<template>
  <q-page>
    <q-card-section class="bg-grey-3 flex items-center" style="gap:20px">
      <div class="text-h6 text-primary">{{ $t("menu.dashboard") }} </div>
      <label>{{ $t("dashboard.showBranch") }}</label>
      <MySelect 
        @update="onBranchChange()" 
        v-model="applicantStore.state.applicantProgressFilter['branchIncharge']"
        :optionToFetch="'branchIncharge'"
        :width="'175px'"
      />
    </q-card-section>
    <q-separator color="white" size="2px" />
      <DashboardNotificationTable :rows="notificationRows" />
    <q-separator color="white" size="2px" />
      <DashboardProgressBlocks :updateOnMounted="updateOnMounted" />
    <q-separator color="white" size="2px" />
  </q-page>
</template>
<script setup lang="ts">
import { useApplicant } from 'src/stores/applicant';
import MySelect from 'src/components/inputs/MySelect.vue';
import DashboardNotificationTable from './components/DashboardNotificationTable.vue';
import { onBeforeMount, ref } from 'vue';
import DashboardProgressBlocks from './components/DashboardProgressBlocks.vue';
import { COLUMN_STATUSES, limitQuery } from '../ApplicantProgress/const/applicantColumns';
import { storeToRefs } from 'pinia';

const applicantStore = useApplicant()
const { state } = storeToRefs(applicantStore)
const { attendeeUserInCharge, prefecture, currentStatusMonth } = state.value.applicantProgressFilter
const updateOnMounted = ref(false)
const notificationRows = ref([
  {
    date: '2023/1/1',
    category: 'test 2',
    subject: 'test',
    content: 'test',
  },
  {
    date: '2023/1/3',
    category: 'test',
    subject: 'test',
    content: 'test',
  },
  {
    date: '2023/1/2',
    category: 'test',
    subject: 'test',
    content: 'test',
  },
])
const onBranchChange = async () => {
  COLUMN_STATUSES.map(async (status)=>{
    applicantStore.getApplicantsByStatus(status, applicantStore.state.applicantProgressFilter, limitQuery)
  })
}
onBeforeMount(()=>{
  if(
    attendeeUserInCharge ||
    prefecture ||
    currentStatusMonth ||
    applicantStore.state.needsApplicantUpdateOnMounted
  ) {
    state.value.applicantProgressFilter.attendeeUserInCharge = ''
    state.value.applicantProgressFilter.prefecture = ''
    state.value.applicantProgressFilter.currentStatusMonth= ''
    applicantStore.state.needsApplicantUpdateOnMounted = false
    updateOnMounted.value = true
  }
})
</script>
<style lang="scss">
.dashboardTable{
  &.q-table__card {
    box-shadow: none;
  }
  thead {
      border: none;
    tr{
      background-color: #eeeeee;
      th{
        text-transform: capitalize;
      }
    }
  }
}
</style>