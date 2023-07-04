import { useOrganization } from 'src/stores/organization'
import { useUserStore } from 'src/stores/user'
import { LicenseHistory } from '../types/LicenseHistory'
import { LicenseRequest } from '../types/LicenseRequest'


export async function getOrganizationChildren(requests: LicenseRequest[]) {
  const organizationStore = useOrganization()

  const ids = requests.reduce((prev, curr) => {

    prev.branchesIds.add(curr.branchId)

    prev.organizationsIds.add(curr.organizationId)

    prev.buissnesesIds.add(curr.businessId)

    return prev
  }, { branchesIds: new Set<string>(), organizationsIds: new Set<string>(), buissnesesIds: new Set<string>() })

  const [organizations, buissneses, branches] = await Promise.all([
    organizationStore.getDataById(Array.from(ids.organizationsIds), 'Organization'),
    organizationStore.getDataById(Array.from(ids.buissnesesIds), 'Buissnes'),
    organizationStore.getDataById(Array.from(ids.branchesIds), 'Branch'),
  ])
  const organizationObj = mapToObject(organizations)
  const buissnesesObj = mapToObject(buissneses)
  const branchesObj = mapToObject(branches)
  return { organizationObj, buissnesesObj, branchesObj }
}


function mapToObject<T>(arr: Array<T & { id: string } | undefined>) {
  const obj: { [id: string]: T | undefined } = {}

  arr.reduce((prev, user) => {
    prev[user?.id ?? ''] = user
    return prev
  }, obj)

  return obj
}


export async function geUsersForLicense(requests: (LicenseHistory | LicenseRequest)[]) {
  const userStore = useUserStore()
  const usersIds = new Set<string>()
  requests.forEach((license) => {
    usersIds.add(license.requestUserId)
    if ('executor' in license) {
      usersIds.add(license.executor)
    }
    return license
  })


  const users = await Promise.all(Array.from(usersIds).map(async (id) => {
    return await userStore.getUserById(id)
  }))

  return mapToObject(users)
}


