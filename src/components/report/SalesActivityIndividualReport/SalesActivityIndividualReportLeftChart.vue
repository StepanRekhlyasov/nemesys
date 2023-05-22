<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import {
  ref,
  Ref,
  watch,
  defineProps,
  onMounted,
  ComputedRef,
  computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, columns, data_names } from './const';
import { getIndividualReport } from 'src/stores/individualReport';
import { useTotalizer } from 'src/stores/totalization';
import { calculateCVR } from '../report_util';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';


type ROWS = {
  name: string;
  fix: number | string;
  inspection: number | string;
  offer: number | string;
  admission: number | string;
  inspection_rate: number | string;
  offer_rate: number | string;
  admission_rate: number | string;
}[];
const apexchart = VueApexCharts
const Totalizer = useTotalizer();
const { t } = useI18n({ useScope: 'global' });
const dataToShow: Ref<(number | string)[][]> = ref([]);
const dataToShowCVR: Ref<(number | string)[][]> = ref([]);
const rows_: Ref<ROWS> = ref([]);
const series_: Ref<
  { name: string; data: (number | string)[]; type: string }[]
> = ref([]);
const rows: ComputedRef<ROWS> = computed(() => {
  return dataToShow.value
    .map((row_data, index) => {
      return {
        name: t(data_names[index]),
        fix: row_data[0],
        inspection: row_data[1],
        offer: row_data[2],
        admission: row_data[3],
        inspection_rate: dataToShowCVR.value[index][1],
        offer_rate: dataToShowCVR.value[index][2],
        admission_rate: dataToShowCVR.value[index][3],
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
        name: t(data_names[index]),
        data: row_data,
        type: 'line',
      };
    })
    .concat(series_.value);
});
const user_list: Ref<{ id: string; name: string }[]> = ref([]);
const organization_id = ref('');
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showIndividualReport = async (
  user_list: { id: string; name: string }[],
  dateRange: { from: string; to: string } | undefined
) => {
  if (dateRange == undefined) return;
  const { rows: rows__, series: series__ } = await getIndividualReport(
    user_list,
    dateRange,
    props.graph_type
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
    ['fix', 'inspection', 'offer', 'admission'],
    true,
    organization_id.value,
    target
  );
  const all_data_average = await Totalizer.Totalize(
    dateRange,
    ['fix', 'inspection', 'offer', 'admission'],
    true,
    undefined,
    target
  );
  const data_average_cvr = calculateCVR(data_average);
  const all_data_average_cvr = calculateCVR(all_data_average);
  dataToShow.value = [data_average, all_data_average];
  dataToShowCVR.value = [data_average_cvr, all_data_average_cvr];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (props.branch_user_list.length != 0) {
      if (props.dateRangeProps == undefined) return;
      user_list.value = props.branch_user_list;
      await showIndividualReport(user_list.value, props.dateRangeProps);
    }
  }
);

onMounted(async () => {
  user_list.value = props.branch_user_list;
  organization_id.value = props.organization_id;
  await showIndividualReport(user_list.value, props.dateRangeProps);
});
</script>

