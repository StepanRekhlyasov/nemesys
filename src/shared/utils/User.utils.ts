import { collection, doc, DocumentData, endAt, Firestore, getDoc, getDocs, getFirestore, orderBy, query, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryOrderByConstraint, QuerySnapshot, QueryStartAtConstraint, startAt, where } from 'firebase/firestore';
import { LocalStorage } from 'quasar';
import { selectOptions } from '../model';
import { Role, User, UserPermissionNames } from '../model/Account.model';
import { Branch, branchFlags } from '../model/Branch.model';
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
  return getDoc(doc(db, 'roles/' + roleid))
}

export const getUserOrganization = (db: Firestore, organizationId: string) => {
  return getDoc(doc(db, 'organization/' + organizationId))
}

export const getUserOrganizationList = (db: Firestore, organizationIds: string[]) => {
  return organizationIds.map(id => getUserOrganization(db, id))
}

export const getRoles = (db: Firestore) => {
  return getDocs(collection(db, 'roles'))
}

export const getAllUsers = async (db: Firestore, active_organization_id: string, queryText?: string) => {
  const usersData = await getDocs(query(
    collection(db, 'users'),
    where('deleted', '==', false),
    where('organization_ids', 'array-contains', active_organization_id),
    orderBy('displayName'),
    startAt(queryText || ''),
    endAt(queryText + '\uf8ff'),
  ))

  const users: User[] = []

  usersData.forEach((user) => {
    if (user.exists()) {
      users.push(user.data() as User)
    }
  })

  return users
}
export const mapToSelectOptions = (values: Record<string, { name: string }>) => {
  const list: selectOptions[] = []
  Object.keys(values).map(key => {
    const data = {
      label: values[key]?.name || '',
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
    if (role.exists()) {
      const roleData = role.data() as Role
      if (roleData.permission?.includes(permission)) {
        roleIds.push(role.id);
      }
    }
  })

  if (!roleIds.length) {
    return;
  }

  type ConstraintsType = Array<QueryStartAtConstraint | QueryFieldFilterConstraint | QueryEndAtConstraint | QueryOrderByConstraint>

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

export const getUserById = async (id: string) => {
  const db = getFirestore();

  const docRef = doc(db, 'users', id)

  const userSnap = await getDoc(docRef)

  if (userSnap.exists()) {
    return userSnap.data() as User
  }
}

export const getAllBranches = async (db: Firestore, search?: BranchesSearch) => {
  const organizationsQuery = query(collection(db, 'organization/'));
  const querySnapshot = await getDocs(organizationsQuery);
  const organizationsIds: string[] = []
  querySnapshot.forEach((doc) => {
    if (doc.exists()) {
      organizationsIds.push(doc.id)
    }
  })
  const branches: Promise<QuerySnapshot<DocumentData>>[] = []
  organizationsIds.forEach((id) => {
    branches.push(getBranches(db, id, search))
  })

  const list: { [id: string]: Branch } = {}

  const branchesData = await Promise.all(branches)
  branchesData.forEach((branch) => {
    branch.forEach((doc) => {
      list[doc.id] = doc.data() as Branch
    })
  })

  return list
}

export const getBranches = (db: Firestore, active_organization_id: string, search?: BranchesSearch) => {
  return getDocs(query(
    branchCollection(db, active_organization_id),
    where('deleted', '==', false),
    orderBy('name'),
    search?.flag !== branchFlags.All && search?.flag ? where('flag', 'array-contains', search.flag) : where('flag', 'in', ['valid', '']),
    startAt(search?.queryText || ''),
    endAt(search?.queryText + '\uf8ff')
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

