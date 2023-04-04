import { dataObject } from '../utils/utils';

export interface User {
  id: string;
  name: string;
  deleted: boolean;
  role: string;
  organization_ids: string[];
  branch_id: string;
  displayName: string;
  email: string;
  enabled: boolean;
  hidden: boolean;
  color: string;
  create_at: dataObject;
  updated_at: dataObject;
  disableTime?: dataObject;
  deletedAt?: dataObject;
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
