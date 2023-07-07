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
}

export interface options {
  year?: string;
  month?: string;
  day?: string;
}

export enum TeleAppointmentResult {
  NotConnected = 'notConnected',
  Connected = 'connected'
}

export enum JobResult {
  NoJobOffer = 'noJobOffer',
}
export interface UserTele {
  id?: string;
  name: string;
}
export interface UserTele{
  id?:string,
}
