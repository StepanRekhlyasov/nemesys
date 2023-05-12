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
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
const { t } = useI18n({ useScope: 'global' });
const chartOptions = ref({
  chart: {
    height: 800,
  },
  title:{
    text:t('report.title.Leadtime'),
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
      t('report.categories.Applicant') +
        '-' +
        t('report.categories.Invitations'),
      t('report.categories.Invitations') + '-' + t('report.categories.fix'),
      t('report.categories.fix') + '-' + t('report.categories.inspection'),
      t('report.categories.inspection') + '-' + t('report.categories.offer'),
      t('report.categories.offer') + '-' + t('report.categories.admission'),
    ],
  },
  yaxis: [
    {
      min: 0,

      labels: {
        formatter: function (value) {
          return value.toFixed(1) + '日'; // 目盛りに単位を付ける
        },
      },
    },
  ],
  fill: {
    opacity: 1,
  },
});

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
  dateRangeProps: { from: string; to: string } | null;
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
    name: 'invitations',
    align: 'center',
    label:
      t('report.categories.Applicant') +
      '-' +
      t('report.categories.Invitations'),
    field: 'invitations',
    sortable: true,
  },
  {
    name: 'fix',
    align: 'center',
    label:
      t('report.categories.Invitations') + '-' + t('report.categories.fix'),
    field: 'fix',
    sortable: true,
  },
  {
    name: 'inspection',
    align: 'center',
    label: t('report.categories.fix') + '-' + t('report.categories.inspection'),
    field: 'inspection',
    sortable: true,
  },
  {
    name: 'offer',
    align: 'center',
    label:
      t('report.categories.inspection') + '-' + t('report.categories.offer'),
    field: 'offer',
    sortable: true,
  },
  {
    name: 'admission',
    align: 'center',
    label:
      t('report.categories.offer') + '-' + t('report.categories.admission'),
    field: 'admission',
    sortable: true,
  },
]);
//applicants collectionからdocument id  が　aplicant_idと一致するものを取り出す関数

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数

const get_fix_off_ins_adm_average_list = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  // 0のリストをchartOption.xaxis.categories.length分作成する
  series.value = [];
  rows.value = [];
  let data_average: number[] = Array(5).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  const query_list: Query<DocumentData>[] = [];
  //collection usersの中からorganization_idがmap field organization_idsの中にあるものを取得しそ
  const organization_member_query = query(
    collection(db, 'users'),
    where('organization_ids', 'array-contains', organization_id)
  );
  //collectionRefからwhereでdataの範囲を指定しするquaryを書く
  const query_data = query(
    collectionRef,
    where('data', '>=', targetDateFrom),
    where('data', '<=', targetDateTo)
  );
  const snapshot = await getDocs(query_data);
  let num_i_d = 0;
  let num_o_i = 0;
  let num_a_o = 0;
  let num_ap = 0;

  await Promise.all(
    snapshot.docs.map(async (doc_) => {
      const data = doc_.data();
      const offerDate = data.offerDate;
      const dataDate = data.data;
      const inspectiondate = data.inspectionDate;
      const admissiondate = data.admissionDate;
      const applicantData = (
        await getDoc(doc(db, 'applicants', data.applicant_id))
      ).data();

      if (
        applicantData !== undefined &&
        applicantData.attractionDate !== undefined
      ) {
        data_average[0] +=
          (applicantData.attractionDate - applicantData.applicationDate) /
          (60 * 60 * 24);
        data_average[1] +=
          (dataDate - applicantData.attractionDate) / (60 * 60 * 24);
        num_ap += 1;
      }

      if (inspectiondate !== undefined) {
        data_average[2] += (inspectiondate - dataDate) / (60 * 60 * 24);
        num_i_d += 1;
      }
      if (offerDate !== undefined) {
        data_average[3] += (offerDate - inspectiondate) / (60 * 60 * 24);
        num_o_i += 1;
      }
      if (admissiondate !== undefined) {
        data_average[4] += (admissiondate - offerDate) / (60 * 60 * 24);
        num_a_o += 1;
      }
    })
  );
  //data_averageをsnapshot.sizeで割る
  data_average[0] /= num_ap;
  data_average[1] /= num_ap;
  data_average[2] /= num_i_d;
  data_average[3] /= num_o_i;
  data_average[4] /= num_a_o;

  rows.value.push({
    name: t('report.CompanyAverage'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
  });
  series.value.push({
    name: t('report.AllAverage'),
    data: data_average,
    type: 'bar',
  });
};

watch(
  () => props.branch_user_list,
  async () => {
    if (props.dateRangeProps == undefined) return;

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
    if (props.dateRangeProps == undefined) return;

    await get_fix_off_ins_adm_average_list(
      props.dateRangeProps,
      props.organization_id
    );
  }
);

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (props.dateRangeProps == undefined) return;

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
