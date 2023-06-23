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
import { onMounted, Ref, ref, computed ,watch} from 'vue';
import { useMedia } from 'stores/media';
import { useApplicant } from 'stores/applicant';
import VueApexCharts from 'vue3-apexcharts';

const apexchart = VueApexCharts;
const dataToshow: Ref<(number | string)[]> = ref([]);
const media = useMedia();
const applicant = useApplicant();
const mediaList: Ref<string[]> = ref([]);
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
const chartOptions = computed(() => {
  return {
    legend: { position: 'left' },
    labels: [...mediaList.value],
  };
});

const showChart = async () => {
  mediaList.value = await media.getAllmedia();
  if (!props.dateRangeProps) return;
  const dateRange = props.dateRangeProps;
  dataToshow.value = await Promise.all(
    mediaList.value.map(async (mediaName) => {
      return await applicant.countApplicantsByMedia(mediaName, dateRange);
    })
  );
};

watch(
  () => [
    props.branch_user_list,
    props.dateRangeProps,
    props.graph_type,
  ],
  async () => {
    await showChart();
  }
);


onMounted(async () => {
  await showChart();
});
</script>
