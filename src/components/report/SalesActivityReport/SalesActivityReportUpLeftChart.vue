<template>
  <div class="col">
    <apexchart :options="chartOptions" :series="series"></apexchart>
    <q-table title="" :rows="rows" :columns="columns" row-key="name" />
  </div>
  <div class="col">
    <apexchart :options="chartOptionsR" :series="seriesR"></apexchart>
    <q-table title="" :rows="rowsR" :columns="columns" row-key="name" />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted } from 'vue';
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
  chart: {
    height: 800,
  },
  title:{
    text:t('report.title.FIXAndInspection'),
    style:{
      color:'gray'
    }
  },
  plotOptions: {
    bar: {
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
  yaxis: [
    {
      min: 0,

      labels: {
        formatter: function (value) {
          return value.toFixed(1) + '人'; // 目盛りに単位を付ける
        },
      },

    },
    {
      opposite: true,
      min: 0,
      max: 100,

      labels: {
        formatter: function (value) {
          return value.toFixed(1) + '%'; // 目盛りに単位を付ける
        },
      },

    },
  ],
  fill: {
    opacity: 1,
  },
};

const chartOptionsR = {
  chart: {
    height: 800,
  },
  title:{
    text:t('report.title.SalseProductivity'),
    style:{
      color:'gray'
    }
  },
  plotOptions: {
    bar: {
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
      t('report.categories.BO_total'),

    ],
  },
  yaxis: [
    {
      min: 0,



    },
  ],
  fill: {
    opacity: 1,
  },
};


const series: Ref<{ name: string; data: number[]; type: string }[]> = ref([]);
const seriesR: Ref<{ name: string; data: number[]; type: string }[]> = ref([]);

const user_list: Ref<{ id: string; name: string }[]> = ref([]);
const db = getFirestore();
const rows: Ref<{
  name: string;
  fix: number|string;
  inspection: number|string;
  offer: number|string;
  admission: number|string;
}[]> = ref([]);

const rowsR: Ref<{
  name: string;
  fix: number;
  inspection: number;
  offer: number;
  admission: number;
  BO_total: number;
}[]>=ref([]);

//auth.currentUser.uidとcollection usersのidが一致しているものを探す
//propsで渡されたbranch_idをbranch_idに代入
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string }|undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: string;
}>();

const columns = ref([
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
    name: 'BO_total',
    align: 'center',
    label: t('report.categories.BO_total'),
    field: 'BO_total',
    sortable: true,
  },
]);

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数

const get_fix_off_ins_adm_average_list = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  // 0のリストをchartOption.xaxis.categories.length分作成する
  series.value = [];
  rows.value = [];
  seriesR.value = [];
  rowsR.value = [];
  let data_average: number[] = Array(4).fill(0);
  let data_average_R: number[] = Array(5).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  const query_list_all: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  const query_list_R: Query<DocumentData>[] = Array(
    chartOptionsR.xaxis.categories.length
  ).fill(undefined);
  const query_list_all_R: Query<DocumentData>[] = Array(
    chartOptionsR.xaxis.categories.length
  ).fill(undefined);

  //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
  const organization_member_query = query(
    collection(db, 'users'),
    where('organization_ids', 'array-contains', organization_id)
  );
  const number_of_member_snapshot = await getCountFromServer(
    organization_member_query
  );
  let  DateTargets = ['data','data','data','data']
  if(props.graph_type=='BasedOnEachItemDate') {DateTargets = ['data','inspectionDate','offerDate','admissionDate']}
  else if(props.graph_type=='BasedOnFIXDate') { DateTargets = ['data','data','data','data']}
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

  const query_BO = query (
    collection(db, 'BO'),
    where('organization_id', '==', organization_id),
    where('created_at', '>=', targetDateFrom),
    where('created_at', '<=', targetDateTo),
  )
  const query_BO_all = query (
    collection(db, 'BO'),
    where('created_at', '>=', targetDateFrom),
    where('created_at', '<=', targetDateTo),
  )

  data_average = await Promise.all(
    query_list.map(async (query) => {
      const snapshot = await getCountFromServer(query);
      return snapshot.data().count ;
    })
  );
  const BO = await  getCountFromServer(query_BO).then((snapshot) => {
    return snapshot.data().count;
  });
  const BO_all = await  getCountFromServer(query_BO_all).then((snapshot) => {
    return snapshot.data().count;
  });
  //data_average の末尾に0をつけdata_average_Rに代入
 //data_averageをdata_average_Rにdeep copy
  data_average_R = [...data_average];

  data_average_R.push(BO);
  const data_cvr = data_average.map((num, idx) => {
    if (idx == 0) return '100.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  rows.value.push({
    name: t('report.CompanyTotal'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
  });
  rowsR.value.push({
    name: t('report.CompanyTotal'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
    BO_total: data_average_R[4],
  });
  rows.value.push({
    name: t('report.CVR'),
    fix: data_cvr[0],
    inspection: data_cvr[1],
    offer: data_cvr[2],
    admission: data_cvr[3],
  });
  series.value.push({
    name: t('report.CompanyTotal'),
    data: data_average,
    type: 'bar',
  });
  series.value.push({
    name: t('report.CVR'),
    data: data_cvr,
    type: 'line',
  });
  seriesR.value.push({
    name: t('report.CompanyTotal'),
    data: data_average_R,
    type: 'bar',
  });
  const organization_member_query_all = query(collection(db, 'users'));
  const number_of_member_snapshot_all = await getCountFromServer(
    organization_member_query_all
  );
  const number_of_member_all = await number_of_member_snapshot_all.data().count;
  query_list_all[0] = query(
    collectionRef,
    where(DateTargets[0], '>=', targetDateFrom),
    where(DateTargets[0], '<=', targetDateTo),
    where('status', '==', 'ok')
  );
  query_list_all[1] = query(
    collectionRef,
    where(DateTargets[1], '>=', targetDateFrom),
    where(DateTargets[1], '<=', targetDateTo),
    where('inspectionStatus', '==', 'ok')
  );
  query_list_all[2] = query(
    collectionRef,
    where(DateTargets[2], '>=', targetDateFrom),
    where(DateTargets[2], '<=', targetDateTo),
    where('offerStatus', '==', 'ok')
  );
  query_list_all[3] = query(
    collectionRef,
    where(DateTargets[3], '>=', targetDateFrom),
    where(DateTargets[3], '<=', targetDateTo),
    where('admissionStatus', '==', 'ok')
  );
  const data_average_all = await Promise.all(
    query_list_all.map(async (query) => {
      const snapshot = await getCountFromServer(query);
      return snapshot.data().count ;
    })
  );
  let data_average_all_R = [...data_average_all];
  data_average_all_R.push(BO_all);
  const data_cvr_all = data_average_all.map((num, idx) => {
    if (idx == 0) return '100.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  seriesR.value.push({
    name: t('report.Total'),
    data: data_average_all_R,
    type: 'bar',
  });
  rowsR.value.push({
    name: t('report.Total'),
    fix: data_average_all[0],
    inspection: data_average_all[1],
    offer: data_average_all[2],
    admission: data_average_all[3],
    BO_total: data_average_all_R[4],
  });
  series.value.push({
    name: t('report.AllCVR'),
    data: data_cvr_all,
    type: 'line',
  });
  rows.value.push({
    name: t('report.AllCVR'),
    fix: data_cvr_all[0],
    inspection: data_cvr_all[1],
    offer: data_cvr_all[2],
    admission: data_cvr_all[3],
  });
}
watch(
  () => props.branch_user_list,
  async () => {
    user_list.value = await props.branch_user_list;
    if(props.dateRangeProps==undefined)return;

    await get_fix_off_ins_adm_average_list(

      props.dateRangeProps,
      props.organization_id
    );
  }
);

watch(
  () => props.dateRangeProps,
  async () => {
    if(props.dateRangeProps==undefined)return;

    await get_fix_off_ins_adm_average_list(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

watch (
  () => props.graph_type,
  async () =>{
    if(props.dateRangeProps==undefined)return;

    await get_fix_off_ins_adm_average_list(
      props.dateRangeProps,
      props.organization_id
    );
  }
)

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
  if(props.dateRangeProps==undefined)return;

  await new Promise((resolve) => setTimeout(resolve, 500));
  await get_fix_off_ins_adm_average_list(
    props.dateRangeProps,
    props.organization_id
  );
})
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
