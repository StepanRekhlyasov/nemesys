<template>
  <q-page class="bg-grey-3">
   <q-card-section class="bg-grey-3 flex items-center q-pb-none">
      <div class="text-h6 text-primary"><span style="font-size:28px;">■</span>KPI</div>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-end">
      <label class="text-subtitle1 q-mr-md">
        {{ $t('kpi.targetPeriod') }}
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
      <q-btn 
        color="primary"
        style="margin-left: auto;"
        @click="downloadCSV"
      >
        {{ $t('common.downloadCSV') }}
      </q-btn>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-center">
      <KpiTable
        :rows="rowData"
        @openDrawer="(applicant : Applicant)=>detailsDrawer?.openDrawer(applicant)"
        ref="kpiTableRef"
      />
      <q-linear-progress query v-if="loading" color="primary"/>
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer"/>
  </q-page>
</template>
<script setup lang="ts">
import MySelect from 'src/components/inputs/MySelect.vue';
import DateRange from 'src/components/inputs/DateRange.vue';
import KpiTable from './components/KpiTable.vue';
import { ref, onMounted, watch } from 'vue'
import { useApplicant } from 'src/stores/applicant';
import { where } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';
import { Applicant } from 'src/shared/model';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';

const dateRange = ref('')
const branch = ref('')
const loading = ref(false)
const rowData = ref<Applicant[]>([])
const applicantStore = useApplicant()
const organizationStore = useOrganization()
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const kpiTableRef = ref<InstanceType<typeof KpiTable> | null>(null);

async function getData(){
  if(organizationStore.currentOrganizationId){
    loading.value = true
    /** 
     * here is test data.
     * true data should be parsed here to table keys only 
     * because of csv downloading
     */
    rowData.value = await applicantStore.getApplicantsByConstraints([where('organizationId', '==', organizationStore.currentOrganizationId)])
    loading.value = false
  }
}
watch(()=>organizationStore.currentOrganizationId, ()=>{
  getData()
})
function downloadCSV(){
  kpiTableRef.value?.exportTable()
}
onMounted(()=>{
  getData()
})
</script>