<template>
  <q-table 
    :rows="rows" 
    :separator="'cell'" 
    flat bordered hide-pagination
    class="applicantTable" 
    :loading="loading"
    :pagination="{rowsPerPage:0}"
    :columns="columns"
    row-key="fix"
    >
      <template v-slot:body-cell-staffRank="props">
        <q-td>{{ RankCount.getRank(props.row.staffRank) }}</q-td>
      </template>
      <template v-slot:body-cell-occupation="props">
        <q-td>{{ props.row.occupation && $t('applicant.add.' + props.row.occupation) }}</q-td>
      </template>
      <template v-slot:body-cell-classification="props">
        <q-td>{{ props.row.classification && $t('applicant.list.info.classification.' + props.row.classification) }}</q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td 
            @click="()=>{
              emit('openDrawer', props.row)
            }" 
            class="applicant-clickable"
        >{{ props.row.name }}</q-td>
      </template>
      <template v-slot:header-cell-applicationDate>
        <q-th v-if="mode==='applicant'">{{ $t('applicant.progress.table.applicationDate') }}</q-th>
        <q-th v-if="mode==='fix'">{{ $t('client.backOrder.list.id') }}</q-th>
      </template>
      <template v-slot:body-cell-applicationDate="props">
        <q-td v-if="mode==='applicant'">{{ myDateFormat(props.row.applicationDate, 'MM/DD') }}</q-td>
        <q-td v-if="mode==='fix'">{{ boIdList[props.row.fix.backOrder]?.boId }}</q-td>
      </template>
      <template v-slot:body-cell-boId="props">
        <q-td>{{ boIdList[props.row.fix.backOrder]?.boId }}</q-td>
      </template>
      <template v-slot:body-cell-chargeOfAdmission="props">
        <q-td>{{ organizationStore.state.currentOrganizationUsers?.[props.row?.fix?.chargeOfAdmission]?.displayName }}</q-td>
      </template>
      <template v-slot:body-cell-admissionDate="props">
        <q-td>{{ myDateFormat(props.row.fix?.admissionDate, 'YYYY/MM/DD') }}</q-td>
      </template>
      <template v-slot:body-cell-endDate="props">
        <q-td>{{ myDateFormat(props.row.fix?.endDate, 'YYYY/MM/DD') }}</q-td>
      </template>
      <template v-slot:body-cell-remainingDays="props">
        <q-td>{{ remainingDays(new Date(), new Date(myDateFormat(props.row.fix?.endDate, 'YYYY/MM/DD'))) }}</q-td>
      </template>
      <template v-slot:body-cell-invoice="props">
        <q-td>{{ boIdList[props.row.fix.backOrder]?.invoice }}</q-td>
      </template>
      <template v-slot:body-cell-payment="props">
        <q-td>{{ boIdList[props.row.fix.backOrder]?.payment }}</q-td>
      </template>
      <template v-slot:body-cell-memo="props">
        <q-td>{{ chooseMemo(props.row.fix) }}</q-td>
      </template>
      <template v-slot:body-cell-qualification="props">
        <q-td><p v-for="q, index in props.row.qualification" :key="index" style="margin:0;">{{ $t('backOrder.qualification.'+q) }}</p></q-td>
      </template>
      <template v-slot:body-cell-timeToWork="props">
        <q-td>{{ myDateFormat(props.row.timeToWork, 'YYYY/MM/DD') }}</q-td>
      </template>
      <template v-slot:body-cell-workingHoursEarly="props">
        <q-td>{{ props.row.workingHoursEarly?'●':'-' }}</q-td>
      </template>
      <template v-slot:body-cell-workingHoursDay="props">
        <q-td>{{ props.row.workingHoursDay?'●':'-' }}</q-td>
      </template>
      <template v-slot:body-cell-workingHoursLate="props">
        <q-td>{{ props.row.workingHoursLate?'●':'-' }}</q-td>
      </template>
      <template v-slot:body-cell-workingHoursNight="props">
        <q-td>{{ props.row.workingHoursNight?'●':'-' }}</q-td>
      </template>
      <template v-slot:body-cell-shiftRemarks="props">
        <q-td>{{ props.row.shiftRemarks }}</q-td>
      </template>
      <template v-slot:body-cell-monday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='monday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-tuesday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='tuesday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-wednesday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='wednesday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-thursday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='thursday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-friday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='friday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-saturday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='saturday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-sunday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='sunday')?'●':'-'}}</q-td>
      </template>
      <template v-slot:body-cell-holiday="props">
        <q-td>{{ props.row.daysPerWeek?.find?.((row : string)=>row==='holiday')?'●':'-'}}</q-td>
      </template>
  </q-table>
</template> 
<script setup lang="ts">
import { Applicant, ApplicantFix, ApplicantStatus, ApplicantWithFix, BackOrderModel } from 'src/shared/model';
import { myDateFormat, remainingDays } from 'src/shared/utils/utils';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { QueryOrderByConstraint } from 'firebase/firestore';
import { applicantFixesTableColumns, updateFixesTableColumns } from 'src/pages/user/ApplicantProgress/const/applicantColumns'
import { computed, ref, watch } from 'vue';
import { useBackOrder } from 'src/stores/backOrder';
import { useOrganization } from 'src/stores/organization';

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant)
  (e: 'sortQuery', orderBy: QueryOrderByConstraint[])
}>()
const props = defineProps<{ 
  rows: ApplicantWithFix[],
  loading: boolean,
  status: string
}>()
const organizationStore = useOrganization()
const boIdList = ref<{[id: string] : BackOrderModel}>({})
const backOrderStore = useBackOrder()
const mode = computed(()=>{
  if([ApplicantStatus.WAIT_CONTACT, ApplicantStatus.WAIT_ATTEND, ApplicantStatus.WAIT_FIX].includes(props.status as ApplicantStatus)){
    return 'applicant'
  } else if (props.status === ApplicantStatus.WAIT_TERMINATION){
    return 'update'
  } else {
    return 'fix'
  }
})
function chooseMemo(fix : ApplicantFix){
  return fix.offerMemo || fix.inspectionMemo || fix.admissionMemo || fix.fixMemo || '-'
}
const columns = mode.value==='update'?updateFixesTableColumns:applicantFixesTableColumns
watch(()=>props.rows, ()=>{
  props.rows.forEach(async (row)=>{
    if(row.fix?.backOrder){
      if(boIdList.value[row.fix.backOrder]){
        return;
      } else {
        boIdList.value[row.fix.backOrder] = await backOrderStore.getBoById(row.fix.backOrder)
      }
    }
  })
})

</script>
<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
.applicantTable{
  overflow:hidden;
  table{
    thead{
      background-color: $main-primary;
    }
    th{
      font-size: 15px;
      background-color: $main-primary;
      color: #fff;
      border-color: #fff;
      padding: 0 3px;
      white-space: break-spaces;
      position: relative;
      min-width: 35px;
      i{
        position: absolute;
        top: 3px;
        right: 3px;
      }
    }
    td{
      text-align: center;
    }
  }
  .applicant-clickable{
    color: $primary;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
}
.clickable {
  cursor: pointer;
  span {
    transform: rotate(-90deg);
    display: block;
    &.asc {
      transform: rotate(-180deg);
    }
    &.desc {
      transform: rotate(0);
    }
  }
}
</style>