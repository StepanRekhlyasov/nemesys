<template>
  <div class="row">
    <SalesActivityReportUpLeftChart
      :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :branch_user_list="branch_user_list"
      :graph_type="graph_type"
    ></SalesActivityReportUpLeftChart>
  </div>
  <div class="col">
    <!-- <SalesActivityReportRightChart :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :branch_user_list="branch_user_list"></SalesActivityReportRightChart> -->
  </div>
</template>

<script setup lang="ts">
import SalesActivityReportUpLeftChart from './SalesActivityReportUpLeftChart.vue';
// import SalesActivityIndividualReportRightChart from './SalesActivityIndividualReportRightChart.vue'

defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string }|undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: string;
}>();
</script>
