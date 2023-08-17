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

    <q-card flat class=" q-px-lg">

      <StatisticSearch @update-search="search" />

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
          <q-td v-if="props.branchItem.working === false" class="emptyCell">
            {{ 'nemesys' }}
          </q-td>
          <q-td v-else>
            {{ 'nemesys' }}
          </q-td>
          <q-td v-if="props.branchItem.working === false" class="emptyCell">
            {{ props.branchItem.licensesSlots }}
          </q-td>
          <q-td v-else>
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
import { Search } from '../types/LicenseStatistic'
import StatisticSearch from './StatisticSearch.vue';
import Fuse from 'fuse.js'


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

async function loadDataInMonth(selectedYear: number, selectedMonth: number) {
  data.value = []
  const organizationIds = await organization.getAllOrganizationsIds()
  try {
    const tableData = await Promise.all(organizationIds.map(async (id) => {

      const { business, branchesInBusiness, organization } = await licenceStore.getLicensesInMonth({
        organizationId: id,
        selectedMonth,
        selectedYear,
      })

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


function getSearchKeys(v: Search) {
  type SearchKey = keyof Omit<Search, 'arroba' | 'nemesys'>

  const searchedKeys: SearchKey[] = []

  for (const [key, item] of Object.entries(v)) {
    if (key == 'arroba' || key == 'nemesys') {
      continue
    }

    if (item) {
      searchedKeys.push(key as SearchKey)
    }
  }
  return searchedKeys
}

function search(searchQuery: Search) {
  data.value = []

  let setDefault = true
  for (let key in searchQuery) {
    const value = searchQuery[key]
    if (key == 'arroba' || key == 'nemesys') {
      if (!value && key == 'nemesys') {
        data.value = []
        return
      }
      continue
    }
    if (value) {
      setDefault = false
    }
  }

  if (setDefault) {
    data.value = copyData.value
    return
  }

  const searchKeys = getSearchKeys(searchQuery)

  if (!searchKeys) {
    return
  }

  const pathDict = {
    'branchName': 'organization.buisneses.branches.name',
    'businessName': 'organization.buisneses.name',
    'orgaName': 'organization.name',
    'code': 'organization.code'
  }
  const keys: string[] = []

  if (searchKeys.length == 1) {
    const key = searchKeys[0]
    keys.push(pathDict[key])
    data.value = configureFuse(copyData.value, keys, searchQuery[key])
    return
  }

  const andArray: Fuse.Expression[] = []
  searchKeys.forEach((key) => {
    const path = pathDict[key]
    keys.push(path)

    andArray.push({
      $path: path,
      $val: searchQuery[key]
    })
  })
  data.value = configureFuse(copyData.value, keys, { $and: andArray })
}

function configureFuse(list: ReadonlyArray<Table>, keys: string[], pattren: string | Fuse.Expression) {

  const options: Fuse.IFuseOptions<Table> = {
    keys,
  }

  const fuse = new Fuse(list, options)
  const searchResult = fuse.search(pattren)
  return searchResult.map((r) => r.item)
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

.emptyCell {
  background: $grey-4;
}
</style>
