import { collection, doc, endAt, Firestore, getDoc, getDocs, orderBy, query, startAt, where } from 'firebase/firestore';
import { LocalStorage } from 'quasar';
import { selectOptions } from '../model';
import { Role, UserPermissionNames } from '../model/Account.model';
import { branchFlags } from '../model/Branch.model';
import { itemFlags } from '../model/system';
import { ConstraintsType, itemCollection } from './utils';

export interface BranchesSearch {
  queryText?: string;
  flag?: branchFlags;
}

export interface ItemsSearch {
  queryText?: string;
  flag?: itemFlags;
}

export const isPermission = (permissions: UserPermissionNames[], permission: UserPermissionNames) => permissions?.includes(permission);

export const getUserPermissions = (): UserPermissionNames[] => {
  const role: Role | null = LocalStorage.getItem('role')
  if (role) {
    return role.permission
  }
  return [];
};

export const getRole = (db: Firestore, roleid: string) => {
  return getDoc(doc(db, 'roles/' + roleid))
}

export const getUserOrganization = (db: Firestore, organizationId: string) => {
  return getDoc(doc(db, 'organization/' + organizationId))
}

export const getUserOrganizationList = (db: Firestore, organizationIds: string[]) => {
  return organizationIds.map(id => getUserOrganization(db, id))
}

export const getRoles = async (db: Firestore) => {
  const roles = await getDocs(collection(db, 'roles'))
  return roles.docs.map((doc) => {
    return doc.data() as Role
  })
}

export const mapToSelectOptions = (values: Record<string, { name: string, displayName?: string }>) => {
  const list: selectOptions[] = []
  Object.keys(values).map(key => {
    const displayName = values[key]?.displayName
    const data = {
      label: (displayName ? displayName : values[key]?.name) || '',
      value: key
    }
    list.push(data)
  })
  return list
}

export const getUsersByPermission = async (db: Firestore, permission: UserPermissionNames, queryText?: string, active_organization_id?: string,) => {

  const roles = await getRoles(db)
  const roleIds: string[] = [];

  roles.forEach((role) => {
    if (role.permission?.includes(permission)) {
      roleIds.push(role.id);
    }
  })

  if (!roleIds.length) {
    return;
  }

  const constraints: ConstraintsType = [where('deleted', '==', false), where('role', 'in', roleIds), orderBy('displayName')]

  if (active_organization_id) {
    constraints.push(where('organization_ids', 'array-contains', active_organization_id))
  }

  if (queryText) {
    constraints.push(startAt(queryText), endAt(queryText + '\uf8ff'),)
  }

  return getDocs(query(
    collection(db, 'users'),
    ...constraints,
  ))

}

export const getItem = (db: Firestore, active_organization_id: string, search?: ItemsSearch) => {
  return getDocs(query(
    itemCollection(db, active_organization_id),
    where('deleted', '==', false),
    orderBy('name'),
    search?.flag !== itemFlags.All && search?.flag ? where('flag', 'array-contains', search.flag) : where('flag', 'in', ['valid', '']),
    startAt(search?.queryText || ''),
    endAt(search?.queryText + '\uf8ff')
  ))
}

