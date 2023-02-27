import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';

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
