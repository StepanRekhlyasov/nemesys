import { Branch } from './Branch.model';

export interface Accaunt {
  email: string;
  person_name: string;
  branch: Branch;
  manager: boolean;
  hidden: boolean;
  create_at: Date;
  last_update: Date;
}

export interface User{
  id: string;
  name: string;
  addedAt:  Date;
  deleted: boolean;
  role: string;
  displayName: string;
  permissions: UserPermissionNames[];
}

export interface Roles {
  createdAt: Date;
  name: string;
  permissions: UserPermissionNames[];
  updatedAt?: Date;
}

export enum UserPermissionNames {
  ContentsRead = 'CONTENTS_READ',
  UserUpdate = 'USER_UPDATE'
}