<template>
  <div class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div class="text-h6 q-pr-md text-primary">
          <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md" />
          {{ $t('menu.branches') }}
        </div>
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px" />
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{ $t('common.keyboard') }}</span>
          <q-input v-model="search.queryText" square outlined class="col-6 q-mr-md q-ml-md bg-grey-2 input-md" dense>
            <template v-slot:append>
              <q-icon v-if="search.queryText" name="close" @click=" search.queryText = ''; loadBranchesList();"
                class="cursor-pointer" />
            </template>
          </q-input>
          <div class="row content-center q-pr-md">
            <span class="row content-center q-pr-md">{{ $t('settings.branch.flag') }}</span>
            <q-select v-model="search.enablity" :options="flagOptions" option-value="flag" option-label="label" emit-value
              map-options dense />
          </div>
          <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md" unelevated
            @click="loadBranchesList" />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-table :columns="columns" :rows="branches" row-key="id" :loading="loading" v-model:pagination="pagination"
            hide-pagination class="no-shadow">
            <template v-slot:body-cell-edit="props">
              <q-td :props="props" auto-width>
                <q-btn icon="edit" flat @click="editBranch = props.row; openDialog = true; dialogType = 'Branch'" />
              </q-td>
            </template>
            <template v-slot:body-cell-list="props">
              <q-td :props="props" auto-width>
                <q-btn :label="$t('menu.admin.licenseManagement.showList')" unelevated size="sm" color="primary"
                  text-color="white" @click="() => {
                    showList = true;
                    showListRow = props.row
                  }" />
              </q-td>
            </template>

            <template v-slot:body-cell-hidden="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.hidden" :disable="true" checked-icon="mdi-checkbox-intermediate"
                  unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md" />
              </q-td>
            </template>

            <template v-slot:body-cell-prefecture="props">
              <q-td :props="props">
                <span v-if="props.row.prefecture">{{ $t('prefectures.' +
                  (prefectureLocaleKey[props.row.prefecture] ? prefectureLocaleKey[props.row.prefecture] :
                    props.row.prefecture))
                }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-flag="props">
              <q-td :props="props">
                <span v-if="props.row.flag">{{ $t('settings.branch.flags.' + (props.row.flag)) }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-created_at="props">
              <q-td :props="props">
                {{ props.row.created_at.date }}<br />
                {{ props.row.created_at.time }}
              </q-td>
            </template>

            <template v-slot:body-cell-updated_at="props">
              <q-td :props="props">
                {{ props.row.updated_at.date }}<br />
                {{ props.row.updated_at.time }}
              </q-td>
            </template>
            <template v-slot:body-cell-addLicenseRequestButton="props">
              <q-td :props="props" auto-width>
                <DefaultButton v-if="!props.row.hidden" size="sm" color="primary"
                  :label-key="'menu.admin.licenseManagement.addLicenseRequest'"
                  @click=" dialogType = 'LicenseRequest'; openDialog = true; branch = props.row" />
              </q-td>
            </template>
          </q-table>
          <div class="row justify-start q-mt-md q-mb-md pagination">
            <TablePaginationSimple :pagination="pagination" :is-admin="false"
              :max="(branches.length / pagination.rowsPerPage) >= 1 ? Math.ceil(branches.length / pagination.rowsPerPage) : 1"
              @on-data-update="async (page) => {
                pagination.page = page
              }" />
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </div>
  <q-dialog v-model="openDialog" @hide=" editBranch = undefined">
    <DialogWrapper style="max-width: 450px;">
      <BranchCreateForm v-if="dialogType === 'Branch'" @closeDialog=" loadBranchesList(); openDialog = false;"
        :editBranch="editBranch" color="primary" />
      <AddLicenseRequestForm v-if="dialogType === 'LicenseRequest'" :branch="branch"
        @close-dialog=" openDialog = false;" />
    </DialogWrapper>
  </q-dialog>
  <RequestList v-model="showList" :branch="showListRow" v-if="showListRow" @hide="showListRow = undefined" />
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { Branch, BranchesSearch, branchEnablityFilter } from 'src/shared/model/Branch.model';
import BranchCreateForm from 'src/components/organization/BranchCreate.form.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useOrganization } from 'src/stores/organization';
import { flagOptions } from 'src/components/handlers/flagOptions';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
import { useBranch } from 'src/stores/branch';
import { columns } from './consts/BranchMasterColumns'
import AddLicenseRequestForm from './AddLicenseRequestForm.vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import RequestList from './components/RequestList.vue';
import { prefectureLocaleKey } from 'src/shared/constants/Prefecture.const';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';

const search: Ref<BranchesSearch> = ref({
  queryText: '',
  enablity: branchEnablityFilter.All,
});
const branches: Ref<Branch[]> = ref([])
const loading = ref(false);
const editBranch: Ref<Branch | undefined> = ref(undefined)
const openDialog = ref(false)
const dialogType = ref<'Branch' | 'LicenseRequest'>('Branch')
const branch = ref<Branch>()
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100
});
const showList = ref(false)
const showListRow = ref<Branch>()

const organization = useOrganization()
const branchStore = useBranch()

watch(() => organization.currentOrganizationId, () => {
  loadBranchesList()
})

loadBranchesList()
async function loadBranchesList() {
  loading.value = true;
  editBranch.value = undefined;
  try {
    if (organization.currentOrganizationId) {
      branches.value = Object.values(await branchStore.getBranches(organization.currentOrganizationId, search.value)).reduce((prev, curr) => {
        return prev.concat(curr)
      }, [])
    }
    loading.value = false;
  } catch (e) {
    console.log(e)
    loading.value = false;
    Alert.warning(e);
  }
}

</script>

