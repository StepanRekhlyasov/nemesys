<template>
  <PageHader>
    {{ t('menu.admin.organizationsTable.organizationSearh') }}
  </PageHader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :on-click-search="() => { }" :on-click-clear="() => { }" :model-value="''" />
  </q-card>
  <q-table flat :columns="columns" :loading="loading" :rows="rows" hide-pagination>

    <template v-slot:body-cell-edit="props">
      <EditButton :props="props" color="accent" :on-edit="() => { }" :on-save="async () => { }"
        :editable-row="editableRow" />
    </template>

    <template v-slot:header-cell-company="props">
      <q-th class="no-breaks">
        {{ props.col.label }}
      </q-th>
    </template>

  </q-table>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAllOrganizations } from 'src/shared/utils/Organization.utils';
import { Organization } from 'src/shared/model';
import { getUserById } from 'src/shared/utils/User.utils';
import EditButton from 'src/components/EditButton.vue';
import PageHader from 'src/components/PageHeader.vue'
import SearchField from 'src/components/SearchField.vue';

const editableRow = ref(-1);

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
  },
  {
    name: 'company',
    label: `${t('menu.admin.organizationsTable.companyId') + '\n' + t('menu.admin.organizationsTable.companyName')}  `,
    field: 'company',
    align: 'left',
  },
  {
    name: 'operator',
    label: t('menu.admin.organizationsTable.operator'),
    field: 'operator',
    align: 'left',
  },
  {
    name: 'phone',
    label: t('menu.admin.organizationsTable.phoneNumber'),
    field: 'phone',
    align: 'left',
  },
  {
    name: 'fax',
    label: t('menu.admin.organizationsTable.fax'),
    field: 'fax',
    align: 'left',
  },
  {
    name: 'email',
    label: t('menu.admin.organizationsTable.email'),
    field: 'email',
    align: 'left',
  },
  {
    name: 'invoiceRequest',
    label: t('menu.admin.organizationsTable.invoiceRequest'),
    field: 'invoiceRequest',
    align: 'left',
  },
  {
    name: 'buttons',
    label: 'btn',
    field: '',
    align: 'left',
  }
])
const rows = ref<Awaited<ReturnType<typeof mapOrganizations>> | undefined>()
requestOrganizations()
async function requestOrganizations() {
  const organizations = await getAllOrganizations()
  rows.value = await mapOrganizations(organizations)
  loading.value = false
}

async function mapOrganizations(organizations: Organization[]) {
  return await Promise.all(
    organizations.map(async (organization, index) => {
      const user = await getUserById(organization.operatorUser)
      return {
        number: index + 1,
        company: organization.id + ' ' + organization.name,
        operator: user?.displayName,
        phone: organization.tel,
        fax: organization.fax,
        email: organization.mailaddress,
        invoiceRequest: organization.invoiceRequest,
      }
    })
  )
}
</script>

<style lang="scss" scoped>
.no-breaks {
  white-space: pre-line;
  text-align: left;
}
</style>
