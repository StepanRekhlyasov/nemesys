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
const chartOptions = ref({
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
      t('report.categories.fix') + '-' + t('report.categories.inspection'),
      t('report.categories.inspection') + '-' + t('report.categories.offer'),
      t('report.categories.offer') + '-' + t('report.categories.admission'),
    ],
  },
  yaxis: [
    {
      min: 0,
      max: 100,

      labels: {
        formatter: function (value) {
          return value.toFixed(2) + '%'; // 目盛りに単位を付ける
        },
      },
    },
  ],
  fill: {
    opacity: 1,
  },
});

// t('report.Applicant'),
//       t('report.ValidApplicant'),
//       t('report.CompanyAverage'),
//       t('report.NumberOfContacts'),
//       t('report.NumberOfInvitations'),
//       t('report.NumberOfAttendance'),
const series: Ref<{ name: string; data: number[]; type: string }[]> = ref([]);
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
  dateRangeProps: { from: string; to: string };
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
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
    where('data', '>=', targetDateFrom),
    where('data', '<=', targetDateTo),
    where('status', '==', 'ok')
  );
  query_list[1] = query(
    collectionRef,
    where('organization_id', '==', organization_id),
    where('inspectionDate', '>=', targetDateFrom),
    where('inspectionDate', '<=', targetDateTo),
    where('inspectionStatus', '==', 'ok')
  );
  query_list[2] = query(
    collectionRef,
    where('organization_id', '==', organization_id),
    where('offerDate', '>=', targetDateFrom),
    where('offerDate', '<=', targetDateTo),
    where('offerStatus', '==', 'ok')
  );
  query_list[3] = query(
    collectionRef,
    where('organization_id', '==', organization_id),
    where('admissionDate', '>=', targetDateFrom),
    where('admissionDate', '<=', targetDateTo),
    where('admissionStatus', '==', 'ok')
  );
  data_average = await Promise.all(
    query_list.map(async (query) => {
      const snapshot = await getCountFromServer(query);
      return snapshot.data().count / number_of_member;
    })
  );
  const data_cvr = data_average.map((num, idx) => {
    if (idx == 0) return 100;
    else return (data_average[idx] / data_average[idx - 1]) * 100;
  });
  rows.value.push({
    name: t('report.CompanyAverage'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
  });
  rows.value.push({
    name: t('report.CVR'),
    fix: data_cvr[0],
    inspection: data_cvr[1],
    offer: data_cvr[2],
    admission: data_cvr[3],
  });
  series.value.push({
    name: t('report.CompanyAverage'),
    data: data_average,
    type: 'bar',
  });
  series.value.push({
    name: t('report.CVR'),
    data: data_cvr,
    type: 'line',
  });
};

watch(
  () => props.branch_user_list,
  async () => {
    user_list.value = await props.branch_user_list;
    await get_fix_off_ins_adm_average_list(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

watch(
  () => props.dateRangeProps,
  async () => {
    await get_fix_off_ins_adm_average_list(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await get_fix_off_ins_adm_average_list(
    props.dateRangeProps,
    props.organization_id
  );
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
