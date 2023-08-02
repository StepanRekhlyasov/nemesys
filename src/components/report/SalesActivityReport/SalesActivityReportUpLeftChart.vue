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
import {
  chartOptions,
  chartOptionsR,
  columns,
  columnsR,
  dataNames,
  dataNamesR,
  chartNames,
  chartNamesR,
  itemList,
} from './salesActivity.const';
import { calculateCVR, getListFromObject } from '../reportUtil';
import { SeriesType, graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
import { useGetReport } from 'src/stores/getReport';
import { listToFixed } from 'src/shared/utils/KPI.utils';
const apexchart = VueApexCharts;
const { getReport } = useGetReport();
const { t } = useI18n({ useScope: 'global' });
const dataToshow: Ref<(number | string)[][]> = ref([]);
const dataToshowR: Ref<(number | string)[][]> = ref([]);

const series: ComputedRef<SeriesType[]> = computed(() => {
  return dataToshow.value.map((rowData, index) => {
    return {
      name: t(dataNames[index]),
      data: rowData,
      type: chartNames[index],
    };
  });
});
const seriesR: ComputedRef<SeriesType[]> = computed(() => {
  return dataToshowR.value.map((rowData, index) => {
    return {
      name: t(dataNamesR[index]),
      data: rowData,
      type: chartNamesR[index],
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
  return dataToshow.value.map((rowData, index) => {
    return {
      name: t(dataNames[index]),
      fix: rowData[0],
      inspection: rowData[1],
      offer: rowData[2],
      admission: rowData[3],
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
    BO: number | string;
  }[]
> = computed(() => {
  return dataToshowR.value.map((rowData, index) => {
    return {
      name: t(dataNamesR[index]),
      fix: rowData[0],
      inspection: rowData[1],
      offer: rowData[2],
      admission: rowData[3],
      BO: rowData[4],
    };
  });
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  graph_type: graphType;
}>();

const showSalesActivityReport = async (
  dateRange: { from: string; to: string },
  organizationId: string
) => {
  const dataAverage = getListFromObject(
    await getReport({
      dateRange: dateRange,
      graphType: props.graph_type,
      queryNames: itemList,
      organizationId: organizationId,
      isAverage: true,
    }),
    itemList.map((item) => {
      return item.queryName;
    })
  ) as number[];

  const dataTotal = getListFromObject(
    await getReport({
      dateRange: dateRange,
      graphType: props.graph_type,
      queryNames: itemList.slice(0, -1),
      organizationId: organizationId,
      isAverage: false,
    }),
    itemList.map((item) => {
      return item.queryName;
    })
  ) as number[];

  const dataAverageAll = getListFromObject(
    await getReport({
      dateRange: dateRange,
      graphType: props.graph_type,
      queryNames: itemList,
      isAverage: true,
    }),
    itemList.map((item) => {
      return item.queryName;
    })
  ) as number[];

  const dataCvr = calculateCVR(dataTotal);
  const dataCvrAll = calculateCVR(dataAverageAll);
  dataToshow.value = [dataTotal, dataCvr, dataCvrAll.slice(0, -1)];
  dataToshowR.value = [
    listToFixed(dataAverage, 1),
    listToFixed(dataAverageAll, 1),
  ];
};

watch(
  () => [props.dateRangeProps, props.graph_type],
  async () => {
    if (!props.dateRangeProps) return;
    await showSalesActivityReport(props.dateRangeProps, props.organization_id);
  }
);
onMounted(async () => {
  if (!props.dateRangeProps) return;
  await showSalesActivityReport(props.dateRangeProps, props.organization_id);
});
</script>
