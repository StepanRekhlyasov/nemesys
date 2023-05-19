import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { LicenseHistory } from 'src/pages/admin/LicenseManagement/types/LicenseHistory';
import { LicenseRequest } from 'src/pages/admin/LicenseManagement/types/LicenseRequest';
import { useOrganization } from './organization';


export const useLicense = defineStore('license', () => {
  const db = getFirestore()
  const organization = useOrganization()

  async function search(search: string) {
    const organizations = await organization.getOrganizationsByName(search)
    const organizationIds = organizations.map((org) => {
      return org.id
    })
    if (!organizationIds.length) {
      return
    }
    const organizationQuery = query(collection(db, 'licenseRequests'), where('organizationId', 'in', organizationIds))
    const docs = await getDocs(organizationQuery)
    if (!docs.docs.length) {
      return
    }
    return docs.docs.map((doc) => {
      return doc.data() as LicenseRequest
    })
  }

  async function execute(request: LicenseRequest, changedSlotsCount: number, organizationId: string, businessId: string, branchId: string) {

    const auth = getAuth();
    if (!auth.currentUser?.uid) {
      return
    }
    //copy to licenseHistory
    const historyRef = collection(db, 'licenseHistory')
    const historyDoc = doc(historyRef)
    const executedRequest = JSON.parse(JSON.stringify(request)) as LicenseHistory
    executedRequest.executor = auth.currentUser.uid
    executedRequest.executionTime = serverTimestamp() as Timestamp
    executedRequest.requestDate = new Timestamp(executedRequest.requestDate.seconds, executedRequest.requestDate.nanoseconds)
    executedRequest.id = historyDoc.id
    await setDoc(historyDoc, executedRequest)

    // editBranch
    await organization.editBranch(db, { licensesSlots: changedSlotsCount }, organizationId, businessId, branchId)

    // delete licenseRequest
    await deleteDoc(doc(db, `licenseRequests/${request.id}`))
  }

  return { search, execute }
})
