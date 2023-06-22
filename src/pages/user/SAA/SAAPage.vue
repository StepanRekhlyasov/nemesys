<template>
  <q-page class="bg-grey-3">
   <q-card-section class="bg-grey-3 flex items-center q-pb-none">
      <div class="text-h6 text-primary"><span style="font-size:28px;">■</span>{{ $t('menu.SAA') }}</div>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-end gap">
      <label class="text-subtitle1">
        {{ $t('KPI.aggregationMethods') }}
        <MySelect
          :options="[
            {
              label: $t('KPI.modeIndividual'),
              value: 'user'
            },
            {
              label: $t('KPI.modeBranch'),
              value: 'branch'
            },
          ]"
          :width="'175px'"
          v-model="method"
          :clearable="false"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1">
        {{ $t('KPI.targetPeriod') }}
        <DateRange
          v-model="dateRange"
          :width="'250px'"
          :height="'40px'"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1">
        {{ $t('applicant.progress.filters.branch') }}
        <MySelect
          :option-to-fetch="'branchIncharge'"
          :width="'175px'"
          v-model="branch"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1">
        {{ $t('KPI.username') }}
        <MySelect
          :option-to-fetch="'usersInCharge'"
          :width="'175px'"
          v-model="user"
          @update:model-value="getData()"
        />
      </label>
      <q-btn 
        color="primary"
        style="margin-left: auto;"
        @click="downloadCSV"
      >
        {{ $t('common.downloadCSV') }}
      </q-btn>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-center">
      <SAATable
        :rows="rowData"
        ref="saaTableRef"
      />
      <q-linear-progress query v-if="loading" color="primary"/>
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer"/>
  </q-page>
</template>
<script setup lang="ts">
import MySelect from 'src/components/inputs/MySelect.vue';
import DateRange from 'src/components/inputs/DateRange.vue';
import SAATable from './components/SAATable.vue';
import { ref, onMounted, watch } from 'vue'
import { useOrganization } from 'src/stores/organization';
import { User } from 'src/shared/model';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { useUserStore } from 'src/stores/user';
import { where } from 'firebase/firestore';

const dateRange = ref('')
const branch = ref('')
const user = ref('')
const method = ref('user')
const loading = ref(false)
const rowData = ref<User[]>([])
const userStore = useUserStore()
const organizationStore = useOrganization()
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const saaTableRef = ref<InstanceType<typeof SAATable> | null>(null);

async function getData(){
  if(organizationStore.currentOrganizationId){
    loading.value = true
    /** 
     * here is test data.
     * true data should be parsed here to table keys only 
     * because of csv downloading
     */
    if(user.value){
      rowData.value = await userStore.getUsersByConstrains([where('id', '==', user.value), where('deleted', '==', false), where('organization_ids', 'array-contains', organizationStore.currentOrganizationId)])
    } else if (branch.value) {
      rowData.value = await userStore.getUsersByConstrains([where('branch_id', '==', branch.value), where('deleted', '==', false), where('organization_ids', 'array-contains', organizationStore.currentOrganizationId)])
    } else {
      rowData.value = await userStore.getAllUsers(organizationStore.currentOrganizationId)
    }
    loading.value = false
  }
}
watch(()=>organizationStore.currentOrganizationId, ()=>{
  getData()
})
function downloadCSV(){
  saaTableRef.value?.exportTable()
}
onMounted(()=>{
  getData()
})
</script>
<style scoped lang="scss">
.gap{
  gap: 10px;
}
</style>