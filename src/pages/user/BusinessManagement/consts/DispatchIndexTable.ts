import { computed } from 'vue';
import { i18n } from 'boot/i18n';
const { t } = i18n.global;
export const columnsDispatchIndexTable = computed(() => {
  return [
    {
      name: 'clientName',
      required: true,
      label: t('backOrder.clientName'),
      field: 'clientName',
      align: 'left',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'index',
      required: true,
      label: t('common.index'),
      field: 'index',
      align: 'left',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'totalPoints',
      required: true,
      label: t('common.totalPoints'),
      field: 'totalPoints',
      align: 'left',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'telOne',
      required: true,
      label: t('backOrder.daysPerWeek.one'),
      align: 'left',
      field: 'telOne',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'telTwo',
      required: true,
      label: t('backOrder.daysPerWeek.two'),
      align: 'left',
      field: 'telTwo',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'telThree',
      required: true,
      label: t('backOrder.daysPerWeek.three'),
      align: 'left',
      field: 'telThree',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'telFour',
      required: true,
      label: t('backOrder.daysPerWeek.four'),
      align: 'left',
      field: 'telFour',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'telFive',
      required: true,
      label: t('backOrder.daysPerWeek.five'),
      align: 'left',
      field: 'telFive',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'faxOne',
      required: true,
      label: t('backOrder.daysPerWeek.one'),
      align: 'left',
      field: 'faxOne',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'faxTwo',
      required: true,
      label: t('backOrder.daysPerWeek.two'),
      align: 'left',
      field: 'faxTwo',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'faxThree',
      required: true,
      label: t('backOrder.daysPerWeek.three'),
      align: 'left',
      field: 'faxThree',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'faxFour',
      required: true,
      label: t('backOrder.daysPerWeek.four'),
      align: 'left',
      field: 'faxFour',
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'faxFive',
      required: true,
      label: t('backOrder.daysPerWeek.five'),
      align: 'left',
      field: 'faxFive',
      format: val => `${val}`,
      sortable: true
    },

  ]
})

export const argsList = [
  ['one', 'coldCall'],
  ['two', 'coldCall'],
  ['three', 'coldCall'],
  ['four', 'coldCall'],
  ['five', 'coldCall'],
  ['one', 'fax'],
  ['two', 'fax'],
  ['three', 'fax'],
  ['four', 'fax'],
  ['five', 'fax'],
];
