import { Timestamp } from 'firebase/firestore';

export interface BackOrderModel {
  id: string;
  type: 'dispatch' | 'referral';
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
  industry?: string

  // Introduction Section
  dateOfRegistration: Timestamp | undefined | string;
  typeCase: TypeOfCase;
  status: BackOrderStatus;
  requiredQualifications: boolean;
  qualifications: TypeQualifications[];
  somethingNotQuestioned: boolean;
  experienceRemarks: string;
  employmentType: string[];

  // Employment Conditions Section
  daysPerWeekList?: 'one' | 'two' | 'three' | 'four' | 'five';
  workingDays: WorkingDaysWeek[];
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
  salary: string;
  benefit: number;
  bonus: number;
  travelingExpenses: 'yesRegular' | 'yesDaily' | 'none';
  payday: string;
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

  transactionType: TransactionType;
  customerRepresentative: string;
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
  Worker = 'worker',
}

export enum TransactionType {
  Introduction = 'introduction',
  TTP = 'ttp',
  GeneralDispatch = 'generalDispatch',
}

export enum BackOrderStatus {
  Wanted = 'wanted',
  Inactive = 'inactive',
}

export enum EmploymentBOStatus {
  FullTime = 'fullTime',
  PartTime = 'partTime',
  Dispatch = 'dispatch',
  ReferralDispatch = 'referralDispatch'
}

export enum WorkingDaysWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
  Holiday = 'holiday',
}
