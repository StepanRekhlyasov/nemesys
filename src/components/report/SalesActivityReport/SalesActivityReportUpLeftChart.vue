<template>
  <div class="col">
    <apexchart :options="chartOptions" :series="series"></apexchart>
    <q-table title="" :rows="rows" :columns="columns" row-key="name" />
  </div>
  <div class="col">
    <apexchart :options="chartOptionsR" :series="seriesR"></apexchart>
    <q-table title="" :rows="rowsR" :columns="columnsR" row-key="name" />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, ComputedRef, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, chartOptionsR, columns, columnsR ,data_names,data_namesR,chart_names ,chart_namesR } from './const';
import { Totalizer } from 'src/stores/totalization';
import { calculateCVR } from '../report_util';
import {graphType} from '../Models';

const { t } = useI18n({ useScope: 'global' });
const dataToshow: Ref<(number | string)[][]> = ref([]);
const dataToshowR: Ref<(number | string)[][]> = ref([]);
const item_list = ['fix', 'inspection', 'offer', 'admission'];

const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  return dataToshow.value.slice(0,-1).map((row_data, index) => {
    return {
      name: t(data_names[index]),
      data: row_data,
      type: chart_names[index],
    };
  });
});
const seriesR: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  return dataToshowR.value.map((row_data, index) => {
    return {
      name: t(data_namesR[index]),
      data: row_data,
      type: chart_namesR[index],
    };
  });
});
const rows: ComputedRef<
  {
    name: string;
    fix: number | string;
    inspection: number | string;
    offer: number | string;
    admission: number | string;
  }[]
> = computed(() => {
  return dataToshow.value.map((row_data, index) => {
    return {
      name: t(data_names[index]),
      fix: row_data[0],
      inspection: row_data[1],
      offer: row_data[2],
      admission: row_data[3],
    };
  });
});

const rowsR: ComputedRef<
  {
    name: string;
    fix: number | string;
    inspection: number | string;
    offer: number | string;
    admission: number | string;
  }[]
> = computed(() => {
  return dataToshowR.value.map((row_data, index) => {
    return {
      name: t(data_namesR[index]),
      fix: row_data[0],
      inspection: row_data[1],
      offer: row_data[2],
      admission: row_data[3],
    BO_total: row_data[4]

    };
  });
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();


const showSalesActivityReport = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'fix', bo: 'bo' };
  }
  const data_average = await Totalizer(
    dateRange,
    item_list,
    false,
    organization_id,
    target
  );
  if (data_average == undefined) return;
  const data_average_R = [...data_average];
  const data_average_all = await Totalizer(
    dateRange,
    item_list,
    false,
    undefined,
    target
  );
  if (data_average_all == undefined) return;
  const data_average_all_R = [...data_average];
  const BO = await Totalizer(dateRange, ['bo'], false, organization_id, target);
  const BO_all = await Totalizer(dateRange, ['bo'], false, undefined, target);
  if (BO == undefined) return;
  data_average_R.push(BO[0]);
  if (BO_all == undefined) return;
  data_average_all_R.push(BO_all[0]);
  const data_cvr = calculateCVR(data_average);
  const data_cvr_all = calculateCVR(data_average_R);
  dataToshow.value = [data_average, data_cvr, data_cvr_all];
  dataToshowR.value = [data_average_R, data_average_all_R];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (props.dateRangeProps == undefined) return;
    await showSalesActivityReport(props.dateRangeProps, props.organization_id);
  }
);
onMounted(async () => {
  if (props.dateRangeProps == undefined) return;
  await showSalesActivityReport(props.dateRangeProps, props.organization_id);
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
