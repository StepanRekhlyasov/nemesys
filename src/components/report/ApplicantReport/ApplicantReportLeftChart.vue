<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, columns, itemList, chartType, rowNames } from './applicant.const';
import {
  calculateCVR,
  getListFromObject,
} from 'src/components/report/reportUtil';
import { graphType } from '../Models';
import { useGetReport } from 'src/stores/getReport';
import VueApexCharts from 'vue3-apexcharts';
const { getReport } = useGetReport();
const { t } = useI18n({ useScope: 'global' });
const apexchart = VueApexCharts;
const dataToShow = ref<(number | string)[][]>([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToShow.value.map((rowData, index) => {
    return {
      name: t(rowNames[index]),
      data: rowData,
      type: chartType[index],
    };
  });
  return seriesList;
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
  const rowsList = dataToShow.value.map((rowData, index) => {
    return {
      name: t(rowNames[index]),
      applicants: rowData[0],
      valid_applicants: rowData[1],
      contact_applicants: rowData[2],
      attraction_applicants: rowData[3],
      attend_applicants: rowData[4],
      fix: rowData[5],
      inspection: rowData[6],
      offer: rowData[7],
      admission: rowData[8],
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

const showData = async (
  dateRange: { from: string; to: string },
  organizationId: string
) => {
  dataToShow.value = [];
  const dataAverage = getListFromObject(
    await getReport({
      dateRange: dateRange,
      graphType: props.graph_type,
      queryNames: itemList,
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
      isAverage: false,
    }),
    itemList.map((item) => {
      return item.queryName;
    })
  ) as number[];
  const dataCvr = calculateCVR(dataAverage);

  const dataCvrAll = calculateCVR(dataAverageAll);

  dataToShow.value = [dataAverage, dataCvr, dataCvrAll];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (!props.dateRangeProps) return;
    await showData(props.dateRangeProps, props.organization_id);
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  //wait 0.1sec
  await new Promise((resolve) => setTimeout(resolve, 100));
  await showData(props.dateRangeProps, props.organization_id);
});
</script>
