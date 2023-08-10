import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { where } from '@firebase/firestore';
import { chartOptionsVerticalBase } from '../report.const';
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

export const daysToWorkQueryNamesList = [
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 1)],
    fieldName: 'daysToWork1',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 2)],
    fieldName: 'daysToWork2',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 3)],
    fieldName: 'daysToWork3',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 4)],
    fieldName: 'daysToWork4',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 5)],
    fieldName: 'daysToWork5',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 6)],
    fieldName: 'daysToWork6',
  },
  {
    queryName: 'applicants',
    filtersInput: [where('daysToWork', '==', 7)],
    fieldName: 'daysToWork7',
  },
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
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.chart.stacked = true;
  chartOptions.title.text = t('report.title.sex');
  chartOptions.xaxis['categories'] = [t('report.ourCompany'), t('report.all')];
  chartOptions.yaxis[0]['labels'] = {
    formatter: function (value) {
      return value.toFixed(1) + '%';
    },
}
  return chartOptions;
});

export const chartOptionsAges = computed(() => {
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.chart.stacked = true;
  chartOptions.title.text = t('report.title.age');
  chartOptions.xaxis['categories'] = [t('report.ourCompany'), t('report.all')];
  chartOptions.yaxis[0]['labels'] = {
    formatter: function (value) {
      return value.toFixed(1) + '%';
    },
}
  return chartOptions;
});

export const chartOptionsDaysToWork = computed(() => {
  const chartOptions = JSON.parse(JSON.stringify(chartOptionsVerticalBase));
  chartOptions.chart.stacked = true;
  chartOptions.title.text = t('report.title.daysToWork');
  chartOptions.xaxis['categories'] = [t('report.ourCompany'), t('report.all')];
  chartOptions.yaxis[0]['labels'] = {
    formatter: function (value) {
      return value.toFixed(1) + '%';
    },
}
  return chartOptions;
});

export const chartOptionsMedia = computed(() => {
  return {
    legend: { position: 'right' },
    labels: [],
  };
});
