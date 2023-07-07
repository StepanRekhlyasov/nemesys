<template>
  <apexchart :options="chartOptionsR" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsR" row-key="name" />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptionsR, columnsR, dataNames } from './const';
import { useGetReport } from 'src/stores/getReport';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
import { useUserStore } from 'src/stores/user';
import { useOrganization } from 'src/stores/organization';
import { where } from 'firebase/firestore';
const apexchart = VueApexCharts;
const {getReport} = useGetReport();
const userStore = useUserStore();
const organizationStore = useOrganization();
const t = useI18n({ useScope: 'global' }).t;
const dataToShow = ref<(number | string)[][]>([]);
const userList = ref<{ id: string; name: string }[]>([]);

const rowsIndividual = ref<{ [key: string]: string | number }[]>([]);

const seriesIndividual = ref<
  { name: string; data: (number | string)[]; type: string }[]
>([]);
const rows = computed<{ [key: string]: string | number }[]>(() => {
  const dataToshowCnverted = dataToShow.value.map((rowData, index) => {
    return {
      name: t(dataNames[index]),
      number_of_calls_per_day: rowData[0],
      number_of_FAX_per_day: rowData[1],
      BO: rowData[2],
      BOIsfirst: rowData[3],
      BOIsnotfirst: rowData[4],
    };
  });
  return (dataToshowCnverted as {[key: string]: string | number }[]).concat(rowsIndividual.value);
});

const series = computed<
  { name: string; data: (number | string)[]; type: string }[]
>(() => {
  return dataToShow.value
    .map((rowData, index) => {
      return {
        name: t(dataNames[index]),
        data: rowData,
        type: 'line',
      };
    })
    .concat(seriesIndividual.value);
});

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();

const showIndividualReport = async (
  organizationId: string,
  userList: { id: string; name: string }[],
  dateRange?: { from: string; to: string }
) => {
  if (!dateRange) return;

  const users = await userStore.getUsersByConstrains([
    where('branch_id', '==', props.branch_id),
    where('deleted', '==', false),
    where(
      'organization_ids',
      'array-contains',
      organizationStore.currentOrganizationId
    ),
  ]);

  const rows = await getReport(
    users,
    undefined,
    dateRange,
    props.graph_type,
    ['BO', 'BOIsfirst', 'BOIsnotfirst'],
    undefined,
    undefined,
    false
  );
  rowsIndividual.value = rows;

  for (const row of rows) {
    seriesIndividual.value.push({
      name: row.name as string,
      data: [0, 0, row['BO'], row['BOIsfirst'], row['BOIsnotfirst']],
      type: 'bar',
    });
  }
  const allDataAverage_ = await getReport(
    undefined,
    undefined,
    dateRange,
    props.graph_type,
    ['BO', 'BOIsfirst', 'BOIsnotfirst'],
    undefined,
    undefined,
    true
  );
  const dataAverage_ = await getReport(
    undefined,
    undefined,
    dateRange,
    props.graph_type,
    ['BO', 'BOIsfirst', 'BOIsnotfirst'],
    undefined,
    organizationId,
    true
  );
  const dataAverage = [
    dataAverage_[0]['BO'],
    dataAverage_[0]['BOIsfirst'],
    dataAverage_[0]['BOIsnotfirst'],
  ];
  const allDataAverage = [
    allDataAverage_[0]['BO'],
    allDataAverage_[0]['BOIsfirst'],
    allDataAverage_[0]['BOIsnotfirst'],
  ];

  dataAverage.unshift(0);
  allDataAverage.unshift(0);
  dataAverage.unshift(0);
  allDataAverage.unshift(0);
  dataToShow.value = [dataAverage, allDataAverage];
};
watch(
  () => [props.branch_user_list, props.dateRangeProps],
  async () => {
    if (!props.dateRangeProps) return;
    if (props.branch_user_list.length != 0) {
      userList.value = props.branch_user_list;
      await showIndividualReport(
        props.organization_id,
        userList.value,
        props.dateRangeProps
      );
    }
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  if (props.branch_user_list.length != 0) {
    userList.value = props.branch_user_list;
    await showIndividualReport(
      props.organization_id,
      userList.value,
      props.dateRangeProps
    );
  }
});
</script>
