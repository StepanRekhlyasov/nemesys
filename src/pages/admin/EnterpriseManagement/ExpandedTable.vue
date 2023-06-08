<template>
  <OrganizationColspanTabel :columns="columns" :loading="loading" :table="data">
    <template #organization="{ organizationItem }">
      {{ organizationItem.organizationCodeAndName }}
      <q-toggle v-model="organizationItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
        color="accent"
        @update:model-value="async (working) => await onWorkingChange(working, { organizationId: organizationItem.id })" />
    </template>

    <template #buisneses="props">
      <q-toggle v-model="props.buisnesesItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
        color="accent" @update:model-value="async (working) =>
            await onWorkingChange(working, { organizationId: props.organizationItem.id, businessId: props.buisnesesItem.id })
          " />
    </template>

    <template #branch="props">
      <q-toggle v-model="props.branchItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
        color="accent"
        @update:model-value="async (working) => await onWorkingChange(working, { organizationId: props.organizationItem.id, businessId: props.buisnesesItem.id, branchId: props.branchItem.id })" />
    </template>

  </OrganizationColspanTabel>
</template>

<script setup lang="ts">
import { getFirestore } from '@firebase/firestore';
import { QTableProps, QTableSlots, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Row, Table } from './types'
import type { Overwrite } from 'src/shared/types/Overwrite'
import { useOrganization } from 'src/stores/organization';
import { Alert } from 'src/shared/utils/Alert.utils';
import { manageUserAvailability } from './handlers/handlers';
import OrganizationColspanTabel from 'src/components/organization/OrganizationColspanTabel.vue';
import { toTable } from 'src/components/organization/handlers/ToTable';


type Props = Overwrite<Parameters<QTableSlots['body']>[0], { row: Row }>

interface ExpandedTableProps {
  props: Props
}

const $q = useQuasar();

const organization = useOrganization()

const loading = ref(false)

const db = getFirestore()

const componentProps = defineProps<ExpandedTableProps>()

const { t } = useI18n({ useScope: 'global' });

const data = ref<Table[]>([])

async function onWorkingChange(working: boolean, ids: { organizationId?: string, businessId?: string, branchId?: string }) {

  loading.value = true;
  const { businessId, organizationId, branchId } = ids

  try {

    if (organizationId && !businessId && !branchId) {
      await organization.editOrganization(db, { working }, organizationId)
      await manageUserAvailability({ enabled: working, organizationId })
    }

    if (organizationId && businessId && !branchId) {
      await organization.editBusiness(db, { working }, organizationId, businessId)
    }

    if (organizationId && businessId && branchId) {
      await organization.editBranch(db, { working }, organizationId, businessId, branchId)
      await manageUserAvailability({ enabled: working, branchId })
    }

    if (working) {
      loading.value = false
      Alert.success($q, t);
      return
    }

    const organizations = data?.value[0].organization

    if (!organizations) {
      loading.value = false
      Alert.success($q, t);
      return
    }

    for (let i = 0; i < organizations.length; i++) {
      const organizationItem = organizations[i]
      for (let j = 0; j < organizationItem.buisneses.length; j++) {
        const businessItem = organizationItem.buisneses[j]
        if (businessId && businessItem.id !== businessId) {
          continue
        }

        if (branchId) {
          continue
        }
        await organization.editBusiness(db, { working }, organizationItem.id, businessItem.id)
        businessItem.working = working
        for (let k = 0; k < businessItem.branches.length; k++) {
          const branchItem = businessItem.branches[k]
          if (branchId && branchItem.businessId !== branchId) {
            continue
          }
          branchItem.working = working
          await organization.editBranch(db, { working }, organizationItem.id, businessItem.id, branchItem.id)
          await manageUserAvailability({ enabled: working, branchId: branchItem.id })
        }
      }
    }
    Alert.success($q, t);
  } catch (error) {
    Alert.warning($q, t);
  }

  loading.value = false

}

loadTableData()
async function loadTableData() {
  loading.value = true

  const businesses = await organization.getBusinesses(db, componentProps.props.row.id)
  const branches = await organization.getBranches(db, componentProps.props.row.id)

  data.value = [toTable(businesses, branches, componentProps.props.row)]

  loading.value = false
}

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'organizationName',
    label: t('menu.admin.organizationsTable.organizationName'),
    field: 'organizationName',
    align: 'left',

  },
  {
    name: 'buisnesses',
    label: t('menu.admin.organizationsTable.businessName'),
    field: 'buisnesses',
    align: 'left',


  },
  {
    name: 'branchName',
    label: t('menu.admin.organizationsTable.branchName'),
    field: 'branchName',
    align: 'left',
  }
])
</script>

