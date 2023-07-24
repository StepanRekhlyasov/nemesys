import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { where } from 'firebase/firestore';
const { t } = i18n.global;

export const secondperday = 1000 * 60 * 60 * 24;
export const applicationAttributeItemList = [
  { queryName: 'male' },
  { queryName: 'female' },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 1)],
    fieldName: 'daysToWork1',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 2)],
    fieldName: 'daysToWork2',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 3)],
    fieldName: 'daysToWork3',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 4)],
    fieldName: 'daysToWork4',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 5)],
    fieldName: 'daysToWork5',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 6)],
    fieldName: 'daysToWork6',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 7)],
    fieldName: 'daysToWork7',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('occupation', '==', 'nurse')],
    fieldName: 'applicantsNurse',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('occupation', '==', 'nursingCare')],
    fieldName: 'applicantsNursingCare',
  },
] as const;

export const rateCalcuPattern = [
  {
    before: 'applicants',
    after: 'validApplicants',
    name: 'validApplicantsRate',
  },
  {
    before: 'validApplicants',
    after: 'contactApplicants',
    name: 'contactApplicantsRate',
  },
  {
    before: 'contactApplicants',
    after: 'attractionApplicants',
    name: 'attractionApplicantsRate',
  },
  {
    before: 'attractionApplicants',
    after: 'attendApplicants',
    name: 'attendApplicantsRate',
  },
  { before: 'attendApplicants', after: 'fix', name: 'fixRate' },
  { before: 'fix', after: 'inspection', name: 'inspectionRate' },
  { before: 'inspection', after: 'offer', name: 'offerRate' },
  { before: 'offer', after: 'admission', name: 'admissionRate' },
  { before: 'applicants', after: 'fix', name: 'applicantsFixRate' },
];
export const dayItemList = [
  { queryName: 'applicants' },
  { queryName: 'validApplicants' },
  { queryName: 'contactApplicants' },
  { queryName: 'attractionApplicants' },
  { queryName: 'attendApplicants' },
  { queryName: 'nursingCare' },
  { queryName: 'nurse' },
  { queryName: 'generalDispatch' },
  { queryName: 'introduction' },
  { queryName: 'TTP' },
  { queryName: 'fix' },
  { queryName: 'inspection' },
  { queryName: 'offer' },
  { queryName: 'admission' },
] as const;

export const mediaItemList = [
  { queryName: 'amount' },
  { queryName: 'applicants' },
  { queryName: 'validApplicants' },
  { queryName: 'contactApplicants' },
  { queryName: 'attractionApplicants' },
  { queryName: 'attendApplicants' },
  { queryName: 'fix' },
  { queryName: 'inspection' },
  { queryName: 'offer' },
  { queryName: 'admission' },
] as const;

export const mediaItemRateList = [
  ['applicants', 'validApplicants'],
  ['validApplicants', 'contactApplicants'],
  ['contactApplicants', 'attractionApplicants'],
  ['attractionApplicants', 'attendApplicants'],
  ['attendApplicants', 'fix'],
  ['fix', 'inspection'],
  ['inspection', 'offer'],
  ['offer', 'admission'],
  ['applicants', 'fix', 'applicantsFixRate'],
] as const;

export const actualFiguresColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: '',
      field: 'name',
      label: '',
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'amount',
      label: t('KPI.tables.actualFigures.2'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'applicants',
      label: t('KPI.tables.actualFigures.3'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'validApplicants',
      label: t('KPI.tables.actualFigures.4'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'contactApplicants',
      label: t('KPI.tables.actualFigures.5'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicants',
      label: t('KPI.tables.actualFigures.6'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attendApplicants',
      label: t('KPI.tables.actualFigures.7'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'fix',
      label: t('KPI.tables.actualFigures.8'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'inspection',
      label: t('KPI.tables.actualFigures.9'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'offer',
      label: t('KPI.tables.actualFigures.10'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'admission',
      label: t('KPI.tables.actualFigures.11'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'validApplicantsRate',
      label: t('KPI.tables.actualFigures.12'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'contactApplicantsRate',
      label: t('KPI.tables.actualFigures.13'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicantsRate',
      label: t('KPI.tables.actualFigures.14'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicantsRate',
      label: t('KPI.tables.actualFigures.15'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'fixRate',
      label: t('KPI.tables.actualFigures.16'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'inspectionRate',
      label: t('KPI.tables.actualFigures.17'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'offerRate',
      label: t('KPI.tables.actualFigures.18'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'admissionRate',
      label: t('KPI.tables.actualFigures.19'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'applicantsFixRate',
      label: t('KPI.tables.actualFigures.20'),
      align: 'center',
      sortable: true,
    },
  ];
});
export const unitPriceColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: '',
      field: 'name',
      label: '',
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'applicants',
      label: t('KPI.tables.unitPrice.1'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'validApplicants',
      label: t('KPI.tables.unitPrice.2'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'contactApplicants',
      label: t('KPI.tables.unitPrice.3'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicants',
      label: t('KPI.tables.unitPrice.4'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attendApplicants',
      label: t('KPI.tables.unitPrice.5'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'fix',
      label: t('KPI.tables.unitPrice.6'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'inspection',
      label: t('KPI.tables.unitPrice.7'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'offer',
      label: t('KPI.tables.unitPrice.8'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'admission',
      label: t('KPI.tables.unitPrice.9'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'contactApplicantsRate',
      label: t('KPI.tables.unitPrice.10'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicantsRate',
      label: t('KPI.tables.unitPrice.11'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicantsRate',
      label: t('KPI.tables.unitPrice.12'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'fixRate',
      label: t('KPI.tables.unitPrice.13'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'inspectionRate',
      label: t('KPI.tables.unitPrice.14'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'offerRate',
      label: t('KPI.tables.unitPrice.15'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'admissionRate',
      label: t('KPI.tables.unitPrice.16'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'applicantsFixRate',
      label: t('KPI.tables.unitPrice.17'),
      align: 'center',
      sortable: true,
    },
  ];
});
export const applicationAttributeColumns = computed<QTableProps['columns']>(
  () => {
    return [
      {
        name: '',
        field: 'name',
        label: '',
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'male',
        label: t('KPI.tables.applicationAttribute.1'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'female',
        label: t('KPI.tables.applicationAttribute.2'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '10s',
        label: t('KPI.tables.applicationAttribute.3'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '20s',
        label: t('KPI.tables.applicationAttribute.4'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '30s',
        label: t('KPI.tables.applicationAttribute.5'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '40s',
        label: t('KPI.tables.applicationAttribute.6'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '50s',
        label: t('KPI.tables.applicationAttribute.7'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '60sOver',
        label: t('KPI.tables.applicationAttribute.8'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'daysToWork1',
        label: t('KPI.tables.applicationAttribute.9'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'daysToWork2',
        label: t('KPI.tables.applicationAttribute.10'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'daysToWork3',
        label: t('KPI.tables.applicationAttribute.11'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'daysToWork4',
        label: t('KPI.tables.applicationAttribute.12'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'daysToWork5',
        label: t('KPI.tables.applicationAttribute.13'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '',
        label: t('KPI.tables.applicationAttribute.14'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '',
        label: t('KPI.tables.applicationAttribute.15'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '',
        label: t('KPI.tables.applicationAttribute.16'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'applicantsNursingCare',
        label: t('KPI.tables.applicationAttribute.17'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '',
        label: t('KPI.tables.applicationAttribute.18'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: 'applicantsNurse',
        label: t('KPI.tables.applicationAttribute.19'),
        align: 'center',
        sortable: true,
      },
      {
        name: '',
        field: '',
        label: t('KPI.tables.applicationAttribute.20'),
        align: 'center',
        sortable: true,
      },
    ];
  }
);
export const everydayColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: '',
      field: 'name',
      label: '',
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.everyday.1'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.everyday.2'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.everyday.3'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'nursingCare',
      label: t('KPI.tables.everyday.4'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'nurse',
      label: t('KPI.tables.everyday.5'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'generalDispatch',
      label: t('KPI.tables.everyday.6'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'introduction',
      label: t('KPI.tables.everyday.7'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'TTP',
      label: t('KPI.tables.everyday.8'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'applicants',
      label: t('KPI.tables.everyday.9'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attractionApplicants',
      label: t('KPI.tables.everyday.10'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'attendApplicants',
      label: t('KPI.tables.everyday.11'),
      align: 'center',
      sortable: true,
    },
    {
      name: 'fix',
      field: 'fix',
      label: t('KPI.tables.everyday.12'),
      align: 'center',
      sortable: true,
    },
    {
      name: 'inspection',
      field: 'inspection',
      label: t('KPI.tables.everyday.13'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'offer',
      label: t('KPI.tables.everyday.14'),
      align: 'center',
      sortable: true,
    },
    {
      name: '',
      field: 'admission',
      label: t('KPI.tables.everyday.15'),
      align: 'center',
      sortable: true,
    },
  ];
});
