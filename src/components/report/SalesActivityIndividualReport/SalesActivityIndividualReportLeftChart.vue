<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  defineProps,
  onMounted,
  computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, columns, data_names as dataNames } from './const';
import { getIndividualReport } from 'src/stores/individualReport';
import { useTotalizer } from 'src/stores/totalization';
import { calculateCVR } from '../reportUtil';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';

type RowsType = {
  name: string;
  fix: number | string;
  inspection: number | string;
  offer: number | string;
  admission: number | string;
  inspection_rate: number | string;
  offer_rate: number | string;
  admission_rate: number | string;
}[];
const apexchart = VueApexCharts;
const totalizer = useTotalizer();
const { t } = useI18n({ useScope: 'global' });
const dataToShow = ref<(number | string)[][]>([]);
const dataToShowCVR = ref<(number | string)[][]>([]);
const rowsIndividual = ref<RowsType>([]);
const seriesList = ref<
  { name: string; data: (number | string)[]; type: string }[]
>([]);
const rows = computed<RowsType>(() => {
  return dataToShow.value
    .map((rowData, index) => {
      return {
        name: t(dataNames[index]),
        fix: rowData[0],
        inspection: rowData[1],
        offer: rowData[2],
        admission: rowData[3],
        inspection_rate: dataToShowCVR.value[index][1],
        offer_rate: dataToShowCVR.value[index][2],
        admission_rate: dataToShowCVR.value[index][3],
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
    .concat(seriesList.value);
});
const userList = ref<{ id: string; name: string }[]>([]);
const organizationId = ref('');
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showIndividualReport = async (
  userList: { id: string; name: string }[],
  dateRange: { from: string; to: string } | undefined
) => {
  if (!dateRange) return;
  const { rows: rows, series: series } = await getIndividualReport(
    userList,
    dateRange,
    props.graph_type
  );
  rowsIndividual.value = rows;
  seriesList.value = series;
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'fix', bo: 'bo' };
  }
  const dataAverage = await totalizer.Totalize(
    dateRange,
    ['fix', 'inspection', 'offer', 'admission'],
    true,
    organizationId.value,
    target
  );
  const allDataAverage = await totalizer.Totalize(
    dateRange,
    ['fix', 'inspection', 'offer', 'admission'],
    true,
    undefined,
    target
  );
  const dataAverageCvr = calculateCVR(dataAverage);
  const allDataAverageCvr = calculateCVR(allDataAverage);
  dataToShow.value = [dataAverage, allDataAverage];
  dataToShowCVR.value = [dataAverageCvr, allDataAverageCvr];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (props.branch_user_list.length != 0) {
      if (props.dateRangeProps == undefined) return;
      userList.value = props.branch_user_list;
      await showIndividualReport(userList.value, props.dateRangeProps);
    }
  }
);

onMounted(async () => {
  userList.value = props.branch_user_list;
  organizationId.value = props.organization_id;
  await showIndividualReport(userList.value, props.dateRangeProps);
});
</script>
