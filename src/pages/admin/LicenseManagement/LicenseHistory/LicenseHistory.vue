<template>
  <PageHeader>
    {{ t('menu.admin.licenseManagement.licenseHistory') }}
  </PageHeader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :on-click-search="async () => { await searchLicense() }" :on-click-clear="async () => {
        search = ''
        await paginationRef?.refreshPage()
      }" v-model:model-value="search" />
  </q-card>

  <q-table :columns="columns" flat hide-pagination :rows-per-page-options="[0]" :loading="loading" :rows="rows">
    <template v-slot:loading>
      <q-inner-loading showing color="accent" />
    </template>
    <template v-slot:header-cell-organizationCodeAndName="props">
      <q-th :props="props" class="no-breaks items-center row">
        {{ props.col.label }}
      </q-th>
    </template>
    <template v-slot:header-cell-requestType="props">
      <q-th :props="props" class="no-breaks items-center row">
        {{ props.col.label }}
      </q-th>
    </template>
  </q-table>
  <TablePagination ref="paginationRef" :pagination="pagination" :isAdmin="true" @on-data-update="async (newData) => {
      rows = await getRows(newData as LicenseHistory[])
    }" />
</template>

<script setup lang="ts">
import { orderBy } from '@firebase/firestore';
import PageHeader from 'src/components/PageHeader.vue';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import SearchField from 'src/components/SearchField.vue';
import { toDate } from 'src/shared/utils/utils';
import { useLicense } from 'src/stores/license';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { columns } from '../consts/LicenseHistoryColumns'
import { getOrganizationChildren, geUsersForLicense } from '../handlers/LicenseHandlers';
import { LicenseHistory } from '../types/LicenseHistory';
const { t } = useI18n({ useScope: 'global' });
const search = ref('')
const rows = ref<Awaited<ReturnType<typeof getRows>>>([])
const loading = ref(true)
const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null)

const pagination = ref({
  rowsPerPage: 100,
  path: 'licenseHistory',
  order: orderBy('requestDate', 'asc')
});
const licenceStore = useLicense()


async function getRows(licenseHistory: LicenseHistory[]) {

  if (!licenseHistory.length) {
    loading.value = false
    return []
  }
  loading.value = true

  const query = await Promise.all([getOrganizationChildren(licenseHistory), geUsersForLicense(licenseHistory)])
  const { organizationObj, buissnesesObj, branchesObj } = query[0]
  const users = query[1]

  const rows = licenseHistory.map((history, index) => {
    const organization = organizationObj[history.organizationId]
    const branch = branchesObj[history.branchId]
    const buissneses = buissnesesObj[history.businessId]
    return {
      ...history,
      number: index + 1,
      organizationCodeAndName: organization?.code + ' ' + organization?.name,
      branchName: branch?.name,
      businessName: buissneses?.name,
      requestUser: users[history.requestUserId]?.displayName,
      requestDate: toDate(history.requestDate),
      executionTime: toDate(history.executionTime),
      executor: users[history.executor]?.displayName
    }
  })
  loading.value = false
  return rows
}

async function searchLicense() {
  loading.value = true
  const licences = await licenceStore.search(search.value, 'licenseHistory')
  if (!licences) {
    loading.value = false
    rows.value = []
    return
  }
  rows.value = await getRows(licences)
  loading.value = false
}


</script>

<style scoped lang="scss">
@import 'src/css/no-breaks.scss';
</style>
