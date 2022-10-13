import { UserPermissionNames } from '../model/Accaunt.model';

export const isPermission = (permissions: UserPermissionNames[], permission: UserPermissionNames) => permissions?.includes(permission);
