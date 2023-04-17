<template>
  <div class="q-pt-lg q-pl-lg">
    <div class="q-gutter-md row">
      <q-select outlined v-model="branch_input" :options="branchs" />
      <q-select outlined v-model="model_report" :options="report_type" />
      <q-input filled :model-value="`${dateRange.from} - ${dateRange.to}`">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
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
  <keep-alive>
  <component
    v-bind:is="report_componets[model_report.value]"
    :organization_id="organization_id"
    :dateRangeProps="dateRange"
    :branch_id="branch_input"
    :branch_user_list="branch_user_list"
    :all_user_list="all_user_list"
  ></component>
</keep-alive>
</template>

<script setup lang="ts">
import { ref, Ref ,watch} from 'vue';
import { useI18n } from 'vue-i18n';
// import { getAuth } from '@firebase/auth';
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
} from 'firebase/firestore';
import SalesActivityIndividualReport from '../../../components/report/SalesActivityIndividualReport.vue';
import ApplicantReport from '../../../components/report/ApplicantReport.vue';
import RecruitmentEffectivenessReport from '../../../components/report/RecruitmentEffectivenessReport.vue';
import SalesActivityReport from '../../../components/report/SalesActivityReport.vue';
const t = useI18n({ useScope: 'global' }).t;
const branch_input: Ref<string> = ref('');
const branchs: Ref<string[]> = ref([]);
const db = getFirestore();
const branch_user_list:any = ref();
const all_user_list:any = ref();
const model_report: Ref<{label:string,value:number}> = ref(
{label: t('report.ApplicantReport'), value: 0});
const report_type: Ref<{label:string,value:number}[]> = ref([
  {label: t('report.ApplicantReport'), value: 0},
  {label: t('report.SalesActivityIndividualReport'), value: 1},
  {label: t('report.SalesActivityReport'), value: 2},
  {label: t('report.RecruitmentEffectivenessReport'), value: 3},
]);
const report_componets={0:ApplicantReport,1:SalesActivityIndividualReport,2:SalesActivityReport,3:RecruitmentEffectivenessReport}
const dateRange: Ref<{ from: string | undefined; to: string | undefined }> =
  ref({ from: '2021/01/01', to: '2021/07/17' });
const organization_id: Ref<string> = ref('');
const getBranchId = async (code: string) => {
  branchs.value = [];
  const collectionRef = collection(db, 'organization');
  const q = query(collectionRef, where('code', '==', code));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    organization_id.value = doc.id;
    console.log(doc.id, '=>', doc.data());
    const branchRef = collection(db, 'organization', doc.id, 'branch');
    const branchSnapshot = getDocs(branchRef);
    branchSnapshot.then((branch) => {
      branch.forEach((branchDoc) => {
        //optionsにbranchIdを追加する
        branchs.value.push(branchDoc.id);
      });
    });
  });
};

const getUser = async (id: string, field = 'branch_id') => {
  let user_list: { id: string; name: string }[] = [];
  const collectionRef = collection(db, 'users');
  const q = query(collectionRef, where(field, '==', id));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    user_list.push({ id: doc.id, name: doc.data().displayName });
  });
  return user_list;
};

// watchでbranch_inputを監視して、branch_inputが変更されたら、getUserを実行する
watch(branch_input, async () => {
  all_user_list.value = await getUser(organization_id.value, 'organization_id');
  branch_user_list.value = await getUser(branch_input.value);
});
getBranchId('CODEHIN');
</script>
