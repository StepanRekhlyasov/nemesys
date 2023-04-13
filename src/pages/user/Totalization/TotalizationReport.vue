<template>
  <div class="q-pt-lg q-pl-lg">
  <div class="q-gutter-md row">
    <q-select outlined v-model="branch_input" :options="branchs"/>
    <q-select outlined v-model="model_report" :options="report_type"/>
    <q-input filled :model-value="`${dateRange.from} - ${dateRange.to}`">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="dateRange" range>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</div>
<div class="row">
  <div class="col">
  <apexchart :options="chartOptions" :series="series" ></apexchart>
  <q-table
      title=""
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
  <div class="col">

  <!-- <apexchart :options="chartOptions" :series="series"></apexchart> -->
  </div>
</div>
</template>



<script setup lang="ts">
import { ref ,Ref ,watch} from 'vue'
import { useI18n } from 'vue-i18n';


import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  getCountFromServer
} from 'firebase/firestore';
const { t } = useI18n({ useScope: 'global' });
const chartOptions= ref({
            chart: {
              height: 800,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '25%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
            },
            xaxis: {
              categories: ['FIX','職見','内定','入職'],
            },
            yaxis: {
              min:0,
              title: {
                text: '人'
              }
            },
            fill: {
              opacity: 1
            },
          })
const series:Ref<{'name':string,'data':number[],type:string}[]>= ref([])


const branch_input:Ref<string> = ref('')
const user_list:Ref<{'id':string,'name':string}[]> = ref([])
const all_user_list:Ref<{'id':string,'name':string}[]> = ref([])
const branchs:Ref<string[]> = ref([])
const model_report:Ref<string> = ref(t('report.SalesActivityIndividualReport'))
const report_type:string[] = [t('report.SalesActivityIndividualReport')]
const dateRange = ref({ from: '2021/01/01', to: '2021/07/17' })
const organization_id = ref('')
const db = getFirestore();
const columns=ref([{
    name: 'name',
    required: true,
    label: 'Fix',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'fix', align: 'center', label: 'FIX', field: 'fix', sortable: true },
  { name: 'inspection', align: 'center', label: '職見', field: 'inspection', sortable: true },
  { name: 'offer', align: 'center', label: '内定', field: 'offer', sortable: true },
  { name: 'admission', align: 'center', label: '入職', field: 'admission', sortable: true },
])
const rows:Ref<{
    name: string,
    fix: number,
    inspection: number,
    offer: number,
    admission: number
  }[]> = ref([])

//ApplicantsIdと{ from: '2020/07/08', to: '2020/07/17' }のような日付の範囲を入力としてfix collectionからtimestamp型のadmissionDateの範囲を指定し集計クエリを利用して集計する関数
const getReportByDate = async (IdAndNames:{'id':string,'name':string}[], dateRange:{ from: string; to: string; }) => {
  series.value = []
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  let data:number[] =[]
  for (let IdAndName of IdAndNames){
  const Id:string=IdAndName.id
  const fix = await query(collectionRef, where('contactPerson', '==', Id), where('data', '>=', targetDateFrom), where('data', '<=', targetDateTo),where('status', '==', 'ok'));
  const snapshot_fix = await getCountFromServer(fix);
  const inspect = await query(collectionRef, where('chargeOfInspection', '==', Id), where('inspectionDate', '>=', targetDateFrom), where('inspectionDate', '<=', targetDateTo),where('inspectionStatus', '==', 'ok'));

  const snapshot_inspect = await getCountFromServer(inspect);
  const offer = await query(collectionRef, where('chargeOfOffer', '==', Id), where('offerDate', '>=', targetDateFrom), where('offerDate', '<=', targetDateTo),where('offerStatus', '==', 'ok'));
  const snapshot_offer = await getCountFromServer(offer);
  const admission = await query(collectionRef, where('chargeOfAdmission', '==', Id), where('admissionDate', '>=', targetDateFrom), where('admissionDate', '<=', targetDateTo),where('admissionStatus', '==', 'ok'));
  const snapshot_admission = await getCountFromServer(admission);
  data = [snapshot_fix.data().count,snapshot_inspect.data().count,snapshot_offer.data().count,snapshot_admission.data().count]
  rows.value.push({
    name: IdAndName.name,
    fix: data[0],
    inspection: data[1],
    offer: data[2],
    admission: data[3]
  })
  await series.value.push({
    name: IdAndName.name,
    data: data,
    type:'bar'
    })
}
}

const listSum=(list1, list2,ln)=> {
  const sum = list1.map((num, idx) => num + list2[idx]/ln);
  return sum;
}

const getAverageReportByDate = async (IdAndNames:{'id':string,'name':string}[], dateRange:{ from: string; to: string; }) => {
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  let data_average =[0,0,0,0]
  for (let IdAndName of IdAndNames){
  const Id:string=IdAndName.id
  const fix = await query(collectionRef, where('contactPerson', '==', Id), where('data', '>=', targetDateFrom), where('data', '<=', targetDateTo),where('status', '==', 'ok'));
  const snapshot_fix = await getCountFromServer(fix);
  const inspect = await query(collectionRef, where('chargeOfInspection', '==', Id), where('inspectionDate', '>=', targetDateFrom), where('inspectionDate', '<=', targetDateTo),where('inspectionStatus', '==', 'ok'));
  // const inspect = query(collectionRef, where('contactPerson', '==', Id),where('inspectionStatus', '==', 'ok'));

  const snapshot_inspect = await getCountFromServer(inspect);
  const offer = await query(collectionRef, where('chargeOfOffer', '==', Id), where('offerDate', '>=', targetDateFrom), where('offerDate', '<=', targetDateTo),where('offerStatus', '==', 'ok'));
  const snapshot_offer = await getCountFromServer(offer);
  const admission = await query(collectionRef, where('chargeOfAdmission', '==', Id), where('admissionDate', '>=', targetDateFrom), where('admissionDate', '<=', targetDateTo),where('admissionStatus', '==', 'ok'));
  const snapshot_admission = await getCountFromServer(admission);
  let data = [snapshot_fix.data().count,snapshot_inspect.data().count,snapshot_offer.data().count,snapshot_admission.data().count]
  data_average =listSum(data_average,data,IdAndNames.length)
}
rows.value.push({
    name: '全社平均',
    fix: data_average[0],
    inspection: data_average[1],
    offer: data_average[2],
    admission: data_average[3]
  })
await series.value.push({
    name: '全社平均',
    data: data_average,
    type:'line'
    })
}

//codeを入力としてそのcodeとfild code が一致するoganization documentを選択し、そのsubcollection branchの中のdocumentのbranchIdをすべて取得する関数
const getBranchId = async (code:string) => {
  branchs.value = []
  const collectionRef = collection(db, 'organization');
  const q = query(collectionRef, where('code', '==', code));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    organization_id.value = doc.id
    console.log(doc.id, '=>', doc.data());
    const branchRef = collection(db, 'organization', doc.id, 'branch');
    const branchSnapshot = getDocs(branchRef);
    branchSnapshot.then((branch) => {
      branch.forEach((branchDoc) => {
        console.log(branchDoc.id, '=>', branchDoc.data());
        //optionsにbranchIdを追加する
        branchs.value.push(branchDoc.id)
      });
    });
  });
}

// branch_idを入力としてusers collectionからそのbranch_idが一致するものをすべて取得する関数
const getUser = async (id:string,field='branch_id') => {
  let user_list:{'id':string,'name':string}[] = []
  const collectionRef = collection(db, 'users');
  const q = query(collectionRef, where(field, '==', id));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    user_list.push({'id':doc.id,'name':doc.data().displayName})});
    return user_list

}


//4cAISPxAq6v8HT0YSFKH
//branch_inputが変更されたらbranch_inputを入力としてgetUserを実行する
watch(branch_input, async () => {
  user_list.value = await getUser(branch_input.value)
  all_user_list.value = await getUser(organization_id.value,'organization_id')
  await getReportByDate(user_list.value, dateRange.value)
  await getAverageReportByDate(all_user_list.value, dateRange.value)
})
getBranchId('CODEHIN')
//DateRangeが変更されたらDateRangeを入力としてgetReportByDateを実行する
watch(dateRange, async () => {
  user_list.value = await getUser(branch_input.value)
  all_user_list.value = await getUser(organization_id.value,'organization_id')
  await getReportByDate(user_list.value, dateRange.value)
  await getAverageReportByDate(all_user_list.value, dateRange.value)
})

</script>

<script lang="ts">

import VueApexCharts from 'vue3-apexcharts';

export default {
    name: 'ChartExample',
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    id: 'vuechart-example',
                },
                xaxis: {
                    // categories loaded here
                },
            },
            series: [
                // data loaded here
            ],
        };
    },
}

</script>
