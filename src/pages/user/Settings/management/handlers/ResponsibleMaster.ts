import { Firestore } from 'firebase/firestore'
import { QTableProps } from 'quasar'
import { Branch, Role } from 'src/shared/model'
import { useOrganization } from 'src/stores/organization'

export async function getAllBranches(db: Firestore) {
  const organization = useOrganization()
  const branchesArr = await organization.getAllBranches(db)
  const branchesObj: { [id: string]: Branch } = {}

  branchesArr.forEach((branch) => {
    branchesObj[branch.id] = branch
  })

  return branchesObj
}

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

export function filterRoles(roles: Record<string, Role>) {
  for (const roleId in roles) {
    if (!adminRolesIds.includes(roleId)) {
      delete roles[roleId]
    }
  }
}
