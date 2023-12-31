<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { graphType, SeriesType, MonthYear } from '../Models';
import { onMounted, ref, ComputedRef, computed, watch } from 'vue';
import {
  unitPricenames,
  chartTypeUnitPrice,
  queryNamesList,
} from './recruitmentEffectiveness.const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import { useGetReport } from 'src/stores/getReport';
import { round } from 'src/shared/utils/KPI.utils';
import {
  chartOptionsVerticalBase,
  beforeMonth,
  monthPerYear,
} from '../report.const';

const { getReport } = useGetReport();
const { t } = i18n.global;
const apexchart = VueApexCharts;
const dataToShow = ref<(number | string)[][]>([]);
const monthList = ref<number[]>([]);
const series: ComputedRef<SeriesType[]> = computed(() => {
  const seriesList = dataToShow.value.map((rowData, index) => {
    return {
      name: t(unitPricenames[index]),
      data: rowData,
      type: chartTypeUnitPrice[index],
    };
  });
  return seriesList;
});

const chartOptions = computed(() => {
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.title.text = t('report.title.unitPriceTransition');
  (chartOptions.xaxis['categories'] = [...monthList.value].map((month) => {
    return t(`common.months.${month}`);
  })),
    (chartOptions.yaxis[0]['forceNiceScale'] = true);
  chartOptions.yaxis[0]['labels'] = {
    formatter: function (value) {
      return value.toFixed(0) + t('report.yen');
    },
  };
  return chartOptions;
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  graph_type: graphType;
}>();

const getMonthList = (dateString: string, len: number): MonthYear[] => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthList = Array.from({ length: len }, (_, i) => {
    const monthBefore = month - i;
    if (monthBefore <= 0) {
      return { year: year - 1, month: monthBefore + monthPerYear };
    }
    return { year: year, month: monthBefore };
  }).reverse();
  return monthList;
};

const calcUnitPrice = async (
  month: { from: Date; to: Date },
  organizationId?: string
) => {
  const numOfApplicantsAmount = await getReport({
    dateRange: month,
    queryNames: queryNamesList,
    organizationId: organizationId,
    graphType: props.graph_type,
    isAverage: false,
  });

  const numOfApplicantsSum = numOfApplicantsAmount.reduce((sum, current) => {
    if (typeof current.applicants === 'number') {
      return sum + current.applicants;
    } else return sum;
  }, 0);

  const numOfAdmissionSum = numOfApplicantsAmount.reduce((sum, current) => {
    if (typeof current.admission === 'number') {
      return sum + current.admission;
    } else return sum;
  }, 0);

  const amountSum = numOfApplicantsAmount.reduce((sum, current) => {
    if (typeof current.amount === 'number') {
      return sum + current.amount;
    } else return sum;
  }, 0);
  const unitPrice =
    numOfApplicantsSum !== 0 ? round(amountSum / numOfApplicantsSum, 1) : 0;

  const startPrice =
    numOfAdmissionSum !== 0 ? round(amountSum / numOfAdmissionSum, 1) : 0;
  return { unitPrice: unitPrice, startPrice: startPrice };
};

const getMonthRange = (monthYear: MonthYear): { from: Date; to: Date } => {
  const from = new Date({ ...monthYear }.year, { ...monthYear }.month - 1, 1);
  const to = new Date(
    { ...monthYear }.year,
    { ...monthYear }.month,
    0,
    23,
    59,
    59
  );
  return { from: from, to: to };
};

const showChart = async () => {
  dataToShow.value = [[], [], [], []];
  const dataToShowPre: (number | string)[][] = [[], [], [], []];
  if (!props.dateRangeProps) return;

  const monthRangeList = getMonthList(props.dateRangeProps.to, beforeMonth).map(
    (monthYear) => {
      return getMonthRange(monthYear);
    }
  );
  monthList.value = [...monthRangeList].map((month) => {
    return month.from.getMonth() + 1;
  });
  for (const month of monthRangeList) {
    const price = await calcUnitPrice(
      JSON.parse(JSON.stringify(month)),
      props.organization_id
    );
    const priceAll = await calcUnitPrice(month);
    dataToShowPre[0].push(price.unitPrice);
    dataToShowPre[1].push(price.startPrice);
    dataToShowPre[2].push(priceAll.unitPrice);
    dataToShowPre[3].push(priceAll.startPrice);
  }
  dataToShow.value = dataToShowPre;
};

watch(
  () => [props.dateRangeProps, props.graph_type],
  async () => {
    if (!props.dateRangeProps) return;
    await showChart();
  }
);

onMounted(async () => {
  //wait 0.1sec
  await new Promise((resolve) => setTimeout(resolve, 100));
  showChart();
});
</script>
