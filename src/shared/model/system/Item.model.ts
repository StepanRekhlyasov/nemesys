import { dataObject } from '../../utils/utils';

export interface Item {
  id: string;
  name: string;
  itemName: string;
  displayOrder: string;
  flug: string;
  hidden: boolean;
  created_at: dataObject;
  updated_at?: dataObject;
  deletedAt?: Date;
}

export enum itemFlags {
  All = 'all',
  Valid = 'valid'
}
