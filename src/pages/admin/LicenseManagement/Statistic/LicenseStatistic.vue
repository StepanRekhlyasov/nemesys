<template>
  <q-card class="bg-white no-shadow no-border-radius">
    <PageHeader>
      {{ t('menu.admin.licenseManagement.totalLicenseNumber') }}
    </PageHeader>
    <div class="q-pt-sm q-px-lg row items-center">
      {{ t('menu.admin.licenseManagement.statisticMonth') }}
      <YearMonthPicker :model-value="selectedDate" isAdmin class="q-ml-sm" :clearable="false" @pickerHide="onDateChange"
        :max-year-month="currentDate.replace('-', '/')" :disable="loading" />
    </div>

    <q-card flat class="q-pt-sm q-px-lg">
      <SearchField :on-click-search="searchLicense" :on-click-clear="() => { search = ''; data = copyData }"
        v-model:model-value="search">
      </SearchField>
    </q-card>

    <div class="container">
      <OrganizationColspanTabel :columns="columns" :loading="loading" :table="data" :sort-method="sort">
        <template #organization="{ organizationItem }">
          <div>
            {{ calculateBillingId(organizationItem.code) }}
          </div>
          <div>
            {{ organizationItem.name }}
          </div>
        </template>
        <template #after="props">
          <q-td>
            {{ 'nemesys' }}
          </q-td>
          <q-td>
            {{ props.branchItem.licensesSlots }}
          </q-td>
        </template>
      </OrganizationColspanTabel>
    </div>

  </q-card>
</template>

<script setup lang="ts">
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { columns } from '../consts/LicenseStatisticColumns'
import { date } from 'quasar'
import { Table } from 'src/pages/admin/EnterpriseManagement/types/index'
import { useOrganization } from 'src/stores/organization';
import OrganizationColspanTabel from 'src/components/organization/OrganizationColspanTabel.vue';
import { toTable } from 'src/components/organization/handlers/ToTable'
import { Branch } from 'src/shared/model';
import { useLicense } from 'src/stores/license';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBranch } from 'src/stores/branch';
import { useBusiness } from 'src/stores/business';
import SearchField from 'src/components/SearchField.vue';
import { SearchData } from '../types/LicenseStatistic'
import { filterInPlace } from '../handlers/LicenseHandlers';

const { t } = useI18n({ useScope: 'global' });
const currentDate = date.formatDate(Date.now(), 'YYYY-MM')
const selectedDate = ref(currentDate)
const data = ref<Table[]>([])
const copyData = ref<Table[]>([])
const loading = ref(true)
const organization = useOrganization()
const licenceStore = useLicense()
const branchStore = useBranch()
const business = useBusiness()
const search = ref('')
const searchData = ref<SearchData>({})

async function loadDataInMonth(selectedYear: number, selectedMonth: number) {
  data.value = []
  searchData.value = {}
  const organizationIds = await organization.getAllOrganizationsIds()
  try {
    const tableData = await Promise.all(organizationIds.map(async (id) => {

      const { business, branchesInBusiness, organization } = await licenceStore.getLicensesInMonth({
        organizationId: id,
        selectedMonth,
        selectedYear,
      })

      searchData.value[id] = {
        businesses: business,
        branches: branchesInBusiness,
        organization: organization
      }

      return toTable(business, branchesInBusiness, organization)
    }))

    tableData.forEach((d) => {
      if (d) {
        data.value.push(d)
      }
    })
    copyData.value = data.value
  } catch (error) {
    data.value = []
    Alert.warning(error)
    console.log(error)
  }
}


function calculateBillingId(organizationCode: string) {
  const [year, month] = selectedDate.value.split('-')
  return month + year + organizationCode
}

onMounted(async () => {
  loading.value = true;
  try {
    await loadCurrentData()
  } catch (error) {
    Alert.warning(error);
  }
  loading.value = false
})

function searchLicense() {
  data.value = []
  Object.values(searchData.value).forEach((d) => {

    const copy = JSON.parse(JSON.stringify(d)) as typeof d

    let foundBranch = false
    let foundBusiness = false
    let foundOrganization = false

    Object.values(copy.branches).forEach((v) => {
      filterInPlace(v, (v) => {
        const includes = v.name.includes(search.value)
        foundBranch = foundBranch || includes
        return includes
      })

    })

    for (const key in copy.businesses) {
      const business = copy.businesses[key]
      const includes = business.name?.includes(search.value)

      foundBusiness = foundBusiness || includes

      if (!includes) {
        delete copy.businesses[key]
      }
    }

    foundOrganization = foundOrganization || copy.organization.name.includes(search.value)

    if (foundOrganization && foundBranch && foundBusiness) {
      data.value.push(toTable(copy.businesses, copy.branches, copy.organization))
    }

    if (foundOrganization && foundBranch && !foundBusiness) {
      data.value.push(toTable(d.businesses, copy.branches, copy.organization))
    }

    if (foundOrganization && !foundBranch && !foundBusiness) {
      data.value.push(toTable(d.businesses, d.branches, copy.organization))

    }

    if (!foundOrganization && !foundBranch && !foundBusiness) {
      data.value.push(toTable(copy.businesses, copy.branches, copy.organization))

    }

    if (foundOrganization && !foundBranch && foundBusiness) {
      data.value.push(toTable(copy.businesses, d.branches, copy.organization))

    }

    if (!foundOrganization && foundBranch && !foundBusiness) {
      data.value.push(toTable(d.businesses, copy.branches, d.organization))

    }


    if (!foundOrganization && !foundBranch && foundBusiness) {
      data.value.push(toTable(copy.businesses, d.branches, d.organization))
    }


    if (!foundOrganization && foundBranch && foundBusiness) {
      data.value.push(toTable(copy.businesses, d.branches, d.organization))
    }

  })
}

function sort(rows, sortBy: string, descending: boolean) {

  if (sortBy === 'numberIdName') {
    data.value.sort((a, b) => {
      if (descending) {
        return a.organization[0].name.localeCompare(b.organization[0].name)
      }
      return b.organization[0].name.localeCompare(a.organization[0].name)
    })
  }

  if (sortBy === 'businessName') {
    data.value.forEach((v) => {
      return v.organization[0].buisneses.sort((a, b) => {
        if (descending) {
          return a.name.localeCompare(b.name)
        }
        return b.name.localeCompare(a.name)
      })
    })
  }

  if (sortBy === 'branchName') {
    data.value.forEach((v) => {
      return v.organization[0].buisneses.forEach((v) => {
        v.branches.sort((a, b) => {
          if (descending) {
            return a.name.localeCompare(b.name)
          }
          return b.name.localeCompare(a.name)
        })
      })
    })
  }

  return rows
}

async function loadCurrentData() {
  data.value = []
  searchData.value = {}
  const organizationIds = await organization.getAllOrganizationsIds()
  const dataArray = await Promise.all(organizationIds.map(async (id) => {
    return Promise.all([
      business.getBusinesses(id),
      branchStore.getBranchesInOrganization(id),
      organization.getDataById([id], 'Organization')
    ])
  }))

  dataArray.forEach((value) => {
    const [businesses, br, organizations] = value

    const branches: { [businessId: string]: Branch[] } = {}
    for (let id in br) {
      const branch = br[id]
      if (!branches[branch.businessId]?.length) {
        branches[branch.businessId] = []
      }
      branches[branch.businessId].push(branch)
    }
    searchData.value[organizations[0].id] = {
      businesses,
      branches,
      organization: organizations[0]
    }
    data.value.push(toTable(businesses, branches, organizations[0]))
  })
  copyData.value = data.value
}

async function onDateChange(date: string) {
  loading.value = true
  selectedDate.value = date
  try {
    if (date == currentDate) {
      await loadCurrentData()
    } else {
      const [yearString, monthString] = selectedDate.value.split('-')
      const year = parseInt(yearString)
      const month = parseInt(monthString)
      await loadDataInMonth(year, month)
    }
    ;
  } catch (error) {
    Alert.warning(error);
  }

  loading.value = false
}

</script>

<style scoped lang="scss">
td {
  border: 1px solid black;
}

.container {
  margin: 20px 90px 0px 90px;
}
</style>
