<template>
  <div class="row">
    <div class="col">
      <RecruitmentEffecitvenessReportLeftUpChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></RecruitmentEffecitvenessReportLeftUpChart>
    </div>
    <div class="col">
      <RecruitmentEffecitvenessReportRightUpChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></RecruitmentEffecitvenessReportRightUpChart>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <RecruitmentEffecitvenessReportLeftDownChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></RecruitmentEffecitvenessReportLeftDownChart>
    </div>
    <div class="col">
      <RecruitmentEffecitvenessReportRightDownChart
        :organization_id="organization_id"
        :dateRangeProps="dateRangeProps"
        :branch_id="branch_id"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></RecruitmentEffecitvenessReportRightDownChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecruitmentEffecitvenessReportRightDownChart from './RecruitmentEffecitvenessReportRightDownChart.vue';
import RecruitmentEffecitvenessReportRightUpChart from './RecruitmentEffecitvenessReportRightUpChart.vue';
import RecruitmentEffecitvenessReportLeftUpChart from './RecruitmentEffecitvenessReportLeftUpChart.vue';
import RecruitmentEffecitvenessReportLeftDownChart from './RecruitmentEffecitvenessReportLeftDownChart.vue';
import { graphType } from '../Models';

defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
</script>
