<template>
  {{ organization_id }}
  <div class="row">
    <div class="col">
      <apexchart :options="chartOptions" :series="series"></apexchart>
      <q-table title="" :rows="rows" :columns="columns" row-key="name" />
    </div>
    <div class="col">
      <!-- <apexchart :options="chartOptions" :series="series"></apexchart> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  getCountFromServer,
  Query,
  DocumentData,
} from 'firebase/firestore';
const { t } = useI18n({ useScope: 'global' });
const chartOptions = ref({
  chart: {
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
          return value.toFixed(2) + '人'; // 目盛りに単位を付ける
        },
  }},
  fill: {
    opacity: 1,
  },
});
const series: Ref<{ name: string; data: number[]; type: string }[]> = ref([]);
const user_list: Ref<{ id: string; name: string }[]> = ref([]);
const all_user_list: Ref<{ id: string; name: string }[]> = ref([]);
const organization_id = ref('');
const db = getFirestore();
const auth = getAuth();
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
  dateRangeProps: { from: string | undefined; to: string | undefined };
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  all_user_list: { id: string; name: string }[];
}>();
//branch_idが渡されている場合はbranch_idをbranch_inputに代入watchでbranch_idが変更されたらbranch_inputを変更

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
const getReportByDate = async (
  IdAndNames_branch: { id: string; name: string }[],
  IdAndNames: { id: string; name: string }[] | undefined,
  dateRange: { from: string | undefined; to: string | undefined }
) => {
  if (dateRange.from == undefined || dateRange.to == undefined) return;
  if (IdAndNames == undefined || IdAndNames.length == 0) return;
  series.value = [];
  rows.value = [];
  // 0のリストをchartOption.xaxis.categories.length分作成する
  let data_average = Array(chartOptions.value.xaxis.categories.length).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  const query_list: Query<DocumentData>[] = [];
  for (let IdAndName of IdAndNames) {
    const Id: string = IdAndName.id;
    query_list[0] = query(
      collectionRef,
      where('contactPerson', '==', Id),
      where('data', '>=', targetDateFrom),
      where('data', '<=', targetDateTo),
      where('status', '==', 'ok')
    );
    query_list[1] = query(
      collectionRef,
      where('chargeOfInspection', '==', Id),
      where('inspectionDate', '>=', targetDateFrom),
      where('inspectionDate', '<=', targetDateTo),
      where('inspectionStatus', '==', 'ok')
    );
    query_list[2] = query(
      collectionRef,
      where('chargeOfOffer', '==', Id),
      where('offerDate', '>=', targetDateFrom),
      where('offerDate', '<=', targetDateTo),
      where('offerStatus', '==', 'ok')
    );
    query_list[3] = query(
      collectionRef,
      where('chargeOfAdmission', '==', Id),
      where('admissionDate', '>=', targetDateFrom),
      where('admissionDate', '<=', targetDateTo),
      where('admissionStatus', '==', 'ok')
    );
    let data = await Promise.all(
      query_list.map(async (query) => {
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );
    data_average = listSum(data_average, data, IdAndNames.length);
    if (IdAndNames_branch.some((e) => e.id == Id)) {
      rows.value.push({
        name: IdAndName.name,
        fix: data[0],
        inspection: data[1],
        offer: data[2],
        admission: data[3],
      });
      series.value.push({
        name: IdAndName.name,
        data: data,
        type: 'bar',
      });
    }
  }
  rows.value.push({
    name: t('report.CompanyAverage'),
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3],
  });
  await series.value.push({
    name: t('report.CompanyAverage'),
    data: data_average,
    type: 'line',
  });
  //ここからIdAndNamesでforを回して上と同じことをするただしIdAndNames_branchにあるものは除外する
};

const listSum = (list1, list2, ln) => {
  const sum = list1.map((num, idx) => num + list2[idx] / ln);
  return sum;
};

//props.branch_user_listが変更されたらdraw()を実行する
watch(
  () => props.branch_user_list,
  async () => {
    if (props.branch_user_list.length != 0) {
      user_list.value = props.branch_user_list;
      all_user_list.value = props.all_user_list;
      await getReportByDate(
        user_list.value,
        all_user_list.value,
        props.dateRangeProps
      );
    }
  }
);

watch(
  () => props.dateRangeProps,
  async () => {
    if (user_list.value.length != 0) {
      await getReportByDate(
        user_list.value,
        all_user_list.value,
        props.dateRangeProps
      );
    }
  }
);

//このコンポーネントが読み込まれたらdraw()を実行する
onMounted(async () => {
    //0.5秒待つ
    await new Promise((resolve) => setTimeout(resolve, 500));
    user_list.value = props.branch_user_list;
    all_user_list.value = props.all_user_list;
    await getReportByDate(
      user_list.value,
      all_user_list.value,
      props.dateRangeProps
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
