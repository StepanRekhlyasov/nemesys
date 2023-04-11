import { addDoc, collection, doc, Firestore,  getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
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
    collection(db, '/fix'), 
    where('applicant_id', '==', applicant_id),
    ...constraints
  ))
}

export const saveFix = async (db: Firestore, applicant_id: string, data) => {
  await addDoc(
    collection(db, '/fix'),
    {
      ...data,
      applicant_id: applicant_id
    }
  )
}

export const updateFix = async (db: Firestore, fix_id: string, data) => {
  await updateDoc(
    doc(db, '/fix/'+ fix_id ),
    data
  );
}