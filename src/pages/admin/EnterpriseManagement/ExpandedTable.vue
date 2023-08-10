<template>
  <OrganizationColspanTabel :columns="columns" :loading="loading" :table="data">
    <template #organization="{ organizationItem }">
      {{ organizationItem.organizationCodeAndName }}
      <q-toggle v-model="organizationItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
        color="accent"
        @update:model-value="async (working) => await onWorkingChange(working, { organizationId: organizationItem.id })" />
    </template>

    <template #buisneses="props">
      <div class="flex justify-between full-width">
        <q-toggle v-model="props.buisnesesItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
          color="accent" @update:model-value="async (working) =>
              await onWorkingChange(working, { organizationId: props.organizationItem.id, businessId: props.buisnesesItem.id })
            " />
        <q-btn flat icon="edit" color="accent" @click="openDialogBusiness = true; buisnesesEdit=props.buisnesesItem; organizationItemEdit = props.organizationItem" />
        <q-btn flat icon="delete" color="accent" @click="deleteConfirm = true; deleteBusinessData = props.buisnesesItem; deleteOrganizationId = props.organizationItem.id; deleteItem = 'business'" />
      </div>
    </template>

    <template #branch="props">
      <div class="row justify-between full-width">
        <q-toggle v-model="props.branchItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
          color="accent"
          @update:model-value="async (working) => await onWorkingChange(working, { organizationId: props.organizationItem.id, businessId: props.buisnesesItem.id, branchId: props.branchItem.id })" />
        <q-btn flat icon="edit" color="accent" @click="openDialog = true; organizationId=props.organizationItem.id; branchToEdit=props.branchItem" />
        <q-btn flat icon="delete" color="accent" @click="deleteConfirm = true; deleteBusinessData = props.buisnesesItem; deleteOrganizationId = props.organizationItem.id; deleteBranchId = props.branchItem.id; deleteItem = 'branch'" />
      </div>
    </template>

  </OrganizationColspanTabel>

  <q-dialog v-model="openDialogBusiness">
    <DialogWrapper>
      <AddBusiness @closeDialog="openDialogBusiness = false; loadTableData();" color="accent" :editBusiness="JSON.parse(JSON.stringify(buisnesesEdit))" :organization="organizationItemEdit" @onCatchError="loadTableData"/>
    </DialogWrapper>
  </q-dialog>
  <q-dialog v-model="openDialog">
    <DialogWrapper>
      <BranchCreateForm @closeDialog="openDialog = false; loadTableData(); organizationItemEdit = undefined; branchToEdit = undefined; " color="accent" :editBranch="JSON.parse(JSON.stringify(branchToEdit))" @onCatchError="loadTableData" :defaultOrganizationid="organizationId"/>
    </DialogWrapper>
  </q-dialog>

  <q-dialog v-model="deleteConfirm" persistent @hide="deleteBusinessData=''; deleteOrganizationId=''">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ $t('common.deleteBusiness') }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" color="primary" v-close-popup />
          <q-btn flat :label="$t('common.delete')" color="primary" v-close-popup @click="()=>deleteBusinessHandler()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
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
import { useBranch } from 'src/stores/branch';
import { useBusiness } from 'src/stores/business';
import BranchCreateForm from 'src/components/organization/BranchCreate.form.vue';
import AddBusiness from './AddBusiness.vue';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
import { Branch, Business } from 'src/shared/model';


type Props = Overwrite<Parameters<QTableSlots['body']>[0], { row: Row }>

interface ExpandedTableProps {
  props: Props
}

const organization = useOrganization()
const branchStore = useBranch()
const business = useBusiness()
const openDialog = ref(false)
const openDialogBusiness = ref(false)
const loading = ref(false)
const deleteConfirm = ref(false)
const deleteBusinessData = ref()
const deleteItem = ref('')
const deleteOrganizationId = ref('')
const deleteBranchId = ref('')
const organizationId = ref<string>()
const branchToEdit = ref<Branch>()
const buisnesesEdit = ref<Business>()
const organizationItemEdit = ref()
const $q = useQuasar()

const componentProps = defineProps<ExpandedTableProps>()

async function deleteBusinessHandler(){
  if(deleteItem.value === 'business' && deleteBusinessData.value?.branches?.[0]?.id){
    $q.dialog({
      title: t('errors.error'),
      message: t('errors.deleteBranchesFirst'),
      ok: t('common.ok')
    })
    return
  }
  if(deleteItem.value === 'business'){
    try {
      await business.deleteBusiness(deleteOrganizationId.value, deleteBusinessData.value.id)
      ;
      await loadTableData();
    } catch (error) {
      Alert.warning(error);
    }
  } else {
    try {
      await business.deleteBranch(deleteOrganizationId.value, deleteBusinessData.value.id, deleteBranchId.value)
      ;
      await loadTableData();
    } catch (error) {
      Alert.warning(error);
    }
  }
}

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
      ;
      return
    }

    const organizations = data?.value[0].organization

    if (!organizations) {
      loading.value = false
      ;
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
          if (branchId && branchItem.businessId !== branchId || !branchItem.id) {
            continue
          }
          branchItem.working = working
          await branchStore.editBranch({ working }, organizationItem.id, businessItem.id, branchItem.id)
          await manageUserAvailability({ enabled: working, branchId: branchItem.id })
        }
      }
    }
    ;
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

