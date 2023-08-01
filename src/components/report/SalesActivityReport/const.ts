import { i18n } from 'boot/i18n';
import { computed, ComputedRef } from 'vue';
import { QTableProps } from 'quasar';
import { chartOptionsVerticalBase } from '../report.const';
const { t } = i18n.global;
export const itemList = [
  { queryName: 'fix' },
  { queryName: 'inspection' },
  { queryName: 'offer' },
  { queryName: 'admission' },
  { queryName: 'BO' },
] as const;
export const donutGraphItem = [
  { queryName: 'nurse' },
  { queryName: 'nursingCare' },
] as const;
export const donutLabelNames = [
  t('client.add.nurse'),
  t('client.add.nursing'),
] as const;
export const dataNames = [
  'report.companyTotal',
  'report.CVR',
  'report.allCVR',
] as const;
export const dataNamesR = [
  'report.companyAverage',
  'report.allAverage',
] as const;
export const chartNames = ['bar', 'line', 'line'] as const;
export const chartNamesR = ['bar', 'bar'] as const;
export const chartOptions = computed(() => {
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.title.text = t('report.title.FIXAndInspection');
  chartOptions.xaxis['categories'] = [
    t('report.categories.fix'),
    t('report.categories.inspection'),
    t('report.categories.offer'),
    t('report.categories.admission'),
  ];
  chartOptions.yaxis[0]['forceNiceScale'] = true;
  chartOptions.yaxis[1] = {
    opposite: true,
    min: 0,
    max: 100,

    labels: {
      formatter: function (value) {
        return value.toFixed(1) + '%';
      },
    },
  }
  return chartOptions;
});

export const chartOptionsR = computed(() => {
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.title.text = t('report.title.salseProductivity');
  chartOptions.xaxis['categories'] = [
    t('report.categories.fix'),
    t('report.categories.inspection'),
    t('report.categories.offer'),
    t('report.categories.admission'),
    t('report.categories.BOTotal'),
  ];
  chartOptions.yaxis[0]['forceNiceScale'] = true;
  return chartOptions;
});

export const columns: ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      align: 'left',
      label: '',
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

export const columnsR: ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label: '',
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
      name: 'BO',
      align: 'center',
      label: t('report.categories.BOTotal'),
      field: 'BO',
      sortable: true,
    },
  ];
});
