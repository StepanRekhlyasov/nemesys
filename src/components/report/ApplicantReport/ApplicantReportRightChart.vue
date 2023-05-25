<template>
  <apexchart :options="chartOptionsLeadtime" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsLeadtime" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted, ComputedRef, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usecalcLeadtime } from 'src/stores/leadtime';
import { chartOptionsLeadtime, columnsLeadtime } from './const';
import VueApexCharts from 'vue3-apexcharts';
const  Leadtime  = usecalcLeadtime();
const apexchart = VueApexCharts;
const { t } = useI18n({ useScope: 'global' });
const dataToshow: Ref<(number | string)[][]> = ref([]);
const series: ComputedRef<{ name: string; data: (number|string)[]; type: string }[]> =
  computed(() => {
    const series_ = dataToshow.value.map((row_data) => {
      return {
        name: t('report.companyAverage'),
        data: row_data,
        type: 'bar',
      };
    });
    return series_;
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
  const rows_ = dataToshow.value.map((row_data) => {
    return {
      name: t('report.companyAverage'),
      invitations: row_data[0],
      fix: row_data[1],
      inspection: row_data[2],
      offer: row_data[3],
      admission: row_data[4],
    };
  });
  return rows_;
});
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
}>();

const showLeadtime = async (
  dateRange: { from: string; to: string } | undefined,
  organization_id: string
) => {
  if (dateRange == undefined) return;
  const data_average = await Leadtime.calcLeadtime(dateRange, organization_id);
  dataToshow.value = [data_average];
};

watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    await showLeadtime(props.dateRangeProps, props.organization_id);
  }
);

onMounted(async () => {
  if (props.dateRangeProps == undefined) return;
  await showLeadtime(props.dateRangeProps, props.organization_id);
});
</script>

