export interface BackOrderModel {
  id?: string;
  type: 'dispatch' | 'referral';
  
  typeCase: TypeOfCase;
  qualifications: TypeQualifications;
  experience: string;
  moreHalfYearExp: boolean;
  ageLimit: number;
  status: BackOrderStatus;
  retirementAge: string;
  hourlywage: string;
  monthlySalary: string;
  buissnesDescription: string;
  unitPrice: string;
  payday: string;
  transportationExpenses: string;
  workingDays: string;
  workingDaysWeek: WorkingDaysWeek;
  transactionType: TransactionType;
  daysPerWeekList?: 'one' | 'two' | 'three' | 'four' | 'five';
  working_days_week: string[];
  client_id: string; 
  

  workingHoursEarly: string;
  workingHoursDay: string;
  workingHoursLate: string;
  workingHoursNight: string;

  businessContent: string;
  onCallPickUP: string;
  overtimeHours: string;
  holidaysWeekly: string;
  holidayAnnual: string;
  leaveChildcare: string;
  otherNotes: string;

  created_at: string;
  deleted: false;
}


export enum TypeOfCase {
  Nurse = 'nurse',
  NursingCare = 'nursingCare'
}


export enum TypeQualifications {
  Registered = 'registeredNurse',
  Assistant = 'assistantNurse',
  NewComer = 'newcomer',
  CareWorker = 'careWorker'
}

export enum TransactionType {
  Introduction = 'introduction',
  TTP = 'ttp',
  GeneralDispatch = 'generalDispatch'
} 

export enum BackOrderStatus {
  FullTime = 'fullTime',
  Dispatch = 'dispatchEm',
  PartTime = 'partTime',
  Baito = 'baito'
}

export enum WorkingDaysWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday ='friday',
  Saturday = 'saturday',
  Holiday = 'holiday',
}
