import { JobResult, TeleAppointmentHistory, TeleAppointmentResult } from 'src/shared/model/TeleAppoint.model';

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
