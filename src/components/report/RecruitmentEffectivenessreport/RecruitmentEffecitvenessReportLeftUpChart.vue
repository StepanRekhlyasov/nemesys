<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="seriesSex"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudget } from 'stores/budget';
import { graphType } from '../Models';
import { onMounted, Ref, ref, ComputedRef, computed, watch } from 'vue';
import {unitPricenames,chartTypeUnitPrice
} from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
const { t } = i18n.global;
const apexchart = VueApexCharts;
const Budget = useBudget();
const dataToshow: Ref<(number | string)[][] > = ref([]);
const month_list: Ref<number[]> = ref([]);
const seriesSex: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const series_ = dataToshow.value.map((row_data, index) => {
    return {
      name: t(unitPricenames[index]),
      data: row_data,
      type: chartTypeUnitPrice[index]
    };
  });
  return series_;
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
      categories: [...month_list.value].map((month) => {
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
  if (props.dateRangeProps == undefined) return;
  const month = props.dateRangeProps.to.split('/')[1];
  month_list.value = Array.from({ length: 7 }, (_, i) => {
    const month_ = Number(month) - i;
    if (month_ <= 0) {
      return month_ + 12;
    } else {
      return month_;
    }
  }).reverse();

  const company_average = await Budget.getUnitPricePerOrganization(
    props.dateRangeProps,
    props.organization_id
  );
  if(company_average == undefined) return;
  dataToshow.value.push(company_average[0]);
  dataToshow.value.push(company_average[1]);


  const all_average = await Budget.getUnitPricePerOrganization(
    props.dateRangeProps,
    undefined
  );
  if(all_average == undefined) return;
  dataToshow.value.push(all_average[0]);
  dataToshow.value.push(all_average[1]);



};

watch(
  () => [props.branch_user_list, props.dateRangeProps, props.graph_type],
  async () => {
    if (props.dateRangeProps == undefined) return;
    await showChart();
  }
);

onMounted(async () => {
  showChart();
});
</script>
