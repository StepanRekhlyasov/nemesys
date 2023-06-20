import { QTableProps } from 'quasar'
import { i18n } from 'boot/i18n'
import { computed } from 'vue'

const { t } = i18n.global

export const dashboardNotificationTableColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'recievedDate',
      field: 'recievedDate',
      label: t('inquiry.table.recievedDate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'category',
      field: 'category',
      label: t('inquiry.table.category'),
      align: 'left',
      sortable: true
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
    'wait_contact': t('applicant.progress.status.waitContact'),
    'wait_attend': t('applicant.progress.status.waitAttent'),
    'wait_FIX': t('applicant.progress.status.waitFix'),
    'wait_visit': t('applicant.progress.status.waitVisit'),
    'wait_offer': t('applicant.progress.status.waitOffer'),
    'wait_entry': t('applicant.progress.status.waitEntry'),
    'wait_termination': t('applicant.progress.status.waitTermination'),
  }
})
export const borderColor = {
  'wait_contact': '#FB8C00',
  'wait_attend': '#DFFE86',
  'wait_FIX': '#DFFE86',
  'wait_visit': '#DFFE86',
  'wait_offer': '#DFFE86',
  'wait_entry': '#17568080',
  'wait_termination': '#17568080',
}