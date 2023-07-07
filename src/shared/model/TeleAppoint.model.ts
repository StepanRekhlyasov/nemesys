export interface TeleAppointmentHistory {
  id: string;
  name?: string;
  branch?: string;
  date?: string;
  result?: TeleAppointmentResult;
  jobResult?: JobResult;
  requiredService?: string;
  remark?: string;
  created_at?: string;
  user?:object
}

export enum TeleAppointmentResult {
  NotConnected = 'notConnected',
  Connected = 'connected'
}

export enum JobResult {
  NoJobOffer = 'noJobOffer',
}

export interface UserTele{
  id?:string,
}
