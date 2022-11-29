import { dataObject } from '../utils/utils';

export interface Branch {
  id: string;
  name: string;
  prefectures: string;
  phone?: string;
  flug: string;
  hidden: boolean;
  create_at: dataObject;
  updateAt?: dataObject;
  deletedAt?: Date;
}

export enum branchFlags {
  All = 'all',
  Valid = 'valid'
}
