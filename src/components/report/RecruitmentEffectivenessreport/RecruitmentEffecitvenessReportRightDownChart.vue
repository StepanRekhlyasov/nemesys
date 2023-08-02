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
  daysToWorkQueryNamesList,
} from './recruitmentEffectiveness.const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import { convertToPercentage, calculateValues } from '../reportUtil';
import { useGetReport } from 'src/stores/getReport';
const { t } = i18n.global;
const apexchart = VueApexCharts;
const { getReport, getAgeReport } = useGetReport();

const dataToshowSex: Ref<(number | string)[][]> = ref([]);
const dataToshowAges: Ref<(number | string)[][]> = ref([]);
const dataToshowDaysToWork: Ref<(number | string)[][]> = ref([]);

const seriesSex: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series = dataToshowSex.value.map((rowdata, index) => {
    return {
      name: t(rowNamesSex[index]),
      data: rowdata,
      type: chartTypeSex[index],
    };
  });
  return series;
});
const seriesAges: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series = dataToshowAges.value.map((rowdata, index) => {
    return {
      name: t(rowNamesAges[index]),
      data: rowdata,
      type: chartTypeAges[index],
    };
  });
  return series;
});
const seriesDaysToWork: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToshowDaysToWork.value.map((rowData, index) => {
    return {
      name: rowNamesDaysToWork[index] + t('report.day'),
      data: rowData,
      type: chartTypeDaysToWork[index],
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
  if (!props.dateRangeProps) return;
  dataToshowDaysToWork.value = [];
  const sexDataAll = Object.values(
    (
      await getReport({
        dateRange: props.dateRangeProps,
        queryNames: [{ queryName: 'male' }, { queryName: 'female' }],
        graphType: props.graph_type,
        isAverage: false,
      })
    )[0]
  ).filter((data) => typeof data === 'number') as number[];
  const sexDataCompany = Object.values(
    (
      await getReport({
        dateRange: props.dateRangeProps,
        organizationId: props.organization_id,
        queryNames: [{ queryName: 'male' }, { queryName: 'female' }],
        graphType: props.graph_type,
        isAverage: false,
      })
    )[0]
  ).filter((data) => typeof data === 'number') as number[];
  dataToshowSex.value = calculateValues([
    [sexDataCompany[0], sexDataAll[0]],
    [sexDataCompany[1], sexDataAll[1]],
  ] as number[][]);

  const ageDataAll = convertToPercentage(
    Object.values(await getAgeReport({ dateRange: props.dateRangeProps })).map(
      (age) => [age]
    )
  );

  const ageDataCompany = convertToPercentage(
    Object.values(
      await getAgeReport({
        dateRange: props.dateRangeProps,
        organizationId: props.organization_id,
      })
    ).map((age) => [age])
  );

  for (const [all, company] of ageDataAll.map((age, index) => [
    age,
    ageDataCompany[index],
  ])) {
    dataToshowAges.value.push([company[0], all[0]]);
  }
  const daysDataCompany = convertToPercentage(
    Object.values(
      (
        await getReport({
          dateRange: props.dateRangeProps,
          queryNames: daysToWorkQueryNamesList,
          organizationId: props.organization_id,
          graphType: props.graph_type,
          isAverage: false,
        })
      )[0]
    )
      .filter((data) => typeof data === 'number')
      .map((data) => [data]) as number[][]
  );

  const daysDataAll = convertToPercentage(
    Object.values(
      (
        await getReport({
          dateRange: props.dateRangeProps,
          queryNames: daysToWorkQueryNamesList,
          graphType: props.graph_type,
          isAverage: false,
        })
      )[0]
    )
      .filter((data) => typeof data === 'number')
      .map((data) => [data]) as number[][]
  );

  for (const [all, company] of daysDataAll.map((days, index) => [
    days,
    daysDataCompany[index],
  ])) {
    dataToshowDaysToWork.value.push([company[0], all[0]]);
  }
};
watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    await showChart();
  }
);

onMounted(async () => {
  //wait 0.1 sec
  await new Promise((resolve) => setTimeout(resolve, 100));
  await showChart();
});
</script>
