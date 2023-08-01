<template>
  <apexchart :options="chartOptionsR" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columnsR" row-key="name" />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { chartOptionsR, columnsR, dataNames, itemListRight } from './const';
import { listToFixed } from 'src/shared/utils/KPI.utils';
import { useGetReport } from 'src/stores/getReport';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
import { useUserStore } from 'src/stores/user';
import { useOrganization } from 'src/stores/organization';
import { where } from 'firebase/firestore';
import { getListFromObject } from '../reportUtil';
const apexchart = VueApexCharts;
const { getReport } = useGetReport();
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
  return (dataToshowCnverted as { [key: string]: string | number }[]).concat(
    rowsIndividual.value
  );
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
  dateRange?: { from: string; to: string }
) => {
  if (!dateRange) return;
  seriesIndividual.value = [];

  const users = await userStore.getUsersByConstrains([
    where('branch_id', '==', props.branch_id),
    where('deleted', '==', false),
    where(
      'organization_ids',
      'array-contains',
      organizationStore.currentOrganizationId
    ),
  ]);

  const rows = await getReport({
    dateRange: dateRange,
    graphType: props.graph_type,
    queryNames: itemListRight,
    isAverage: false,
    users: users,
  });
  rowsIndividual.value = rows;

  for (const row of rows) {
    seriesIndividual.value.push({
      name: row.name as string,
      data: [
        0,
        0,
        row[itemListRight[0].queryName],
        row[itemListRight[0].queryName],
        row[itemListRight[2].queryName],
      ],
      type: 'bar',
    });
  }

  const allDataAverage = listToFixed(
    getListFromObject(
      await getReport({
        dateRange: dateRange,
        graphType: props.graph_type,
        queryNames: itemListRight,
        organizationId: undefined,
        isAverage: true,
      }),
      itemListRight.map((item) => {
        return item.queryName;
      })
    ) as number[]
  );

  const dataAverage = listToFixed(
    getListFromObject(
      await getReport({
        dateRange: dateRange,
        graphType: props.graph_type,
        queryNames: itemListRight,
        organizationId: organizationId,
        isAverage: true,
      }),
      itemListRight.map((item) => {
        return item.queryName;
      })
    ) as number[]
  );

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
      await showIndividualReport(props.organization_id, props.dateRangeProps);
    }
  }
);

onMounted(async () => {
  if (!props.dateRangeProps) return;
  if (props.branch_user_list.length != 0) {
    userList.value = props.branch_user_list;
    await showIndividualReport(props.organization_id, props.dateRangeProps);
  }
});
</script>
