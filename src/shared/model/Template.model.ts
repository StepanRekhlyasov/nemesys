import { dataObject } from '../utils/utils';

export enum TemplateType {
  Mail = 'mail',
  Sms = 'sms'
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  contents: string;
  created_at: dataObject;
  updated_at?: dataObject;
}
