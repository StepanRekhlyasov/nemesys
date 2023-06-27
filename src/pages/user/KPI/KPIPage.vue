<template>
  <q-page class="bg-grey-3">
   <q-card-section class="bg-grey-3 flex items-center q-pb-none">
      <div class="text-h6 text-primary"><span style="font-size:28px;">■</span>{{ $t('menu.KPI') }}</div>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-end gap">
      <label class="text-subtitle1">
        {{ $t('KPI.aggregationMethods') }}
        <MySelect
          :options="[
            {
              label: $t('KPI.modeDay'),
              value: 'day'
            },
            {
              label: $t('KPI.modeBranch'),
              value: 'branch'
            },
            {
              label: $t('KPI.modeMedia'),
              value: 'media'
            },
          ]"
          :width="'175px'"
          v-model="mode"
          :clearable="false"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('KPI.item') }}
        <MySelect
          :options="[
            {
              label: $t('KPI.actualFigures'),
              value: 'actualFigures'
            },
            {
              label: $t('KPI.unitPrice'),
              value: 'unitPrice'
            },
            {
              label: $t('KPI.applicationAttribute'),
              value: 'applicationAttribute'
            },
          ]"
          :width="'175px'"
          v-model="item"
          :clearable="false"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('KPI.targetPeriod') }}
        <DateRange
          v-model="dateRange"
          :width="'250px'"
          :height="'40px'"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'day'">
        {{ $t('applicant.progress.filters.month') }}
        <DateRange
          v-model="day"
          :width="'150px'"
          :height="'40px'"
          @update:model-value="getData()"
          :range="false"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'day'">
        {{ $t('KPI.location') }}
        <MySelect
          :width="'150px'"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'media'">
        {{ $t('KPI.media') }}
        <MySelect
          :width="'150px'"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'day'">
        {{ $t('KPI.username') }}
        <MySelect
          :option-to-fetch="'usersInCharge'"
          :width="'175px'"
          v-model="user"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('applicant.add.occupation') }}
        <MySelect
          :options="occupationList"
          :width="'100px'"
          v-model="occupation"
          :clearable="false"
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
        :mode="mode"
        :item="item"
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
import KpiTable from './components/KPITable.vue';
import { ref, onMounted, watch } from 'vue'
import { useOrganization } from 'src/stores/organization';
import { User } from 'src/shared/model';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { useUserStore } from 'src/stores/user';
import { where } from 'firebase/firestore';
import { occupationList } from 'src/shared/constants/Applicant.const';

const day = ref('')
const dateRange = ref('')
const branch = ref('')
const occupation = ref('')
const user = ref('')
const mode = ref('day')
const item = ref('actualFigures')
const resetData = () => {
  user.value = ''
  day.value = ''
  dateRange.value = ''
  branch.value = ''
  occupation.value = ''
}
const loading = ref(false)
const rowData = ref<User[]>([])
const userStore = useUserStore()
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
watch(()=>mode.value, ()=>{
  resetData()
})
function downloadCSV(){
  kpiTableRef.value?.exportTable()
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