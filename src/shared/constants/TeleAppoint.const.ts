import { JobResult, TeleAppointmentHistory, TeleAppointmentResult } from 'src/shared/model/TeleAppoint.model';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'
const { t } = i18n.global
// Delete after connecting to firebase
export const teleAppointmentData: TeleAppointmentHistory[] =[
  {
    id: '1',
    name: '高橋瞳',
    branch: '東京支店',
    date: '2022/10/18 13:30',
    result: TeleAppointmentResult.NotConnected,
    jobResult: JobResult.NoJobOffer,
    remark: '他業者を利用中'
  },
  {
    id: '2',
    name: '高橋瞳',
    branch: '東京支店',
    date: '2022/10/18 13:30',
    result: TeleAppointmentResult.Connected,
  },
]
export const TeleColumns = computed(() => {
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
       label: '',
       field: 'action',
       name: 'action',
       align: 'left',
      },
]
});

