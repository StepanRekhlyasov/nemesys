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
import { useMedia } from 'stores/media';
import VueApexCharts from 'vue3-apexcharts';
import { Media } from 'src/shared/model/Media.model';
import { i18n } from 'boot/i18n';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import { useGetReport } from 'src/stores/getReport';
const { getReport } = useGetReport();
const apexchart = VueApexCharts;
const dataToshow: Ref<(number | string)[]> = ref([]);
const media = useMedia();
const mediaList = ref<Media[]>([]);
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
      text: t('report.title.budget'),
      style: {
        color: 'gray',
      },
    },
    labels: [...mediaList.value.map((media) => media.name)],
  };
});

const showChart = async () => {
  mediaList.value = await media.getAllmedia();
  if (!props.dateRangeProps) return;
  const dateRange = props.dateRangeProps;
  dataToshow.value = (
    await getReport({
      queryNames: [{ queryName: 'amount' }],
      graphType: props.graph_type,
      dateRange: dateRange,
      isAverage: false,
      medias: mediaList.value,
    })
  ).map((row) => row.amount);
};

watch(
  () => [
    props.branch_user_list,
    props.dateRangeProps,
    props.graph_type,
    props.branch_id,
  ],
  async () => {
    await showChart();
  }
);

watchCurrentOrganization(async () => {
  await showChart();
});

onMounted(async () => {
  await showChart();
});
</script>
