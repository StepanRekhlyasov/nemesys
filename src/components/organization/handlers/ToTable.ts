import { Buisneses, Table } from 'src/pages/admin/EnterpriseManagement/types'
import { Branch, Business, Organization } from 'src/shared/model'

export function toTable(businesses: { [id: string]: Business }, branches: { [businessId: string]: Branch[] }, organization: Organization) {

  let businessesAndbranches: Buisneses[] = []
  const organizationKey = 'organization'

  const parsedData = {}

  parsedData[organizationKey] = [{}]

  parsedData[organizationKey][0] = organization

  for (const key in businesses) {

    const objToPush = JSON.parse(JSON.stringify(businesses[key]))

    objToPush.branches = branches[key]

    if (!objToPush.branches) {
      objToPush.branches = [{}]
    }

    businessesAndbranches.push(objToPush)
  }

  businessesAndbranches = businessesAndbranches.filter((bb) => {
 
    if(bb.branches && bb.branches.length){
      return Object.values(bb.branches[0]).length != 0
    }
    return false
  })

  let totalBranches = 0
  businessesAndbranches.forEach((bb) => {
    totalBranches += bb.branches.length
  })

  parsedData[organizationKey][0]['totalBranches'] = totalBranches
  parsedData[organizationKey][0]['buisneses'] = businessesAndbranches

  return parsedData as Table
}
