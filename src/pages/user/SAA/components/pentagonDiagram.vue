<template>
  <q-drawer 
      show 
      class="bg-grey-3 pentagonDrawer" 
      :width="660" 
      :breakpoint="500" 
      side="right" 
      overlay 
      elevated
      bordered
    >
    <q-card-section class="flex justify-between q-pl-none q-pr-none q-pt-none">
      <div class="text-h7 text-primary text-bold"><span style="font-size:20px;">■</span> {{ $t('KPI.parameters') }}</div>
      <q-btn dense flat icon="close" @click="emit('closeDrawer')"/>
    </q-card-section>
    <div class="bg-white">
      <VueApexCharts v-if="showDrawer" type="radar" height="450" :options="chartOptions" :series="series"></VueApexCharts>
    </div>
  </q-drawer>
</template>
<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global
const emit = defineEmits(['closeDrawer'])
const props = defineProps<{
  data: {
    average : number[]
    row : number[],
    labels: string[],
    name: string
  },
  showDrawer: boolean
}>()

const series = computed(()=>[{
  name: t('pentagon.average'),
  data: [props.data.average[0], props.data.average[1], props.data.average[2], props.data.average[3], props.data.average[4]],
  color: '#E0C329'
}, {
  name: props.data.name,
  data: [props.data.row[0], props.data.row[1], props.data.row[2], props.data.row[3], props.data.row[4]],
  color: '#0096C7'
}])
const chartOptions = computed(()=>{
  return {
    yaxis: {
      show: true,
      labels: {
        formatter: (val : number)=>parseFloat(val.toFixed(1))
      }
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        borderRadius:2,
      },
      style: {
        colors: ['#E0C329', '#0096C7'],
      }
    },
    chart: {
      height: 350,
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      }
    },
    stroke: {
      width: 2,
      colors: ['#E0C329', '#0096C7'],
    },
    fill: {
      opacity: 0.1,
      colors: ['#E0C329', '#0096C7'],
    },
    markers: {
      size: 0,
      colors: ['#E0C329', '#0096C7'],
    },
    xaxis: {
      categories: props.data.labels.map((row)=>t('pentagon.'+row)),
      labels: {
        show: true,
        style: {
          colors: ['#000', '#000', '#000' ,'#000' ,'#000'],
          fontSize: '16px',
          fontWeight: 700
        }
      }
    },
  }
})
</script>
<style lang="scss">
.pentagonDrawer{
  padding: 20px;
}
</style>