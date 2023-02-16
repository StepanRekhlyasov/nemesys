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
