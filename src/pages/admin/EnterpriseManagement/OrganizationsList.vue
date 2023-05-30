<template>
  <PageHader>
    {{ t('menu.admin.organizationsTable.organizationsSearh') }}
  </PageHader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :on-click-search="async () => { await searchOrganizations(search) }"
      :on-click-clear="() => { refresh() }" v-model:model-value="search">
      <template #rigthButton>
        <DefaultButton label-key="menu.admin.organizationsTable.addOrganization" icon="mdi-plus" @click="() => {
            dialogType = 'Organization'
            closeDialog = false;
          }" />
      </template>
    </SearchField>
  </q-card>


  <AddDialog @update:model-value="(v) => closeDialog = !v" :organization="organization!" :open-dialog="!closeDialog"
    @close-dialog="async (v) => { closeDialog = v; await forceReRender() }" :dialog-type="dialogType"
    @on-organization-added="async () => {
        await refresh();
        await forceReRender()
      }" />

  <q-table flat :columns="columns" :loading="loading" :rows="rows" hide-pagination :rows-per-page-options="[0]">
    <template v-slot:header-cell-organizationCodeAndName="props">
      <q-th :props="props" class="no-breaks items-center row">
        {{ props.col.label }}
      </q-th>
    </template>

    <template v-slot:loading>
      <q-inner-loading showing color="accent" />
    </template>

    <template v-slot:body="props">

      <q-tr :props="props">

        <EditButton color="accent" :on-edit="() => { sortable = false; editableRow = cloneToRaw(props.row); }" :on-save="async () => {
            isEqual = deepEqualClone(editableRow, props.row)
            if (!isEqual) {
              await editOrganization(editableRow, props.rowIndex)
            }
            sortable = true
          }" :editable-row="editableRowNumber" @on-editable-row-change="(row) => editableRowNumber = row"
          :row-index="props.rowIndex" :props="props" />

        <q-td>
          {{ props.row.number }}
        </q-td>

        <q-td>
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.organizationCodeAndName }}
          </template>
          <q-input v-else v-model:model-value="editableRow!.name" color="accent" />
        </q-td>

        <q-td>
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.operatorName }}
          </template>
          <SelectUser v-else :model-value="editableRow!.operatorName"
            @on-user-change="(user) => { editableRow!.operatorUser = user.id; editableRow!.operatorName = user.displayName }" />
        </q-td>

        <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.tel"
          @update:model-value="(v) => editableRow!.tel = v" />

        <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.fax"
          @update:model-value="(v) => editableRow!.fax = v" />

        <q-td>
          {{ props.row.mailaddress }}
        </q-td>

        <q-td>
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ t('menu.admin.organizationsTable.' + props.row.invoiceRequest) }}
          </template>
          <q-select v-else v-model:model-value="editableRow!.invoiceRequest" :options="invoiceRequestOptions"
            color="accent" emit-value map-options />
        </q-td>

        <q-td>
          <DefaultButton size="sm" label-key="menu.admin.organizationsTable.addBusiness" clear
            @click="{ closeDialog=false; organization=props.row; dialogType='Business' }" />
          <DefaultButton size="sm" label-key="menu.admin.organizationsTable.addBranch" clear
            @click="{ closeDialog=false; organization=props.row; dialogType='Branch' }" />
        </q-td>

        <q-td auto-width>
          <q-btn unelevated dense @click="props.expand = !props.expand" size="1px">
            <q-icon v-if="props.expand" name="mdi-menu-down" size="xl" color="accent" />
            <q-icon v-else name="mdi-menu-up" size="xl" color="accent" />
          </q-btn>
        </q-td>
      </q-tr>

      <q-tr v-show="props.expand" :props="props">
        <ExpandedTable :props="props" v-if="renderComponent" />
      </q-tr>

    </template>

  </q-table>

  <div class="row justify-start q-mt-md q-mb-md pagination">
    <TablePagination :isAdmin="true" ref="paginationRef" :pagination="pagination" @on-data-update="async (newData) => {
        rows = await mapOrganizationsToRow(newData as Organization[])
        await forceReRender()
      }" @on-loading-state-change="(v) => loading = v" :disable="!sortable" />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { QInput, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import EditButton from 'src/components/EditButton.vue';
import PageHader from 'src/components/PageHeader.vue'
import SearchField from 'src/components/SearchField.vue';
import { getFirestore, orderBy } from '@firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';
import SelectUser from './SelectUser.vue';
import InputCell from './InputCell.vue';
import { cloneToRaw, deepEqualClone } from 'src/shared/utils/utils'
import { invoiceRequestOptions, mapOrganizationsToRow } from './handlers/handlers';
import { DialogType, Row, Rows } from './types'
import { rowToOrganization } from './handlers/handlers'
import ExpandedTable from './ExpandedTable.vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import AddDialog from './AddDialog.vue';
import { useOrganization } from 'src/stores/organization';
import TablePagination from 'src/components/pagination/TablePagination.vue'
import { Organization } from 'src/shared/model';
import { columns, sortable } from './consts/OrganizationsListColumns'

const pagination = ref({
  rowsPerPage: 100,
  path: 'organization',
  order: orderBy('name', 'asc')
});

const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null)

const closeDialog = ref(true)

const organization = ref<Row>()

const dialogType = ref<DialogType>('Business')

const editableRowNumber = ref(-1);

const db = getFirestore();

const search = ref('')

const $q = useQuasar();

const { t } = useI18n({ useScope: 'global' });
const loading = ref(true)

const organizationStore = useOrganization()

const editableRow = ref<Row>()
const rows = ref<Rows>([])

const isEqual = ref(false)

const renderComponent = ref(true);

const forceReRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};


async function searchOrganizations(name: string) {
  loading.value = true
  const organizations = await organizationStore.getOrganizationsByName(name)
  rows.value = await mapOrganizationsToRow(organizations)
  loading.value = false
}

async function refresh() {
  await paginationRef.value?.refreshPage()
}


function isRowSelected(row: number) {
  return row == editableRowNumber.value
}

async function editOrganization(row: Row | undefined, rowIndex: number) {
  if (!row) {
    return
  }

  loading.value = true;
  rows.value[rowIndex] = row
  rows.value[rowIndex].organizationCodeAndName = row.code + ' ' + row.name

  try {
    const organization = rowToOrganization(row)
    await organizationStore.editOrganization(db, organization, row.id)
    await refresh()
    loading.value = false;
    Alert.success($q, t)
  } catch (error) {
    Alert.warning($q, t);
    loading.value = false;
  }

}

</script>

<style lang="scss" scoped>
@import 'src/css/no-breaks.scss';

</style>
