<template>
  <div class="q-pt-lg q-pl-lg ">
    <div class="q-gutter-md row">
      <q-select outlined v-model="branch_input" :options="branchs" />
      <q-select outlined v-model="model_report" :options="report_type" />
      <q-input filled :model-value="dateRange!==null ? `${dateRange.from} - ${dateRange.to}`:``">
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
      <q-radio v-model="graph_type" val="BasedOnLeftMostItemDate" :label="$t('report.BasedOnLeftMostItemDate')"/>
      <q-radio v-model="graph_type" val="BasedOnEachItemDate" :label="$t('report.BasedOnEachItemDate')" />
    </div>
  </div>
  <keep-alive>
    <component
      v-bind:is="report_componets[model_report.value]"
      :organization_id="currentOrganizationId"
      :dateRangeProps="dateRange"
      :branch_id="branch_input"
      :branch_user_list="branch_user_list"
      :graph_type="graph_type"
    ></component>
  </keep-alive>
</template>

<script setup lang="ts">
import { ref, Ref, watch, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import {useOrganization}  from 'src/stores/organization'
import { storeToRefs } from 'pinia';
import {getUser} from 'src/stores/getBranchUsers'
import SalesActivityIndividualReport from '../../../components/report/SalesActivityIndividualReport/SalesActivityIndividualReport.vue';
import ApplicantReport from '../../../components/report/ApplicantReport/ApplicantReport.vue';
import RecruitmentEffectivenessReport from '../../../components/report/RecruitmentEffectivenessreport/RecruitmentEffectivenessReport.vue';
import SalesActivityReport from '../../../components/report/SalesActivityReport/SalesActivityReport.vue';
import {graphType} from 'src/components/report/Models'
const t = useI18n({ useScope: 'global' }).t;
const graph_type:Ref<graphType> = ref('BasedOnLeftMostItemDate');
const branch_input: Ref<string> = ref('');
const branchs: Ref<string[]> = ref([]);
const organizationStore = useOrganization()
const {currentOrganizationId} = storeToRefs(organizationStore)
const branch_user_list: Ref<{ id: string; name: string }[]> = ref([]);
const model_report: Ref<{ label: string; value: number }> = ref({
  label: t('report.ApplicantReport'),
  value: 0,
});
const report_type: Ref<{ label: string; value: number }[]> = ref([
  { label: t('report.ApplicantReport'), value: 0 },
  { label: t('report.SalesActivityReport'), value: 1 },
  { label: t('report.SalesActivityIndividualReport'), value: 2 },
  { label: t('report.RecruitmentEffectivenessReport'), value: 3 },
]);
const report_componets = {
  0: ApplicantReport,
  2: SalesActivityIndividualReport,
  1: SalesActivityReport,
  3: RecruitmentEffectivenessReport,
};
//defalt dateRnage is { from: Today - 1manth to:Today} but now set { from: 1900/01/01 to:1900/12/31} for dummy data,

// const get_date=()=>{
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1;
//   const day = today.getDate();
//   const from = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
//   const from_year = from.getFullYear();
//   const from_month = from.getMonth() + 1;
//   const from_day = from.getDate();
//   const dateRange = {
//     from: `${from_year}/${from_month}/${from_day}`,
//     to: `${year}/${month}/${day}`,
//   };
//   return dateRange;
// }
// const dateRange: Ref<{ from: string; to: string }> = ref(get_date());

const dateRange: Ref<{ from: string; to: string }|null> = ref({
  from: '1900/01/01',
  to: '1900/12/31',
});

watch(branch_input, async () => {
  branch_user_list.value = await getUser(branch_input.value);
});

onMounted(async () => {
  branchs.value = Object.keys(await organizationStore.getBranchesInOrganization(currentOrganizationId.value))
});
</script>

