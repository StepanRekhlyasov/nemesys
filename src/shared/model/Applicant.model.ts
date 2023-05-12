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

export interface Applicant extends DesiredConditions, PersonalStatus, AssignedEvaluation {
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
  status?: ApplicantStatus;
  branchIncharge?: string;
  sex?: ApplicantSex;
  dob?: string;
  occupation?: ApplicantOccupation;
  qualification?: ApplicantQualification[];
  applicationDate?: string;
  currentStatusTimestamp: number;
  currentStatusMonth?: number;
  created_at: string;
  deleted: false;
  imageURL?: string;
  media?: string;
  applicationMetod?: string;
  classification?: string;
  totalYear?: string;
  address?: string;
  lat?: number;
  lon?: number;
  attractionsStatus?: string;
  seductionDay?: string;
  employmentStatus?: string;
  position?: string[];
  period?: string;

  // Attendance Info 
  attendingStatus?: 'ok' | 'ng';
  attendingDate?: string;
  attendee?: string;
  memo?: string;
}

export interface DesiredConditions {
  timeAvailable?: string;
  timeToWork?: string;
  daysToWork?: number;
  daysPerWeek?: Days[];
  specialDay?: SpecialDay[];
  workingHoursEarly?: string;
  workingHoursDay?: string;
  workingHoursLate?: string;
  workingHoursNight?: string;
  shiftRemarks?: string;
  meansCommuting?: string;
  nearestStation?: string;
  commutingTime?: string;
  route?: string;
  commutingTimeRemarks?: string;
  facilityDesired?: string;
  ngFacilityType?: string;
  hourlyRate?: string;
  transportationServices?: 'possible' | 'no';
  jobSearchPriorities1?: string;
  jobSearchPriorities2?: string;
  jobSearchPriorities3?: string;
}

export interface PersonalStatus  {
  smoking?: SmokingStatus;
  tattoos?: TattoosStatus;
  marriedStatus?: MarriedStatus;
  liveTogether?: TattoosStatus;
  cohabitation?: string;
  children?: string;
  medicalHistory?: string;
  vaccinationStatus?: string;
  startCaring?: string;
  interviewsWaitingList?: string;
  temporaryCompaniesRegistered?: string;
  startedInCaregiving?: string;
  daysVisitAtWork?: string;
}

export interface AssignedEvaluation {
  language?: Level;
  comprehension?: Level;
  staffRank?: number;
  remarks?: string;
}

export enum ApplicantSex{
  MALE = 'male',
  FEMALE = 'female'
}

export enum MarriedStatus {
  MARRIED = 'married',
  UNMARRIED = 'unmarried'
}

export enum Days {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  HOLIDAY = 'holiday',
}

export enum Level {
  PERFORMANCE = 'performance',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  POSSIBLE = 'possible',
  NO = 'no',
}

export enum SpecialDay {
  GW = 'gw',
  FESTIVAL = 'festival',
  CHRISTMAS = 'christmas'
}

export enum SmokingStatus {
  NO = 'no',
  YES = 'yes',
  PAPER = 'paper',
  ELECTRONIC = 'electronic',
  NOWHILEWORKING = 'noWhileWorking',
  ACCEPTABLE = 'acceptable',
  NOTPOSSIBLE = 'notPossible',
}

export enum TattoosStatus {
  NIL = 'nil',
  YES = 'yes'
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
