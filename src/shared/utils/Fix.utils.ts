import { applicantStatusDates, applicantStatusOkFields } from '../constants/Applicant.const';
import { ApplicantFix, ApplicantStatus } from '../model';

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
        if(new Date(a[applicantStatusDates[value]]) < new Date(b[applicantStatusDates[value]])){
          return 1
        }
        return -1
      })
      return result[0]
    } 
  }
  fixes.sort((a, b)=>{
    if(new Date(a[applicantStatusDates[ApplicantStatus.WAIT_FIX]]) < new Date(b[applicantStatusDates[ApplicantStatus.WAIT_FIX]])){
      return 1
    } 
    return -1
  })
  return fixes[0]
}