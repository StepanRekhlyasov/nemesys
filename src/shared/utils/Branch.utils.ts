import { Firestore, collection, getDocs, query } from 'firebase/firestore';
import { Branch, Business } from '../model';
import { getBusinesses } from './Organization/Organization.utils';

export const getOrganizationBranches = async (db: Firestore, organization_id: string) => {
  const business = await getBusinesses(db, organization_id)
  
  const branches = business.map(async (busines: Business) => 
    await getDocs(query(
      collection(db, `organization/${organization_id}/businesses/${busines.id}/branches`)
    ))
  )
}