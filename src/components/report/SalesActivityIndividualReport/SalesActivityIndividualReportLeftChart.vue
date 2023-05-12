<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup lang="ts">
import { ref, Ref, watch, defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  collection,
  query,
  where,
  getFirestore,
  getCountFromServer,
  Query,
  DocumentData,
} from 'firebase/firestore';
const { t } = useI18n({ useScope: 'global' });
const chartOptions = {
  chart: {},
  title:{
    text:t('report.title.IndividualPerformanceStatus'),
    style:{
      color:'gray'
    }
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
  xaxis: {
    categories: [
      t('report.categories.fix'),
      t('report.categories.inspection'),
      t('report.categories.offer'),
      t('report.categories.admission'),
    ],
  },
  yaxis: {
    min: 0,
    labels: {
      formatter: function (value) {
        return value.toFixed(1) + '人'; // 目盛りに単位を付ける
      },
    },
  },
  fill: {
    opacity: 1,
  },
};
const series: Ref<{ name: string; data: number[]; type: string }[]> = ref([]);
const user_list: Ref<{ id: string; name: string }[]> = ref([]);
const organization_id = ref('');
const db = getFirestore();
let DateTargets: string[] = [];
const rows: Ref<
  {
    name: string;
    fix: number;
    inspection: number;
    offer: number;
    admission: number;
    inspection_rate: string;
    offer_rate: string;
    admission_rate: string;
  }[]
> = ref([]);
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: string;
}>();
//branch_idが渡されている場合はbranch_idをbranch_inputに代入watchでbranch_idが変更されたらbranch_inputを変更

const columns = [
  {
    name: 'name',
    required: true,
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'fix',
    align: 'center',
    label: t('report.categories.fix'),
    field: 'fix',
    sortable: true,
  },
  {
    name: 'inspection',
    align: 'center',
    label: t('report.categories.inspection'),
    field: 'inspection',
    sortable: true,
  },
  {
    name: 'offer',
    align: 'center',
    label: t('report.categories.offer'),
    field: 'offer',
    sortable: true,
  },
  {
    name: 'admission',
    align: 'center',
    label: t('report.categories.admission'),
    field: 'admission',
    sortable: true,
  },
  {
    name: 'inspection_rate',
    align: 'center',
    label: t('report.categories.inspection_rate'),
    field: 'inspection_rate',
    sortable: true,
  },
  {
    name: 'offer_rate',
    align: 'center',
    label: t('report.categories.offer_rate'),
    field: 'offer_rate',
    sortable: true,
  },
  {
    name: 'admission_rate',
    align: 'center',
    label: t('report.categories.admission_rate'),
    field: 'admission_rate',
    sortable: true,
  },
];

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数
const getReportByDate = async (
  IdAndNames_branch: { id: string; name: string }[],
  dateRange: { from: string; to: string }
) => {
  if (props.graph_type == 'BasedOnEachItemDate') {
    DateTargets = ['data', 'inspectionDate', 'offerDate', 'admissionDate'];
  } else if (props.graph_type == 'BasedOnFIXDate') {
    DateTargets = ['data', 'data', 'data', 'data'];
  }
  if (IdAndNames_branch == undefined) return;
  if (dateRange.from == undefined || dateRange.to == undefined) return;
  series.value = [];
  rows.value = [];
  // 0のリストをchartOption.xaxis.categories.length分作成する
  let data_average = Array(chartOptions.xaxis.categories.length).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  for (let IdAndName of IdAndNames_branch) {
    const Id: string = IdAndName.id;
    query_list[0] = query(
      collectionRef,
      where('contactPerson', '==', Id),
      where(DateTargets[0], '>=', targetDateFrom),
      where(DateTargets[0], '<=', targetDateTo),
      where('status', '==', 'ok')
    );
    query_list[1] = query(
      collectionRef,
      where('chargeOfInspection', '==', Id),
      where(DateTargets[1], '>=', targetDateFrom),
      where(DateTargets[1], '<=', targetDateTo),
      where('inspectionStatus', '==', 'ok')
    );
    query_list[2] = query(
      collectionRef,
      where('chargeOfOffer', '==', Id),
      where(DateTargets[2], '>=', targetDateFrom),
      where(DateTargets[2], '<=', targetDateTo),
      where('offerStatus', '==', 'ok')
    );
    query_list[3] = query(
      collectionRef,
      where('chargeOfAdmission', '==', Id),
      where(DateTargets[3], '>=', targetDateFrom),
      where(DateTargets[3], '<=', targetDateTo),
      where('admissionStatus', '==', 'ok')
    );
    const data = await Promise.all(
      query_list.map(async (query) => {
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );
    const data_cvr = data.map((num, idx) => {
      if (idx == 0) return '100.0%';
      if (data[idx - 1] == 0) return '0.0%';
      const per = (data[idx] / data[idx - 1]) * 100;
      const per_str = per.toFixed(1);
      return per_str + '%';
    });

    rows.value.push({
      name: IdAndName.name,
      fix: data[0],
      inspection: data[1],
      offer: data[2],
      admission: data[3],
      inspection_rate: data_cvr[1],
      offer_rate: data_cvr[2],
      admission_rate: data_cvr[3],
    });
    series.value.push({
      name: IdAndName.name,
      data: data,
      type: 'bar',
    });
  }

  const get_fix_off_ins_adm_average_list = async (
    dateRange: { from: string; to: string },
    organization_id: string
  ): Promise<number[]> => {
    // 0のリストをchartOption.xaxis.categories.length分作成する
    let data_average: number[] = Array(4).fill(0);
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const collectionRef = collection(db, 'fix');
    const query_list: Query<DocumentData>[] = [];
    //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
    const organization_member_query = query(
      collection(db, 'users'),
      where('organization_ids', 'array-contains', organization_id)
    );
    const number_of_member_snapshot = await getCountFromServer(
      organization_member_query
    );

    const number_of_member = await number_of_member_snapshot.data().count;
    query_list[0] = query(
      collectionRef,
      where('organization_id', '==', organization_id),
      where(DateTargets[0], '>=', targetDateFrom),
      where(DateTargets[0], '<=', targetDateTo),
      where('status', '==', 'ok')
    );
    query_list[1] = query(
      collectionRef,
      where('organization_id', '==', organization_id),
      where(DateTargets[1], '>=', targetDateFrom),
      where(DateTargets[1], '<=', targetDateTo),
      where('inspectionStatus', '==', 'ok')
    );
    query_list[2] = query(
      collectionRef,
      where('organization_id', '==', organization_id),
      where(DateTargets[2], '>=', targetDateFrom),
      where(DateTargets[2], '<=', targetDateTo),
      where('offerStatus', '==', 'ok')
    );
    query_list[3] = query(
      collectionRef,
      where('organization_id', '==', organization_id),
      where(DateTargets[3], '>=', targetDateFrom),
      where(DateTargets[3], '<=', targetDateTo),
      where('admissionStatus', '==', 'ok')
    );
    data_average = await Promise.all(
      query_list.map(async (query) => {
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count / number_of_member;
      })
    );
    return data_average;
  };

  const get_fix_off_ins_adm_all_average_list = async (dateRange: {
    from: string;
    to: string;
  }): Promise<number[]> => {
    // 0のリストをchartOption.xaxis.categories.length分作成する
    let data_average: number[] = Array(4).fill(0);
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const collectionRef = collection(db, 'fix');
    const query_list: Query<DocumentData>[] = [];
    //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
    const organization_member_query = query(collection(db, 'users'));
    const number_of_member_snapshot = await getCountFromServer(
      organization_member_query
    );
    const number_of_member = await number_of_member_snapshot.data().count;
    query_list[0] = query(
      collectionRef,
      where(DateTargets[0], '>=', targetDateFrom),
      where(DateTargets[0], '<=', targetDateTo),
      where('status', '==', 'ok')
    );
    query_list[1] = query(
      collectionRef,
      where(DateTargets[1], '>=', targetDateFrom),
      where(DateTargets[1], '<=', targetDateTo),
      where('inspectionStatus', '==', 'ok')
    );
    query_list[2] = query(
      collectionRef,
      where(DateTargets[2], '>=', targetDateFrom),
      where(DateTargets[2], '<=', targetDateTo),
      where('offerStatus', '==', 'ok')
    );
    query_list[3] = query(
      collectionRef,
      where(DateTargets[3], '>=', targetDateFrom),
      where(DateTargets[3], '<=', targetDateTo),
      where('admissionStatus', '==', 'ok')
    );
    data_average = await Promise.all(
      query_list.map(async (query) => {
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count / number_of_member;
      })
    );
    return data_average;
  };

  data_average = await get_fix_off_ins_adm_average_list(
    dateRange,
    organization_id.value
  );
  const all_data_average = await get_fix_off_ins_adm_all_average_list(
    dateRange
  );
  const data_average_cvr = data_average.map((num, idx) => {
    if (idx == 0) return '100.0%';
    if (data_average[idx - 1] == 0) return '0.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  const all_data_average_cvr = data_average.map((num, idx) => {
    if (idx == 0) return '100.0%';
    if (data_average[idx - 1] == 0) return '0.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  rows.value.unshift({
    name: t('report.CompanyAverage'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
    inspection_rate: data_average_cvr[1],
    offer_rate: data_average_cvr[2],
    admission_rate: data_average_cvr[3],
  });
  await series.value.push({
    name: t('report.CompanyAverage'),
    data: data_average,
    type: 'line',
  });
  rows.value.unshift({
    name: t('report.AllAverage'),
    fix: all_data_average[0],
    inspection: all_data_average[1],
    offer: all_data_average[2],
    admission: all_data_average[3],
    inspection_rate: all_data_average_cvr[1],
    offer_rate: all_data_average_cvr[2],
    admission_rate: all_data_average_cvr[3],
  });
  await series.value.push({
    name: t('report.AllAverage'),
    data: all_data_average,
    type: 'line',
  });
};

//props.branch_user_listが変更されたらdraw()を実行する
watch(
  () => props.branch_user_list,
  async () => {
    if (props.branch_user_list.length != 0) {
      if (props.dateRangeProps == undefined) return;

      user_list.value = props.branch_user_list;
      await getReportByDate(user_list.value, props.dateRangeProps);
    }
  }
);

watch(
  () => props.dateRangeProps,
  async () => {
    if (user_list.value.length != 0) {
      if (props.dateRangeProps == undefined) return;

      await getReportByDate(user_list.value, props.dateRangeProps);
    }
  }
);

watch(
  () => props.graph_type,
  async () => {
    if (props.dateRangeProps == undefined) return;

    await getReportByDate(user_list.value, props.dateRangeProps);
  }
);

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
  //0.5秒待つ
  await new Promise((resolve) => setTimeout(resolve, 500));
  user_list.value = props.branch_user_list;
  organization_id.value = props.organization_id;
  await getReportByDate(user_list.value, props.dateRangeProps);
});
</script>

<script lang="ts">
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'ChartExample',
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
