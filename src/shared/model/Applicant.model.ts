import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface ApplicantExperience extends ApplicantExperienceBase, ApplicantExperienceDates { }
export interface ApplicantExperienceInputs extends ApplicantExperienceBase, ApplicantExperienceInputDates { }
export interface ApplicantExperienceBase {
  id: string;
  experience?: string;
  facilityType?: string;
  nameEstablishment?: string;
  employmentType?: string;
  reasonResignation?: string;
  pastInterviews?: EmploymentStatus;
  deleted?: boolean;
}
export interface ApplicantExperienceInputDates{
  startMonth?: string;
  endMonth?: string;
}
export interface ApplicantExperienceDates{
  startMonth?: Timestamp;
  endMonth?: Timestamp;
}

export enum EmploymentStatus {
  'working',
  'notWorking'
}
export interface ApplicantDates {
  invitationDate?: Timestamp;
  created_at: Timestamp;
  currentStatusTimestamp: Timestamp;
  applicationDate?: Timestamp;
  dob?: Timestamp;
  attendingDate?: Timestamp;
  timeToWork?: Timestamp;
}
export interface ApplicantInputDates {
  invitationDate?: string;
  created_at: string;
  currentStatusTimestamp: string;
  applicationDate?: string;
  dob?: string;
  attendingDate?: string;
  timeToWork?: string;
}

export interface ApplicantBase {
  id: string;
  organizationId: string;
  prefecture?: string;
  municipalities?: string;
  street: string;
  apartment: string;
  status?: ApplicantStatus;
  statusChangeTimestamp?: {[key: string] : Timestamp}[]
  staffRank?: number;
  branchIncharge?: string;
  occupation?: ApplicantOccupation;
  qualification?: ApplicantQualification[];
  totalYear?: string;
  address?: string;
  classification?: string;
  currentStatusMonth?: string;
  deleted: boolean;
  imageURL?: string;
  attractionsStatus?: boolean;
  seduser?: string;
  employmentStatus?: string;
  period?: string;
  position?: string[];
}
export interface Applicant extends ApplicantBase, DesiredConditions, PersonalStatus, AssignedEvaluation, Attendance, ApplicantInfo, ApplicantDates {
}
export interface ApplicantInputs extends ApplicantBase, DesiredConditions, PersonalStatus, AssignedEvaluation, Attendance, ApplicantInfo, ApplicantInputDates {
}

export interface ApplicantInfo {
  name?: string;
  media?: string;
  kanaName?: string;
  applicationMetod?: string;
  sex?: ApplicantSex;
  phone?: string;
  email?: string;
  lat?: number;
  lon?: number;
  postCode?: string;
}

export interface DesiredConditions {
  timeAvailable?: boolean;
  daysToWork?: number;
  daysPerWeek?: Days[];
  specialDay?: SpecialDay[];
  workingHoursEarly?: boolean;
  workingHoursDay?: boolean;
  workingHoursLate?: boolean;
  workingHoursNight?: boolean;
  shiftRemarks?: string;
  meansCommuting?: string;
  nearestStation?: string;
  commutingTime?: string;
  route?: string;
  commutingTimeRemarks?: string;
  facilityDesired?: string[];
  ngFacilityType?: string[];
  hourlyRate?: string;
  transportationServices?: 'possible' | 'no';
  jobSearchPriorities1?: string;
  jobSearchPriorities2?: string;
  jobSearchPriorities3?: string;
}

export interface Attendance { 
  attendingStatus?: 'ok' | 'ng';
  attendeeUserInCharge?: string;
  memo?: string;
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
  THURSDAY = 'thursday',
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
  status: boolean;
  reason: string;
  reasonDetal?: string;
  date: string;
  contactPerson: string;
  memo: string;
  // Job Search Info 
  inspectionStatus: boolean;
  inspectionDate: string;
  reasonNG: 'notApplicable' | 'decided' | 'notCovered' | 'registrationDeclined';
  reasonJobDetal?: string;
  chargeOfFacility: string;
  jobTitle?: string;
  contact: string;
  comments: string;
  notesInspection: string;
  // Job Offers Info
  offerStatus: boolean;
  offerDate: string;
  offerReasonNG: string;
  chargeOfOffer: string;
  offerMemo: string;
  // Employment Info
  admissionStatus: boolean;
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
