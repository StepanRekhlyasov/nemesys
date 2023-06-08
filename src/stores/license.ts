import { getApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { defineStore } from 'pinia';
import { toTable } from 'src/components/organization/handlers/ToTable';
import { Table } from 'src/pages/admin/EnterpriseManagement/types';
import { YearMonthIterator } from 'src/pages/admin/LicenseManagement/handlers/YearMonthIterator';
import { LicensePath, LicenseVariation } from 'src/pages/admin/LicenseManagement/types/LicenseHistory';
import { LicenseRequest } from 'src/pages/admin/LicenseManagement/types/LicenseRequest';
import { LicenseStatistic } from 'src/pages/admin/LicenseManagement/types/LicenseStatistic';
import { Branch } from 'src/shared/model';
import { useOrganization } from './organization';


export const useLicense = defineStore('license', () => {
  const db = getFirestore()
  const organizationStore = useOrganization()

  async function search<T extends LicensePath>(search: string, collectionPath: T) {
    const organizations = await organizationStore.getOrganizationsByName(search)
    const organizationIds = organizations.map((org) => {
      return org.id
    })
    if (!organizationIds.length) {
      return
    }
    const organizationQuery = query(collection(db, collectionPath), where('organizationId', 'in', organizationIds))
    const docs = await getDocs(organizationQuery)
    if (!docs.docs.length) {
      return
    }
    return docs.docs.map((doc) => {
      return doc.data() as LicenseVariation<T>
    })
  }

  async function execute(request: LicenseRequest) {
    const functions = getFunctions(getApp(), 'asia-northeast1')
    const executeLicenseRequest = httpsCallable(functions, 'execute_license_request');
    await executeLicenseRequest(request)
  }

  /**
   * @param selectedYear in 2023 format
   * @param selectedMonth in 1-12 format
   */
  async function getLicensesInMonth({ organizationId, selectedYear, selectedMonth }: { organizationId: string, selectedYear: number, selectedMonth: number }): Promise<Table | undefined> {
    const defaultData = await Promise.all([
      organizationStore.getDataById([organizationId], 'Organization'),
      organizationStore.getBusinesses(db, organizationId),
      organizationStore.getBranchesInOrganization(organizationId),
    ])

    // first [0] - get from defaultData, second [0] get from getDataById (always one element)
    const organization = defaultData[0][0]
    const business = defaultData[1]
    const branches = defaultData[2]
    const branchesArr = Object.values(branches)

    const previousBranchesCount = await Promise.all(branchesArr.map(async (b) => {
      /*
      Possible improvements: in each licenseStatistic document store a reference to the previous one.
      Also, you can query the document immediately, and if it's not there, start searching
      */

      const firstLicenseStatisticDoc = await getDocs(query(collection(db, 'licenseStatistic')
        , where('branchId', '==', b.id)
        , where('businessId', '==', b.businessId)
        , where('organizationId', '==', organizationId)
        , where('isFirstDoc', '==', true)
      ))


      if (firstLicenseStatisticDoc.size > 1) {
        throw ('found multiple first licenseStatistic docs')
      }

      const newBranchCount: { [branchId: string]: number | undefined } = { [b.id]: undefined }

      const firstDoc = firstLicenseStatisticDoc.docs[0].data() as LicenseStatistic

      if (new Date(selectedYear, selectedMonth).getTime() < new Date(firstDoc.year, firstDoc.month).getTime()) {
        return newBranchCount
      }

      const iterator = new YearMonthIterator(selectedYear, selectedMonth)
      let search = true;
      let prevCount: number | undefined = undefined
      //search the previous count in licenseStatistic
      while (search) {

        const { year, month } = iterator.getData()

        const licenseStatisticQuery = query(
          collection(db, 'licenseStatistic')
          , where('month', '==', month)
          , where('year', '==', year)
          , where('branchId', '==', b.id)
          , where('businessId', '==', b.businessId)
          , where('organizationId', '==', organization.id))
        const nextDoc = await getDocs(licenseStatisticQuery)

        if (!nextDoc.empty) {
          search = false
          if (nextDoc.size > 1) {
            throw ('found multiple licenseStatistic docs for one month while search')
          }
          prevCount = nextDoc.docs[0].data().count
        }
        iterator.minusOneMonth()
      }
      if (typeof prevCount === 'undefined') {
        throw ('previous document not found')
      }
      newBranchCount[b.id] = prevCount

      return newBranchCount
    }))

    // update licensesSlots
    for (const key in branches) {
      const branch = branches[key]
      const count = previousBranchesCount.find((val) => {
        return Object.keys(val)[0] == branch.id
      })
      if (!count) {
        continue
      }
      const newSlots = count[key]

      if (typeof newSlots === 'undefined') {
        delete branches[key]
        delete business[branch.businessId]
        continue
      }
      branch.licensesSlots = newSlots
    }


    // map form branches: {[id: string]: Branch;} to { [businessId: string]: Branch[] }
    const branchesInBusiness: { [businessId: string]: Branch[] } = {}
    for (const id in branches) {
      const branch = branches[id]
      if (!branchesInBusiness[branch.businessId]?.length) {
        branchesInBusiness[branch.businessId] = []
      }
      branchesInBusiness[branch.businessId].push(branch)
    }

    return toTable(business, branchesInBusiness, organization, { deleteBusinessWithoutBranch: true })

  }

  return { search, execute, getLicensesInMonth }
})
