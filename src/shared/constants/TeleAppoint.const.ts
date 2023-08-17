import { computed } from 'vue';
import { i18n } from 'boot/i18n'
import { QTableProps } from 'quasar';
const { t } = i18n.global

export const TeleColumns = computed<QTableProps['columns']>(() => {
  return [
    {
        label:'',
        name: 'edit',
        align: 'left',
        field:'edit'
      },
      {
        label: t('detal.teleAppoint.registredUser'),
        name: 'created_by',
        required: true,
        align: 'left',
        field: 'created_by',
        sortable: false,
      },
      {
        name: 'created_at',
        required: true,
        label: t('detal.teleAppoint.date'),
        field: 'created_at',
        align: 'left',
      },
      {
        name: 'result',
        required: true,
        label: t('detal.teleAppoint.teleAppointmentResult'),
        field: 'result',
        align: 'left',
      },
      {
        name: 'jobResult',
        label: t('detal.teleAppoint.jobResult'),
        field: 'jobResult',
        align: 'left',
      },
      {
        name: 'requiredService',
        label: t('detal.teleAppoint.requiredService'),
        field: 'requiredService',
        align: 'left',
      },
      {
        name: 'remark',
        label: t('detal.teleAppoint.remark'),
        field: 'remark',
        align: 'left',
      },
      {
        name: 'timeFrame',
        label: t('detal.teleAppoint.timeFrame'),
        field: 'timeFrame',
        align: 'left',
      },
      {
       label: '',
       field: 'action',
       name: 'action',
       align: 'left',
      },
]
});

