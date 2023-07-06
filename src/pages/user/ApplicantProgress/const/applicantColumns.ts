import { QTableProps } from 'quasar';
import { ApplicantCol } from 'src/pages/user/Applicant/types/applicant.types';
import { ApplicantStatus } from 'src/shared/model';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global
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
  ApplicantStatus.RETIRED,
  ApplicantStatus.WORKING
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

export const applicantFixesTableColumns = computed<QTableProps['columns']>(()=>{
  return [
    {
      name: 'staffRank',
      align: 'center',
      label: '',
      field: 'staffRank',
      sortable: true
    },
    {
      name: 'occupation',
      align: 'center',
      label: '',
      field: 'occupation',
      sortable: true
    },
    {
      name: 'classification',
      align: 'center',
      label: '',
      field: 'classification',
      sortable: true
    },
    {
      name: 'name',
      align: 'center',
      label: t('applicant.progress.table.fullName'),
      field: 'name',
      sortable: true
    },
    {
      name: 'applicationDate',
      align: 'center',
      label: t('applicant.progress.table.applicationDate'),
      field: 'applicationDate',
      sortable: true
    },
    {
      name: 'nearestStation',
      align: 'center',
      label: t('applicant.progress.table.nearestStation'),
      field: 'nearestStation',
      sortable: true
    },
    {
      name: 'qualification',
      align: 'center',
      label: t('applicant.progress.table.qualificationsExperience'),
      field: 'qualification',
      sortable: true
    },
    {
      name: 'timeToWork',
      align: 'center',
      label: t('applicant.progress.table.availableStartDate'),
      field: 'timeToWork',
      sortable: true
    },
    {
      name: 'daysToWork',
      align: 'center',
      label: t('applicant.progress.table.numberOfDays'),
      field: 'daysToWork',
      sortable: true
    },
    {
      name: 'workingHoursEarly',
      align: 'center',
      label: t('applicant.progress.table.earlyShift'),
      field: 'workingHoursEarly',
      sortable: true
    },
    {
      name: 'workingHoursDay',
      align: 'center',
      label: t('applicant.progress.table.dayShift'),
      field: 'workingHoursDay',
      sortable: true
    },
    {
      name: 'workingHoursLate',
      align: 'center',
      label: t('applicant.progress.table.lateShift'),
      field: 'workingHoursLate',
      sortable: true
    },
    {
      name: 'workingHoursNight',
      align: 'center',
      label: t('applicant.progress.table.nightShift'),
      field: 'workingHoursNight',
      sortable: true
    },
    {
      name: 'shiftRemarks',
      align: 'center',
      label: t('applicant.progress.table.remarks'),
      field: 'shiftRemarks',
      sortable: true
    },
    {
      name: 'monday',
      align: 'center',
      label: t('applicant.progress.table.mon'),
      field: 'mon',
      sortable: true
    },
    {
      name: 'tuesday',
      align: 'center',
      label: t('applicant.progress.table.tue'),
      field: 'tue',
      sortable: true
    },
    {
      name: 'wednesday',
      align: 'center',
      label: t('applicant.progress.table.wed'),
      field: 'wed',
      sortable: true
    },
    {
      name: 'thursday',
      align: 'center',
      label: t('applicant.progress.table.thu'),
      field: 'thu',
      sortable: true
    },
    {
      name: 'friday',
      align: 'center',
      label: t('applicant.progress.table.fri'),
      field: 'fri',
      sortable: true
    },
    {
      name: 'saturday',
      align: 'center',
      label: t('applicant.progress.table.sat'),
      field: 'sat',
      sortable: true
    },
    {
      name: 'sunday',
      align: 'center',
      label: t('applicant.progress.table.sun'),
      field: 'sun',
      sortable: true
    },
    {
      name: 'holiday',
      align: 'center',
      label: t('applicant.progress.table.holiday'),
      field: 'holiday',
      sortable: true
    },
    {
      name: 'memo',
      align: 'center',
      label: t('applicant.progress.table.memo'),
      field: 'memo',
      sortable: true
    },
  ]
})

export const updateFixesTableColumns = computed<QTableProps['columns']>(()=>{
  return [
    {
      name: 'name',
      align: 'center',
      label: t('applicant.progress.table.staffName'),
      field: 'name',
      sortable: true
    },
    {
      name: 'occupation',
      align: 'center',
      label: t('applicant.progress.table.jobType'),
      field: 'occupation',
      sortable: true
    },
    {
      name: 'boId',
      align: 'center',
      label: t('client.backOrder.list.id'),
      field: 'boId',
      sortable: true
    },
    {
      name: 'chargeOfAdmission',
      align: 'center',
      label: t('applicant.list.fixEmployment.admission.chargeOfAdmission'),
      field: 'chargeOfAdmission',
      sortable: true
    },
    {
      name: 'admissionDate',
      align: 'center',
      label: t('applicant.progress.table.startDate'),
      field: 'admissionDate',
      sortable: true
    },
    {
      name: 'endDate',
      align: 'center',
      label: t('applicant.progress.table.endDate'),
      field: 'endDate',
      sortable: true
    },
    {
      name: 'remainingDays',
      align: 'center',
      label: t('applicant.progress.table.remainingDays'),
      field: '',
      sortable: true
    },
    {
      name: 'invoice',
      align: 'center',
      label: t('applicant.progress.table.invoice'),
      field: '',
      sortable: true
    },
    {
      name: 'payment',
      align: 'center',
      label: t('applicant.progress.table.payment'),
      field: '',
      sortable: true
    },
    {
      name: 'memo',
      align: 'center',
      label: t('applicant.progress.table.memo'),
      field: '',
      sortable: true
    },
  ]
})