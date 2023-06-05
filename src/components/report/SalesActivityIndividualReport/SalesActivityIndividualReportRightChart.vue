<template>
  <apexchart :options="chartOptionsR" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsR" row-key="name" />
</template>

<script setup lang="ts">
import {
  ref,
  Ref,
  watch,
  defineProps,
  onMounted,
  computed,
  ComputedRef,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptionsR, columnsR ,data_names as dataNames} from './const';
import { useBOIndividualReport } from 'src/stores/BOindividualReport';
import { useTotalizer } from 'src/stores/totalization';
import {graphType} from '../Models';
import VueApexCharts from 'vue3-apexcharts';
const apexchart = VueApexCharts;
const Totalizer = useTotalizer();
const BOIndividualReport = useBOIndividualReport();
const t = useI18n({ useScope: 'global' }).t;
const dataToShow: Ref<(number | string)[][]> = ref([]);
const user_list: Ref<{ id: string; name: string }[]> = ref([]);

const rows_: Ref<
  {
    name: string;
    number_of_calls_per_day: number;
    number_of_FAX_per_day: number;
    BO_total: number;
    BO_New: number;
    BO_Existing: number;
  }[]
> = ref([]);

const series_: Ref<
  { name: string; data: (number | string)[]; type: string }[]
> = ref([]);
const rows: ComputedRef<
  {
    name: string;
    number_of_calls_per_day: number | string;
    number_of_FAX_per_day: number | string;
    BO_total: number | string;
    BO_New: number | string;
    BO_Existing: number | string;
  }[]
> = computed(() => {
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
    .concat(rows_.value);
});

const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  return dataToShow.value
    .map((row_data, index) => {
      return {
        name: t(dataNames[index]),
        data: row_data,
        type: 'line',
      };
    })
    .concat(series_.value);
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;

}>();

const showIndividualReport = async (
  dateRange: { from: string; to: string } | undefined,
  organization_id: string
) => {
  if (dateRange == undefined) return;
  const { rows: rows__, series: series__ } = await BOIndividualReport.getBOIndividualReport(
    user_list.value,
    dateRange
  );
  rows_.value = rows__;
  series_.value = series__;
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'fix', bo: 'bo' };
  }
  const data_average = await Totalizer.Totalize(
    dateRange,
    ['bo', 'bo_isfirst', 'bo_isnotfirst'],
    true,
    organization_id,
    target
  );
  const all_data_average = await Totalizer.Totalize(
    dateRange,
    ['bo', 'bo_isfirst', 'bo_isnotfirst'],
    true,
    undefined,
    target
  );
  data_average.unshift(0);
  all_data_average.unshift(0);
  data_average.unshift(0);
  all_data_average.unshift(0);
  dataToShow.value = [data_average, all_data_average];
};
watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    if (props.dateRangeProps == undefined) return;
    if (props.branch_user_list.length != 0) {
      user_list.value = props.branch_user_list;
      await showIndividualReport(props.dateRangeProps, props.organization_id);
    }
  }
);

onMounted(async () => {
  if (props.dateRangeProps == undefined) return;
  user_list.value = props.branch_user_list;
  await showIndividualReport(props.dateRangeProps, props.organization_id);
});
</script>
