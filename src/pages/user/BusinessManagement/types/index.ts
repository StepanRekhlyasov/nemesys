export interface OfficeMenuItem {
  name: string;
  center?: string;
  right?: string;
  click: () => void;
}

export enum ClientFactoryTabs {
  TeleAppointmentHistory = 'TeleAppointmentHistory',
  OfficeDetails = 'OfficeDetails',
  BOHistory = 'BOHistory',
  HeadOffice = 'HeadOffice',
  VariousAchievements = 'VariousAchievements',
  Memo = 'Memo',
}

export interface FaxSearchData {
  selectedDate: string;
  selectedBranch: string;
  selectedInCharge: string;
  selectedApplicant: string | null;
  selectedOrganization: string | null;
}

export interface DispatchIndexTable {
  clientName: string;
  telOne: number;
  index?: number;
  totalPoints?: number;
  telTwo: number;
  telThree: number;
  telFour: number;
  telFive: number;
  faxOne: number;
  faxTwo: number;
  faxThree: number;
  faxFour: number;
  faxFive: number;
}
