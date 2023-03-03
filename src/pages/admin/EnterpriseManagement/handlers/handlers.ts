import { Organization } from 'src/shared/model'
import { cloneToRaw } from 'src/shared/utils/utils'
import { useUserStore } from 'src/stores/user'
import { Row } from '../types/types'

const store = useUserStore()

export async function mapOrganizationsToRow(organizations: Organization[]) {
  return await Promise.all(
    organizations.map(async (organization, index) => {
      const user = await store.getUserById(organization.operatorUser)
      return {
        number: index + 1,
        organizationIdAndName: organization.id + ' ' + organization.name,
        operatorName: user?.displayName,
        ...organization
      }
    })
  )
}

export function rowToOrganization(row: Row): Organization {
  const organization = cloneToRaw(row)
  delete organization.number
  delete organization.organizationIdAndName
  delete organization.operatorName
  return organization
}
