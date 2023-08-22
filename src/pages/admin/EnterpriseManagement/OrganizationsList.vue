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
  <q-form ref="formRef" @submit.prevent>
    <q-table flat :columns="columns" :loading="loading" :rows="rows" hide-pagination :rows-per-page-options="[0]"
      v-model:pagination="pagination" binary-state-sort>
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
          <EditButton cancelButton color="accent"
            :on-edit="() => { sortable = false; editableRow = cloneToRaw(props.row); }"
            :on-save="async () => { return await onRowSave(props) }" :editable-row="editableRowNumber"
            @on-editable-row-change="async (row) => { editableRowNumber = row }" :row-index="props.rowIndex"
            :props="props" @on-exit-editing-mode="{ editableRowNumber = -1; }" />

          <q-td>
            {{ props.row.number }}
          </q-td>

          <q-td>
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ props.row.organizationCodeAndName.split(' ')?.[0] }} <br />
              {{ props.row.organizationCodeAndName.split(' ')?.[1] }}
            </template>
            <q-input v-else v-model:model-value="editableRow!.name" color="accent" :rules="[creationRule]"
              hide-bottom-space dense />
          </q-td>

          <q-td>
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ props.row.operatorName || props.row.operatorUser || t('common.userNotFound') }}
            </template>
            <q-input v-else v-model="editableRow!.operatorUser" dense color="accent" :rules="[creationRule]"
              :disable="loading" hide-bottom-space />
          </q-td>

          <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.tel"
            @update:model-value="(v) => editableRow!.tel = v" type="tel" hide-bottom-space dense
            :rules="[creationRule]" />

          <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.fax"
            @update:model-value="(v) => editableRow!.fax = v" type="tel" hide-bottom-space dense
            :rules="[creationRule]" />


          <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.mailaddress" dense
            @update:model-value="(v) => { editableRow!.mailaddress = v; }" :rules="[validateEmail]" hide-bottom-space />

          <q-td>
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ t('menu.admin.organizationsTable.' + props.row.invoiceRequest) }}
            </template>
            <q-select v-else v-model:model-value="editableRow!.invoiceRequest" :options="invoiceRequestOptions"
              color="accent" emit-value map-options dense />
          </q-td>

          <q-td>
            <DefaultButton size="sm" label-key="menu.admin.organizationsTable.addBusiness" clear
              @click="{ closeDialog = false; organization = props.row; dialogType = 'Business' }" />
            <DefaultButton size="sm" label-key="menu.admin.organizationsTable.addBranch" clear
              @click="{ closeDialog = false; organization = props.row; dialogType = 'Branch' }" />
          </q-td>

          <q-td auto-width>
            <q-btn unelevated dense @click="props.expand = !props.expand" size="1px">
              <q-icon v-if="props.expand" name="mdi-menu-up" size="xl" color="accent" />
              <q-icon v-else name="mdi-menu-down" size="xl" color="accent" />
            </q-btn>
          </q-td>
        </q-tr>

        <q-tr v-if="props.expand" :props="props">
          <ExpandedTable :props="props" v-if="renderComponent" />
        </q-tr>
      </template>
    </q-table>
  </q-form>
  <div class="row justify-start q-mt-md pagination q-ml-sm">
    <TablePaginationSimple :pagination="pagination" :is-admin="true"
      :max="(rows.length / pagination.rowsPerPage) >= 1 ? Math.ceil(rows.length / pagination.rowsPerPage) : 1"
      @on-data-update="async (page) => {
        pagination.page = page
      }" />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';
import { QForm, QInput } from 'quasar';
import { useI18n } from 'vue-i18n';
import EditButton from 'src/components/EditButton.vue';
import PageHader from 'src/components/PageHeader.vue'
import SearchField from 'src/components/SearchField.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import InputCell from './InputCell.vue';
import { cloneToRaw, deepEqualClone } from 'src/shared/utils/utils'
import { invoiceRequestOptions, mapOrganizationsToRow } from './handlers/handlers';
import { DialogType, Row } from './types'
import { rowToOrganization } from './handlers/handlers'
import ExpandedTable from './ExpandedTable.vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import AddDialog from './AddDialog.vue';
import { useOrganization } from 'src/stores/organization';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';
import { Organization } from 'src/shared/model';
import { columns, sortable } from './consts/OrganizationsListColumns'
import { validateEmail } from 'src/shared/constants/Form.const';
import { creationRule } from 'src/components/handlers/rules';

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

const closeDialog = ref(true)

const organization = ref<Row>()

const dialogType = ref<DialogType>('Business')

const editableRowNumber = ref(-1);

const search = ref('')

const { t } = useI18n({ useScope: 'global' });
const loading = ref(true)

const organizationStore = useOrganization()

const editableRow = ref<Row>()
const rows = ref<Organization[]>([])
const copyRows = ref<Organization[]>([])

const isEqual = ref(false)

const renderComponent = ref(true);

onMounted(async () => {
  loadOrganizations()
})

const forceReRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const formRef = ref<QForm | null>(null)

async function onRowSave(props: { row: Row, rowIndex: number }) {
  const valid = await formRef.value?.validate()

  if (!valid) {
    return false
  }
  isEqual.value = deepEqualClone(editableRow.value, props.row)
  if (!isEqual.value) {
    await editOrganization(editableRow.value, props.rowIndex)
  }
  sortable.value = true
}

async function searchOrganizations(name: string) {
  loading.value = true
  name=name
  if (!name) {
    loading.value = false
    return
  }
  const organizations = [...copyRows.value].filter(function (el) {
    const orgName= el['name']
    const code= el['code']
    return orgName.includes(name) || code.includes(name)
  });

  rows.value = await mapOrganizationsToRow(organizations)
  loading.value = false
}

async function refresh() {
  search.value = ''
  loadOrganizations()

}

async function loadOrganizations() {
  loading.value = true;
  const organizations = await organizationStore.getAllOrganizations();
  copyRows.value = organizations;
  rows.value = await mapOrganizationsToRow(organizations)
  loading.value = false;
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
  rows.value[rowIndex]['organizationCodeAndName'] = row.code + ' ' + row.name

  try {
    const organization = rowToOrganization(row)
    await organizationStore.editOrganization(organization, row.id)
    await refresh()
    loading.value = false;

  } catch (error) {
    Alert.warning(error);
    console.log(error)
    loading.value = false;
  }

}

</script>

<style lang="scss" scoped>
@import 'src/css/no-breaks.scss';
</style>
