<template>
  <apexchart :options="chartOptionsLeadtime" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsLeadtime" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, ComputedRef, computed } from 'vue';
import { listToFixed } from 'src/shared/utils/KPI.utils';
import { chartOptionsLeadtime, columnsLeadtime, nameList } from './const';
import { useGetReport } from 'src/stores/getReport';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
const { calcLeadtime } = useGetReport();
const apexchart = VueApexCharts;
const dataToshow: Ref<(number | string)[][]> = ref([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToshow.value.map((rowData, index) => {
    return {
      name: nameList[index],
      data: rowData,
      type: 'bar',
    };
  });
  return seriesList;
});

const rows: ComputedRef<
  {
    name: string;
    invitations: string | number;
    fix: string | number;
    inspection: string | number;
    offer: string | number;
    admission: string | number;
  }[]
> = computed(() => {
  const rowsList = dataToshow.value.map((rowData, index) => {
    return {
      name: nameList[index],
      invitations: rowData[0],
      fix: rowData[1],
      inspection: rowData[2],
      offer: rowData[3],
      admission: rowData[4],
    };
  });
  return rowsList;
});
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showLeadtime = async (
  dateRange: { from: string; to: string } | undefined,
  organizationId: string
) => {
  if (!dateRange) return;
  const dataAverage = listToFixed(
    await calcLeadtime(dateRange, organizationId)
  );
  const dataAverageAll = listToFixed(await calcLeadtime(dateRange));
  dataToshow.value = [dataAverage, dataAverageAll];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    await showLeadtime(props.dateRangeProps, props.organization_id);
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  await showLeadtime(props.dateRangeProps, props.organization_id);
});
</script>
