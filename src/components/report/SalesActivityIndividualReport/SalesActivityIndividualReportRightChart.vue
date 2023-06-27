<template>
  <apexchart :options="chartOptionsR" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsR" row-key="name" />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptionsR, columnsR, dataNames } from './const';
import { useBOIndividualReport } from 'src/stores/BOindividualReport';
import { useTotalizer } from 'src/stores/totalization';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
const apexchart = VueApexCharts;
const Totalizer = useTotalizer();
const BOIndividualReport = useBOIndividualReport();
const t = useI18n({ useScope: 'global' }).t;
const dataToShow = ref<(number | string)[][]>([]);
const userList = ref<{ id: string; name: string }[]>([]);

const rowsIndividual = ref<
  {
    name: string;
    number_of_calls_per_day: number;
    number_of_FAX_per_day: number;
    BO_total: number;
    BO_New: number;
    BO_Existing: number;
  }[]
>([]);

const seriesIndividual = ref<
  { name: string; data: (number | string)[]; type: string }[]
>([]);
const rows = computed<
  {
    name: string;
    number_of_calls_per_day: number | string;
    number_of_FAX_per_day: number | string;
    BO_total: number | string;
    BO_New: number | string;
    BO_Existing: number | string;
  }[]
>(() => {
  return dataToShow.value
    .map((rowData, index) => {
      return {
        name: t(dataNames[index]),
        number_of_calls_per_day: rowData[0],
        number_of_FAX_per_day: rowData[1],
        BO_total: rowData[2],
        BO_New: rowData[3],
        BO_Existing: rowData[4],
      };
    })
    .concat(rowsIndividual.value);
});

const series = computed<
  { name: string; data: (number | string)[]; type: string }[]
>(() => {
  return dataToShow.value
    .map((rowData, index) => {
      return {
        name: t(dataNames[index]),
        data: rowData,
        type: 'line',
      };
    })
    .concat(seriesIndividual.value);
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showIndividualReport = async (
  organizationId: string,
  userList: { id: string; name: string }[],
  dateRange?: { from: string; to: string }
) => {
  if (!dateRange) return;
  const { rows: rows, series: series } =
    await BOIndividualReport.getBOIndividualReport(userList, dateRange);
  rowsIndividual.value = rows;
  seriesIndividual.value = series;
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'fix', bo: 'bo' };
  }
  const dataAverage = await Totalizer.Totalize(
    dateRange,
    ['bo', 'bo_isfirst', 'bo_isnotfirst'],
    true,
    organizationId,
    target
  );
  const allDataAverage = await Totalizer.Totalize(
    dateRange,
    ['bo', 'bo_isfirst', 'bo_isnotfirst'],
    true,
    undefined,
    target
  );
  dataAverage.unshift(0);
  allDataAverage.unshift(0);
  dataAverage.unshift(0);
  allDataAverage.unshift(0);
  dataToShow.value = [dataAverage, allDataAverage];
};
watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    if (!props.dateRangeProps) return;
    if (props.branch_user_list.length != 0) {
      userList.value = props.branch_user_list;
      await showIndividualReport(
        props.organization_id,
        userList.value,
        props.dateRangeProps
      );
    }
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  if (props.branch_user_list.length != 0) {
    userList.value = props.branch_user_list;
    await showIndividualReport(
      props.organization_id,
      userList.value,
      props.dateRangeProps
    );
  }
});
</script>
