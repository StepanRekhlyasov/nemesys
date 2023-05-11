<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
  <q-table title="" :rows="rows" :columns="columns" row-key="name" />
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
      t('report.categories.Applicant'),
      t('report.categories.ValidApplicant'),
      t('report.categories.NumberOfContacts'),
      t('report.categories.NumberOfInvitations'),
      t('report.categories.NumberOfAttendance'),
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

const series: Ref<{ name: string; data: number[] | string[]; type: string }[]> =
  ref([]);
const user_list: Ref<{ id: string; name: string }[]> = ref([]);
const db = getFirestore();
const rows: Ref<
  {
    name: string;
    fix: number;
    inspection: number;
    offer: number;
    admission: number;
  }[]
> = ref([]);
//auth.currentUser.uidとcollection usersのidが一致しているものを探す
//propsで渡されたbranch_idをbranch_idに代入
const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string }|null;
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
    name: 'Applicant',
    align: 'center',
    label: t('report.categories.Applicant'),
    field: 'Applicant',
    sortable: true,
  },
  {
    name: 'ValidApplicant',
    align: 'center',
    label: t('report.categories.ValidApplicant'),
    field: 'ValidApplicant',
    sortable: true,
  },
  {
    name: 'NumberOfContacts',
    align: 'center',
    label: t('report.categories.NumberOfContacts'),
    field: 'NumberOfContacts',
    sortable: true,
  },
  {
    name: 'NumberOfInvitations',
    align: 'center',
    label: t('report.categories.NumberOfInvitations'),
    field: 'NumberOfInvitations',
    sortable: true,
  },
  {
    name: 'NumberOfAttendance',
    align: 'center',
    label: t('report.categories.NumberOfAttendance'),
    field: 'NumberOfAttendance',
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
]);

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数

const get_fix_off_ins_adm_average_list = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  // 0のリストをchartOption.xaxis.categories.length分作成する
  series.value = [];
  rows.value = [];
  let data_average: number[] = Array(4).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const fixCollectionRef = collection(db, 'fix');
  const applicantsCollectionRef = collection(db, 'applicants');
  const query_list: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  const query_list_all: Query<DocumentData>[] = Array(
    chartOptions.xaxis.categories.length
  ).fill(undefined);
  let DateTargets: string[] = [];
  if (props.graph_type=='BasedOnFIXDate') {
    DateTargets = [
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
    ];
  } else {
    DateTargets = [
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'applicationDate',
      'data',
      'inspectionDate',
      'offerDate',
      'admissionDate',
    ];
  }
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
    applicantsCollectionRef,
    where(DateTargets[0], '>=', targetDateFrom),
    where(DateTargets[0], '<=', targetDateTo)
  );
  query_list[1] = query(
    applicantsCollectionRef,
    where(DateTargets[1], '>=', targetDateFrom),
    where(DateTargets[1], '<=', targetDateTo)
  );
  query_list[2] = query(
    applicantsCollectionRef,
    where(DateTargets[2], '>=', targetDateFrom),
    where(DateTargets[2], '<=', targetDateTo),
    where('contactStatus', '==', true)
  );
  query_list[3] = query(
    applicantsCollectionRef,
    where(DateTargets[3], '>=', targetDateFrom),
    where(DateTargets[3], '<=', targetDateTo),
    where('attractionStatus', '==', true)
  );
  query_list[4] = query(
    applicantsCollectionRef,
    where(DateTargets[4], '>=', targetDateFrom),
    where(DateTargets[4], '<=', targetDateTo),
    where('attendStatus', '==', true)
  );
  query_list[5] = query(
    fixCollectionRef,
    where('organization_id', '==', organization_id),
    where(DateTargets[5], '>=', targetDateFrom),
    where(DateTargets[5], '<=', targetDateTo),
    where('status', '==', 'ok'),
    where('ignore','==',false)
  );
  query_list[6] = query(
    fixCollectionRef,
    where('organization_id', '==', organization_id),
    where(DateTargets[6], '>=', targetDateFrom),
    where(DateTargets[6], '<=', targetDateTo),
    where('inspectionStatus', '==', 'ok'),
    where('ignore','==',false)

  );
  query_list[7] = query(
    fixCollectionRef,
    where('organization_id', '==', organization_id),
    where(DateTargets[7], '>=', targetDateFrom),
    where(DateTargets[7], '<=', targetDateTo),
    where('offerStatus', '==', 'ok'),
    where('ignore','==',false)

  );
  query_list[8] = query(
    fixCollectionRef,
    where('organization_id', '==', organization_id),
    where(DateTargets[8], '>=', targetDateFrom),
    where(DateTargets[8], '<=', targetDateTo),
    where('admissionStatus', '==', 'ok'),
    where('ignore','==',false)

  );
  data_average = await Promise.all(
    query_list.map(async (query) => {
      if (query == undefined) return 0;

      const snapshot = await getCountFromServer(query);
      return snapshot.data().count;
    })
  );
  const data_cvr = data_average.map((num, idx) => {
    if (idx == 0) return '100.0%';
    if (data_average[idx - 1] == 0) return '0.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });

  rows.value.push({
    name: t('report.CompanyTotal'),
    fix: data_average[6],
    inspection: data_average[7],
    offer: data_average[8],
    admission: data_average[9],
  });
  rows.value.push({
    name: t('report.CVR'),
    fix: data_cvr[6],
    inspection: data_cvr[7],
    offer: data_cvr[8],
    admission: data_cvr[9],
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

  const organization_member_query_all = query(collection(db, 'users'));
  const number_of_member_snapshot_all = await getCountFromServer(
    organization_member_query_all
  );
  const number_of_member_all = await number_of_member_snapshot_all.data().count;
  query_list_all[5] = query(
    fixCollectionRef,
    where('data', '>=', targetDateFrom),
    where('data', '<=', targetDateTo),
    where('status', '==', 'ok')
  );
  query_list_all[6] = query(
    fixCollectionRef,
    where('inspectionDate', '>=', targetDateFrom),
    where('inspectionDate', '<=', targetDateTo),
    where('inspectionStatus', '==', 'ok')
  );
  query_list_all[7] = query(
    fixCollectionRef,
    where('offerDate', '>=', targetDateFrom),
    where('offerDate', '<=', targetDateTo),
    where('offerStatus', '==', 'ok')
  );
  query_list_all[8] = query(
    fixCollectionRef,
    where('admissionDate', '>=', targetDateFrom),
    where('admissionDate', '<=', targetDateTo),
    where('admissionStatus', '==', 'ok')
  );
  const data_average_all = await Promise.all(
    query_list_all.map(async (query) => {
      if (query == undefined) return 0;
      const snapshot = await getCountFromServer(query);
      return snapshot.data().count / number_of_member_all;
    })
  );
  const data_cvr_all = data_average_all.map((num, idx) => {
    if (idx == 0) return '100.0%';
    if (data_average[idx - 1] == 0) return '0.0%';
    const per = (data_average[idx] / data_average[idx - 1]) * 100;
    const per_str = per.toFixed(1);
    return per_str + '%';
  });
  series.value.push({
    name: t('report.AllCVR'),
    data: data_cvr_all,
    type: 'line',
  });
  rows.value.push({
    name: t('report.AllCVR'),
    fix: data_cvr_all[6],
    inspection: data_cvr_all[7],
    offer: data_cvr_all[8],
    admission: data_cvr_all[9],
  });
};

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
  ()=>props.graph_type,
  async () => {
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
});
</script>

<script lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { async } from '@firebase/util';

export default {
  name: 'ChartExample',
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
