<template>
  <q-page class="bg-grey-3">
    <div class="q-pt-lg q-pl-lg bg-grey-3">
      <div class="q-gutter-md row">
        <q-select
          outlined
          v-model="branch_input"
          :options="branchs"
          v-if="modeIndex == 2"
        />
        <q-select
          outlined
          v-model="modelReportComputed"
          :options="reportType"
        />
        <q-input
          filled
          :model-value="
            dateRange !== null ? `${dateRange.from} - ${dateRange.to}` : ``
          "
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="dateRange" range>
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      :label="$t('common.close')"
                      color="primary"
                      flat
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-radio
          v-model="graph_type"
          val="BasedOnLeftMostItemDate"
          :label="$t('report.basedOnLeftMostItemDate')"
        />
        <q-radio
          v-model="graph_type"
          val="BasedOnEachItemDate"
          :label="$t('report.basedOnEachItemDate')"
        />
      </div>
    </div>
    <keep-alive>
      <component
        v-bind:is="reportComponets[modeIndex]"
        :organization_id="currentOrganizationId"
        :dateRangeProps="dateRange"
        :branch_id="branch_input['value']"
        :branch_user_list="branch_user_list"
        :graph_type="graph_type"
      ></component>
    </keep-alive>
  </q-page>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOrganization } from 'src/stores/organization';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user';
import { useBranch } from 'src/stores/branch';
import { convertObjToIdNameList } from 'src/shared/utils/KPI.utils';
import SalesActivityIndividualReport from '../../../components/report/SalesActivityIndividualReport/SalesActivityIndividualReport.vue';
import ApplicantReport from '../../../components/report/ApplicantReport/ApplicantReport.vue';
import RecruitmentEffectivenessReport from '../../../components/report/RecruitmentEffectivenessreport/RecruitmentEffectivenessReport.vue';
import SalesActivityReport from '../../../components/report/SalesActivityReport/SalesActivityReport.vue';
import { graphType } from 'src/components/report/Models';
const UserStore = useUserStore();
const UserBranch = useBranch();
const t = useI18n({ useScope: 'global' }).t;
const graph_type = ref<graphType>('BasedOnLeftMostItemDate');
const branch_input = ref({ value: '', label: '' });
const organizationStore = useOrganization();
const { currentOrganizationId } = storeToRefs(organizationStore);
const branchs = ref<[]>([]);
const branch_user_list = ref<{ id: string; name: string }[]>([]);
const reportType = computed<{ label: string; value: number }[]>(() => {
  return [
    { label: t('report.applicantReport'), value: 0 },
    { label: t('report.salesActivityReport'), value: 1 },
    { label: t('report.salesActivityIndividualReport'), value: 2 },
    { label: t('report.recruitmentEffectivenessReport'), value: 3 },
  ];
});

const modeIndex = ref(0);

const modelReportComputed = computed({
  get() {
    return reportType.value[modeIndex.value];
  },
  set(type) {
    return modeIndex.value = type['value'];
  },
});
const reportComponets = {
  0: ApplicantReport,
  1: SalesActivityReport,
  2: SalesActivityIndividualReport,
  3: RecruitmentEffectivenessReport,
};

const get_date = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const from = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  const fromYear = from.getFullYear();
  const fromMonth = from.getMonth() + 1;
  const fromDay = from.getDate();
  const dateRange = {
    from: `${fromYear}/${fromMonth}/${fromDay}`,
    to: `${year}/${month}/${day}`,
  };
  return dateRange;
};
const dateRange: Ref<{ from: string; to: string }> = ref(get_date());

watch(branch_input, async () => {
  branch_user_list.value = await UserStore.getAllUsersInBranch(
    branch_input.value['value']
  );
});

onMounted(async () => {
  branchs.value = convertObjToIdNameList(
    Object.values(
      await UserBranch.getBranchesInOrganization(currentOrganizationId.value)
    )
  );
});
</script>
