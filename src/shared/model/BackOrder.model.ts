export interface BackOrderModel {
  typeCase: TypeOfCase;
  typeTransaction: TypeOfTransaction;
  qualifications: string;
  experience: string;
  ageLimit: number;
  status: BackOrderStatus;
  unitPrice?: number;
  posibleDays?: number;
  posibleObsidianDays: string;
  buissnesDescription: string;
  otherNotes: string;
  dateRegistration: string;
  customerRepresentative: string;
  early: string;
  datetime: string;
  shortened: string;
  nightShift: string;
}


export enum TypeOfCase {
  Nurse = 'nurse',
  NursingCare = 'nursingCare'
}

export enum TypeOfTransaction {
  DispatchEm = 'dispatchEm',
  Introduction = 'introduction'
}

export enum BackOrderStatus {
  Dispatch = 'dispatch',
  FullTime = 'fullTime'
}
