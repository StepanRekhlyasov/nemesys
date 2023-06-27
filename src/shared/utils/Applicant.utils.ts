import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType } from './utils';
import { Applicant, ApplicantStatus } from '../model';

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export const getApplicantCurrentStatusTimestampField = (status? : ApplicantStatus) => {
  switch (status){
    case ApplicantStatus.WAIT_CONTACT:
      return 'applicationDate';
    case ApplicantStatus.WAIT_ATTEND:
      return 'invitationDate';
    case ApplicantStatus.WAIT_FIX:
      return 'attendingDate';
    case ApplicantStatus.WAIT_VISIT:
      return 'fixDate';
    case ApplicantStatus.WAIT_OFFER:
      return 'inspectionDate';
    case ApplicantStatus.WAIT_ENTRY:
      return 'offerDate';
    default:
      return '';
  }
}

export const getApplicantNGStatus = (status : ApplicantStatus, applicant : Applicant) => {
  switch (status){
    case ApplicantStatus.WAIT_ATTEND:
      return applicant['attractionsReasonNG'];
    case ApplicantStatus.WAIT_FIX:
      return applicant['attendingReasonNG'];
    case ApplicantStatus.WAIT_VISIT:
        return applicant['fixReasonNG'];
      case ApplicantStatus.WAIT_OFFER:
        return applicant['inspectionReasonNG'];
      case ApplicantStatus.WAIT_ENTRY:
        return applicant['offerReasonNG'];
      case ApplicantStatus.WORKING:
      return applicant['admissionReasonNG'];
    default:
      return '';
  }
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