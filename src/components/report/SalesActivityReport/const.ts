import { i18n } from 'boot/i18n';
import { computed ,ComputedRef} from 'vue';
import {QTableProps} from 'quasar'
const { t } = i18n.global;

export const data_names = ['report.companyTotal', 'report.CVR', 'report.allCVR'];
export const data_namesR = ['report.companyTotal','report.allCVR'];
export const chart_names = ['bar', 'line', 'line'];
export const chart_namesR = ['bar', 'bar'];
export const chartOptions = computed(() => {
  return {
    chart: {
    },
    title: {
      text: t('report.title.FIXAndInspection'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
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
    yaxis: [
      {
        min: 0,

        labels: {
          formatter: function (value) {
            return value.toFixed(1)
          },
        },
      },
      {
        opposite: true,
        min: 0,
        max: 100,

        labels: {
          formatter: function (value) {
            return value.toFixed(1)
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
  };
});

export const chartOptionsR = computed(() => {
  return {
    chart: {},
    title: {
      text: t('report.title.salseProductivity'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
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
        t('report.categories.BOTotal'),
      ],
    },
    yaxis: [
      {
        min: 0,
      },
    ],
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
      align: 'left',
      label:'',
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
  ];
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
      name: 'BO_total',
      align: 'center',
      label: t('report.categoriesBOTotal'),
      field: 'BO_total',
      sortable: true,
    },
  ];
});
