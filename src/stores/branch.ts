import { collection, collectionGroup, doc, documentId, endAt, getDoc, getDocs, getFirestore, orderBy, PartialWithFieldValue, query, runTransaction, startAt, Timestamp, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, BranchesSearch, branchFlags } from 'src/shared/model';
import { ConstraintsType, serializeTimestamp, toDateObject } from 'src/shared/utils/utils';
import { LicenseStatistic } from 'src/pages/admin/LicenseManagement/types/LicenseStatistic';
import { useBusiness } from './business';


export const useBranch = defineStore('branch', () => {
  const db = getFirestore()
  const business = useBusiness()

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


  async function getBranches(organization_id: string, search?: BranchesSearch) {
    const businesses = await business.getBusinesses(organization_id)
    const businessesIds = Object.keys(businesses)
    const branchesObj: { [businessId: string]: Branch[] } = {}

    const constraints: ConstraintsType = [orderBy('name'), where('deleted', '==', false)]
    if (search && search?.flag === branchFlags.Working) {
      constraints.push(where('working', '==', true))
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

  async function editBranch(branch: PartialWithFieldValue<Branch>, organizationId: string, businessId: string, branchId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}/branches/${branchId}`)
    serializeTimestamp(branch)
    await updateDoc(ref, {
      ...branch
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



  return {
    getBranchesInOrganization,
    getBranches,
    editBranch,
    countUsersInBranch,
    getBranch,
    calculateLicenceFee,
    createBranch,
  }
})
