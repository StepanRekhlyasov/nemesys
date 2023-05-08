import { Firestore, collection, endAt, getDocs, getFirestore, orderBy, query, startAt } from 'firebase/firestore';
import { Business, Organization } from '../../model';

const db = getFirestore();

export async function getAllOrganizations() {

  const organizationsQuery = query(collection(db, 'organization'))

  const organizationsData = await getDocs(organizationsQuery);

  return organizationsData.docs.map((organization)=>{
    return organization.data() as Organization
  })
}

export async function getOrganizationsByName(name:string) {
  const organizationsQuery = query(collection(db, 'organization'), orderBy('name'), startAt(name), endAt(name + '\uf8ff'),)

  const organizationsData = await getDocs(organizationsQuery);

  return organizationsData.docs.map((organization)=>{
    return organization.data() as Organization
  })
}


export async function getBusinesses(db: Firestore, organization_id: string) {
  const businesses = await getDocs(
    query(collection(db, `/organization/${organization_id}/businesses/`))
  )
  const businessList:Business[] = []
  businesses.forEach((business) => {
    businessList.push(business.data() as Business)
  })

  return businessList
}
