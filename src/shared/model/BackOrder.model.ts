export interface BackOrderModel {
  id: string;
  type: 'dispatch' | 'referral';
  BOGenerationRoute: 'coldCall' | 'fax';
  client_id: string;
  office_id: string;
  boId: string;

  created_at: string;
  deleted: false;

  // Introduction Section
  dateOfRegistration: string;
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

}
export interface BackOrderState {
  BOList: BackOrderModel[]
  selectedBo: BackOrderModel | null,
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
  PartTime = 'partTime',
  PartTimeEmployee = 'partTimeEmployee'
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


