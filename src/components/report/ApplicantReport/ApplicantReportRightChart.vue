<template>
  <apexchart :options="chartOptionsLeadtime" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsLeadtime" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, ComputedRef, computed } from 'vue';
import { listToFixed } from '../reportUtil';
import { useI18n } from 'vue-i18n';
import { usecalcLeadtime } from 'src/stores/leadtime';
import { chartOptionsLeadtime, columnsLeadtime } from './const';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
const  Leadtime  = usecalcLeadtime();
const apexchart = VueApexCharts;
const { t } = useI18n({ useScope: 'global' });
const dataToshow: Ref<(number | string)[][]> = ref([]);
const series: ComputedRef<{ name: string; data: (number|string)[]; type: string }[]> =
  computed(() => {
    const seriesList = dataToshow.value.map((rowData) => {
      return {
        name: t('report.companyAverage'),
        data: rowData,
        type: 'bar',
      };
    });
    return seriesList;
  });
const rows: ComputedRef<
  {
    name: string;
    invitations: string|number;
    fix: string|number;
    inspection: string|number;
    offer: string|number;
    admission: string|number;
  }[]
> = computed(() => {
  const rowsList = dataToshow.value.map((rowData) => {
    return {
      name: t('report.companyAverage'),
      invitations: rowData[0],
      fix: rowData[1],
      inspection: rowData[2],
      offer: rowData[3],
      admission: rowData[4],
    };
  });
  return rowsList;
});
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showLeadtime = async (
  dateRange: { from: string; to: string } | undefined,
  organizationId: string
) => {
  if (!dateRange) return;
  const dataAverage = listToFixed(await Leadtime.calcLeadtime(dateRange, organizationId));
  dataToshow.value = [dataAverage];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    await showLeadtime(props.dateRangeProps, props.organization_id);
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  await showLeadtime(props.dateRangeProps, props.organization_id);
});
</script>

