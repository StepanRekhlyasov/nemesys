<template>
  <div class="dashboardStatusBlock" :style="'border-bottom: 3px solid '+borderColor[status]">
    <q-btn unelevated square :color="'primary'" :label="statusTitles[status]" :disabled="applicantStore.state.columnsLoading[status]" >
      <DashboardChooseBanner
        :link="'/applicant-progress/'"
        :offset="[0,-200]"
        @openPreview="showPreview=true"
      />
    </q-btn>
      <q-card-section class="number">
        <q-inner-loading showing color="primary" v-if="applicantStore.state.columnsLoading[status]"/>
        <template v-else>
          <q-btn unelevated square :label="applicantStore.state.applicantRowsCount[status] || 0" :disabled="applicantStore.state.columnsLoading[status]" :size="'25px'">
            <DashboardChooseBanner
              :link="'/applicant-progress/'"
              :offset="[0,-220]"
              @openPreview="showPreview=true"
            />
          </q-btn>
        </template>
      </q-card-section>
      <DashboardProgressPreviewTable
        v-model="showPreview"
        :status="status"
      />
    </div>
</template>
<script setup lang="ts">
import { useApplicant } from 'src/stores/applicant';
import { statusTitles, borderColor } from '../const/dashboard.const'
import { onMounted, ref } from 'vue';
import DashboardChooseBanner from './DashboardChooseBanner.vue';
import DashboardProgressPreviewTable from './DashboardProgressPreviewTable.vue';
import { limitQuery } from '../../ApplicantProgress/const/applicantColumns';

const applicantStore = useApplicant()
const props = defineProps<{
  status: string,
  updateOnMounted: boolean
}>()
const showPreview = ref(false)

onMounted(async ()=>{
  if(props.updateOnMounted || typeof applicantStore.state.applicantRowsCount[props.status] === 'undefined') {
    await applicantStore.getApplicantsByStatus(props.status, applicantStore.state.applicantProgressFilter, limitQuery)
  } 
})
</script>
<style lang="scss" scoped>
.dashboardStatusBlock{
  width: 120px;
  height: 120px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  button{
    white-space: nowrap;
  }
  .title{
    background-color: $primary;
    color: #fff;
    text-align: center;
    padding: 9px 0;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  .number{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0;
    &:hover{
      text-decoration: underline;
    }
  }
}
.disable-link{
  pointer-events: none;
}
</style>