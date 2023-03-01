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
      <EditButton :props="props" color="accent" :on-edit="() => { }" :on-save="async () => { }"
        :editable-row="editableRow" />
    </template>

    <template v-slot:header-cell-organization="props">
      <q-th :props="props" class="no-breaks items-center row">
        {{ props.col.label }}
      </q-th>
    </template>

  </q-table>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import { Organization } from 'src/shared/model';
import { getUserById } from 'src/shared/utils/User.utils';
import EditButton from 'src/components/EditButton.vue';
import PageHader from 'src/components/PageHeader.vue'
import SearchField from 'src/components/SearchField.vue';
import { getAllOrganizations, getOrganizationsByName } from 'src/shared/utils/Organization/Organization.utils';

const editableRow = ref(-1);

const search = ref('')

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
    name: 'organization',
    label: `${t('menu.admin.organizationsTable.organizationId') + '\n' + t('menu.admin.organizationsTable.organizationName')}  `,
    field: 'organization',
    align: 'left',
    sortable: true,
    sort: (a: string, b: string) => {
      const firstOrganizationName = a.split(' ')[1]
      const secondOrganizationName = b.split(' ')[1]
      return firstOrganizationName.localeCompare(secondOrganizationName)
    }
  },
  {
    name: 'operator',
    label: t('menu.admin.organizationsTable.operator'),
    field: 'operator',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: t('menu.admin.organizationsTable.phoneNumber'),
    field: 'phone',
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
    name: 'email',
    label: t('menu.admin.organizationsTable.email'),
    field: 'email',
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
const rows = ref<Awaited<ReturnType<typeof mapOrganizations>> | undefined>()

async function searchOrganizations(name: string) {
  loading.value = true
  const organizations = await getOrganizationsByName(name)
  rows.value = await mapOrganizations(organizations)
  loading.value = false
}

requestOrganizations()
async function requestOrganizations() {
  loading.value = true
  const organizations = await getAllOrganizations()
  rows.value = await mapOrganizations(organizations)
  loading.value = false
}

async function mapOrganizations(organizations: Organization[]) {
  loading.value = true
  const mapped = await Promise.all(
    organizations.map(async (organization, index) => {
      const user = await getUserById(organization.operatorUser)
      return {
        number: index + 1,
        organization: organization.id + ' ' + organization.name,
        operator: user?.displayName,
        phone: organization.tel,
        fax: organization.fax,
        email: organization.mailaddress,
        invoiceRequest: organization.invoiceRequest,
      }
    })
  )
  loading.value = false
  return mapped
}
</script>

<style lang="scss" scoped>
.no-breaks {
  white-space: pre-line;
  text-align: left;
}
</style>
