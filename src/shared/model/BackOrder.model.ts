export interface BackOrderModel {
  typeCase: TypeOfCase;
  typeTransaction: TypeOfTransaction;
  qualifications: string | TypeQualifications;
  experience: string;
  moreHalfYearExp?: boolean;
  ageLimit: number;
  retirementAge?: string;
  hourlywage?: string;
  monthlySalary?: string;
  status: BackOrderStatus;
  unitPrice?: string;
  payday?: string;
  workingDays?: string;
  posibleDays?: number;
  posibleObsidianDays: string;
  buissnesDescription: string;
  dateRegistration: string;
  customerRepresentative: string;
  early: string;
  datetime: string;
  shortened: string;
  nightShift: string;

  workingHoursEarly?: string;
  workingHoursDay?: string;
  workingHoursLate?: string;
  workingHoursNight?: string;

  overtimeHours?: string;
  holidaysWeekly?: string;
  holidayAnnual?: string;

  businessContent?: string;
  onCallPickUP?: string;
  welfare?: string;
  leaveChildcare?: string;
  otherNotes?: string;
}


export enum TypeOfCase {
  Nurse = 'nurse',
  NursingCare = 'nursingCare'
}

export enum TypeOfTransaction {
  DispatchEm = 'dispatchEm',
  Introduction = 'introduction'
}

export enum TypeQualifications {
  Registered = 'registeredNurse',
  Assistant = 'assistantNurse',
  NewComer = 'newcomer',
  CareWorker = 'careWorker'
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
