import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType } from './utils';
import { ApplicantStatus } from '../model';

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export const getApplicantCurrentUserInChargeField = (status? : ApplicantStatus) => {
  switch (status){
    case ApplicantStatus.WAIT_ATTEND:
      return 'chargeOfAttraction';
    case ApplicantStatus.WAIT_FIX:
      return 'chargeOfAttending';
    case ApplicantStatus.WAIT_VISIT:
      return 'chargeOfFix';
    case ApplicantStatus.WAIT_OFFER:
      return 'chargeOfInspection';
    case ApplicantStatus.WAIT_ENTRY:
      return 'chargeOfOffer';
    case ApplicantStatus.WORKING:
      return 'chargeOfAdmission';
    default:
      return '';
  }
}

export const getApplicantNGStatus = (status : ApplicantStatus) => {
  switch (status){
    case ApplicantStatus.WAIT_ATTEND:
      return 'attractionsReasonNG';
    case ApplicantStatus.WAIT_FIX:
      return 'attendingReasonNG';
    case ApplicantStatus.WAIT_VISIT:
        return 'fixReasonNG';
      case ApplicantStatus.WAIT_OFFER:
        return 'inspectionReasonNG';
      case ApplicantStatus.WAIT_ENTRY:
        return 'offerReasonNG';
      case ApplicantStatus.WORKING:
      return 'admissionReasonNG';
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