export const chartOptionsVerticalBase = {
  legend: { position: 'right' },
  chart: { type: 'bar' },
  title: {
    text: '',
    style: {
      color: 'gray',
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '25%',
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
  xaxis: {},
  yaxis: [
    {
      opposite: false,
      min: 0,
      labels: {
        formatter: function (value) {
          return value.toFixed(1);
        },
      },
    },
  ],
  fill: {
    opacity: 1,
  },
};
