import { ApplicantCol } from '../types/applicant.types';

export const COLUMN_STATUSES = [
  'wait_contact',
  'wait_attend',
  'wait_FIX',
  'wait_visit',
  'wait_offer',
  'wait_entry',
  'wait_termination',
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
    status: 'wait_contact',
    items: []
  },
  {
    id: 1,
    label: 'applicant.progress.status.waitAttent',
    status: 'wait_attend',
    items: []
  },
  {
    id: 2,
    label: 'applicant.progress.status.waitFix',
    status: 'wait_FIX',
    items: []
  },
  {
    id: 3,
    label: 'applicant.progress.status.waitVisit',
    status: 'wait_visit',
    items: []
  },
  {
    id: 4,
    label: 'applicant.progress.status.waitOffer',
    status: 'wait_offer',
    items: []
  },
  {
    id: 5,
    label: 'applicant.progress.status.waitEntry',
    status: 'wait_entry',
    items: []
  },
  {
    id: 6,
    label: 'applicant.progress.status.waitTermination',
    status: 'wait_termination',
    items: []
  },
]
