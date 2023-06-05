<template> 
  <q-dialog>
      <q-card style="width: 100%; max-width: 900px;border-radius: 11px;">
        <q-scroll-area style="padding:0;height:275px" @scroll="(info)=>onScroll(info)">
          <q-table 
            :columns="columns" 
            :rows="applicantStore.state.applicantsByColumn[status]"
            :rows-per-page-options="[0]"
            :title="'●'+statusTitles[status]+$t('dashboard.waitList')"
            hide-pagination
            :separator="'cell'"
            class="dashboardPreviewTable"
          >
          <template v-slot:body-cell-applicationDate="props">
            <q-td :props="props">{{ timestampToDateFormat(props.row.applicationDate, 'YYYY/MM/DD HH:SS') }}</q-td>
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
import { timestampToDateFormat } from 'src/shared/utils/utils';

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
      await applicantStore.getApplicantsByStatus(props.status, applicantStore.state.applicantProgressFilter, limitQuery, true)
    }
    if(applicantStore.state.applicantsByColumn[props.status].length < 4 && applicantStore.state.continueFromDoc[props.status]){
      onScroll(info)
    }
  }
}
const applicantStore = useApplicant()
const props = defineProps<{
  status: string
}>()
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