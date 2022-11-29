import { dataObject } from '../utils/utils';

export interface Branch {
  id: string;
  name: string;
  prefectures: string;
  phone?: string;
  flug: string;
  hidden: boolean;
  created_at: dataObject;
  updated_at?: dataObject;
  deletedAt?: Date;
}

export enum branchFlags {
  All = 'all',
  Valid = 'valid'
}
