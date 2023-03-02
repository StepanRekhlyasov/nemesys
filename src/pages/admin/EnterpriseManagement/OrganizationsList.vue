<template>
  <PageHader>
    {{ t('menu.admin.organizationsTable.organizationsSearh') }}
  </PageHader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :on-click-search="async () => { await searchOrganizations(search) }"
      :on-click-clear="() => { requestOrganizations() }" v-model:model-value="search" />
  </q-card>

  <q-table flat :columns="columns" :loading="loading" :rows="rows" hide-pagination>

    <template v-slot:body-cell-edit="props">
      <EditButton :props="props" color="accent" :on-edit="() => { editableRow = cloneToRaw(props.row); }"
        :on-save="async () => { !deepEqualClone(editableRow, props.row) && await editOrganization(editableRow, props.rowIndex) }"
        :editable-row="editableRowNumber" @on-editable-row-change="(row) => editableRowNumber = row" />
    </template>

    <template v-slot:header-cell-organizationIdAndName="props">
      <q-th :props="props" class="no-breaks items-center row">
        {{ props.col.label }}
      </q-th>
    </template>

    <template v-slot:body-cell-organizationIdAndName="props">
      <q-td :props="props">
        <template v-if="!isRowSelected(props.rowIndex)">
          {{ props.row.organizationIdAndName }}
        </template>
        <q-input v-else v-model:model-value="editableRow!.name" color="accent" />
      </q-td>
    </template>

    <template v-slot:body-cell-operatorName="props">
      <q-td :props="props">
        <template v-if="!isRowSelected(props.rowIndex)">
          {{ props.row.operatorName }}
        </template>
        <SelectOrganization v-else :model-value="editableRow!.operatorName" :organization-id="props.row.id"
          @on-user-change="(user) => { editableRow!.operatorUser = user.id; editableRow!.operatorName = user.displayName }" />
      </q-td>
    </template>

    <template v-slot:body-cell-tel="props">
      <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.tel" @update:model-value="(v)=>editableRow!.tel = v"/>
    </template>


    <template v-slot:body-cell-fax="props">
     <InputCell :editing="isRowSelected(props.rowIndex)" :text="props.row.fax" @update:model-value="(v)=>editableRow!.fax = v"/>
    </template>

    <template v-slot:body-cell-invoiceRequest="props">
      <q-td :props="props">
        <template v-if="!isRowSelected(props.rowIndex)">
          {{ props.row.invoiceRequest }}
        </template>
        <q-select v-else v-model:model-value="editableRow!.invoiceRequest" :options="invoiceRequests" color="accent" />
      </q-td>
    </template>

    <template v-slot:loading>
      <q-inner-loading showing color="accent" />
    </template>

  </q-table>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw } from 'vue';
import { QInput, QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { Organization, invoiceRequests } from 'src/shared/model';
import { getUserById } from 'src/shared/utils/User.utils';
import EditButton from 'src/components/EditButton.vue';
import PageHader from 'src/components/PageHeader.vue'
import SearchField from 'src/components/SearchField.vue';
import { getAllOrganizations, getOrganizationsByName } from 'src/shared/utils/Organization/Organization.utils';
import { doc, getFirestore, updateDoc } from '@firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';
import { is } from 'quasar'
import SelectOrganization from './SelectOrganization.vue';
import InputCell from './InputCell.vue';

const editableRowNumber = ref(-1);

const db = getFirestore();

const search = ref('')

const $q = useQuasar();

const { t } = useI18n({ useScope: 'global' });
const loading = ref(true)
const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'edit',
    label: '',
    field: '',
    align: 'left',
  },
  {
    name: 'number',
    label: t('menu.admin.organizationsTable.number'),
    field: 'number',
    align: 'left',
    sortable: true
  },
  {
    name: 'organizationIdAndName',
    label: `${t('menu.admin.organizationsTable.organizationId') + '\n' + t('menu.admin.organizationsTable.organizationName')}  `,
    field: 'organizationIdAndName',
    align: 'left',
    sortable: true,
    sort: (a: string, b: string) => {
      const firstOrganizationName = a.split(' ')[1]
      const secondOrganizationName = b.split(' ')[1]
      return firstOrganizationName.localeCompare(secondOrganizationName)
    }
  },
  {
    name: 'operatorName',
    label: t('menu.admin.organizationsTable.operator'),
    field: 'operatorName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tel',
    label: t('menu.admin.organizationsTable.phoneNumber'),
    field: 'tel',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fax',
    label: t('menu.admin.organizationsTable.fax'),
    field: 'fax',
    align: 'left',
    sortable: true,
  },
  {
    name: 'mailaddress',
    label: t('menu.admin.organizationsTable.email'),
    field: 'mailaddress',
    align: 'left',
    sortable: true,
  },
  {
    name: 'invoiceRequest',
    label: t('menu.admin.organizationsTable.invoiceRequest'),
    field: 'invoiceRequest',
    align: 'left',
    sortable: true
  },
  {
    name: 'buttons',
    label: '',
    field: '',
    align: 'left',
  }
])

type Rows = Awaited<ReturnType<typeof mapOrganizationsToRow>>
const rows = ref<Rows>([])
type ElementOf<T> = T extends Array<infer U> ? U : never

type Row = ElementOf<Rows>
const editableRow = ref<Row>()


async function searchOrganizations(name: string) {
  loading.value = true
  const organizations = await getOrganizationsByName(name)
  rows.value = await mapOrganizationsToRow(organizations)
  loading.value = false
}

requestOrganizations()
async function requestOrganizations() {
  loading.value = true
  const organizations = await getAllOrganizations()
  rows.value = await mapOrganizationsToRow(organizations)
  loading.value = false
}

async function mapOrganizationsToRow(organizations: Organization[]) {
  loading.value = true
  const mapped = await Promise.all(
    organizations.map(async (organization, index) => {
      const user = await getUserById(organization.operatorUser)
      return {
        number: index + 1,
        organizationIdAndName: organization.id + ' ' + organization.name,
        operatorName: user?.displayName,
        ...organization
      }
    })
  )
  loading.value = false
  return mapped
}

function cloneToRaw<T>(obj: T) {
  return structuredClone(toRaw(obj))
}

function deepEqualClone<T>(obj1: T, obj2: unknown) {
  return is.deepEqual(cloneToRaw(obj1), cloneToRaw(obj2))
}


function isRowSelected(row: number) {
  return row == editableRowNumber.value
}

function rowToOrganization(row: Row): Organization {
  const organization = cloneToRaw(row)
  delete organization.number
  delete organization.organizationIdAndName
  delete organization.operatorName
  return organization
}

async function editOrganization(row: Row | undefined, rowIndex: number) {
  if (!row) {
    return
  }

  loading.value = true;

  rows.value[rowIndex] = row
  rows.value[rowIndex].organizationIdAndName = row.id + ' ' + row.name

  try {
    const ref = doc(db, 'organization/' + row.id)
    const organization = rowToOrganization(row)

    await updateDoc(ref, {
      ...organization
    })
    await requestOrganizations()
    loading.value = false;
    Alert.success($q, t)
  } catch (error) {
    Alert.warning($q, t);
    loading.value = false;
  }

}

</script>

<style lang="scss" scoped>
.no-breaks {
  white-space: pre-line;
  text-align: left;
}
</style>
