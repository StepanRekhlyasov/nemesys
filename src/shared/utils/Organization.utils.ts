import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { Organization } from '../model';

export async function getAllOrganizations() {
  const db = getFirestore();

  const organizationsQuery = query(collection(db, 'organization'))

  const organizationsData = await getDocs(organizationsQuery);


  return organizationsData.docs.map((organization)=>{
    return organization.data() as Organization
  })
}
