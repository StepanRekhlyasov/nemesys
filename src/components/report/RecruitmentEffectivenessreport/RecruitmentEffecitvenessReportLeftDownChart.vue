<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="seriesSex"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudget } from 'stores/budget';
import { useMedia } from 'stores/media';
import { graphType } from '../Models';
import { onMounted, Ref, ref, ComputedRef, computed, watch } from 'vue';
import { chartTypeUnitPricePerMedia,unitPricenamesPerMedia } from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
const { t } = i18n.global;
const apexchart = VueApexCharts;
const Budget = useBudget();
const Media = useMedia();
const media_list: Ref<string[]> = ref([]);
const chartOptions = computed(() => {
  return {
    legend: { position: 'left' },
    chart: {},
    title: {
      text: t('report.title.mediaApplicationUnitPrice'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '5%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: [...media_list.value],
    },
    yaxis: [
      {
        min: 0,

        labels: {
          formatter: function (value) {
            return value.toFixed(0) + t('report.yen');
          },
        },
      },
    ],
  };
});

const dataToshow: Ref<(number | string)[][]> = ref([]);
const seriesSex: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshow.value.map((row_data, index) => {
    return {
      name: t(unitPricenamesPerMedia[index]),
      data: row_data,
      type: chartTypeUnitPricePerMedia[index],
    };
  });
  return series_;
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showChart = async () => {
  dataToshow.value = [];
  media_list.value = await Media.getAllmedia();
  const company_average = await Budget.getUnitPricePerOrganizationPerMedia(
    props.dateRangeProps,
    props.organization_id,
    media_list.value
  );
  const company_average_all = await Budget.getUnitPricePerOrganizationPerMedia(
    props.dateRangeProps,
    undefined,
    media_list.value
  );
  if (company_average == undefined || company_average_all == undefined) return;
  dataToshow.value = [[...company_average], [...company_average_all]];
};

watch(
  () => [
    props.branch_user_list,
    props.dateRangeProps,
    props.graph_type,
  ],
  async () => {
    if (props.dateRangeProps == undefined) return;
    await showChart();
  }
);

onMounted(async () => {
  showChart();
});
</script>
