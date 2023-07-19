<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudget } from 'stores/budgetData';
import { useMedia } from 'stores/media';
import { graphType } from '../Models';
import { onMounted, ref, computed, watch } from 'vue';
import { chartTypeUnitPricePerMedia, unitPricenamesPerMedia } from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import {Media} from 'src/shared/model/Media.model';
const { t } = i18n.global;
const apexchart = VueApexCharts;
const budget = useBudget();
const media = useMedia();
const mediaList = ref<Media[]>([]);
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
      categories: [...mediaList.value.map((media) => media.name)],
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

const dataToshow = ref<(number | string)[][]>([]);
const series = computed<
  { name: string; data: (number | string)[]; type: string }[]
>(() => {
  const seriesList = dataToshow.value.map((rowData, index) => {
    return {
      name: t(unitPricenamesPerMedia[index]),
      data: rowData,
      type: chartTypeUnitPricePerMedia[index],
    };
  });
  return seriesList;
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
  mediaList.value = await media.getAllmedia();
  const companyAverage = await budget.getUnitPricePerOrganizationPerMedia(
    mediaList.value.map((media) => media.name),
    props.dateRangeProps,
    props.organization_id
  );
  const companyAverageAll = await budget.getUnitPricePerOrganizationPerMedia(
    mediaList.value.map((media) => media.name),
    props.dateRangeProps,
    undefined
  );
  if (!companyAverage || !companyAverageAll) return;
  dataToshow.value = [[...companyAverage], [...companyAverageAll]];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (!props.dateRangeProps) return;
    await showChart();
  }
);

onMounted(async () => {
  showChart();
});
</script>
