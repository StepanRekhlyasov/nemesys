export interface Accaunt {
  id: string;
  email: string;
  person_name: string;
  branch_id?: string;
  manager: boolean;
  hidden: boolean;
  create_at: string;
  last_update: string;
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
  OrganizationUpdate = 'ORGANIZATION_UPDATE'
}
