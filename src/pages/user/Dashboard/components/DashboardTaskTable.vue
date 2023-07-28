<template>
<q-card-section class="bg-grey-3 flex items-center">
  <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('task.task') }} ({{ entity==='applicant'?$t('report.categories.applicant'):$t('applicant.list.fixEmployment.office') }})</p>
</q-card-section>
<q-table :rows="rows" :columns="columns" :pagination="pagination" class="no-shadow">
  <template v-slot:header='props'>
    <q-tr class="bg-grey-3 no-border" :props="props">
      <q-th :props="props" v-for="col in props.cols" :key="col.name">{{ col.label }}</q-th>
    </q-tr>
  </template>
  <template v-slot:body-cell-created_at="props">
    <q-td>{{ myDateFormat(props.row.created_at, 'YYYY/MM/DD') }}</q-td>
  </template>
  <template v-slot:body-cell-applicantName="props">
    <q-td class="text-featured" @click="openDrawer(props.row.applicantId)"><span>{{ props.row.applicantName }}</span></q-td>
  </template>
  <template v-slot:body-cell-clientFactoryName="props">
    <q-td class="text-featured" @click="openDrawer(props.row.clientFactoryId, props.row.clientId)"><span>{{ props.row.clientFactoryName }}</span></q-td>
  </template>
  <template v-slot:body-cell-taskType="props">
    <q-td>{{ $t('task.types.' + props.row.taskType) }}</q-td>
  </template>
  <template v-slot:body-cell-taskContent="props">
    <q-td class="text-featured" @click="openTask(props.row)"><span>{{ props.row.taskContent }}</span></q-td>
  </template>
  <template v-slot:body-cell-applicantStatus="props">
    <q-td v-if="entity === 'applicant'">
    <template v-if="props.row.applicantStatus">
      {{ $t(statusStringMask[props.row.applicantStatus.toLowerCase().replaceAll('_', '-')]?.i18n ) }}
    </template>
    </q-td>
  </template>
  <template v-slot:body-cell-taskStatus="props">
    <q-td>
      <q-select 
        class="text-featured"
        v-model="props.row.taskStatus" 
        :options="taskStatusOptions" 
        emit-value
        map-options
        dense
        borderless
        @update:model-value="taskStore.updateTaskStatus(props.row.id, props.row.taskStatus)"
      />
    </q-td>
  </template>
</q-table>
<ApplicantDetails ref="detailsDrawer" v-if="entity==='applicant'"/>
<ClientFactoryDrawer
  v-if="activeClientFactoryItem && entity==='office'"
  v-model:selectedItem="activeClientFactoryItem"
  :isDrawer="isClientFactoryDrawer"
  @hide-drawer="hideClientFactoryDrawer"
  @open-fax-drawer="openFaxDrawer"
/>
<FaxDrawer
  @hide-drawer="hideNewFaxDrawer"
  theme="primaery"
  :selectedCF="selectedCF"
  :is-drawer="isNewFaxDrawer"
/>
<TaskRegister 
  :entity="'edit'"
  :entityData="selectedEntityData"
  v-model="openTaskRegister" 
  @closeDrawer="openTaskRegister=false" 
  @closeDrawerWithUpdate="(id) => {
    openTaskRegister = false
    getTaskById(id)
  }"
/>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTask } from 'src/stores/task'
import { applicantTaskTableColumns, officeTaskTableColumns, taskStatusOptions } from '../const/dashboard.const'
import { myDateFormat } from 'src/shared/utils/utils';
import { Task } from 'src/shared/model/Tasks.model';
import { useApplicant } from 'src/stores/applicant';
import { statusStringMask } from '../../ApplicantProgress/const/applicantStatuses';
import ApplicantDetails from '../../Applicant/ApplicantDetails.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import ClientFactoryDrawer from '../../BusinessManagement/ClientFactoryDrawer.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import FaxDrawer from 'src/components/client-factory/FaxDrawer.vue';
import TaskRegister from '../../Applicant/components/TaskRegister.vue';

const props = defineProps<{
  entity: 'applicant' | 'office'
}>()
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const taskStore = useTask()
const applicantStore = useApplicant()
const clientFactoryStore = useClientFactory()
const rows = ref()
const activeClientFactoryItem = ref()
const selectedEntityData = ref()
const isClientFactoryDrawer = ref(false)
const isNewFaxDrawer = ref(false)
const openTaskRegister = ref(false)

const selectedCF = ref<string[]>([])
const openFaxDrawer = (id:string) =>{
    selectedCF.value = []
    selectedCF.value.push(id)
    isNewFaxDrawer.value = true
}
const hideNewFaxDrawer = () => {
    isNewFaxDrawer.value = false
}
const pagination = computed(()=>{
  return {
    rowsPerPage: 10
  }
})
const columns = computed(()=>props.entity==='applicant' ? applicantTaskTableColumns.value : officeTaskTableColumns.value)

function openTask(task : Task) {
  selectedEntityData.value = task
  openTaskRegister.value = true
}
async function getTaskById(id : string){
  try{
    const result = await taskStore.getTaskById(id);
    for (let i = 0; i < rows.value.length; i++) {
      if (rows.value[i].id === result?.id) {
        rows.value[i] = result;
        const applicant = await applicantStore.getApplicantById(result.applicantId as string)
        if(applicant){
          rows.value[i]['applicantStatus'] = applicant.status
        }
        break;
      }
    }
  } catch (e) {
    Alert.warning(e)
  }
} 
async function openDrawer(id: string, client_id?: string){
  if(props.entity === 'applicant'){
    if(applicantStore.state.applicants[id]){
      detailsDrawer.value?.openDrawer(applicantStore.state.applicants[id])
    } else {
      const applicant = await applicantStore.getApplicantById(id)
      if(applicant){
        detailsDrawer.value?.openDrawer(applicant)
      } else {
        Alert.warning()
      }
    }
  } else if (props.entity === 'office'){
    activeClientFactoryItem.value = await clientFactoryStore.getClientFactory(client_id as string, id)
    isClientFactoryDrawer.value = true
  }
}

const hideClientFactoryDrawer = () => {
  isClientFactoryDrawer.value = false
}

async function loadData() {
  rows.value = await taskStore.getTasks(props.entity)
  if(props.entity === 'applicant'){
    rows.value.forEach(async (row : Task) => {
      const result = await applicantStore.getApplicantById(row.applicantId as string)
      if(result){
        row['applicantStatus'] = result.status
      }
    })
  }
}

onMounted(()=>{
  loadData()
})
</script>
<style lang="scss">
.text-featured{
  span {
    color: $primary;
    border-bottom: 1px solid;
    cursor: pointer;
  }
}
</style>