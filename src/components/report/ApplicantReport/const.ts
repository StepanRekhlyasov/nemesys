import { i18n } from 'boot/i18n';
import { computed } from 'vue';
const { t } = i18n.global;

export const row_names = ['report.CompanyTotal', 'report.CVR', 'report.AllCVR'];
export const chartType = ['bar', 'line', 'line'];
export const item_list = [
  'applicants',
  'valid_applicants',
  'contact_applicants',
  'attraction_applicants',
  'attend_applicants',
  'fix',
  'inspection',
  'offer',
  'admission',
];
export const chartOptions = computed(() => {
  return {
    chart: {},
    title: {
      text: t('report.title.ApplicationToadmission'),
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
        t('report.categories.Applicant'),
        t('report.categories.ValidApplicant'),
        t('report.categories.NumberOfContacts'),
        t('report.categories.NumberOfInvitations'),
        t('report.categories.NumberOfAttendance'),
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

export const columns = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: 'Applicant',
      align: 'center',
      label: t('report.categories.Applicant'),
      field: 'applicants',
      sortable: true,
    },
    {
      name: 'ValidApplicant',
      align: 'center',
      label: t('report.categories.ValidApplicant'),
      field: 'valid_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfContacts',
      align: 'center',
      label: t('report.categories.NumberOfContacts'),
      field: 'contact_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfInvitations',
      align: 'center',
      label: t('report.categories.NumberOfInvitations'),
      field: 'attraction_applicants',
      sortable: true,
    },
    {
      name: 'NumberOfAttendance',
      align: 'center',
      label: t('report.categories.NumberOfAttendance'),
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
    chart: {},
    title: {
      text: t('report.title.Leadtime'),
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
        t('report.categories.Applicant') +
          '-' +
          t('report.categories.Invitations'),
        t('report.categories.Invitations') + '-' + t('report.categories.fix'),
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
            return value.toFixed(1) + t('report.day');
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
  };
});

export const columnsLeadtime = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      align: 'left',
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: 'invitations',
      align: 'center',
      label:
        t('report.categories.Applicant') +
        '-' +
        t('report.categories.Invitations'),
      field: 'invitations',
      sortable: true,
    },
    {
      name: 'fix',
      align: 'center',
      label:
        t('report.categories.Invitations') + '-' + t('report.categories.fix'),
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
