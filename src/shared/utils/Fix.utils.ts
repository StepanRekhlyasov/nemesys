import { applicantStatusOkFields } from '../constants/Applicant.const';
import { ApplicantFix, ApplicantStatus } from '../model';
import { getApplicantCurrentStatusTimestampField } from './Applicant.utils';

export function getMostCompletedFix(fixes : ApplicantFix[]){
  if(fixes.length === 1){
    return fixes[0]
  } else if (fixes.length === 0 && !fixes){
    return undefined
  }
  const statusPriority = Object.entries(applicantStatusOkFields).reverse();
  for (const [key, value] of statusPriority){
    const result = fixes.filter((row)=>{
      return row[key]
    })
    if(result.length){
      result.sort((a, b)=>{
        if(new Date(a[getApplicantCurrentStatusTimestampField(value)]) < new Date(b[getApplicantCurrentStatusTimestampField(value)])){
          return 1
        }
        return -1
      })
      return result[0]
    } 
  }
  fixes.sort((a, b)=>{
    if(new Date(a[getApplicantCurrentStatusTimestampField(ApplicantStatus.WAIT_FIX)]) < new Date(b[getApplicantCurrentStatusTimestampField(ApplicantStatus.WAIT_FIX)])){
      return 1
    } 
    return -1
  })
  return fixes[0]
}