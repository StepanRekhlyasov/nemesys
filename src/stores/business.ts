import { collection, doc, Firestore, getDocs, getFirestore, PartialWithFieldValue, query, setDoc, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Business } from 'src/shared/model';
import { serializeTimestamp } from 'src/shared/utils/utils';

export const useBusiness = defineStore('business', () => {
  const db = getFirestore()
  async function getBusinesses(organization_id: string) {
    const businessesQuery = query(collection(db, `/organization/${organization_id}/businesses/`))
    const businesses = await getDocs(businessesQuery)
    const businessList: { [id: string]: Business } = {}
    businesses.forEach((business) => {
      businessList[business.id] = business.data() as Business
    })

    return businessList
  }

  async function addBusiness(db: Firestore, business: Omit<Business, 'id'>, organizationId: string) {
    const businessRef = collection(db, `organization/${organizationId}/businesses/`)
    const docRef = doc(businessRef)
    await setDoc(docRef, {
      ...business,
      id: docRef.id
    })
  }

  async function editBusiness(business: PartialWithFieldValue<Business>, organizationId: string, businessId: string) {
    const ref = doc(db, `organization/${organizationId}/businesses/${businessId}`)
    serializeTimestamp(business)
    await updateDoc(ref, {
      ...business
    })
  }

  return {
    getBusinesses,
    addBusiness,
    editBusiness,
  }

})
