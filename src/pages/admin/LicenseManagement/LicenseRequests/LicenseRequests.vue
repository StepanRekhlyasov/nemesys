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
    <SearchField :on-click-search="async () => { await searchLicense() }" :on-click-clear="async () => {
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
import { Branch, Business, Organization } from 'src/shared/model';
import { toDate } from 'src/shared/utils/utils';
import { useOrganization } from 'src/stores/organization';
import { useUserStore } from 'src/stores/user';
import { useLicense } from 'src/stores/license';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { columns } from '../consts/LicenseRequestColumns'
import { LicenseRequest } from '../types/LicenseRequest';
import ManageLicenseDialog from './ManageLicenseDialog.vue';

const { t } = useI18n({ useScope: 'global' });
const rows = ref<Awaited<ReturnType<typeof getRows>>>([])
const loading = ref(true)
const organizationStore = useOrganization()
const userStore = useUserStore()
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
  const ids = requests.reduce((prev, curr) => {
    if (!prev.branchesIds.includes(curr.branchId)) {
      prev.branchesIds.push(curr.branchId)
    }
    if (!prev.organizationsIds.includes(curr.organizationId)) {
      prev.organizationsIds.push(curr.organizationId)
    }

    if (!prev.buissnesesIds.includes(curr.businessId)) {
      prev.buissnesesIds.push(curr.businessId)
    }
    return prev
  }, { branchesIds: [] as string[], organizationsIds: [] as string[], buissnesesIds: [] as string[] })

  const data = await Promise.all([
    organizationStore.getDataById(ids.branchesIds, 'Branch'),
    organizationStore.getDataById(ids.organizationsIds, 'Organization'),
    organizationStore.getDataById(ids.buissnesesIds, 'Buissnes')
  ])
  const branches = data[0]
  const organizations = data[1]
  const buissneses = data[2]

  const rows = await Promise.all(requests.map(async (req, index) => {
    const organization = findDataById(organizations, req.organizationId)
    const branch = findDataById(branches, req.branchId)
    return {
      ...req,
      number: index + 1,
      organizationCodeAndName: organization?.code + ' ' + organization?.name,
      branchName: branch?.name,
      businessName: findDataById(buissneses, req.businessId)?.name,
      requestUser: (await userStore.getUserById(req.requestUserId)).displayName,
      requestDate: toDate(req.requestDate),
      priceForOneUserInYen: branch?.priceForOneUserInYen,
      licenseRequest: req,
    }
  }))
  loading.value = false
  return rows
}

function findDataById<T extends Branch | Organization | Business>(arr: (T)[], wantedId: string) {
  return arr.find((item) => {
    if (item.id == wantedId) {
      return item
    }
  })
}

async function searchLicense() {
  loading.value = true
  const licences = await licenceStore.search(search.value)
  if (!licences) {
    rows.value = []
    return
  }
  rows.value = await getRows(licences)
  loading.value = false
}

</script>

<style lang="scss" scoped>
.no-breaks {
  white-space: pre-line;
  text-align: left;
  min-width: 180px;
}

button {
  width: 90px;
}
</style>
