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
import { chartOptions, chartOptionsR, columns, columnsR ,dataNames,dataNamesR,chartNames ,chartNamesR } from './const';
import { useTotalizer } from 'src/stores/totalization';
import { calculateCVR } from '../reportUtil';
import {graphType} from '../Models';
import VueApexCharts from 'vue3-apexcharts';

const apexchart=VueApexCharts
const Totalizer = useTotalizer();
const { t } = useI18n({ useScope: 'global' });
const dataToshow: Ref<(number | string)[][]> = ref([]);
const dataToshowR: Ref<(number | string)[][]> = ref([]);
const itemList = ['fix', 'inspection', 'offer', 'admission'];

const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  return dataToshow.value.slice(0,-1).map((rowData, index) => {
    return {
      name: t(dataNames[index]),
      data: rowData,
      type: chartNames[index],
    };
  });
});
const seriesR: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
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
  }[]
> = computed(() => {
  return dataToshowR.value.map((rowData, index) => {
    return {
      name: t(dataNamesR[index]),
      fix: rowData[0],
      inspection: rowData[1],
      offer: rowData[2],
      admission: rowData[3],
      BO_total: rowData[4]

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
  organizationId: string
) => {
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'fix', bo: 'bo' };
  }
  const dataAverage = await Totalizer.Totalize(
    dateRange,
    itemList,
    false,
    organizationId,
    target
  );
  if (!dataAverage) return;
  const dataAverageR = [...dataAverage];
  const dataAverageAll = await Totalizer.Totalize(
    dateRange,
    itemList,
    false,
    undefined,
    target
  );
  if (!dataAverageAll) return;
  const dataAverageAllR = [...dataAverage];
  const BO = await Totalizer.Totalize(dateRange, ['bo'], false, organizationId, target);
  const BOAll = await Totalizer.Totalize(dateRange, ['bo'], false, undefined, target);
  if (!BO) return;
  dataAverageR.push(BO[0]);
  if (!BOAll) return;
  dataAverageAllR.push(BOAll[0]);
  const dataCvr = calculateCVR(dataAverage);
  const dataCvrAll = calculateCVR(dataAverageR);
  dataToshow.value = [dataAverage, dataCvr, dataCvrAll];
  dataToshowR.value = [dataAverageR, dataAverageAllR];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
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

