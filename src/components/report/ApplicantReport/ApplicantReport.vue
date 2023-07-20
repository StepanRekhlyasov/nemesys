<template>
  <div class="row">
    <div class="col">
      <ApplicantReportLeftChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :graph_type="graph_type"
        :branch_user_list="branch_user_list"
      ></ApplicantReportLeftChart>
    </div>
    <div class="col">
      <ApplicantReportRightChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
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
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
</script>
