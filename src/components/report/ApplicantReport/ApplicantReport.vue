<template>
  <div class="row">
    <div class="col">
      <ApplicantReportLeftChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :graph_type="graph_type"
      ></ApplicantReportLeftChart>
    </div>
    <div class="col">
      <ApplicantReportRightChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :graph_type="graph_type"
      ></ApplicantReportRightChart>
    </div>
  </div>

</template>

<script setup lang="ts">
import ApplicantReportLeftChart from './ApplicantReportLeftChart.vue';
import ApplicantReportRightChart from './ApplicantReportRightChart.vue';

import { graphType } from '../Models';

defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  graph_type: graphType;
}>();
</script>
