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
import { ApplicantFix } from 'src/shared/model';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { useUserStore } from 'src/stores/user';

interface RowData {
  name: string,
  chargeOfFix: number,
  chargeOfInspection: number,
  chargeOfOffer: number,
  chargeOfAdmission: number,
}

const dateRange = ref('')
const branch = ref('')
const user = ref('')
const method = ref('user')
const loading = ref(false)
const rowData = ref<RowData[]>([]) /** typeme please */
const userStore = useUserStore()
const organizationStore = useOrganization()
const fixList = ref<ApplicantFix[]>([])
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const saaTableRef = ref<InstanceType<typeof SAATable> | null>(null);

async function getData(){
  fixList.value = await userStore.getSAAFixList(organizationStore.state.currentOrganizationUsers)
  rowData.value = mapFixDataForTable(fixList.value)
}

function downloadCSV(){
  saaTableRef.value?.exportTable()
}
onMounted(()=>{
  loading.value = true
  getData()
  loading.value = false
})

watch(()=>organizationStore.currentOrganizationId, ()=>{
  loading.value = true
})
watch(()=>organizationStore.state.currentOrganizationUsers, async ()=>{
  await getData()
  loading.value = false
})

function mapFixDataForTable(data : ApplicantFix[]) {
  const result : RowData[] = []
  for(const [key, value] of Object.entries(organizationStore.state.currentOrganizationUsers)){
    const row : Partial<RowData> = {}
    row['name'] = value.displayName? value.displayName : value.name
    const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission']
    statusCountFields.forEach((field)=>{
      row[field] = data.reduce((accumulator, currentValue)=> currentValue[field] === key ? accumulator + 1 : accumulator, 0)
    })
    result.push(row as RowData)
  }
  return result
}

</script>
<style scoped lang="scss">
.gap{
  gap: 10px;
}
</style>
