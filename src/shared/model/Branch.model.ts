import { dataObject } from '../utils/utils';

export interface Branch {
  id: string;
  name: string;
  prefecture: string;
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

export enum branchEnablityFilter {
  All = 'all',
  Enabled = 'enabled',
  Disabled = 'disabled'
}

export interface BranchesSearch {
  queryText?: string;
  enablity?: branchEnablityFilter;
}
