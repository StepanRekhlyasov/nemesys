import { QTableProps } from 'quasar';
import { computed,ref } from 'vue';
import { i18n } from 'boot/i18n';
import { INQUIRY_STATUS } from '../types/inquiryTypes';

const { t } = i18n.global

export const inquiresTableColumns = computed < QTableProps['columns'] > (() => [
  {
    name: 'edit',
    label: '',
    field: ''
  },
  {
      name: 'number',
      label: 'No.',
      field: 'number',
      sortable: false,
  },
  {
      name: 'status',
      required: true,
      label: t('inquiry.table.status'),
      field: 'status',
      align: 'left',
      sortable: true,
  },
  {
      name: 'category',
      required: true,
      label: t('inquiry.table.category'),
      field: 'category',
      align: 'left',
      sortable: true,
  },
  {
      name: 'subject',
      required: true,
      label: t('inquiry.table.subject'),
      field: 'subject',
      align: 'left',
      sortable: true,
  },
  {
      name: 'companyID',
      required: true,
      label: t('inquiry.table.companyID'),
      field: 'companyID',
      align: 'left',
      sortable: true,
  },
  {
      name: 'companyName',
      required: true,
      label: t('inquiry.table.companyName'),
      field: 'companyName',
      align: 'left',
      sortable: true,
  },
  {
      name: 'updated_at',
      required: true,
      label: t('inquiry.table.recievedDate'),
      field: 'updated_at',
      align: 'left',
      sortable: false,
  },
])

export const statusOptions = computed(()=>[
  {
    label: t('inquiry.'+INQUIRY_STATUS.answered),
    value: INQUIRY_STATUS.answered
  },
  {
    label: t('inquiry.'+INQUIRY_STATUS.unanswered),
    value: INQUIRY_STATUS.unanswered
  },
])
export const sortable = ref(true)
export const notificationTableColumns = computed < QTableProps['columns'] > (() => [{
  name: 'edit',
  label: '',
  field: ''
}, {
  name: 'number',
  label: 'No.',
  field: 'number',
  sortable: true,
}, {
  name: 'status',
  required: true,
  label: t('releaseNotes.table.status'),
  field: 'status',
  align: 'left',
  sortable: true,
}, {
  name: 'category',
  required: true,
  label: t('releaseNotes.form.category'),
  field: 'category',
  align: 'left',
  sortable: true,
}, {
  name: 'subject',
  required: true,
  label: t('releaseNotes.form.subject'),
  field: 'subject',
  align: 'left',
  sortable: true,
}, {
  name: 'content',
  required: true,
  label: t('releaseNotes.form.content'),
  field: 'content',
  align: 'left',
  sortable: true,
}, {
  name: 'author',
  required: true,
  label: t('releaseNotes.table.author'),
  field: 'author',
  align: 'left',
  sortable: true,
}, {
  name: 'creationDate',
  required: true,
  label: t('releaseNotes.table.creationDate'),
  field: 'creationDate',
  align: 'left',
  sortable: true,
}, {
  name: 'deliveryDate',
  required: true,
  label: t('releaseNotes.table.deliveryDate'),
  field: 'deliveryDate',
  align: 'left',
  sortable: true,
}, {
  name: 'delete',
  label: '',
  field: ''
}])
