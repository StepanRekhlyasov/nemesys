<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  chartOptions,
  columns,
  dataNames,
  itemList,
  itemRateList,
} from './const';
import { useGetReport } from 'src/stores/getReport';
import { calculateCVR } from '../reportUtil';
import { listToFixed } from 'src/shared/utils/KPI.utils';
import { useUserStore } from 'src/stores/user';
import { graphType } from '../Models';
import VueApexCharts from 'vue3-apexcharts';
import { useOrganization } from 'src/stores/organization';
import { where } from 'firebase/firestore';
import { getListFromObject } from '../reportUtil';
type RowsType = { [key: string]: string | number }[];
const { getReport } = useGetReport();
const apexchart = VueApexCharts;
const userStore = useUserStore();
const organizationStore = useOrganization();
const { t } = useI18n({ useScope: 'global' });
const dataToShow = ref<(number | string)[][]>([]);
const dataToShowCVR = ref<(number | string)[][]>([]);
const rowsIndividual = ref<RowsType>([]);

const seriesList = ref<
  { name: string; data: (number | string)[]; type: string }[]
>([]);
const rows = computed<RowsType>(() => {
  const dataToshowCnverted = dataToShow.value.map((rowData, index) => {
    return {
      name: t(dataNames[index]),
      fix: rowData[0],
      inspection: rowData[1],
      offer: rowData[2],
      admission: rowData[3],
      inspectionRate: dataToShowCVR.value[index][1],
      offerRate: dataToShowCVR.value[index][2],
      admissionRate: dataToShowCVR.value[index][3],
    };
  });
  return (dataToshowCnverted as RowsType).concat(rowsIndividual.value);
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
    .concat(seriesList.value);
});
const userList = ref<{ id: string; name: string }[]>([]);
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  graph_type: graphType;
}>();

const showIndividualReport = async (
  range: { from: string; to: string } | undefined
) => {
  seriesList.value = [];
  rowsIndividual.value = [];
  dataToShow.value = [];
  dataToShowCVR.value = [];
  const seriesListPre: {
    name: string;
    data: (number | string)[];
    type: string;
  }[] = [];
  if (!range) return;
  const users = await userStore.getUsersByConstrains([
    where('branch_id', '==', props.branch_id),
    where('deleted', '==', false),
    where(
      'organization_ids',
      'array-contains',
      organizationStore.currentOrganizationId
    ),
  ]);
  if (users.length !== 0) {
    const rows = await getReport({
      users: users,
      dateRange: range,
      rateNames: itemRateList,
      graphType: props.graph_type,
      queryNames: itemList,
      isAverage: false,
    });
    rowsIndividual.value = rows;

    for (const row of rows) {
      seriesListPre.push({
        name: row.name as string,
        data: [row['fix'], row['inspection'], row['offer'], row['admission']],
        type: 'bar',
      });
    }
    seriesList.value = seriesListPre;
  }

  const allDataAverage = listToFixed(
    getListFromObject(
      await getReport({
        dateRange: range,
        graphType: props.graph_type,
        queryNames: itemList,
        isAverage: true,
      }),
      itemList.map((item) => {
        return item.queryName;
      })
    ) as number[]
  );

  const dataAverage = listToFixed(
    getListFromObject(
      await getReport({
        dateRange: range,
        graphType: props.graph_type,
        queryNames: itemList,
        isAverage: true,
        organizationId: organizationStore.currentOrganizationId,
      }),
      itemList.map((item) => {
        return item.queryName;
      })
    ) as number[]
  );

  const dataAverageCvr = listToFixed(calculateCVR(dataAverage as number[]));
  const allDataAverageCvr = listToFixed(
    calculateCVR(allDataAverage as number[])
  );
  dataToShow.value = [dataAverage, allDataAverage];
  dataToShowCVR.value = [dataAverageCvr, allDataAverageCvr];
};

watch(
  () => [
    props.dateRangeProps,
    props.graph_type,
    props.branch_id,
  ],
  async () => {
    userList.value = await userStore.getAllUsersInBranch(props.branch_id);
    await showIndividualReport(props.dateRangeProps);
  }
);

onMounted(async () => {
  //wait 0.1sec
  await new Promise((resolve) => setTimeout(resolve, 100));
  userList.value = await userStore.getAllUsersInBranch(props.branch_id);
  await showIndividualReport(props.dateRangeProps);
});
</script>
