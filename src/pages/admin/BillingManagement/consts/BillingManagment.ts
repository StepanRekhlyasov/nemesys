import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
import { AggregatesDummyData } from '../types/billing.types';
const { t } = i18n.global

export const sortable = ref(false)
export const feeAggregatesColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'id',
    label: 'No./'+t('billing.feeAggregates.companyId')+'/'+t('billing.feeAggregates.companyName'),
    field: 'id',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'totalAmountExcludingTax',
    label: t('billing.feeAggregates.totalAmountExcludingTax'),
    field: 'totalAmountExcludingTax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'consumptionTax',
    label: t('billing.feeAggregates.consumptionTax'),
    field: 'consumptionTax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'totalAmountIncludingTax',
    label: t('billing.feeAggregates.totalAmountIncludingTax'),
    field: 'totalAmountIncludingTax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'paymentStatus',
    label: t('billing.feeAggregates.paymentStatus'),
    field: 'paymentStatus',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'createInvoice',
    label: t('billing.feeAggregates.createInvoice'),
    field: 'createInvoice',
    align: 'center',
    sortable: sortable.value,
  },
  {
    name: 'createSmsUsageDetails',
    label: t('billing.feeAggregates.createSmsUsageDetails'),
    field: 'createSmsUsageDetails',
    align: 'center',
    sortable: sortable.value
  },
  {
    name: 'createFaxUsageDetails',
    label: t('billing.feeAggregates.createFaxUsageDetails'),
    field: 'createFaxUsageDetails',
    align: 'center',
    sortable: sortable.value
  },
  {
    name: 'expandButton',
    label: t('billing.feeAggregates.viewDetails'),
    field: '',
    align: 'center',
  }
])
export const billingHistoryColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'no',
    label: 'No.',
    field: '',
    align: 'left',
    value: 'No..',
    sortable: sortable.value
  },
  {
    name: 'name',
    label: t('billing.feeAggregates.companyName') + '\n' + t('billing.feeAggregates.companyId'),
    field: 'name',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'consumptionTax',
    label: '担当者名',
    field: 'consumptionTax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'totalAmountIncludingTax',
    label: '電話番号',
    field: 'totalAmountIncludingTax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'paymentStatus',
    label: 'FAX番号',
    field: 'paymentStatus',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'createInvoice',
    label: 'メールアドレス',
    field: 'createInvoice',
    align: 'center',
    sortable: sortable.value,
  },
  {
    name: 'createSmsUsageDetails',
    label: '請求書希望',
    field: 'createSmsUsageDetails',
    align: 'center',
    sortable: sortable.value
  },
  {
    name: 'createFaxUsageDetails',
    label: '請求書データ',
    field: 'createFaxUsageDetails',
    align: 'center',
    sortable: sortable.value
  },
  {
    name: 'expandButton',
    label: '請求日',
    field: '',
    align: 'center',
  }
])

/** replace this test data */
export const aggregatesDummyData: AggregatesDummyData[] = [
  {
    id: 'A - string 1',
    totalAmountExcludingTax: 'A - string 2',
    consumptionTax: 'A - string 3',
    totalAmountIncludingTax: 'A - string 4',
    paymentStatus: 'A - string 5',
    createInvoice: 'A - string 6',
    createSmsUsageDetails: 'A - string 7',
    createFaxUsageDetails: 'A - string 8',
  },
  {
    id: 'B - string 1',
    totalAmountExcludingTax: 'B - string 2',
    consumptionTax: 'B - string 3',
    totalAmountIncludingTax: 'B - string 4',
    paymentStatus: 'B - string 5',
    createInvoice: 'B - string 6',
    createSmsUsageDetails: 'B - string 7',
    createFaxUsageDetails: 'B - string 8',
  },
  {
    id: 'C - string 1',
    totalAmountExcludingTax: 'C - string 2',
    consumptionTax: 'C - string 3',
    totalAmountIncludingTax: 'C - string 4',
    paymentStatus: 'C - string 5',
    createInvoice: 'C - string 6',
    createSmsUsageDetails: 'C - string 7',
    createFaxUsageDetails: 'C - string 8',
  },
  {
    id: 'D - string 1',
    totalAmountExcludingTax: 'D - string 2',
    consumptionTax: 'D - string 3',
    totalAmountIncludingTax: 'D - string 4',
    paymentStatus: 'D - string 5',
    createInvoice: 'D - string 6',
    createSmsUsageDetails: 'D - string 7',
    createFaxUsageDetails: 'D - string 8',
  },
  {
    id: 'E - string 1',
    totalAmountExcludingTax: 'E - string 2',
    consumptionTax: 'E - string 3',
    totalAmountIncludingTax: 'E - string 4',
    paymentStatus: 'E - string 5',
    createInvoice: 'E - string 6',
    createSmsUsageDetails: 'E - string 7',
    createFaxUsageDetails: 'E - string 8',
  },
  {
    id: 'F - string 1',
    totalAmountExcludingTax: 'F - string 2',
    consumptionTax: 'F - string 3',
    totalAmountIncludingTax: 'F - string 4',
    paymentStatus: 'F - string 5',
    createInvoice: 'F - string 6',
    createSmsUsageDetails: 'F - string 7',
    createFaxUsageDetails: 'F - string 8',
  },
  {
    id: 'G - string 1',
    totalAmountExcludingTax: 'G - string 2',
    consumptionTax: 'G - string 3',
    totalAmountIncludingTax: 'G - string 4',
    paymentStatus: 'G - string 5',
    createInvoice: 'G - string 6',
    createSmsUsageDetails: 'G - string 7',
    createFaxUsageDetails: 'G - string 8',
  },
];
