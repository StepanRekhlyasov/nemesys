<template>
  <PageHeader>
    {{ t('menu.admin.licenseManagement.totalLicenseNumber') }}
  </PageHeader>
  <div class="q-pt-sm q-px-lg row items-center">
    {{ t('menu.admin.licenseManagement.issueDate') }}
    <YearMonthPicker :model-value="selectedDate" isAdmin class="q-ml-sm" :clearable="false" @pickerHide="onDateChange"
      :max-year-month="currentDate.replace('-', '/')" :disable="loading" />
  </div>
  <div class="container">
    <OrganizationColspanTabel :columns="columns" :loading="loading" :table="data">
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
</template>

<script setup lang="ts">
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { columns } from '../consts/LicenseStatisticColumns'
import { date, useQuasar } from 'quasar'
import { Table } from 'src/pages/admin/EnterpriseManagement/types/index'
import { useOrganization } from 'src/stores/organization';
import OrganizationColspanTabel from 'src/components/organization/OrganizationColspanTabel.vue';
import { toTable } from 'src/components/organization/handlers/ToTable'
import { Branch } from 'src/shared/model';
import { useLicense } from 'src/stores/license';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBranch } from 'src/stores/branch';
import { useBusiness } from 'src/stores/business';

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' });
const currentDate = date.formatDate(Date.now(), 'YYYY-MM')
const selectedDate = ref(currentDate)
const data = ref<Table[]>([])
const loading = ref(true)
const organization = useOrganization()
const licenceStore = useLicense()
const branchStore = useBranch()
const business = useBusiness()

async function loadDataInMonth(selectedYear: number, selectedMonth: number) {
  data.value = []

  const organizationIds = await organization.getAllOrganizationsIds()
  const tableData = await Promise.all(organizationIds.map(async (id) => {
    return licenceStore.getLicensesInMonth({
      organizationId: id,
      selectedMonth,
      selectedYear,
    })
  }))
  tableData.forEach((d) => {
    if (d) {
      data.value.push(d)
    }
  })

}


function calculateBillingId(organizationCode: string) {
  const [year, month] = selectedDate.value.split('-')
  return month + year + organizationCode
}

onMounted(async () => {
  loading.value = true;
  try {
    await loadCurrentData()
    Alert.success($q, t);
  } catch (error) {
    Alert.warning($q, t);
  }
  loading.value = false
})

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

    data.value.push(toTable(businesses, branches, organizations[0], { deleteBusinessWithoutBranch: true }))
  })
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
    Alert.success($q, t);
  } catch (error) {
    Alert.warning($q, t);
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
