
import { i18n } from 'boot/i18n'
import { computed } from 'vue';

const { t } = i18n.global

export const DaysPerWeekList = computed(() => [{
  label: t('backOrder.daysPerWeek.one'),
  value: 'one'
},{
  label: t('backOrder.daysPerWeek.two'),
  value: 'two'
},{
  label: t('backOrder.daysPerWeek.three'),
  value: 'three'
},{
  label: t('backOrder.daysPerWeek.four'),
  value: 'four'
},{
  label: t('backOrder.daysPerWeek.five'),
  value: 'five'
},])
export const BackOrderColumns = computed(() => {
  return [
  {
  label: '',
  field: 'select',
  name: 'select',
  align: 'left',
},
  {
      name: 'type',
      required: true,
      label: t('client.backOrder.caseType'),
      align: 'left',
      field: 'type',
      sortable: false,
    },{
      name: 'qualification',
      required: true,
      label: t('client.teleAppoint.date') ,
      field: 'qualification',
      align: 'left',
    },{
      name: 'age',
      required: true,
      label: t('client.teleAppoint.teleAppointmentResult') ,
      field: 'age',
      align: 'left',
    },{
      name: 'work',
      label: t('client.backOrder.workingDays') ,
      field: 'work',
      align: 'left',
    },{
      name: 'content',
      label: t('client.backOrder.businessContent') ,
      field: 'content',
      align: 'left',
    },{
      name: 'dateRegistration',
      label: t('client.backOrder.dateOfRegistration') ,
      field: 'created_at',
      align: 'left',
    },{
      name: 'customerRepresentative',
      label: t('client.backOrder.customerReprisentative'),
      field: 'customerRepresentative',
      align: 'left'
    },{
      name: 'workingTime',
      label: t('client.backOrder.workingHoursEarly'),
      field: 'workingTime',
      align: 'left'
    }
  ];
});
