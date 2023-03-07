import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType } from './utils';

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}


export const getClientList = (db: Firestore) => {
  return getDocs(query(
    collection(db, 'clients'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export const getClientOfficeList = (db: Firestore, client_id: string) => {
  return getDocs(query(
    collection(db, 'clients/'+client_id+'/office'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export interface FixOption {
  operationFilter?: boolean;
}

export const getFixList = (db: Firestore, applicant_id: string, option?: FixOption) => {
  const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]

  if (option && option.operationFilter) {
    constraints.push(where('admissionStatus', '==', 'ok'))
  }

  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/fix'), 
    ...constraints
  ))
}