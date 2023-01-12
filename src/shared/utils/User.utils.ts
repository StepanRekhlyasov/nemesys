import { collection, doc, endAt, Firestore, getDoc, getDocs, orderBy, query, startAt, where } from 'firebase/firestore';
import { LocalStorage } from 'quasar';
import { Role, UserPermissionNames } from '../model/Accaunt.model';
import { branchFlags } from '../model/Branch.model';
import { itemFlags } from '../model/system';
import { branchCollection, itemCollection } from './utils';

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
  return getDoc(doc(db, 'roles/'+roleid))
}

export const getUserOrganization = (db: Firestore, organizationId: string) => {
  return getDoc(doc(db, 'organization/'+organizationId))
}

export const getUserOrganizationList = (db: Firestore, organizationIds: string[]) => {
  return organizationIds.map(id => getUserOrganization(db, id) )
}

export const getRoles = (db: Firestore) => {
  return getDocs(collection(db, 'roles' ))
}

export const getAllUsers = (db: Firestore, active_organization_id: string, queryText?: string) => {
  return getDocs(query(
    collection(db, 'users'),
    where('deleted','==', false),
    where('organization_ids', 'array-contains', active_organization_id),
    orderBy('displayName'),
    startAt(queryText || ''),
    endAt(queryText+'\uf8ff'),
  ))
}

export const getBranches = (db: Firestore, active_organization_id: string, search?: BranchesSearch) => {
  return getDocs(query(
    branchCollection(db, active_organization_id),
    where('deleted','==', false),
    orderBy('name'),
    search?.flag !== branchFlags.All && search?.flag ? where('flag', 'array-contains', search.flag): where('flag', 'in', ['valid', '']),
    startAt(search?.queryText || ''),
    endAt(search?.queryText+'\uf8ff')
  ))
}

export const getItem = (db: Firestore, active_organization_id: string, search?: ItemsSearch) => {
  return getDocs(query(
    itemCollection(db, active_organization_id),
    where('deleted','==', false),
    orderBy('name'),
    search?.flag !== itemFlags.All && search?.flag ? where('flag', 'array-contains', search.flag): where('flag', 'in', ['valid', '']),
    startAt(search?.queryText || ''),
    endAt(search?.queryText+'\uf8ff')
  ))
}

