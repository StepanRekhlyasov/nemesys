import { orderBy, where } from 'firebase/firestore'
import { QTableProps } from 'quasar'
import { adminRolesIds } from 'src/components/handlers/consts'
import { Role } from 'src/shared/model'

export function getVisibleColumns(columns: QTableProps['columns'], isAdmin: boolean | undefined) {
  return columns?.reduce((prev, curr) => {
    if (curr.name === 'branch' && isAdmin) {
      return prev
    }
    prev.push(curr.name)
    return prev
  }, [] as string[])
}

const organizationMembersRoles = ['KLQYPMOoYxTBLFURjCTy', '47SZpyVibCXyPf5gkazr']

export function filterRoles(roles: Record<string, Role>, isAdmin: boolean | undefined) {
  for (const roleId in roles) {
    if (!adminRolesIds.includes(roleId) && isAdmin) {
      delete roles[roleId]
    }
    if (!organizationMembersRoles.includes(roleId) && !isAdmin) {
      delete roles[roleId]
    }
  }
}

export function getConstraints(isAdmin: boolean | undefined, currentOrganizationId?: string) {

  if (isAdmin) {
    return [where('deleted', '==', false), where('role', 'in', adminRolesIds), orderBy('displayName')]
  }

  return [where('deleted', '==', false), where('role', 'in', organizationMembersRoles), where('organization_ids', 'array-contains', currentOrganizationId)]
}


