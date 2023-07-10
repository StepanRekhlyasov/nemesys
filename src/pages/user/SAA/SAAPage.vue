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
import { useUserStore } from 'src/stores/user';
import { fixWithApplicant } from './model/saa.model'

interface RowData {
  name: string,
  chargeOfFix: number,
  chargeOfInspection: number,
  chargeOfOffer: number,
  chargeOfAdmission: number,
  chargeOfInspectionRate: string,
  chargeOfOfferRate: string,
  chargeOfAdmissionRate: string,
  personOK: number,
  personNG: number,
  companyOK: number,
  companyNG: number,
  personOKRate: string,
  companyOKRate: string,
  numberOfFax:number,
  numberOfCalls:number,
  introduction:number,
  dispatch:number,
  BO_NC:number,
  BO_N:number,
  TTP:number
}

const dateRange = ref<
  string | {
      from: string;
      to: string;
  } | null>(null)
const method = ref('user')
const loading = ref(false)
const rowData = ref<RowData[]>([])
const userStore = useUserStore()
const organizationStore = useOrganization()
const fixList = ref<fixWithApplicant[]>([])
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const saaTableRef = ref<InstanceType<typeof SAATable> | null>(null);

async function getData(){
  fixList.value = await userStore.getSAAFixList(organizationStore.state.currentOrganizationUsers, dateRange.value)
  reMapData()
}
async function reMapData(){
  if(method.value === 'user'){
    const faxData:string[] = await userStore.getSAAFaxList()
    const callData:string[] = await userStore.getSAACallList()
    const BOReferralData:string[] = await userStore.getSAABOReferralList()
    const BODispatchData:string[] = await userStore.getSAABODispatchList()
    const BONCData:string[] = await userStore.getSAABONCList()
    const BONData:string[] = await userStore.getSAABONList()
    const BOTTData:string[] = await userStore.getSAABOTTList()
    rowData.value = mapFixDataForUserMode(fixList.value,faxData,callData,BOReferralData,BODispatchData,BONCData,BONData,BOTTData)
  } else {
    rowData.value = mapFixDataForBranchMode(fixList.value)
  }
}

function downloadCSV(){
  saaTableRef.value?.exportTable()
}
onMounted(()=>{
  loading.value = true
  getData()
  loading.value = false
})

watch(()=>organizationStore.state.userAndBranchesUpdated, async ()=>{
  if(organizationStore.state.userAndBranchesUpdated){
    loading.value = false
  } else {
    loading.value = true
    await getData()
  }
})

function mapFixDataForUserMode(data : fixWithApplicant[],faxData:string[],callData:string[],boRData:string[],boDData:string[],boNCData:string[],boNData:string[],boTTData:string[]) {
  const result : RowData[] = []
  for(const [key, value] of Object.entries(organizationStore.state.currentOrganizationUsers)){
    const row : Partial<RowData> = {}
    row.name = value.displayName? value.displayName : value.name
    const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission']
    statusCountFields.forEach((field)=>{
      row[field] = data.reduce((accumulator, currentValue)=> currentValue[field] === key ? accumulator + 1 : accumulator, 0)
    })
    statusCountFields.forEach((field)=>{
      if(field!=='chargeOfFix'){
        if(row.chargeOfFix){
          row[field + 'Rate'] = Math.floor((row[field] / row.chargeOfFix) * 100) + '%'
        } else {
          row[field + 'Rate'] = '-'
        }
      }
    })
    row.numberOfCalls = callData.filter(callId => callId === key).length
    row.numberOfFax = faxData.filter(faxId => faxId === key).length;
    row.BO_NC = boNCData.filter(boId => boId === key).length;
    row.BO_N = boNData.filter(boId => boId === key).length;
    row.dispatch = boDData.filter(boDId => boDId === key).length;
    row.introduction = boRData.filter(boRId => boRId === key).length;
    row.TTP = boTTData.filter(boTTId => boTTId === key).length;
    row.personOK = data.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.personalStatus === true ? accumulator + 1 : accumulator, 0)
    row.personNG = data.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.personalStatus === false ? accumulator + 1 : accumulator, 0)
    row.companyOK = data.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.corporationStatus === true ? accumulator + 1 : accumulator, 0)
    row.companyNG = data.reduce((accumulator, currentValue) => currentValue.chargeOfInspection === key && currentValue.corporationStatus === false ? accumulator + 1 : accumulator, 0)
    row.personOKRate = (row.personOK + row.personNG)?(row.personOK / (row.personOK + row.personNG)).toFixed(2):'-'
    row.companyOKRate = (row.companyOK + row.companyNG)?(row.companyOK / (row.companyOK + row.companyNG)).toFixed(2):'-'
    result.push(row as RowData)
  }
  return result
}

function mapFixDataForBranchMode(data : fixWithApplicant[]){
  const result : RowData[] = []
  for(const [key, value] of Object.entries(organizationStore.state.currentOrganizationBranches)){
    const row : Partial<RowData> = {}
    row.name = value.name
    const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission']
    statusCountFields.forEach((field)=>{
      row[field] = data.reduce((accumulator, currentValue)=> currentValue[field] && currentValue.applicant?.branchIncharge === key ? accumulator + 1 : accumulator, 0)
    })
    statusCountFields.forEach((field)=>{
      if(field!=='chargeOfFix'){
        if(row.chargeOfFix){
          row[field + 'Rate'] = Math.floor((row[field] / row.chargeOfFix) * 100) + '%'
        } else {
          row[field + 'Rate'] = '-'
        }
      }
    })
    row.personOK = data.reduce((accumulator, currentValue) => currentValue.applicant?.branchIncharge === key && currentValue.personalStatus === true ? accumulator + 1 : accumulator, 0)
    row.personNG = data.reduce((accumulator, currentValue) => currentValue.applicant?.branchIncharge === key && currentValue.personalStatus === false ? accumulator + 1 : accumulator, 0)
    row.companyOK = data.reduce((accumulator, currentValue) => currentValue.applicant?.branchIncharge === key && currentValue.corporationStatus === true ? accumulator + 1 : accumulator, 0)
    row.companyNG = data.reduce((accumulator, currentValue) => currentValue.applicant?.branchIncharge === key && currentValue.corporationStatus === false ? accumulator + 1 : accumulator, 0)
    row.personOKRate = (row.personOK + row.personNG)?(row.personOK / (row.personOK + row.personNG)).toFixed(2):'-'
    row.companyOKRate = (row.companyOK + row.companyNG)?(row.companyOK / (row.companyOK + row.companyNG)).toFixed(2):'-'
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
