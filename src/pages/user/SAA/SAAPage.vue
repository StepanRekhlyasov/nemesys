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
          @update:model-value="reMapData()"
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
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { useBackOrder } from 'src/stores/backOrder';
import { fixWithApplicant } from './model/saa.model'
import { BackOrderModel } from 'src/shared/model';
import { ConstraintsType } from 'src/shared/utils/utils';
import { DocumentData, where } from 'firebase/firestore';
import { getFromTo } from 'src/shared/utils/utils';
import { useSAA } from 'src/stores/saa';
import { SaaRowData } from './const/model';

const dateRange = ref<
  string | {
      from: string;
      to: string;
  } | null>(null)
const method = ref('user')
const loading = ref(false)
const rowData = ref<SaaRowData[]>([])
const SAA = useSAA()
const organizationStore = useOrganization()

const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const saaTableRef = ref<InstanceType<typeof SAATable> | null>(null);
const backOrderStore = useBackOrder()

const boData = ref<BackOrderModel[]>([])
const faxData = ref<DocumentData[]>([])
const callData = ref<DocumentData[]>([])
const fixList = ref<fixWithApplicant[]>([])

async function getData(){
  loading.value = true
  const constraints : ConstraintsType = []
  if(dateRange.value){
    const [from, to] = getFromTo(dateRange.value)
    if(from && to){
      constraints.push(where('created_at', '>=', from), where('created_at', '<=', to))
    }
  }

  [boData.value, faxData.value, callData.value, fixList.value] = await Promise.all([
    backOrderStore.getBOByConstraints(constraints),
    SAA.getSAAFaxList(dateRange.value),
    SAA.getSAACallList(dateRange.value),
    SAA.getSAAFixList(organizationStore.state.currentOrganizationUsers, dateRange.value)
  ])
  reMapData()
  loading.value = false
}
async function reMapData(){
  if(method.value === 'user'){
    rowData.value = mapFixDataForUserMode()
  } else {
    rowData.value = mapFixDataForBranchMode()
  }
}

function downloadCSV(){
  saaTableRef.value?.exportTable()
}
onMounted(async ()=>{
  loading.value = true
  await getData()
  loading.value = false
})

watch(()=>organizationStore.state.userAndBranchesUpdated, async (newVal)=>{
  if(!newVal){
    loading.value = false
  } else {
    await getData()
  }
})

function mapFixDataForUserMode() {
  const result : SaaRowData[] = []
  for(const [key, value] of Object.entries(organizationStore.state.currentOrganizationUsers)){
    const row : Partial<SaaRowData> = {}
    row.name = value.displayName? value.displayName : value.name
    const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission']
    statusCountFields.forEach((field)=>{
      row[field] = fixList.value.reduce((accumulator, currentValue)=> currentValue[field] === key ? accumulator + 1 : accumulator, 0)
    })
    row.numberOfCalls = callData.value.filter(row => row.created_by === key)?.length
    row.numberOfFax = faxData.value.filter(row => row.created_by === key)?.length;
    row.BO_NC = boData.value.filter(row => row.registrant === key && row.typeCase === 'nursingCare')?.length;
    row.BO_N = boData.value.filter(row => row.registrant === key && row.typeCase === 'nurse')?.length;
    row.dispatch = boData.value.filter(row => row.registrant === key && row.type === 'dispatch')?.length;
    row.introduction = boData.value.filter(row => row.registrant === key && row.type === 'referral')?.length;
    row.TTP = boData.value.filter(row => row.registrant === key && row.type === 'TTP')?.length;

    statusCountFields.forEach((field)=>{
      if(field!=='chargeOfFix'){
        if(row.chargeOfFix){
          row[field + 'Rate'] = Math.floor((row[field] / row.chargeOfFix) * 100) + '%'
        } else {
          row[field + 'Rate'] = '-'
        }
      }
    })
    
    row.personOK = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.personalStatus === true ? accumulator + 1 : accumulator, 0)
    row.personNG = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.personalStatus === false ? accumulator + 1 : accumulator, 0)
    row.personOKRate = (row.personOK + row.personNG)?(row.personOK / (row.personOK + row.personNG)).toFixed(2):'-'
    row.companyOK = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.corporationStatus === true ? accumulator + 1 : accumulator, 0)
    row.companyNG = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.corporationStatus === false ? accumulator + 1 : accumulator, 0)
    row.companyOKRate = (row.companyOK + row.companyNG)?(row.companyOK / (row.companyOK + row.companyNG)).toFixed(2):'-'
    result.push(row as SaaRowData)
  }
  return result
}

function mapFixDataForBranchMode(){
  const result : SaaRowData[] = []
  for(const [key, value] of Object.entries(organizationStore.state.currentOrganizationBranches)){
    const row : Partial<SaaRowData> = {}
    row.name = value.name
    const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission']
    statusCountFields.forEach((field)=>{
      row[field] = fixList.value.reduce((accumulator, currentValue)=> currentValue[field] && organizationStore.state.currentOrganizationUsers[currentValue[field]].branch_id === key ? accumulator + 1 : accumulator, 0)
    })

    row.numberOfCalls = callData.value.filter(row => row.created_by && organizationStore.state.currentOrganizationUsers[row.created_by] && organizationStore.state.currentOrganizationUsers[row.created_by].branch_id === key)?.length
    row.numberOfFax = faxData.value.filter(row => row.created_by && organizationStore.state.currentOrganizationUsers[row.created_by] && organizationStore.state.currentOrganizationUsers[row.created_by].branch_id === key)?.length;
    row.BO_NC = boData.value.filter(row => row.registrant && organizationStore.state.currentOrganizationUsers[row.registrant] && organizationStore.state.currentOrganizationUsers[row.registrant].branch_id === key && row.typeCase === 'nursingCare')?.length;
    row.BO_N = boData.value.filter(row => row.registrant && organizationStore.state.currentOrganizationUsers[row.registrant] && organizationStore.state.currentOrganizationUsers[row.registrant].branch_id === key && row.typeCase === 'nurse')?.length;
    row.dispatch = boData.value.filter(row => row.registrant && organizationStore.state.currentOrganizationUsers[row.registrant] && organizationStore.state.currentOrganizationUsers[row.registrant].branch_id === key && row.type === 'dispatch')?.length;
    row.introduction = boData.value.filter(row => row.registrant && organizationStore.state.currentOrganizationUsers[row.registrant] && organizationStore.state.currentOrganizationUsers[row.registrant].branch_id === key && row.type === 'referral')?.length;
    row.TTP = boData.value.filter(row => row.registrant && organizationStore.state.currentOrganizationUsers[row.registrant] && organizationStore.state.currentOrganizationUsers[row.registrant].branch_id === key && row.type === 'TTP')?.length;

    statusCountFields.forEach((field)=>{
      if(field!=='chargeOfFix'){
        if(row.chargeOfFix){
          row[field + 'Rate'] = Math.floor((row[field] / row.chargeOfFix) * 100) + '%'
        } else {
          row[field + 'Rate'] = '-'
        }
      }
    })
    
    row.personOK = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection] && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection].branch_id === key && currentValue.personalStatus === true ? accumulator + 1 : accumulator, 0)
    row.personNG = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection] && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection].branch_id === key && currentValue.personalStatus === false ? accumulator + 1 : accumulator, 0)
    row.personOKRate = (row.personOK + row.personNG)?(row.personOK / (row.personOK + row.personNG)).toFixed(2):'-'
    row.companyOK = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection] && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection].branch_id === key && currentValue.corporationStatus === true ? accumulator + 1 : accumulator, 0)
    row.companyNG = fixList.value.reduce((accumulator, currentValue) => currentValue.chargeOfInspection && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection] && organizationStore.state.currentOrganizationUsers[currentValue.chargeOfInspection].branch_id === key && currentValue.corporationStatus === false ? accumulator + 1 : accumulator, 0)
    row.companyOKRate = (row.companyOK + row.companyNG)?(row.companyOK / (row.companyOK + row.companyNG)).toFixed(2):'-'
    result.push(row as SaaRowData)
  }
  return result
}

</script>
<style scoped lang="scss">
.gap{
  gap: 10px;
}
</style>
