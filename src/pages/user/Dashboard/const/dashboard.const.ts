import { QTableProps } from 'quasar'
import { i18n } from 'boot/i18n'
import { computed } from 'vue'
import { InquiryMessage } from 'src/pages/admin/InquiryPage/types/inquiryTypes'
import { FieldValue, Timestamp } from 'firebase/firestore'

const { t } = i18n.global

export const dashboardNotificationTableColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'readBy',
      field: 'readBy',
      label: '',
      align: 'left',
      sortable: false,
    },
    {
      name: 'messageDirection',
      field: '',
      label: '',
      align: 'center',
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
  readBy?: string[] | FieldValue
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

export const applicantTaskTableColumns = computed<QTableProps['columns']>(()=> [
  {
    name: 'created_at',
    field: 'created_at',
    label: t('client.backOrder.dateOfRegistration'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskType',
    field: 'taskType',
    label: t('task.taskType'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskStatus',
    field: 'taskStatus',
    label: t('task.taskStatus'),
    align: 'left',
    sortable: true
  },
  {
    name: 'applicantName',
    field: 'applicantName',
    label: t('task.applicantName'),
    align: 'left',
    sortable: true
  },
  {
    name: 'applicantStatus',
    field: 'applicantStatus',
    label: t('applicant.list.status'),
    align: 'left',
    sortable: true
  },
  {
    name: 'assignedUserName',
    field: 'assignedUserName',
    label: t('applicant.progress.filters.userInCharge'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskContent',
    field: 'taskContent',
    label: t('task.taskContent'),
    align: 'left',
    sortable: true
  },
])

export const officeTaskTableColumns = computed<QTableProps['columns']>(()=> [
  {
    name: 'created_at',
    field: 'created_at',
    label: t('client.backOrder.dateOfRegistration'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskType',
    field: 'taskType',
    label: t('task.taskType'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskStatus',
    field: 'taskStatus',
    label: t('task.taskStatus'),
    align: 'left',
    sortable: true
  },
  {
    name: 'clientFactoryName',
    field: 'clientFactoryName',
    label: t('client.add.officeName'),
    align: 'left',
    sortable: true
  },
  {
    name: 'clientName',
    field: 'clientName',
    label: t('client.add.clientName'),
    align: 'left',
    sortable: true
  },
  {
    name: 'assignedUserName',
    field: 'assignedUserName',
    label: t('applicant.progress.filters.userInCharge'),
    align: 'left',
    sortable: true
  },
  {
    name: 'taskContent',
    field: 'taskContent',
    label: t('task.taskContent'),
    align: 'left',
    sortable: true
  },
])
export const taskStatusOptions = computed(()=>[
  {
    label: t('task.statuses.new'),
    value: 'new'
  },
  {
    label: t('task.statuses.process'),
    value: 'process'
  },
  {
    label: t('task.statuses.finish'),
    value: 'finish'
  },
])

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