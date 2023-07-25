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
