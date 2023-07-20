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
  <div class="row">
    <div class="col">
      <ApplicantReportLeftDownChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></ApplicantReportLeftDownChart>
    </div>
    <div class="col">
      <ApplicantReportRightDownChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></ApplicantReportRightDownChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import SalesActivityReportUpLeftChart from './SalesActivityReportUpLeftChart.vue';
import ApplicantReportRightDownChart from './ApplicantReportRightDownChart.vue';
import ApplicantReportLeftDownChart from './ApplicantReportLeftDownChart.vue';
import { graphType } from '../Models';

defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
</script>
