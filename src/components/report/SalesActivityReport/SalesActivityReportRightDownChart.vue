<template>
  <apexchart
    :options="chartOptions"
    :series="dataToshow"
    ref="donut"
    type="donut"
  ></apexchart>
</template>

<script setup lang="ts">
import { graphType } from '../Models';
import { onMounted, Ref, ref, computed, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import { useGetReport } from 'src/stores/getReport';
import { donutGraphItem, donutLabelNames } from './const';
const apexchart = VueApexCharts;
const { getReport } = useGetReport();
const dataToshow: Ref<(number | string)[]> = ref([]);
const { t } = i18n.global;
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
const chartOptions = computed(() => {
  return {
    legend: { position: 'right' },
    title: {
      text: t('report.title.AverageBOStatus'),
      style: {
        color: 'gray',
      },
    },
    labels: donutLabelNames,
  };
});

const showChart = async () => {
  if (!props.dateRangeProps) return;
  const rows = await getReport({
    queryNames: donutGraphItem,
    graphType: props.graph_type,
    dateRange: props.dateRangeProps,
    organizationId: props.organization_id,
    isAverage: false,
  });
  dataToshow.value = Object.values(rows[0]).filter(
    (value) => typeof value !== 'string'
  );
};
watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    await showChart();
  }
);

onMounted(async () => {
  await showChart();
});
</script>
