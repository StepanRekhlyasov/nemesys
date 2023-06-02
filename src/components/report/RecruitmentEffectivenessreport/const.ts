import { computed } from 'vue';
import { i18n } from 'boot/i18n';
const { t } = i18n.global;
export const rowNamesSex = [
  'report.categories.male',
  'report.categories.female',
];
export const chartTypeSex: string[] = ['bar', 'bar'];
export const chartTypeUnitPrice: string[] = ['bar','bar','line','line']
export const chartTypeUnitPricePerMedia: string[] = ['bar','bar']

export const rowNamesAges = [
  'report.categories.teens',
  'report.categories.twenties',
  'report.categories.thirties',
  'report.categories.forties',
  'report.categories.fifties',
  'report.categories.sixties',
];

export const chartTypeAges: string[] = [
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
];
export const rowNamesDaysToWork = ['1', '2', '3', '4', '5', '6', '7'];
export const chartTypeDaysToWork: string[] = [
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
  'bar',
];
export const chartTypeMedia: string[] = ['pie'];

export const unitPricenames: string[] = [
  'report.categories.applicationUnitPrice',
  'report.categories.startUnitPrice',
  'report.categories.applicationUnitPriceAllAverage',
  'report.categories.startUnitPriceAllAverage',
];
export const unitPricenamesPerMedia: string[] = [
  'report.categories.applicationUnitPrice',
  'report.categories.applicationUnitPriceAllAverage',
];
export const chartOptionsSex = computed(() => {
  return {
    legend: { position: 'left' },
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
      categories: [t('report.genderRatio')],
    },
    yaxis: [
      {
        min: 0,

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
    legend: { position: 'left' },
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
    legend: { position: 'left' },
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
    legend: { position: 'left' },
    labels: [],
  };
});
