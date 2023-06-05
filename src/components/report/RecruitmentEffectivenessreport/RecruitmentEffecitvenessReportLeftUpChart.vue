<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudget } from 'stores/budget';
import { graphType } from '../Models';
import { onMounted, Ref, ref, ComputedRef, computed, watch } from 'vue';
import {unitPricenames,chartTypeUnitPrice} from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
const monthPerYear = 12;
const beforeMonth =7;
const { t } = i18n.global;
const apexchart = VueApexCharts;
const budget = useBudget();
const dataToshow: Ref<(number | string)[][] > = ref([]);
const monthList: Ref<number[]> = ref([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToshow.value.map((rowData, index) => {
    return {
      name: t(unitPricenames[index]),
      data: rowData,
      type: chartTypeUnitPrice[index]
    };
  });
  return seriesList;
});

const chartOptions = computed(() => {
  return {
    legend: { position: 'left' },
    chart: {},
    title: {
      text: t('report.title.unitPriceTransition'),
      style: {
        color: 'gray',
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '15%',
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
      categories: [...monthList.value].map((month) => {
    return t(`common.months.${month}`);
  }),
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

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showChart = async () => {
  dataToshow.value = [];
  if (!props.dateRangeProps) return;
  const month = props.dateRangeProps.to.split('/')[1];
  monthList.value = Array.from({ length: beforeMonth }, (_, i) => {
    const month_ = Number(month) - i;
    if (month_ <= 0) {
      return month_ + monthPerYear;
    } else {
      return month_;
    }
  }).reverse();

  const company_average = await budget.getUnitPricePerOrganization(
    props.dateRangeProps,
    props.organization_id,
    beforeMonth
  );
  if(!company_average) return;
  dataToshow.value.push(company_average[0]);
  dataToshow.value.push(company_average[1]);


  const all_average = await budget.getUnitPricePerOrganization(
    props.dateRangeProps,
    undefined,
    beforeMonth
  );
  if(!all_average) return;
  dataToshow.value.push(all_average[0]);
  dataToshow.value.push(all_average[1]);



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
