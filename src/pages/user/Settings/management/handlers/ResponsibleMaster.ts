import { orderBy, where } from 'firebase/firestore'
import { QTableProps } from 'quasar'
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

export const adminRolesIds = ['bNq7hugK8pePZC0i0noC', 'hLbasZSnKrBrICIwZLtu']
const userRole = ['KLQYPMOoYxTBLFURjCTy']

export function filterRoles(roles: Record<string, Role>) {
  for (const roleId in roles) {
    if (!adminRolesIds.includes(roleId)) {
      delete roles[roleId]
    }
  }
}

export function getConstraints(isAdmin: boolean | undefined, currentOrganizationId?: string) {

  if (isAdmin) {
    return [where('deleted', '==', false), where('role', 'in', adminRolesIds), orderBy('displayName')]
  }

  return [where('deleted', '==', false), where('role', 'in', userRole), where('organization_ids', 'array-contains', currentOrganizationId)]
}


