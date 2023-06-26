export interface TeleAppointmentHistory {
  id?: string;
  name?: string;
  branch?: string;
  date?: string;
  result?: TeleAppointmentResult;
  jobResult?: JobResult;
  requiredService?: string ;
  remark?: string;
  updated_at?: string;
  created_at?: string;
  created_by?: string;
  value?:any;
}


export enum TeleAppointmentResult {
  NotConnected = 'notConnected',
  Connected = 'connected'
}


export enum JobResult {
  NoJobOffer = 'noJobOffer',
}
export interface UserList {
  id: string;
  name: string;
}
export interface UserTele{
  id:string,
  value?:any
}

