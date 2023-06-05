<template>
  <div class="row">
    <div class="col">
      <q-responsive :ratio="17 / 30">
        <apexchart
          :options="chartOptionsSex"
          :series="seriesSex"
          width="100%"
          height="100%"
        ></apexchart>
      </q-responsive>
    </div>
    <div class="col">
      <q-responsive :ratio="17 / 30">
        <apexchart
          :options="chartOptionsAges"
          :series="seriesAges"
          width="100%"
          height="100%"
        ></apexchart>
      </q-responsive>
    </div>
    <div class="col">
      <q-responsive :ratio="17 / 30">
        <apexchart
          :options="chartOptionsDaysToWork"
          :series="seriesDaysToWork"
          width="100%"
          height="100%"
        ></apexchart>
      </q-responsive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicant } from 'stores/applicant';
import { graphType } from '../Models';
import { onMounted, Ref, ref, ComputedRef, computed, watch } from 'vue';
import {
  chartOptionsSex,
  chartOptionsAges,
  chartOptionsDaysToWork,
  rowNamesAges,
  rowNamesDaysToWork,
  rowNamesSex,
  chartTypeAges,
  chartTypeDaysToWork,
  chartTypeSex,
} from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import { convertToPercentage } from '../reportUtil';
const { t } = i18n.global;
const apexchart = VueApexCharts;
const Applicant = useApplicant();
const {
  countApplicantsBySex,
  agesListOfApplicants,
  countApplicantsdaysToWork,
} = Applicant;

const dataToshow: Ref<(number | string)[][]> = ref([]);
const dataToshowAges: Ref<(number | string)[][]> = ref([]);
const dataToshowDaysToWork: Ref<(number | string)[][]> = ref([]);

const seriesSex: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshow.value.map((rowdata, index) => {
    return {
      name: t(rowNamesSex[index]),
      data: rowdata,
      type: chartTypeSex[index],
    };
  });
  return series_;
});
const seriesAges: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshowAges.value.map((rowdata, index) => {
    return {
      name: t(rowNamesAges[index]),
      data: rowdata,
      type: chartTypeAges[index],
    };
  });
  return series_;
});
const seriesDaysToWork: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshowDaysToWork.value.map((rowData, index) => {
    return {
      name: rowNamesDaysToWork[index] + t('report.day'),
      data: rowData,
      type: chartTypeDaysToWork[index],
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
  if (!props.dateRangeProps) return;
  const sexData = [
    [await countApplicantsBySex('male', props.dateRangeProps)],
    [await countApplicantsBySex('female', props.dateRangeProps)],
  ];
  dataToshow.value = convertToPercentage(sexData);
  const listofages = await agesListOfApplicants(props.dateRangeProps);
  if (listofages) {
    const agesData = [
      [listofages.filter((age) => age >= 10 && age < 20).length],
      [listofages.filter((age) => age >= 20 && age < 30).length],
      [listofages.filter((age) => age >= 30 && age < 40).length],
      [listofages.filter((age) => age >= 40 && age < 50).length],
      [listofages.filter((age) => age >= 50 && age < 60).length],
      [listofages.filter((age) => age >= 60).length],
    ];
    dataToshowAges.value = convertToPercentage(agesData);
  } else {
    const agesData = [[0], [0], [0], [0], [0], [0]];
    dataToshowAges.value = convertToPercentage(agesData);
  }

  const daysData = await countApplicantsdaysToWork(props.dateRangeProps);
  dataToshowDaysToWork.value = convertToPercentage(daysData);
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
