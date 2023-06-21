<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptions, columns, item_list ,chartType,row_names} from './const';
import { useTotalizer } from 'src/stores/totalization';
import { calculateCVR } from 'src/components/report/reportUtil';
import {graphType} from '../Models';
import VueApexCharts from 'vue3-apexcharts';
const Totalizer = useTotalizer();
const { t } = useI18n({ useScope: 'global' });
const apexchart=VueApexCharts
const dataToshow: Ref<(number | string)[][]> = ref([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToshow.value.map((rowData, index) => {
    return {
      name: t(row_names[index]),
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
  const rowsList = dataToshow.value.map((rowData, index) => {
    return {
      name: t(row_names[index]),
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
  let target: { applicants: string; fix: string; bo: string } | undefined =
    undefined;
  if (props.graph_type == 'BasedOnLeftMostItemDate') {
    target = { applicants: 'applicants', fix: 'applicants', bo: 'bo' };
  }
  const dataAverage = await Totalizer.Totalize(
    dateRange,
    item_list,
    false,
    organizationId,
    target,
    true
  );
  const dataCvr = calculateCVR(dataAverage);
  const dataAverageAll = await Totalizer.Totalize(
    dateRange,
    item_list,
    false,
    undefined,
    target,
    true
  );
  const dataCvrAll = calculateCVR(dataAverageAll);
  dataToshow.value = [dataAverage, dataCvr, dataCvrAll];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (!props.dateRangeProps) return;
    await showData(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  await showData(
    props.dateRangeProps,
    props.organization_id
  );
});
</script>

