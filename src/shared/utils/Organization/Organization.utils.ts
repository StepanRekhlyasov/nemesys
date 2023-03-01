import { collection, endAt, getDocs, getFirestore, orderBy, query, startAt } from 'firebase/firestore';
import { Organization } from '../../model';

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
