import { LocalStorage } from 'quasar';
import { selectOptions } from '../model';
import { Role, UserPermissionNames } from '../model/Account.model';

export const isPermission = (permissions: UserPermissionNames[], permission: UserPermissionNames) => permissions?.includes(permission);

export const getUserPermissions = (): UserPermissionNames[] => {
  const role: Role | null = LocalStorage.getItem('role')
  if (role) {
    return role.permission
  }
  return [];
};

export const mapToSelectOptions = (values: Record<string, { name: string, displayName?: string }>) => {
  const list: selectOptions[] = []
  Object.keys(values).map(key => {
    const displayName = values[key]?.displayName
    const data = {
      label: (displayName ? displayName : values[key]?.name) || '',
      value: key,
    }
    list.push(data)
  })
  return list
}
