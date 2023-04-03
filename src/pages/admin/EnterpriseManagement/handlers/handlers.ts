import { getAuth } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { Organization } from 'src/shared/model'
import { cloneToRaw } from 'src/shared/utils/utils'
import { useUserStore } from 'src/stores/user'
import { Availability, AvailabilityApi, Row } from '../types'
import { api } from 'src/boot/axios';

const store = useUserStore()

const auth = getAuth();


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
  organization.updatedAt = serverTimestamp()
  return organization
}

export async function manageUserAvailability(availability: Availability) {
  const url = 'https://manage-user-availability-planwvepxa-an.a.run.app'
  const headers = {
    'Content-Type': 'application/json'
  };

  const idToken = await auth.currentUser?.getIdToken()
  const userId = auth.currentUser?.uid

  if (!idToken || !userId) {
    return
  }

  const data: AvailabilityApi = {
    ...availability,
    userId,
    idToken
  }

  await api.post(url, data,
    {
      headers: headers,
      timeout: 30000,
    }
  )

}
