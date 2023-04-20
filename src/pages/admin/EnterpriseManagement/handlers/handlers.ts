import { getAuth } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { InvoiceRequest, Organization } from 'src/shared/model'
import { cloneToRaw } from 'src/shared/utils/utils'
import { useUserStore } from 'src/stores/user'
import { Availability, AvailabilityApi, Row } from '../types'
import { api } from 'src/boot/axios';
import { i18n } from 'boot/i18n';
import { computed, ComputedRef } from 'vue'

const { t } = i18n.global

const store = useUserStore()

const auth = getAuth();


export async function mapOrganizationsToRow(organizations: Organization[]) {
  return await Promise.all(
    organizations.map(async (organization, index) => {
      const user = await store.getUserById(organization.operatorUser)
      return {
        number: index + 1,
        organizationCodeAndName: organization.code + ' ' + organization.name,
        operatorName: user?.displayName,
        ...organization
      }
    })
  )
}

export function rowToOrganization(row: Row): Organization {
  const organization = cloneToRaw(row)
  delete organization.number
  delete organization.organizationCodeAndName
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


export const invoiceRequestOptions: ComputedRef<({
  label: string;
  value: InvoiceRequest;
})[]> = computed(() => [
  {
    label: t('menu.admin.organizationsTable.electronic'),
    value: 'electronic'
  },
  {
    label: t('menu.admin.organizationsTable.mail'),
    value: 'mail'
  }
])
