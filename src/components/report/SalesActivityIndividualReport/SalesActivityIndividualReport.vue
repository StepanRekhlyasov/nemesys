<template>
  <div class="row">
    <div class="col">
      <SalesActivityIndividualReportLeftChart :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :graph_type="graph_type"
      ></SalesActivityIndividualReportLeftChart>
    </div>
    <div class="col">
      <SalesActivityIndividualReportRightChart :organization_id="organization_id"
      :dateRangeProps="dateRangeProps"
      :branch_id="branch_id"
      :graph_type="graph_type"
      ></SalesActivityIndividualReportRightChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import SalesActivityIndividualReportLeftChart from './SalesActivityIndividualReportLeftChart.vue'
import SalesActivityIndividualReportRightChart from './SalesActivityIndividualReportRightChart.vue'
import {graphType} from '../Models';


defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string }|undefined;
  organization_id: string;
  graph_type: graphType;
}>();
</script>
