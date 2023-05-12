import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { PrefectureListModel } from './Metadata.model';

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
  address?: string;
  applicationDate?: string;
  applicationMetod?: string;
  apartment: string;
  attractionsStatus?: string;
  branchIncharge?: string;
  classification?: string;
  created_at: Timestamp;
  currentStatusMonth?: number;
  currentStatusTimestamp: Timestamp;
  deleted: false;
  dob?: string;
  daysToWork?: string;
  email: string;
  employmentStatus?: string;
  imageURL?: string;
  kanaName: string;
  lat?: number;
  lon?: number;
  media?: string;
  memo?: string;
  municipalities?: string;
  name: string;
  occupation?: ApplicantOccupation;
  period?: string;
  phone: string;
  position?: string[];
  postCode?: string;
  prefecture?: PrefectureListModel;
  qualification?: ApplicantQualification[];
  seductionDay?: string;
  sex?: ApplicantSex;
  status?: ApplicantStatus;
  statusChangeTimestamp?: {[key: string] : Timestamp}[]
  street: string;
  staffRank?: number;
  totalYear?: string;
  workingHoursDay?: string;
  workingHoursEarly?: string;
  workingHoursLate?: string;
  workingHoursNight?: string;
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
  UNSUPPORTED = 'unsupported',
  WAIT_CONTACT = 'wait_contact',
  EXCLUDED = 'excluded',
  ANOTHER_COMPANY = 'anotherCompany',
  BREAK_CONTACT = 'break_contact',
  DECLINE = 'decline',
  WAIT_ATTEND = 'wait_attend',
  WAIT_FIX = 'wait_FIX',
  WAIT_VISIT = 'wait_visit',
  WAIT_OFFER = 'wait_offer',
  WAIT_ENTRY = 'wait_entry',
  WORKING = 'working',
  WAIT_TERMINATION = 'wait_termination',
  WAIT_RETIRE = 'wait_retire',
  RETIRED = 'retired'
}

export interface ApplicantFix { 
  id: string;
  created_user?: string;
  created_at: string;
  // Fix Info 
  status: 'ok' | 'ng';
  reason: string;
  reasonDetal?: string;
  date: string;
  contactPerson: string;
  memo: string;
  // Job Search Info 
  inspectionStatus: 'ok' | 'ng';
  inspectionDate: string;
  reasonNG: 'notApplicable' | 'decided' | 'notCovered' | 'registrationDeclined';
  reasonJobDetal?: string;
  chargeOfFacility: string;
  jobTitle?: string;
  contact: string;
  comments: string;
  notesInspection: string;
  // Job Offers Info
  offerStatus: 'ok' | 'ng';
  offerDate: string;
  offerReasonNG: string;
  chargeOfOffer: string;
  offerMemo: string;
  // Employment Info
  admissionStatus: 'ok' | 'ng';
  admissionDate: string;
  reasonNotJoining: string;
  chargeOfAdmission: string;
  endDate: string;
  admissionMemo: string;
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
