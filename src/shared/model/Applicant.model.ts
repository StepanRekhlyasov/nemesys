import { User } from 'firebase/auth';

export interface ApplicantExperience {
  id: string;
  experience: string;
  facilityType: string;
  startMonth: string;
  endMonth: string;
  nameEstablishment: string;
  employmentType: string;
  reasonResignation: string;
  pastInterviews: EmploymentStatus;

}

export enum EmploymentStatus {
  'working',
  'notWorking'
}

export interface Applicant {
  id: string;
  name: string;
  kanaName: string;
  postCode?: string;
  prefecture?: string;
  municipalities?: string;
  street: string;
  apartment: string;
  phone: string;
  email: string;
  status?: ApplicantStatus;  //
  branchIncharge?: string; //
  sex?: ApplicantSex;
  dob?: string;
  occupation?: ApplicantOccupation;
  qualification?: ApplicantQualification[];
  applicationDate?: string;
  
  created_at: string;
  deleted: false;
}

export enum ApplicantSex{
  MALE = 'male',
  FEMALE = 'female'
}

export enum ApplicantOccupation {
  NURSE = 'nurse',
  NURSING_CARE = 'nursingCare',
  LIFECOUNSELOR = 'lifeCounselor',
  CAREMANAGER = 'careManager', 
  OTHERS = 'others'
}

export enum ApplicantQualification {
  REGISTEREDNURSE = 'registeredNurse',
  ASSISTANTNURSE = 'assistantNurse',
  NEWCOMER = 'newcomer',
  CAREWORKER = 'careWorker'
}

export enum ApplicantStatus {
  NOTCOMPATIBLE = 'notCompatible',
  EXCLUDEDAPPLICANT = 'excludedApplicant',
  WAITINGCONTACT = 'waitingContact',
  CONTACTNG = 'contactNG',
  CONTACTEDWI = 'contactedWI',
  INVITATIONNG = 'invitationNG',
  INVITEDWAITING = 'invitedWaiting',
  INVITEDNOCONTACT = 'invitedNoContact',
  ATTENDEDNG = 'attendedNG',
  ATTENDEDWAITINGFIX = 'attendedWaitingFix',
  FIXNG = 'fixNG',
  FIXEDWAITING = 'fixedWaiting',
  VISITINGNG = 'visitingNG',
  VISITEDWAITINGOFFER = 'visitedWaitingOffer',
  OFFERNG = 'offerNG',
  OFFEREDWAITINGENTRY = 'OfferedWaitingEntry',
  ENTRYNG = 'entryNG',
  ENTERED = 'entered',
  EXPIRYNG = 'expiryNG',
  END = 'end',
  UPDATE = 'update',
  FUTURETALENT = 'futureTalent',
}

export interface ApplicantFix { 
  id: string;
  created_user?: string;
  created_at: string;
}

export interface ApplicantMemo {
  id?: string;
  created_user: string;
  content: string;
  user: User;
  created_date: string;
  updated_date?: string;
  delited: boolean;
}

export interface ContactInfo {
  created_at: string;
  contactMethod: ContactMethod;
  content: string;
  note: string;
}

export enum ContactMethod {
  SMS = 'sms',
  PHONE = 'phone'
}
