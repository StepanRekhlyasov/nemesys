import { Applicant, ApplicantFix } from 'src/shared/model';

export interface fixWithApplicant extends ApplicantFix {
  applicant? : Applicant
}