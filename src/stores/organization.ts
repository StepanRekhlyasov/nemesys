import { collection, doc, endAt, Firestore, getDocs, getFirestore, orderBy, PartialWithFieldValue, query, serverTimestamp, setDoc, startAt, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, branchFlags, Business, Organization } from 'src/shared/model';
import { BranchesSearch } from 'src/shared/utils/User.utils';
import { ConstraintsType, toDateObject } from 'src/shared/utils/utils';
import { computed, ref, watch } from 'vue';

interface OrganizationState {
  organizations: Organization[],
  activeOrganization: number,
}

const organization = 'organization'

export const useOrganization = defineStore('organization', () => {
  const db = getFirestore()
  const state = ref<OrganizationState>({
    organizations: [],
    activeOrganization: 0,
  })

  const currentOrganizationId = computed(() => {
    return state.value.organizations[state.value.activeOrganization].id
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
    console.log(businessList)
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


  async function getAllBranches(db: Firestore, search?: BranchesSearch) {

    const organizationsIds = await getAllOrganizationsIds(db)

    const branches: Branch[] = []
    for (let i = 0; i < organizationsIds.length; i++) {
      const id = organizationsIds[i]

      const branchPart = Object.values(await getBranches(db, id, search)).reduce((prev, curr) => {
        return prev.concat(curr)
      }, [])

      branchPart.forEach((branch) => {
        branches.push(branch)
      })
    }

    return branches

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

  async function editOrganization(db: Firestore, organization: PartialWithFieldValue<Organization>, organizationId: string) {
    const ref = doc(db, 'organization/' + organizationId)
    await updateDoc(ref, {
      ...organization
    })
  }

  async function editBusiness(db: Firestore, business: PartialWithFieldValue<Business>, organizationId: string, businessId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}`)
    await updateDoc(ref, {
      ...business
    })
  }

  async function editBranch(db: Firestore, branch: PartialWithFieldValue<Branch>, organizationId: string, businessId: string, branchId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}/branches/${branchId}`)
    await updateDoc(ref, {
      ...branch
    })
  }


  return { state, currentOrganizationId, getBranches, getBusinesses, getAllBranches, getAllBusinesses, addBusiness, addOrganization, editOrganization, editBusiness, editBranch, isCodeUnique }
})
