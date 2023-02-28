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
