import { collection, doc, Firestore, getDoc, getDocs } from 'firebase/firestore';
import { LocalStorage } from 'quasar';
import { Role, UserPermissionNames } from '../model/Accaunt.model';

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

export const getAllUsers = (db: Firestore) => {
  return getDocs(collection(db, 'users'))
}

export const getBranches = (db: Firestore) => {
  return getDocs(collection(db, 'branch'))
}
