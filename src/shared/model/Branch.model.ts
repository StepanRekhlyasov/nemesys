import { dataObject } from '../utils/utils';

export interface Branch {
  id: string;
  name: string;
  prefectures: string;
  phone?: string;
  hidden: boolean;
  created_at: dataObject;
  updated_at?: dataObject;
  deletedAt?: dataObject;
  deleted: boolean;
  created_user: string;
  working: boolean
  businessId: string;
  priceForOneUserInYen: number
  licensesSlots: number
}

export enum branchFlags {
  All = 'all',
  Working = 'working'
}


export interface BranchesSearch {
  queryText?: string;
  flag?: branchFlags;
}
