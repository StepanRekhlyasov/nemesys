<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, columns, item_list ,chartType,row_names} from './const';
import { Totalizer } from 'src/stores/totalization';
import { calculateCVR } from 'src/components/report/report_util';
import {graphType} from '../Models';

const { t } = useI18n({ useScope: 'global' });

const dataToshow: Ref<(number | string)[][]> = ref([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshow.value.map((row_data, index) => {
    return {
      name: t(row_names[index]),
      data: row_data,
      type: chartType[index],
    };
  });
  return series_;
});
const rows: ComputedRef<
  {
    name: string;
    applicants: number | string;
    valid_applicants: number | string;
    contact_applicants: number | string;
    attraction_applicants: number | string;
    attend_applicants: number | string;
    fix: number | string;
    inspection: number | string;
    offer: number | string;
    admission: number | string;
  }[]
> = computed(() => {
  const rows_ = dataToshow.value.map((row_data, index) => {
    return {
      name: t(row_names[index]),
      applicants: row_data[0],
      valid_applicants: row_data[1],
      contact_applicants: row_data[2],
      attraction_applicants: row_data[3],
      attend_applicants: row_data[4],
      fix: row_data[5],
      inspection: row_data[6],
      offer: row_data[7],
      admission: row_data[8],
    };
  });
  return rows_;
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showData = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'applicants', bo: 'bo' };
  }
  const data_average = await Totalizer(
    dateRange,
    item_list,
    false,
    organization_id,
    target,
    true
  );
  const data_cvr = calculateCVR(data_average);
  const data_average_all = await Totalizer(
    dateRange,
    item_list,
    false,
    undefined,
    target,
    true
  );
  const data_cvr_all = calculateCVR(data_average_all);
  dataToshow.value = [data_average, data_cvr, data_cvr_all];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (props.dateRangeProps == undefined) return;
    await showData(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

onMounted(async () => {
  if (props.dateRangeProps == undefined) return;
  await showData(
    props.dateRangeProps,
    props.organization_id
  );
});
</script>

<script lang="ts">
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'ChartExample',
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
