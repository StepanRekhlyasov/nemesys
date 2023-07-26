import { Timestamp } from 'firebase/firestore';
export interface JobModel {
  id?: string;
  areaFlag?: boolean;
  created_at?: string;
  created_by?: string;
  deleted?: boolean;
  dateIssue?: string;
  deleted_at?: string;
  job?: string;
  media?: string;
  name?: string;
  updated_at?: string;
  value?:string;
  publicationPeriod?:{
    from:string;
    to:string;
  }
}

export interface JobFormat {
  id?: string;
  appealPoint?:string;
  companyName?:string;
  created_at?: string;
  created_by?: string;
  deleted?: boolean;
  desc?:string;
  email?:string;
  employmentStatus?:string;
  access?:string;
  infoApplicants?: string;
  jobTag?: string;
  jobContent?: string;
  jobIdFormat?: string;
  name?: string;
  judgingQuestions?: string;
  leaveHolidays?:string;
  minSlary?:string;
  occupation?:string;
  others?:string;
  phone?:number;
  postingImage?: string;
  presenceAbsenceResume?: string;
  projectType?:string;
  salaryCap?: string;
  salaryType?: string;
  status?: string;
  tag?:string;
  transactionType?:string;
  treatmentsBenefits?:string;
}
export interface JobOptions {
  id?: string;
  created_at?: string;
  created_by?: string;
  deleted?: boolean;
  name?: string;
  updated_at?: string;
  updated_by?:string;
}
export interface AreaCityModel{
  created_at?: string;
  deleted?: boolean;
  hourlysalarycap?: number;
  hourlysalarymin?: number;
  monthlysalarycap?: number;
  monthlysalarymin?: number;
  prefecture?: string;
  updated_at?: string;
}
export interface jobDataModel {
  id: string;
  type: 'dispatch' | 'referral' | 'TTP';
  BOGenerationRoute: 'coldCall' | 'fax';
  client_id: string;
  office_id: string;
  boId: string;
  payment?: string;
  invoice?: string;
  created_at: string;
  deleted: false;
  registrant?: string;
  organizationId: string;

  // Introduction Section
  dateOfRegistration: Timestamp | undefined | string;
  typeCase: TypeOfCase;
  status: BackOrderStatus;
  requiredQualifications: boolean;
  qualifications: TypeQualifications;
  somethingNotQuestioned: boolean;
  experienceRemarks: string;

  // Employment Conditions Section
  daysPerWeekList?: 'one' | 'two' | 'three' | 'four' | 'five';
  workingDays: 'shiftSystem' | 'fixed';
  workingDaysWeek: WorkingDaysWeek[];
  workingHoursEarly: string;
  workingHoursDay: string;
  workingHoursLate: string;
  workingHoursNight: string;
  shiftRemarks: string;
  existence: boolean;
  overtimeRemarks: string;
  annualHolidays: string;

  // Paycheck Section
  wage: 'monthlySalary' | 'hourlyWage';
  salary: number;
  benefit: number;
  bonus: number;
  travelingExpenses: 'yesRegular' | 'yesDaily' | 'none';
  payday: number;
  remarks: string;

  // Tasks Section (only referal type)
  tasks: string;
  pickDrop: boolean;
  onCallSupport: boolean;
  onCallRemarks: string;
  welfare: string;
  tasks_childcare: string;
  retirementAge_tasks: string;

  // In House Information Section (only referal type)
  retirementAge: string;
  stipulatedAmount: number;
  retirementAge_house: number;
  memo_house: string;
  transactionType:TransactionType;
  projectType:ProjectType;
  indeedTag:IndeedTagList;
  client:string;
  office:string;
  cfClient:string;
  cfOffice:string;
}

export interface MediaList {
  label?:string;
  value?:string;
}

export interface AddFormatModel {
  selectedFormat: {
    id: number | null;
    name: string;
    transactionType: string;
    projectType: string;
    desc: string;
    media: string;
  };
  isDrawer: boolean;
}

export enum TypeOfCase {
  Nurse = 'nurse',
  NursingCare = 'nursingCare',
}

export enum TypeQualifications {
  Registered = 'registeredNurse',
  Assistant = 'assistantNurse',
  NewComer = 'newcomer',
  CareWorker = 'careWorker',
}
export enum IndeedTagList  {
  EmployeePromotions= 'employeePromotions',
  PayRaiseAvailable= 'payRaiseAvailable',
  NoOvertime='noOvertime',
  Ok1dayWeek= 'ok1dayWeek',
  Ok23DayWeek= 'ok23DayWeek',
  FreeShift= 'freeShift',
  PaidTransportationExpenses= 'paidTransportationExpenses',
  SameDayWorkOK= 'sameDayWorkOK',
  UrgentNeeded= 'urgentNeeded',
  Within5minutesStation= 'within5minutesStation',
  CompletelyHome= 'completelyHome',
  OkStayHome= 'okStayHome',
  FlextimeSystem='flextimeSystem',
  WorkingHours= 'workingHours',
  StaggeredWorkingHours= 'staggeredWorkingHours',
  WorkStartTimeAdjustment= 'workStartTimeAdjustment',
  RemoteInterviewOK= 'remoteInterviewOK',
  WearMaskWhenInterviewing= 'wearMaskWhenInterviewing',
}

export enum TransactionType {
  Introduction = 'introduction',
  TTP = 'ttp',
  GeneralDispatch = 'generalDispatch',
}

export enum ProjectType {
  Nurse = 'nurse',
  NursingCare = 'nursingCare',
  LifeCounselor = 'lifeCounselor',
  careManager = 'careManager',
  Others = 'others',
}

export enum BackOrderStatus {
  Wanted = 'wanted',
  Inactive = 'inactive',
}

export enum EmploymentBOStatus {
  FullTime = 'fullTime',
  PartTime = 'partTime',
  PartTimeEmployee = 'partTimeEmployee',
}

export enum WorkingDaysWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Holiday = 'holiday',
}
