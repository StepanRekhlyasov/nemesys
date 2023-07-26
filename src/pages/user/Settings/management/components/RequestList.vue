<template>
  <q-dialog>
    <q-card style="width: 1200px; max-width: 80vw;">
      <q-card-section class="listRows items-center q-pb-none flex justify-between">
        <div class="text-h5 text-primary">{{ $t('menu.admin.licenseManagement.licenseRequest') }}</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-table :columns="listColumns" :rows="listRows" :pagination="{rowsPerPage: 10}">
          <template v-slot:body-cell-requestDate="props">
            <q-td :props="props">{{ myDateFormat(props.row.requestDate, 'YYYY-MM-DD HH:mm') }}</q-td>
          </template>
          <template v-slot:body-cell-branchId="props">
            <q-td :props="props">{{ branch.name }}</q-td>
          </template>
          <template v-slot:body-cell-requestUserId="props">
            <q-td :props="props">{{ userList[props.row.requestUserId]?.displayName }}</q-td>
          </template>
          <template v-slot:body-cell-requestType="props">
            <q-td :props="props"><template v-if="props.row.requestType">{{ $t('menu.admin.licenseManagement.request.' + props.row.requestType.toLowerCase()) }}</template></q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props"><template v-if="props.row.status">{{ $t('common.' + props.row.status) }}</template></q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { Branch } from 'src/shared/model';
import { useLicense } from 'src/stores/license';
import { onMounted, ref } from 'vue';
import { listColumns } from '../consts/BranchMasterColumns'
import { myDateFormat } from 'src/shared/utils/utils';
import { useUserStore } from 'src/stores/user';

const props = defineProps<{
  branch: Branch
}>()
const licenceStore = useLicense()
const listRows = ref()
const loading = ref(false)
const userStore = useUserStore()
const userList = ref({})

onMounted(async ()=>{
  loading.value = true
  listRows.value = await licenceStore.getRequestList(props.branch.id)
  listRows.value.forEach(async (row)=>{
    if(!userList.value[row.requestUserId]){
      userList.value[row.requestUserId] = await userStore.getUserById(row.requestUserId)
    }
  })
  loading.value = false
})
</script>