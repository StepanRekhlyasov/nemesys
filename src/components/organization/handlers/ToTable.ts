import { Buisneses, Table } from 'src/pages/admin/EnterpriseManagement/types'
import { Branch, Business, Organization } from 'src/shared/model'

interface ToTableOptions {
  deleteBusinessWithoutBranch?: boolean
}

export function toTable(businesses: { [id: string]: Business }, branches: { [businessId: string]: Branch[] }, organization: Organization, options?: ToTableOptions) {

  let businessesAndbranches: Buisneses[] = []
  const organizationKey = 'organization'

  const parsedData = {}

  parsedData[organizationKey] = [{}]
  let totalBranches = Object.values(branches).reduce((prev, curr) => {
    return prev += curr.length
  }, 0)

  parsedData[organizationKey][0] = organization

  for (const key in businesses) {

    const objToPush = JSON.parse(JSON.stringify(businesses[key]))

    objToPush.branches = branches[key]

    if (!objToPush.branches) {
      objToPush.branches = [{}]
      totalBranches++
    }

    businessesAndbranches.push(objToPush)
  }

  if (options?.deleteBusinessWithoutBranch) {
    businessesAndbranches = businessesAndbranches.filter((bb) => {
      const filter = Object.values(bb.branches[0]).length != 0
      if (!filter) {
        totalBranches--
      }
      return filter
    })
  }

  parsedData[organizationKey][0]['totalBranches'] = totalBranches
  parsedData[organizationKey][0]['buisneses'] = businessesAndbranches

  return parsedData as Table
}
