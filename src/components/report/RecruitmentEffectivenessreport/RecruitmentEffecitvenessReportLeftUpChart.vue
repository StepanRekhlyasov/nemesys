<template>
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { graphType } from '../Models';
import { onMounted, Ref, ref, ComputedRef, computed, watch } from 'vue';
import { unitPricenames, chartTypeUnitPrice } from './const';
import VueApexCharts from 'vue3-apexcharts';
import { i18n } from 'boot/i18n';
import { useGetReport } from 'src/stores/getReport';
import { round } from 'src/shared/utils/KPI.utils';
const { getReport } = useGetReport();
const monthPerYear = 12;
const beforeMonth = 7;
const { t } = i18n.global;
const apexchart = VueApexCharts;
const dataToshow: Ref<(number | string)[][]> = ref([]);
const monthList: Ref<number[]> = ref([]);
const series: ComputedRef<
  { name: string; data: (number | string)[]; type: string }[]
> = computed(() => {
  const seriesList = dataToshow.value.map((rowData, index) => {
    return {
      name: t(unitPricenames[index]),
      data: rowData,
      type: chartTypeUnitPrice[index],
    };
  });
  return seriesList;
});

const chartOptions = computed(() => {
  return {
    legend: { position: 'right' },
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
        title: { text: t('report.categories.applicationUnitPrice') },
        labels: {
          formatter: function (value) {
            return value.toFixed(0) + t('report.yen');
          },
        },
      },
      {
        opposite: true,
        title: { text: t('report.categories.startUnitPrice') },
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
  dataToshow.value = [[], [], [], []];
  if (!props.dateRangeProps) return;
  interface MonthYear {
    month: number;
    year: number;
  }
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
      queryNames: [
        { queryName: 'applicants' },
        { queryName: 'admission' },
        { queryName: 'amount' },
      ],
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
    const from = new Date(
      { ...monthYear }.year,
      { ...monthYear }.month - 1,
      1,
      0,
      0,
      0
    );
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
  const monthRangeList = getMonthList(props.dateRangeProps.to, beforeMonth).map(
    (monthYear) => {
      return getMonthRange(monthYear);
    }
  );
  monthList.value = monthRangeList.map((month) => {
    return month.from.getMonth() + 1;
  });
  for (const month of monthRangeList) {
    const price = await calcUnitPrice(month, props.organization_id);
    const priceAll = await calcUnitPrice(month);
    dataToshow.value[0].push(price.unitPrice);
    dataToshow.value[1].push(price.startPrice);
    dataToshow.value[2].push(priceAll.unitPrice);
    dataToshow.value[3].push(priceAll.startPrice);
  }
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
