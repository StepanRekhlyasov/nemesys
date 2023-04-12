<template>
  <div>
    <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script  lang="ts">
import VueApexCharts from 'vue3-apexcharts';
// props で　chartOptions, series を受け取り,apexchatsを表示する
export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    chartOptions: {
      type: Object,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
  },
};
</script>
