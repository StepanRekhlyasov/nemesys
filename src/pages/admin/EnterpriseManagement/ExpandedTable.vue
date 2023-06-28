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
      <div class="row justify-between full-width">
        <q-toggle v-model="props.branchItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
          color="accent"
          @update:model-value="async (working) => await onWorkingChange(working, { organizationId: props.organizationItem.id, businessId: props.buisnesesItem.id, branchId: props.branchItem.id })" />
        <q-btn flat icon="edit" color="accent" @click="openDialog = true; organizationId=props.organizationItem.id; branchToEdit=props.branchItem" />
      </div>
    </template>

  </OrganizationColspanTabel>

  <q-dialog v-model="openDialog">
    <DialogWrapper>
      <BranchCreateForm @closeDialog="openDialog = false; loadTableData()" color="accent" :defaultOrganizationid="organizationId" :editBranch="JSON.parse(JSON.stringify(branchToEdit))" @onCatchError="loadTableData"/>
    </DialogWrapper>
  </q-dialog>
</template>

<script setup lang="ts">
import { QTableProps, QTableSlots } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Row, Table } from './types'
import type { Overwrite } from 'src/shared/types/Overwrite'
import { useOrganization } from 'src/stores/organization';
import { Alert } from 'src/shared/utils/Alert.utils';
import { manageUserAvailability } from './handlers/handlers';
import OrganizationColspanTabel from 'src/components/organization/OrganizationColspanTabel.vue';
import { toTable } from 'src/components/organization/handlers/ToTable';
import { useBranch } from 'src/stores/branch';
import { useBusiness } from 'src/stores/business';
import BranchCreateForm from 'src/components/organization/BranchCreate.form.vue';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
import { Branch } from 'src/shared/model';


type Props = Overwrite<Parameters<QTableSlots['body']>[0], { row: Row }>

interface ExpandedTableProps {
  props: Props
}

const organization = useOrganization()
const branchStore = useBranch()
const business = useBusiness()
const openDialog = ref(false)
const loading = ref(false)
const organizationId = ref<string>()
const branchToEdit = ref<Branch>()

const componentProps = defineProps<ExpandedTableProps>()

const { t } = useI18n({ useScope: 'global' });

const data = ref<Table[]>([])

async function onWorkingChange(working: boolean, ids: { organizationId?: string, businessId?: string, branchId?: string }) {

  loading.value = true;
  const { businessId, organizationId, branchId } = ids

  try {

    if (organizationId && !businessId && !branchId) {
      await organization.editOrganization({ working }, organizationId)
      await manageUserAvailability({ enabled: working, organizationId })
    }

    if (organizationId && businessId && !branchId) {
      await business.editBusiness({ working }, organizationId, businessId)
    }

    if (organizationId && businessId && branchId) {
      await branchStore.editBranch({ working }, organizationId, businessId, branchId)
      await manageUserAvailability({ enabled: working, branchId })
    }

    if (working) {
      loading.value = false
      Alert.success();
      return
    }

    const organizations = data?.value[0].organization

    if (!organizations) {
      loading.value = false
      Alert.success();
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
        await business.editBusiness({ working }, organizationItem.id, businessItem.id)
        businessItem.working = working
        for (let k = 0; k < businessItem.branches.length; k++) {
          const branchItem = businessItem.branches[k]
          if (branchId && branchItem.businessId !== branchId) {
            continue
          }
          branchItem.working = working
          await branchStore.editBranch({ working }, organizationItem.id, businessItem.id, branchItem.id)
          await manageUserAvailability({ enabled: working, branchId: branchItem.id })
        }
      }
    }
    Alert.success();
  } catch (error) {
    Alert.warning(error);
  }

  loading.value = false

}

loadTableData()
async function loadTableData() {
  loading.value = true

  const businesses = await business.getBusinesses(componentProps.props.row.id)
  const branches = await branchStore.getBranches(componentProps.props.row.id)

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

