import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType } from './utils';

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export const getClientList = (db: Firestore, options?: {
  active_organization_id?: string;
}) => {

  const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('name')]
  if (options && options.active_organization_id) {
    constraints.push(where('organization', '==', options.active_organization_id))
  }
  return getDocs(query(
    collection(db, 'clients'),
    ...constraints
  ))
}

export const getClientFactoriesList = (db: Firestore, client_id: string) => {
  return getDocs(query(
    collection(db, 'clients/'+client_id+'/office'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}