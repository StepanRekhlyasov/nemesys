<template> 
  <q-dialog>
      <q-card style="width: 100%; max-width: 900px;border-radius: 11px;">
        <q-scroll-area style="padding:0;height:275px" @scroll="(info)=>onScroll(info)">
          <q-table 
            :columns="columns" 
            :rows="tableRows"
            :rows-per-page-options="[0]"
            :title="'●'+statusTitles[status]+$t('dashboard.waitList')"
            hide-pagination
            :separator="'cell'"
            class="dashboardPreviewTable"
          >
          <template v-slot:header-cell-applicationDate>
            <q-th v-if="mode==='applicant'">{{ $t('applicant.progress.table.applicationDate') }}</q-th>
            <q-th v-if="mode==='fix'">{{ $t('client.backOrder.list.id') }}</q-th>
          </template>
          <template v-slot:body-cell-occupation="props">
              <q-td>{{ $t('applicant.add.'+props.row.occupation) }}</q-td>
          </template>
          <template v-slot:body-cell-applicationDate="props">
              <q-td :props="props" v-if="mode==='applicant'">{{ myDateFormat(props.row.applicationDate, 'YYYY/MM/DD') }}</q-td>
              <q-td :props="props" v-else>{{ boIdList[props.row.backOrder]?.boId }}</q-td>
          </template>
          </q-table>
        </q-scroll-area>
        <q-linear-progress query v-if="applicantStore.state.columnsLoading[status]" color="primary"/>
      </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { useApplicant } from 'src/stores/applicant';
import { dashboardPreviewTableColumns as columns, statusTitles} from '../const/dashboard.const'
import { limitQuery } from '../../ApplicantProgress/const/applicantColumns';
import { QScrollArea } from 'quasar';
import { myDateFormat } from 'src/shared/utils/utils';
import { ApplicantFix, ApplicantStatus, BackOrderModel } from 'src/shared/model';
import { computed, watch, ref } from 'vue';
import { useBackOrder } from 'src/stores/backOrder';
import { ApplicantOrFixColumn } from 'src/shared/constants/Applicant.const';

const onScroll = async (info : {
    ref: QScrollArea;
    verticalPosition: number;
    verticalPercentage: number;
    verticalSize: number;
    verticalContainerSize: number;
    horizontalPosition: number;
    horizontalPercentage: number;
    horizontalSize: number;
    horizontalContainerSize: number;
}) => {
  if(info.verticalPercentage === 1 || info.verticalContainerSize===info.verticalSize){
    if(applicantStore.state.continueFromDoc[props.status]){
      await applicantStore.getApplicantsByColumns(props.status, applicantStore.state.applicantProgressFilter, limitQuery, true)
    }
    if(applicantStore.state.applicantsByColumn[props.status].length < 4 && applicantStore.state.continueFromDoc[props.status]){
      onScroll(info)
    }
  }
}
const applicantStore = useApplicant()
const backOrderStore = useBackOrder()
const props = defineProps<{
  status: ApplicantStatus
}>()
const boIdList = ref<{[id: string] : BackOrderModel}>({})
const mode = computed(()=>{
  if(ApplicantOrFixColumn[props.status]==='applicants'){
    return 'applicant'
  } else if (props.status === ApplicantStatus.WAIT_TERMINATION){
    return 'update'
  }
  return 'fix'
})
const tableRows = computed(()=>{
  if(mode.value !== 'applicant') {
    return applicantStore.state.applicantsByColumn[props.status].map((row : ApplicantFix)=>{
      return {...applicantStore.state.applicants[row.applicant_id], ...row}
    })
  }
  return applicantStore.state.applicantsByColumn[props.status]
})

watch(()=>tableRows.value, ()=>{
  if(mode.value !== 'applicant') {
    tableRows.value.forEach(async (row : ApplicantFix) => {
      if (row.backOrder) {
        if (!boIdList.value[row.backOrder]) {
          boIdList.value[row.backOrder] = await backOrderStore.getBoById(row.backOrder)
        }
      }
    })
  }
}, {immediate: true})

</script>
<style lang="scss">
@import "src/css/imports/colors";
.dashboardPreviewTable{
  th{
    background-color: $primary;
    color: #fff;
    border-color: #fff;
  }
  .q-table__title{
    color: $primary;
    font-weight: 700;
    font-size: 20px;
  }
}
</style>