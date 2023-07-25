import { computed } from 'vue';
import { i18n } from 'boot/i18n';
const { t } = i18n.global;
export const rowNamesSex = [
  'report.categories.male',
  'report.categories.female',
] as const;
export const chartTypeSex = ['bar', 'bar'] as const;
export const chartTypeUnitPrice = ['bar', 'bar', 'line', 'line'] as const;
export const chartTypeUnitPricePerMedia = ['bar', 'bar'] as const;
export const queryNamesList = [
  { queryName: 'applicants' },
  { queryName: 'admission' },
  { queryName: 'amount' },
] as const;

export const rowNamesAges = [
  'report.categories.teens',
  'report.categories.twenties',
  'report.categories.thirties',
  'report.categories.forties',
  'report.categories.fifties',
  'report.categories.sixties',
] as const;

export const chartTypeAges = [
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
] as const;
export const rowNamesDaysToWork = ['1', '2', '3', '4', '5', '6', '7'] as const;
export const chartTypeDaysToWork = [
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
] as const;
export const chartTypeMedia = ['pie'] as const;

export const unitPricenames = [
  'report.categories.applicationUnitPrice',
  'report.categories.startUnitPrice',
  'report.categories.applicationUnitPriceAllAverage',
  'report.categories.startUnitPriceAllAverage',
] as const;
export const unitPricenamesPerMedia = [
  'report.categories.applicationUnitPrice',
  'report.categories.applicationUnitPriceAllAverage',
] as const;
export const chartOptionsSex = computed(() => {
  return {
    legend: { position: 'right' },
    chart: { stacked: true },
    title: {
      text: t('report.title.sex'),
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
      categories: [t('report.ourCompany'),t('report.all')],
    },
    yaxis: [
      {
        min: 0,
        max: 100,

        labels: {
          formatter: function (value) {
            return value.toFixed(0) + '%';
          },
        },
      },
    ],
  };
});

export const chartOptionsAges = computed(() => {
  return {
    legend: { position: 'right' },
    chart: { stacked: true },
    title: {
      text: t('report.title.age'),
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
      categories: [t('report.ageComposition')],
    },
    yaxis: [
      {
        min: 0,
        max: 100,

        labels: {
          formatter: function (value) {
            return value.toFixed(0) + '%';
          },
        },
      },
    ],
  };
});

export const chartOptionsDaysToWork = computed(() => {
  return {
    legend: { position: 'right' },
    chart: { stacked: true },
    title: {
      text: t('report.title.daysToWork'),
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
      categories: [t('report.daysToWork')],
    },
    yaxis: [
      {
        min: 0,
        max: 100,

        labels: {
          formatter: function (value) {
            return value.toFixed(0) + '%';
          },
        },
      },
    ],
  };
});

export const chartOptionsMedia = computed(() => {
  return {
    legend: { position: 'right' },
    labels: [],
  };
});
