<template>
  <ManageLicenseDialog v-if="dialog" :licenseRequest="licenseRequest" :model-value="dialog" :dialogData="dialogData"
    persistent @onDialogHide="(v) => {
        dialog = v
      }" @refesh="async () => {
      await paginationRef?.refreshPage()
    }" />
  <PageHeader>
    {{ t('menu.admin.licenseManagement.licenseRequest') }}
  </PageHeader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :on-click-search="searchLicense" :on-click-clear="async () => {
        search = ''
        await paginationRef?.refreshPage()
      }" v-model:model-value="search" />
  </q-card>
  <q-table :columns="columns" :rows="rows" flat hide-pagination :rows-per-page-options="[0]" :loading="loading">
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
    <template v-slot:body-cell-requestUser="props">
      <q-td :props="props" >
        {{ props.row.requestUser || t('common.userNotFound')   }}
      </q-td>
    </template>
    <template v-slot:body-cell-addMoreSlots="props">
      <q-td :props="props">
        <DefaultButton
          :label-key="props.row.requestType == 'Addition' ? 'menu.admin.licenseManagement.addSlots' : 'menu.admin.licenseManagement.deleteSlots'"
          :size="'sm'" @click="() => {
              requestType = props.row.requestType
              dialogData.branchName = props.row.branchName
              dialogData.organizationCodeAndName = props.row.organizationCodeAndName
              dialogData.userName = props.row.requestUser
              dialogData.priceForOneUserInYen = props.row.priceForOneUserInYen
              licenseRequest = props.row.licenseRequest
              licenseRequest.status = 'approved'
              dialog = true
            }" />
        <DefaultButton
          :label-key="'common.deny'"
          :size="'sm'" @click="() => {
              requestType = props.row.requestType
              dialogData.branchName = props.row.branchName
              dialogData.organizationCodeAndName = props.row.organizationCodeAndName
              dialogData.userName = props.row.requestUser
              dialogData.priceForOneUserInYen = props.row.priceForOneUserInYen
              licenseRequest = props.row.licenseRequest
              licenseRequest.status = 'denied'
              dialog = true
            }" />
      </q-td>
    </template>
  </q-table>
  <TablePagination ref="paginationRef" :pagination="pagination" :isAdmin="true" @on-data-update="async (newData) => {
      rows = await getRows(newData as LicenseRequest[])
    }" />
</template>

<script setup lang="ts">
import { orderBy } from '@firebase/firestore';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import PageHeader from 'src/components/PageHeader.vue';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import SearchField from 'src/components/SearchField.vue';
import { toDate } from 'src/shared/utils/utils';
import { useLicense } from 'src/stores/license';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { columns } from '../consts/LicenseRequestColumns'
import { LicenseRequest } from '../types/LicenseRequest';
import ManageLicenseDialog from './ManageLicenseDialog.vue';
import { getOrganizationChildren, geUsersForLicense } from '../handlers/LicenseHandlers';

const { t } = useI18n({ useScope: 'global' });
const rows = ref<Awaited<ReturnType<typeof getRows>>>([])
const loading = ref(true)
const licenceStore = useLicense()
const search = ref('')

const dialogData = ref({
  organizationCodeAndName: '',
  branchName: '',
  userName: '',
  priceForOneUserInYen: 0,
})

const licenseRequest = ref({} as LicenseRequest)

const dialog = ref(false)
const requestType = ref<LicenseRequest['requestType']>('Addition')
const pagination = ref({
  rowsPerPage: 100,
  path: 'licenseRequests',
  order: orderBy('requestDate', 'asc')
});

const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null)

async function getRows(requests: LicenseRequest[]) {
  if (!requests.length) {
    loading.value = false
    return []
  }
  loading.value = true

  const query = await Promise.all([getOrganizationChildren(requests), geUsersForLicense(requests)])
  const { organizationObj, buissnesesObj, branchesObj } = query[0]
  const users = query[1]

  const rows = requests.map((req, index) => {
    const organization = organizationObj[req.organizationId]
    const branch = branchesObj[req.branchId]
    const buissneses = buissnesesObj[req.businessId]
    if(typeof req.requestQuantity === 'string'){
      req.requestQuantity = parseInt(req.requestQuantity)
    }
    return {
      ...req,
      number: index + 1,
      organizationCodeAndName: organization?.code + ' ' + organization?.name,
      branchName: branch?.name,
      businessName: buissneses?.name,
      requestUser: users[req.requestUserId]?.displayName,
      requestDate: toDate(req.requestDate),
      priceForOneUserInYen: branch?.priceForOneUserInYen,
      licenseRequest: req,
    }
  })
  loading.value = false
  return rows
}

async function searchLicense() {
  loading.value = true
  const licences = await licenceStore.search(search.value, 'licenseRequests')
  if (!licences) {
    loading.value = false
    rows.value = []
    return
  }
  rows.value = await getRows(licences)
  loading.value = false
}

</script>

<style lang="scss" scoped>
@import 'src/css/no-breaks.scss';

button {
  width: 90px;
}
</style>
