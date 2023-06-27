import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const budgetAddItem = computed(() => {
  return [
    {
      label: t('budget.media'),
      key: 'media',
      type: 'select',
      required: true,
    },
    {
      label: t('settings.branch.name'),
      key: 'branch',
      type: 'select',
      required: true,
    },
    {
      label: t('applicant.add.occupation'),
      key: 'occupation',
      type: 'select',
      required: true,
    },
    {
      label: t('budget.postingStartDate'),
      key: 'postingStartDate',
      type: 'date',
      required: true,
    },
    {
      label: t('budget.postingEndDate'),
      key: 'postingEndDate',
      type: 'date',
      required: true,
    },
    {
      label: t('budget.accountingMonth'),
      key: 'accountingMonth',
      type: 'date',
      required: false,
      format: 'month'
    },
    {
      label: t('budget.amount'),
      key: 'amount',
      type: 'number',
      required: true,
      icon: true,
    },
    {
      label: t('budget.numberOfSlots'),
      key: 'numberOfSlots',
      type: 'number',
      required: false,
    },
    {
      label: t('billing.feeAggregates.unitPrice'),
      key: 'unitPrice',
      type: 'number',
      required: false,
      icon: true,
    },
    {
      label: t('budget.agency'),
      key: 'agency',
      type: 'text',
      required: false,
    },
    {
      label: t('backOrder.create.remarks'),
      key: 'remark',
      type: 'text',
      required: false,
    },
  ]
});

export const budgetColumns = computed(() => {
  return [
    {
      label: '',
      field: 'select',
      name: 'select',
      align: 'left',
    },
    {
      label: t('budget.mediaName'),
      field: 'media',
      name: 'media',
      align: 'left',
    },
    {
      label: '',
      field: 'branch',
      name: 'branch',
      align: 'left',
    },
    {
      label: '',
      field: 'posting',
      name: 'posting',
      align: 'left',
    },
    {
      label: t('budget.accountingMonth'),
      field: 'accountingMonth',
      name: 'accountingMonth',
      align: 'left',
    },
    {
      label: t('budget.amount'),
      field: 'amount',
      name: 'amount',
      align: 'left',
    },
    {
      label: '',
      field: 'numberOfSlots',
      name: 'numberOfSlots',
      align: 'left',
    },
    {
      label: t('budget.agency'),
      field: 'agency',
      name: 'agency',
      align: 'left',
    },
    {
      label: t('backOrder.create.remarks'),
      field: 'remark',
      name: 'remark',
      align: 'left',
    },
    {
      label: t('budget.updatedAt'),
      field: 'updated_at',
      name: 'updated_at',
      align: 'left',
    },
    {
      label: '',
      field: 'action',
      name: 'action',
      align: 'left',
    },
  ]
});