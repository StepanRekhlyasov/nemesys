import { collection, collectionGroup, doc, documentId, endAt, Firestore, getDoc, getDocs, getFirestore, orderBy, PartialWithFieldValue, query, runTransaction, serverTimestamp, setDoc, startAt, Timestamp, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, branchFlags, Business, Organization, RequestType, ReturnedObjectType, User, UserPermissionNames } from 'src/shared/model';
import { BranchesSearch } from 'src/shared/utils/User.utils';
import { ConstraintsType, serializeTimestamp, toDateObject } from 'src/shared/utils/utils';
import { computed, ref, watch } from 'vue';
import { i18n } from 'boot/i18n';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { LicenseStatistic } from 'src/pages/admin/LicenseManagement/types/LicenseStatistic';

const { t } = i18n.global
interface OrganizationState {
  organizations: Organization[],
  activeOrganization: number,
  currentOrganizationBranches: { [id: string]: Branch; },
  currentOrganizationUsers: { [id: string]: User; },
}

const organization = 'organization'

export const useOrganization = defineStore('organization', () => {
  const db = getFirestore()
  const state = ref<OrganizationState>({
    organizations: [],
    activeOrganization: 0,
    currentOrganizationBranches: {},
    currentOrganizationUsers: {},
  })

  const currentOrganizationId = computed(() => {
    return state.value.organizations[state.value.activeOrganization]?.id
  })

  const storage = localStorage.getItem(organization)

  if (storage) {
    state.value = JSON.parse(storage)
  }

  watch(state, (stateVal) => {
    localStorage.setItem(organization, JSON.stringify(stateVal))
  },
    { deep: true }
  )
  watch(() => currentOrganizationId.value, async () => {
    state.value.currentOrganizationBranches = await getCurrentOrganizationBranches()
    state.value.currentOrganizationUsers = await getCurrentUsersInChrage()
  })

  async function getBusinesses(db: Firestore, organization_id: string) {
    const businessesQuery = query(collection(db, `/organization/${organization_id}/businesses/`))
    const businesses = await getDocs(businessesQuery)
    const businessList: { [id: string]: Business } = {}
    businesses.forEach((business) => {
      businessList[business.id] = business.data() as Business
    })

    return businessList
  }

  async function getAllBusinesses(db: Firestore) {
    const organizationsIds = await getAllOrganizationsIds(db)
    const businessList: { [id: string]: Business } = {}
    for (let i = 0; i < organizationsIds.length; i++) {
      const id = organizationsIds[i]
      const businesses = await getBusinesses(db, id)
      Object.assign(businessList, businesses)
    }
    return businessList
  }

  async function getAllOrganizationsIds(db: Firestore) {
    const organizationsQuery = query(collection(db, 'organization/'), where('deleted', '==', false));
    const querySnapshot = await getDocs(organizationsQuery);
    const organizationsIds: string[] = []
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        organizationsIds.push(doc.id)
      }
    })

    return organizationsIds
  }


  async function getAllBranches() {

    const branches: { [id: string]: Branch; } = {}

    const branchesQuery = query(collectionGroup(db, 'branches'));
    const querySnapshot = await getDocs(branchesQuery);
    querySnapshot.forEach((doc) => {
      branches[doc.id] = doc.data() as Branch
    });

    return branches
  }

  async function getBranchesInOrganization(organizationId?: string) {
    const organizationRef = doc(db, `/organization/${organizationId}/`)
    const branchesQuery = query(collectionGroup(db, 'branches'), where('deleted', '==', false), where('working', '==', true), where('hidden', '==', false), orderBy(documentId()), startAt(organizationRef.path), endAt(organizationRef.path + '\uf8ff'));
    const querySnapshot = await getDocs(branchesQuery);
    const branches: { [id: string]: Branch; } = {}

    querySnapshot.forEach((doc) => {
      branches[doc.id] = doc.data() as Branch
    })
    return branches
  }

  async function getCurrentOrganizationBranches() {
    const organizationRef = doc(db, `/organization/${currentOrganizationId.value}/`);
    const branchesQuery = query(collectionGroup(db, 'branches'), where('deleted', '==', false), where('working', '==', true), where('hidden', '==', false), orderBy(documentId()), startAt(organizationRef.path), endAt(organizationRef.path + '\uf8ff'));
    const querySnapshot = await getDocs(branchesQuery);
    const branches: { [id: string]: Branch; } = {}
    querySnapshot.forEach((doc) => {
      branches[doc.id] = doc.data() as Branch
    })
    return branches
  }

  async function getCurrentUsersInChrage() {
    const organization = useOrganization()
    const usersSnapshot = getUsersByPermission(db, UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);
    const querySnapshot = await usersSnapshot
    const users: { [id: string]: User; } = {}
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        users[doc.id] = doc.data() as User
      })
    }
    return users
  }

  async function addBusiness(db: Firestore, business: Omit<Business, 'id'>, organizationId: string) {
    const businessRef = collection(db, `organization/${organizationId}/businesses/`)
    const docRef = doc(businessRef)
    await setDoc(docRef, {
      ...business,
      id: docRef.id
    })
  }

  async function addOrganization(db: Firestore, organization: Organization) {
    const organizationRef = collection(db, 'organization/')
    const docRef = doc(organizationRef)
    organization.id = docRef.id
    organization.deleted = false
    await setDoc(docRef, {
      ...organization,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function isCodeUnique(code: string) {
    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', code))
    const querySnapshot = await getDocs(organizationQuery)
    return querySnapshot.size === 0
  }

  async function getBranches(db: Firestore, organization_id: string, search?: BranchesSearch) {
    const businesses = await getBusinesses(db, organization_id)
    const businessesIds = Object.keys(businesses)
    const branchesObj: { [businessId: string]: Branch[] } = {}

    const constraints: ConstraintsType = [orderBy('name'), where('deleted', '==', false)]
    if (search && search?.flag !== branchFlags.All) {
      constraints.push(where('flag', '==', search.flag))
    }

    if (search && search?.queryText) {
      constraints.push(startAt(search?.queryText || ''), endAt(search?.queryText + '\uf8ff'))
    }

    for (let i = 0; i < businessesIds.length; i++) {
      const businessId = businessesIds[i]
      const branchesQuery = query(
        collection(db, `/organization/${organization_id}/businesses/${businessId}/branches`),
        ...constraints
      )
      const branches = await getDocs(branchesQuery)

      branches.forEach((branch) => {
        if (!Array.isArray(branchesObj[businessId])) {
          branchesObj[businessId] = []
        }
        const branchToPush = branch.data()
        branchToPush.created_at = toDateObject(branchToPush.created_at)
        branchToPush.updated_at = toDateObject(branchToPush.updated_at)
        branchToPush.deletedAt = toDateObject(branchToPush.deletedAt)
        branchesObj[businessId].push(branchToPush as Branch)
      })
    }

    return branchesObj
  }

  async function editOrganization(db: Firestore, organization: Partial<Organization>, organizationId: string) {
    const ref = doc(db, 'organization/' + organizationId)
    serializeTimestamp(organization)
    await updateDoc(ref, {
      ...organization
    })
  }

  async function editBusiness(db: Firestore, business: PartialWithFieldValue<Business>, organizationId: string, businessId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}`)
    serializeTimestamp(business)
    await updateDoc(ref, {
      ...business
    })
  }

  async function editBranch(db: Firestore, branch: PartialWithFieldValue<Branch>, organizationId: string, businessId: string, branchId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}/branches/${branchId}`)
    serializeTimestamp(branch)
    await updateDoc(ref, {
      ...branch
    })
  }

  async function getOrganizationByCode(code: string) {
    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', code))
    const querySnapshot = await getDocs(organizationQuery)

    if (querySnapshot.size > 1) {
      throw new Error(t('menu.admin.organizationsTable.codeNotUnique'))
    }

    if (querySnapshot.size == 0) {
      throw new Error('Organization not found')
    }

    return querySnapshot.docs[0].data() as Organization
  }

  async function getOrganizationsByName(name: string) {
    const organizationsQuery = query(collection(db, 'organization'), orderBy('name'), startAt(name), endAt(name + '\uf8ff'),)

    const organizationsData = await getDocs(organizationsQuery);

    return organizationsData.docs.map((organization) => {
      return organization.data() as Organization
    })
  }

  async function getDataById<T extends RequestType>(ids: string[], type: T): Promise<ReturnedObjectType<T>[]> {
    const constraints = [where('working', '==', true)]
    let collectionId = 'businesses'
    if (type == 'Branch') {
      constraints.push(where('deleted', '==', false), where('hidden', '==', false))
      collectionId = 'branches'
    }

    if (type == 'Organization') {
      constraints.push(where('deleted', '==', false))
      collectionId = 'organization'
    }

    const organizationsQuery = query(collectionGroup(db, collectionId), ...constraints, where('id', 'in', ids))
    const organizationData = await getDocs(organizationsQuery)
    return organizationData.docs.map((organization) => {
      const data = organization.data()
      if (type == 'Branch') {
        return data as ReturnedObjectType<T>
      }
      if (type == 'Organization') {
        return data as ReturnedObjectType<T>
      }
      return data as ReturnedObjectType<T>
    })

  }

  async function countUsersInBranch(id: string) {
    const q = query(collection(db, 'users'), where('branch_id', '==', id), where('deleted', '==', false))
    const d = await getDocs(q)
    return d.docs.length
  }

  async function getBranch(organizationId: string, businessId: string, branchId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}/branches/${branchId}`)
    const branchSnapshot = await getDoc(ref)
    const branch = branchSnapshot.data() as Branch
    return branch
  }

  async function calculateLicenceFee(organizationId: string) {
    const allBranches = await getBranchesInOrganization(organizationId)

    const allBranchesArr = Object.values(allBranches)

    let licenceFee = 0
    for (let i = 0; i < allBranchesArr.length; i++) {
      const branch = allBranchesArr[i]
      const usersInBranch = await countUsersInBranch(branch.id)
      licenceFee += usersInBranch * branch.priceForOneUserInYen
    }
    return licenceFee
  }

  async function createBranch(branch: Branch, organizationId: string, businessId: string) {
    const branchRef = doc(collection(db, `organization/${organizationId}/businesses/${businessId}/branches`));

    //We must use the same format as in execute_license_request cloud function
    const date = Timestamp.now().toDate().toLocaleDateString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'numeric',
    }).split('/')

    const [year, month] = date


    await runTransaction(db, async (t) => {
      branch.id = branchRef.id
      t.set(branchRef, branch)
      const license: Partial<LicenseStatistic> = {}
      license.branchId = branch.id
      license.businessId = branch.businessId
      license.count = branch.licensesSlots
      license.month = parseInt(month)
      license.organizationId = organizationId
      license.year = parseInt(year)
      license.isFirstDoc = true
      const licenseDoc = doc(collection(db, 'licenseStatistic'))
      license.id = licenseDoc.id
      t.set(licenseDoc, license)
    })



  }

  return { state, currentOrganizationId, getBranches, getBusinesses, getAllBranches, getAllBusinesses, addBusiness, addOrganization, editOrganization, editBusiness, editBranch, isCodeUnique, getOrganizationByCode, getAllOrganizationsIds, getBranchesInOrganization, getOrganizationsByName, getDataById, countUsersInBranch, calculateLicenceFee, getBranch, createBranch }
})
