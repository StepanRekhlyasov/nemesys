import { dataObject } from '../utils/utils';

export interface Accaunt {
  id: string;
  email: string;
  displayName: string;
  branch_id?: string;
  manager: boolean;
  role?: string;
  hidden: boolean;
  create_at: dataObject;
  updated_at: dataObject;
}

export interface User{
  id: string;
  name: string;
  addedAt:  Date;
  deleted: boolean;
  role?: string;
  organization_ids: string[];
  branch_ids: string[];
  displayName: string;
}

export interface Role {
  createdAt: Date;
  name: string;
  displayName: string;
  permission: UserPermissionNames[];
  updatedAt?: Date;
}

export enum UserPermissionNames {
  ContentsRead = 'CONTENTS_READ',
  UserUpdate = 'USER_UPDATE',
  BranchUpdate = 'BRANCH_UPDATE',
  OrganizationUpdate = 'ORGANIZATION_UPDATE',
  AdminPageAccess = 'ADMIN_PAGE_ACCESS',
}
