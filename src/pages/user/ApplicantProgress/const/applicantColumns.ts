import { ApplicantCol } from 'src/pages/user/Applicant/types/applicant.types';
import { applicantStatusOkFields } from 'src/shared/constants/Applicant.const';
import { ApplicantFix, ApplicantStatus } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { computed } from 'vue';

export const COLUMN_STATUSES = [
  ApplicantStatus.WAIT_CONTACT,
  ApplicantStatus.WAIT_ATTEND,
  ApplicantStatus.WAIT_FIX,
  ApplicantStatus.WAIT_VISIT,
  ApplicantStatus.WAIT_OFFER,
  ApplicantStatus.WAIT_ENTRY,
  ApplicantStatus.WAIT_TERMINATION,
]
export const COUNT_STATUSES = [
  'entry',
  'retired',
  'working'
]
export const limitQuery = 20
export const APPLICANT_COLUMNS: ApplicantCol[] = [
  {
    id: 0,
    label: 'applicant.progress.status.waitContact',
    status: ApplicantStatus.WAIT_CONTACT,
    items: []
  },
  {
    id: 1,
    label: 'applicant.progress.status.waitAttent',
    status: ApplicantStatus.WAIT_ATTEND,
    items: []
  },
  {
    id: 2,
    label: 'applicant.progress.status.waitFix',
    status: ApplicantStatus.WAIT_FIX,
    items: []
  },
  {
    id: 3,
    label: 'applicant.progress.status.waitVisit',
    status: ApplicantStatus.WAIT_VISIT,
    items: []
  },
  {
    id: 4,
    label: 'applicant.progress.status.waitOffer',
    status: ApplicantStatus.WAIT_OFFER,
    items: []
  },
  {
    id: 5,
    label: 'applicant.progress.status.waitEntry',
    status: ApplicantStatus.WAIT_ENTRY,
    items: []
  },
  {
    id: 6,
    label: 'applicant.progress.status.waitTermination',
    status: ApplicantStatus.WAIT_TERMINATION,
    items: []
  },
]

export const fixesByStatus = computed(()=>{
  const applicantStore = useApplicant()
  const result = {
    [ApplicantStatus.WAIT_ATTEND] : [] as ApplicantFix[],
    [ApplicantStatus.WAIT_FIX] : [] as ApplicantFix[],
    [ApplicantStatus.WAIT_VISIT] : [] as ApplicantFix[],
    [ApplicantStatus.WAIT_OFFER] : [] as ApplicantFix[],
    [ApplicantStatus.WAIT_ENTRY] : [] as ApplicantFix[],
    [ApplicantStatus.WORKING] : [] as ApplicantFix[],
    [ApplicantStatus.WAIT_TERMINATION] : [] as ApplicantFix[],
  }
  if(!applicantStore.state){
    return result
  }
  Object.values(applicantStore.state.applicantFixes).forEach((row)=>{
    let fixStatus : string | undefined
    row.forEach((fix)=>{
      fixStatus = undefined
      for (const [key, value] of Object.entries(applicantStatusOkFields)){
        if(fix[key] === true){
          fixStatus = value
        }
      }
      if(fix.waitUpdate === true){
        fixStatus = ApplicantStatus.WAIT_TERMINATION
      }
      if(fixStatus){
        result[fixStatus].push(fix)
      }
    })
  })
  return result
})