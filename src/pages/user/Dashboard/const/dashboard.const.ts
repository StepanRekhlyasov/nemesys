import { QTableProps } from 'quasar'
import { i18n } from 'boot/i18n'
import { computed } from 'vue'
import { InquiryMessage } from 'src/pages/admin/InquiryPage/types/inquiryTypes'
import { FieldValue, Timestamp } from 'firebase/firestore'

const { t } = i18n.global

export const dashboardNotificationTableColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'warning',
      field: 'warning',
      label: '',
      align: 'left',
      sortable: false,
    },
    {
      name: 'recievedDate',
      field: 'recievedDate',
      label: t('inquiry.table.recieve'),
      align: 'left',
      sortable: true,
    },
    {
      name: 'type',
      field: 'type',
      label: t('inquiry.table.notificationType'),
      align: 'center',
      sortable: true,
    },
    {
      name: 'category',
      field: 'category',
      label: t('inquiry.table.category'),
      align: 'left',
      sortable: true,
    },
    {
      name: 'subject',
      field: 'subject',
      label: t('inquiry.table.subject'),
      align: 'left',
    },
    {
      name: 'content',
      field: 'inquiryContent',
      label: t('inquiry.detail.content'),
      align: 'left',
    },
  ]
})

export interface DashboardinquiryRows {
  id: string
  status: string
  category: string
  subject: string
  inquiryContent: string
  organization?: string
  recievedDate:  Timestamp
  messages?: InquiryMessage[] | never[]
  warning?: string[] | FieldValue
  type: string
}
export const dashboardPreviewTableColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'id',
      field: 'id',
      label: t('report.categories.applicant')+'ID',
      align: 'left',
      sortable: true
    },
    {
      name: 'applicationDate',
      field: 'applicationDate',
      label: t('applicant.progress.table.applicationDate'),
      align: 'center',
      sortable: true
    },
    {
      name: 'occupation',
      field: 'occupation',
      label: t('applicant.add.occupation'),
      align: 'left',
      sortable: true
    },
    {
      name: 'municipalities',
      field: 'municipalities',
      label: t('applicant.add.municipalities'),
      align: 'left',
      sortable: true
    },
    {
      name: 'name',
      field: 'name',
      label: t('applicant.progress.table.fullName'),
      align: 'center',
      sortable: true
    },
    {
      name: 'phone',
      field: 'phone',
      label: t('applicant.add.phone'),
      align: 'left',
      sortable: true
    },
  ]
})
export const statusTitles = computed(()=>{
  return {
    'wait_contact': t('applicant.statusList.waitContact'),
    'wait_attend': t('applicant.statusList.waitAttend'),
    'wait_FIX': t('applicant.statusList.waitFIX'),
    'wait_visit': t('applicant.statusList.waitVisit'),
    'wait_offer': t('applicant.statusList.waitOffer'),
    'wait_entry': t('applicant.statusList.waitEntry'),
    'working': t('applicant.statusList.working'),
    'wait_termination': t('applicant.statusList.waitTermination'),
  }
})
export const borderColor = {
  'wait_contact': '#FB8C00',
  'wait_attend': '#DFFE86',
  'wait_FIX': '#DFFE86',
  'wait_visit': '#DFFE86',
  'wait_offer': '#DFFE86',
  'wait_entry': '#DFFE86',
  'working': '#17568080',
  'wait_termination': '#17568080',
}