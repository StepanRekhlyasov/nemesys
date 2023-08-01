import { i18n } from 'boot/i18n';
import { computed ,ComputedRef} from 'vue';
import { QTableProps } from 'quasar';
const { t } = i18n.global;

export const rowNames = ['report.companyTotal', 'report.CVR', 'report.allCVR'] as const;
export const chartType = ['bar', 'line', 'line'] as const ;
export const nameList = [t('report.companyAverage'), t('report.allAverage')];
export const itemList = [
{queryName:'applicants'},
{queryName:'validApplicants'},
{queryName:'contactApplicants'},
{queryName:'attractionApplicants'},
{queryName:'attendApplicants'},
{queryName:'fix'},
{queryName:'inspection'},
{queryName:'offer'},
{queryName:'admission'},
] as const

export const chartOptions = computed(() => {
  return {
    legend: { position: 'right' },
    chart: {},
    title: {
      text: t('report.title.applicationToAdmission'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        holizontal: true,
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
        t('report.categories.applicant'),
        t('report.categories.validApplicant'),
        t('report.categories.numberOfContacts'),
        t('report.categories.numberOfInvitations'),
        t('report.categories.numberOfAttendance'),
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
            return value.toFixed(1) + '%';
          },
        },
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
      name: 'Applicant',
      align: 'center',
      label: t('report.categories.applicant'),
      field: 'applicants',
      sortable: true,
    },
    {
      name: 'ValidApplicant',
      align: 'center',
      label: t('report.categories.validApplicant'),
      field: 'valid_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfContacts',
      align: 'center',
      label: t('report.categories.numberOfContacts'),
      field: 'contact_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfInvitations',
      align: 'center',
      label: t('report.categories.numberOfInvitations'),
      field: 'attraction_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfAttendance',
      align: 'center',
      label: t('report.categories.numberOfAttendance'),
      field: 'attend_applicants',
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

export const chartOptionsLeadtime = computed(() => {
  return {
    legend: { position: 'right' },
    chart: {
      type: 'bar',
    },
    title: {
      text: t('report.title.leadtime'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
        ' ' + t('report.categories.applicant') +
          '-' +
          t('report.categories.invitations'),
        t('report.categories.invitations') + '-' + t('report.categories.fix'),
        t('report.categories.fix') + '-' + t('report.categories.inspection'),
        t('report.categories.inspection') + '-' + t('report.categories.offer'),
        t('report.categories.offer') + '-' + t('report.categories.admission'),
      ],
    },
    yaxis: [
      {
        min: 0,
        labels: {
          formatter: function (value) {
            return value + t('report.day');
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
  };
});

export const columnsLeadtime:ComputedRef<QTableProps['columns']> = computed(() => {
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
      name: 'invitations',
      align: 'center',
      label:
        t('report.categories.applicant') +
        '-' +
        t('report.categories.invitations'),
      field: 'invitations',
      sortable: true,
    },
    {
      name: 'fix',
      align: 'center',
      label:
        t('report.categories.invitations') + '-' + t('report.categories.fix'),
      field: 'fix',
      sortable: true,
    },
    {
      name: 'inspection',
      align: 'center',
      label:
        t('report.categories.fix') + '-' + t('report.categories.inspection'),
      field: 'inspection',
      sortable: true,
    },
    {
      name: 'offer',
      align: 'center',
      label:
        t('report.categories.inspection') + '-' + t('report.categories.offer'),
      field: 'offer',
      sortable: true,
    },
    {
      name: 'admission',
      align: 'center',
      label:
        t('report.categories.offer') + '-' + t('report.categories.admission'),
      field: 'admission',
      sortable: true,
    },
  ];
});
