import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { computed ,ComputedRef} from 'vue';
const { t } = i18n.global;
export const data_names = ['report.companyAverage', 'report.allAverage'];
export const chartOptions = computed(() => {
  return {
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
      name: 'inspection_rate',
      align: 'center',
      label: t('report.categories.inspectionRate'),
      field: 'inspection_rate',
      sortable: true,
    },
    {
      name: 'offer_rate',
      align: 'center',
      label: t('report.categories.offerRate'),
      field: 'offer_rate',
      sortable: true,
    },
    {
      name: 'admission_rate',
      align: 'center',
      label: t('report.categories.admissionRate'),
      field: 'admission_rate',
      sortable: true,
    },
  ];
});

export const chartOptionsR = computed(() => {
  return {
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
      name: 'BO_total',
      align: 'center',
      label: t('report.categoriesBOTotal'),
      field: 'BO_total',
      sortable: true,
    },
    {
      name: 'BO_New',
      align: 'center',
      label: t('report.categoriesBONew'),
      field: 'BO_New',
      sortable: true,
    },
    {
      name: 'BO_Existing',
      align: 'center',
      label: t('report.categories.BOExisting'),
      field: 'BO_Existing',
      sortable: true,
    },
  ];
});
