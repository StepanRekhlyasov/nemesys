<template>
  <div class="row">
    <div class="col">
      <SalesActivityIndividualReportLeftChart :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :branch_user_list="branch_user_list"></SalesActivityIndividualReportLeftChart>
    </div>
    <div class="col">
      <SalesActivityIndividualReportRightChart :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :branch_user_list="branch_user_list"></SalesActivityIndividualReportRightChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import SalesActivityIndividualReportLeftChart from './SalesActivityIndividualReportLeftChart.vue'
import SalesActivityIndividualReportRightChart from './SalesActivityIndividualReportRightChart.vue'


defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string };
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
}>();
</script>
