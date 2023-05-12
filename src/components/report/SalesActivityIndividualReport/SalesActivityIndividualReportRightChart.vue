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
import { Rows } from '../Models';
const { t } = useI18n({ useScope: 'global' });
const chartOptions = {
  chart: {},
  title:{
    text:t('report.title.BOAcquisitionStatus'),
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
      t('report.categories.number_of_calls_per_day'),
      t('report.categories.number_of_FAX_per_day'),
      t('report.categories.BO_total'),
      t('report.categories.BO_New'),
      t('report.categories.BO_Existing'),
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
const rows: Ref<any[]> = ref([]);
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string }|undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
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
    name: 'number_of_calls_per_day',
    align: 'center',
    label: t('report.categories.number_of_calls_per_day'),
    field: 'number_of_calls_per_day',
    sortable: true,
  },
  {
    name: 'number_of_FAX_per_day',
    align: 'center',
    label: t('report.categories.number_of_FAX_per_day'),
    field: 'number_of_FAX_per_day',
    sortable: true,
  },
  {
    name: 'BO_total',
    align: 'center',
    label: t('report.categories.BO_total'),
    field: 'BO_total',
    sortable: true,
  },
  {
    name: 'BO_New',
    align: 'center',
    label: t('report.categories.BO_New'),
    field: 'BO_New',
    sortable: true,
  },
  {
    name: 'BO_Existing',
    align: 'center',
    label: t('report.categories.BO_Existing'),
    field: 'BO_Existing',
    sortable: true,
  },
];

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数
const getReportByDate = async (
  IdAndNames_branch: { id: string; name: string }[],
  dateRange: { from: string; to: string }
) => {
  if (IdAndNames_branch == undefined) return;
  if (dateRange.from == undefined || dateRange.to == undefined) return;
  series.value = [];
  rows.value = [];
  // 0のリストをchartOption.xaxis.categories.length分作成する

  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'BO');
  const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  for (let IdAndName of IdAndNames_branch) {
    const Id: string = IdAndName.id;
    query_list[2] = query(
      collectionRef,
      where('id_registerUser', '==', Id),
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo)
    );
    query_list[3] = query(
      collectionRef,
      where('id_registerUser', '==', Id),
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('is_first','==',true)
    );
    query_list[4] = query(
      collectionRef,
      where('id_registerUser', '==', Id),
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('is_first','==',false)

    );
    let data = await Promise.all(
      query_list.map(async (query) => {
        if (query == undefined) return 0;
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );
    rows.value.push({
      name: IdAndName.name,
      number_of_calls_per_day: data[0],
      number_of_FAX_per_day: data[1],
      BO_total: data[2],
      BO_New: data[3],
      BO_Existing: data[4],
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
    const collectionRef = collection(db, 'BO');
    const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
    //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
    const organization_member_query = query(
      collection(db, 'users'),
      where('organization_ids', 'array-contains', organization_id)
    );
    const number_of_member_snapshot = await getCountFromServer(
      organization_member_query
    );
    const number_of_member = await number_of_member_snapshot.data().count;
    query_list[2] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('organization_id', '==', organization_id)
    );
    query_list[3] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('organization_id', '==', organization_id),
      where('is_first','==',true)
    );
    query_list[4] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('organization_id', '==', organization_id),
      where('is_first','==',false)

    );
    data_average = await Promise.all(
      query_list.map(async (query) => {
        if (query == undefined) return 0;
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
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const collectionRef = collection(db, 'BO');
    const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);

    //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
    const organization_member_query = query(collection(db, 'users'));
    const number_of_member_snapshot = await getCountFromServer(
      organization_member_query
    );
    const number_of_member = await number_of_member_snapshot.data().count;
    query_list[2] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo)
    );
    query_list[3] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('is_first','==',true)
    );
    query_list[4] = query(
      collectionRef,
      where('created_at', '>=', targetDateFrom),
      where('created_at', '<=', targetDateTo),
      where('is_first','==',false)

    );
    const data_average = await Promise.all(
      query_list.map(async (query) => {
        if (query == undefined) return 0;
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count / number_of_member;
      })
    );
    return data_average;
  };

  const data_average = await get_fix_off_ins_adm_average_list(
    dateRange,
    organization_id.value
  );
  const all_data_average = await get_fix_off_ins_adm_all_average_list(
    dateRange
  );
  rows.value.unshift({
    name: t('report.CompanyAverage'),
    number_of_calls_per_day: data_average[0],
    number_of_FAX_per_day: data_average[1],
    BO_total: data_average[2],
    BO_New: data_average[3],
    BO_Existing: data_average[4],
  });
  series.value.push({
    name: t('report.CompanyAverage'),
    data: data_average,
    type: 'line',
  });
  rows.value.unshift({
    name: t('report.AllAverage'),
    number_of_calls_per_day: all_data_average[0],
    number_of_FAX_per_day: all_data_average[1],
    BO_total: all_data_average[2],
    BO_New: all_data_average[3],
    BO_Existing: all_data_average[4],
  });
   series.value.push({
    name: t('report.AllAverage'),
    data: all_data_average,
    type: 'line',
  });
};

//props.branch_user_listが変更されたらdraw()を実行する
watch(
  () => props.branch_user_list,
  async () => {
    if(props.dateRangeProps==undefined)return;

    if (props.branch_user_list.length != 0) {
      user_list.value = props.branch_user_list;
      await getReportByDate(user_list.value, props.dateRangeProps);
    }
  }
);

watch(
  () => props.dateRangeProps,
  async () => {
    if(props.dateRangeProps==undefined)return;

    if (user_list.value.length != 0) {
      await getReportByDate(user_list.value, props.dateRangeProps);
    }
  }
);

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
  //0.5秒待つ
  if(props.dateRangeProps==undefined)return;

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
