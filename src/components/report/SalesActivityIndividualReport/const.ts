import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { computed ,ComputedRef} from 'vue';
const { t } = i18n.global;
export const itemList = [
  {queryName:'fix'},
  {queryName:'inspection'},
  {queryName:'offer'},
  {queryName:'admission'}
] as const
export const itemListRight = [
  {queryName:'BO'},
  {queryName:'BOIsfirst'},
  {queryName:'BOIsnotfirst'}
] as const
export const dataNames = ['report.companyAverage', 'report.allAverage'] as const;

export const chartOptions = computed(() => {
  return {

    legend: { position: 'left' },
    chart: {},
    title: {
      text: t('report.title.individualPerformanceStatus'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: [
        t('report.categories.fix'),
        t('report.categories.inspection'),
        t('report.categories.offer'),
        t('report.categories.admission'),
      ],
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (value) {
          return value.toFixed(1)
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };
});

export const columns:ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label:'',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: 'fix',
      align: 'center',
      label: t('report.categories.fix'),
      field: 'fix',
      sortable: true,
    },
    {
      name: 'inspection',
      align: 'center',
      label: t('report.categories.inspection'),
      field: 'inspection',
      sortable: true,
    },
    {
      name: 'offer',
      align: 'center',
      label: t('report.categories.offer'),
      field: 'offer',
      sortable: true,
    },
    {
      name: 'admission',
      align: 'center',
      label: t('report.categories.admission'),
      field: 'admission',
      sortable: true,
    },
    {
      name: 'inspectionRate',
      align: 'center',
      label: t('report.categories.inspectionRate'),
      field: 'inspectionRate',
      sortable: true,
    },
    {
      name: 'offerRate',
      align: 'center',
      label: t('report.categories.offerRate'),
      field: 'offerRate',
      sortable: true,
    },
    {
      name: 'admissionRate',
      align: 'center',
      label: t('report.categories.admissionRate'),
      field: 'admissionRate',
      sortable: true,
    },
  ];
});

export const chartOptionsR = computed(() => {
  return {
    legend: { position: 'left' },
    chart: {},
    title: {
      text: t('report.title.BOAcquisitionStatus'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: [
        t('report.categories.numberOfCallsPerDay'),
        t('report.categories.numberOfFAXPerDay'),
        t('report.categories.BOTotal'),
        t('report.categories.BONew'),
        t('report.categories.BOExisting'),
      ],
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (value) {
          return value.toFixed(1)
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };
});

export const columnsR:ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label:'',
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: 'number_of_calls_per_day',
      align: 'center',
      label: t('report.categories.numberOfCallsPerDay'),
      field: 'number_of_calls_per_day',
      sortable: true,
    },
    {
      name: 'number_of_FAX_per_day',
      align: 'center',
      label: t('report.categories.numberOfFAXPerDay'),
      field: 'number_of_FAX_per_day',
      sortable: true,
    },
    {
      name: 'BOTotal',
      align: 'center',
      label: t('report.categories.BOTotal'),
      field: 'BO',
      sortable: true,
    },
    {
      name: 'BONew',
      align: 'center',
      label: t('report.categories.BONew'),
      field: 'BOIsfirst',

      sortable: true,
    },
    {
      name: 'BOExisting',
      align: 'center',
      label: t('report.categories.BOExisting'),
      field: 'BOIsnotfirst',
      sortable: true,
    },
  ];
});
