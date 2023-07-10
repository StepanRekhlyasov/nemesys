import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const saaTableColumns = computed<QTableProps['columns']>(() => {
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
      field: 'chargeOfFix',
      label: t('KPI.numberOfFix'),
      align: 'center',
      sortable: true
    },
    {
      name: 'numberOfVisit',
      field: 'chargeOfInspection',
      label: t('KPI.numberOfVisit'),
      align: 'center',
      sortable: true
    },
    {
      name: 'numberOfOffer',
      field: 'chargeOfOffer',
      label: t('KPI.numberOfOffer'),
      align: 'center',
      sortable: true
    },
    {
      name: 'numberOFEntry',
      field: 'chargeOfAdmission',
      label: t('KPI.numberOFEntry'),
      align: 'center',
      sortable: true
    },
    {
      name: 'numberOfCalls',
      field: 'numberOfCalls',
      label: t('KPI.numberOfCalls'),
      align: 'left',
      sortable: true
    },
    {
      name: 'numberOfFax',
      field: 'numberOfFax',
      label: t('KPI.numberOfFax'),
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: 'BO_NC',
      label: t('KPI.BO_NC'),
      align: 'left',
      sortable: true
    },
    {
      name: '',
      field: 'BO_N',
      label: t('KPI.BO_N'),
      align: 'left',
      sortable: true
    },
    {
      name: 'dispatch',
      field: 'dispatch',
      label: t('KPI.dispatch'),
      align: 'left',
      sortable: true
    },
    {
      name: 'introduction',
      field: 'introduction',
      label: t('KPI.introduction'),
      align: 'left',
      sortable: true
    },
    // {
    //   name: 'occupationRate',
    //   field: 'occupationRate',
    //   label: t('KPI.occupationRate'),
    //   align: 'left',
    //   sortable: true
    // },
    {
      name: 'TTP',
      field: 'TTP',
      label: 'TTP',
      align: 'left',
      sortable: true
    },
    {
      name: 'chargeOfInspectionRate',
      field: 'chargeOfInspectionRate',
      label: t('KPI.occupationRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'chargeOfOfferRate',
      field: 'chargeOfOfferRate',
      label: t('KPI.jobOfferRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'chargeOfAdmissionRate',
      field: 'chargeOfAdmissionRate',
      label: t('KPI.hiringRate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'personOK',
      field: 'personOK',
      label: t('KPI.Person')+'OK',
      align: 'left',
      sortable: true
    },
    {
      name: 'personNG',
      field: 'personNG',
      label: t('KPI.Person')+'NG',
      align: 'left',
      sortable: true
    },
    {
      name: 'personOKRate',
      field: 'personOKRate',
      label: t('KPI.Person')+'OK'+t('KPI.Rate'),
      align: 'left',
      sortable: true
    },
    {
      name: 'companyOK',
      field: 'companyOK',
      label: t('KPI.Company')+'OK',
      align: 'left',
      sortable: true
    },
    {
      name: 'companyNG',
      field: 'companyNG',
      label: t('KPI.Company')+'NG',
      align: 'left',
      sortable: true
    },
    {
      name: 'companyOKRate',
      field: 'companyOKRate',
      label: t('KPI.Company')+'OK'+t('KPI.Rate'),
      align: 'left',
      sortable: true
    },
  ]
}) 