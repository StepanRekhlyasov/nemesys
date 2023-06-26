<template>
  <div class="q-pt-lg q-pl-lg">
    <div class="q-gutter-md row">
      <q-select
        outlined
        v-model="branchInput"
        :options="branchs"
        :hint="t('report.base')"
      />
      <q-select
        outlined
        v-model="item"
        :options="items"
        :hint="t('report.item')"
      >
      </q-select>
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
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select
        outlined
        v-model="totalingMethod"
        :options="totalingMethods"
        :hint="t('report.totalingMethod')"
      />
      <q-select
        outlined
        v-model="totalingMethod"
        :options="jobCategory"
        :hint="t('report.jobCategory')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOrganization } from 'src/stores/organization';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user';
import { useBranch } from 'src/stores/branch';
const UserStore = useUserStore();
const UserBranch = useBranch();
const t = useI18n({ useScope: 'global' }).t;
const branchInput = ref('');
const organizationStore = useOrganization();
const { currentOrganizationId } = storeToRefs(organizationStore);
const branchs = ref<string[]>([]);
const branch_user_list = ref<{ id: string; name: string }[]>([]);

const item = ref('');

const items = computed<{ label: string; value: number }[]>(() => {
  return [
    { label: t('report.applicantReport'), value: 0 },
    { label: t('report.salesActivityReport'), value: 1 },
    { label: t('report.salesActivityIndividualReport'), value: 2 },
    { label: t('report.recruitmentEffectivenessReport'), value: 3 },
  ];
});

const totalingMethod = ref('');

const totalingMethods = computed<{ label: string; value: number }[]>(() => {
  return [
    {
      label: t('report.categories.totalingMethod.totallingDailyData'),
      value: 0,
    },
    {
      label: t(
        'report.categories.totalingMethod.totallingAttractionDataByBranch'
      ),
      value: 1,
    },
    {
      label: t(
        'report.categories.totalingMethod.totallingAttractionDataByMedia'
      ),
      value: 2,
    },
  ];
});

const jobCategory = computed<{ label: string; value: number }[]>(() => {
  return [];
});

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

const dateRange: Ref<{ from: string; to: string } | null> = ref({
  from: '1900/01/01',
  to: '1900/12/31',
});

watch(branchInput, async () => {
  branch_user_list.value = await UserStore.getAllUsersInBranch(
    branchInput.value
  );
});

onMounted(async () => {
  branchs.value = Object.keys(
    await UserBranch.getBranchesInOrganization(currentOrganizationId.value)
  );
});
</script>
