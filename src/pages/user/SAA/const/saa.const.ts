import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const kpiTableColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'name',
      field: 'name',
      label: t('applicant.add.name'),
      align: 'left',
      sortable: true
    },
    {
      name: 'numberOfFix',
      field: 'numberOfFix',
      label: t('SAA.numberOfFix'),
      align: 'left',
      sortable: true
    },
    {
      name: 'jobs',
      field: 'jobs',
      label: t('SAA.jobs'),
      align: 'left',
      sortable: true
    },
    {
      name: 'innerConstant',
      field: 'innerConstant',
      label: t('SAA.innerConstant'),
      align: 'left',
      sortable: true
    },
    {
      name: 'entry',
      field: 'entry',
      label: t('SAA.entry'),
      align: 'left',
      sortable: true
    },
    {
      name: 'numberOfCalls',
      field: 'numberOfCalls',
      label: t('SAA.numberOfCalls'),
      align: 'left',
      sortable: true
    },
    {
      name: 'numberOfFax',
      field: 'numberOfFax',
      label: t('SAA.numberOfFax'),
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: 'BO_介',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: 'BO_看',
      align: 'left',
      sortable: true
    },
    {
      name: 'dispatch',
      field: 'dispatch',
      label: t('SAA.dispatch'),
      align: 'left',
      sortable: true
    },
    {
      name: 'introduction',
      field: 'introduction',
      label: t('SAA.introduction'),
      align: 'left',
      sortable: true
    },
    {
      name: 'occupationRate',
      field: 'occupationRate',
      label: t('SAA.occupationRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'TTP',
      field: 'TTP',
      label: 'TTP',
      align: 'left',
      sortable: true
    },
    {
      name: 'occupationRate',
      field: 'occupationRate',
      label: t('SAA.occupationRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'jobOfferRate',
      field: 'jobOfferRate',
      label: t('SAA.jobOfferRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'hiringRate',
      field: 'hiringRate',
      label: t('SAA.hiringRate'),
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '本人OK',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '本人NG',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '本人OK率',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '企業OK',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '企業NG',
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: '企業OK率',
      align: 'left',
      sortable: true
    },
  ]
}) 