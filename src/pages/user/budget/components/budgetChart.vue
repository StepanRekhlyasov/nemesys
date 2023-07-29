<template>
  <div>
    <branchDropdown @getBranchId="getBranchId" />
    <apexchart width="90%" type="bar" height="200px" :options="chartOptions" :series="series"></apexchart>
    <div class="row flex justify-center centers" :style="'width: 95%'" v-if="budgetSum">
      <div class="q-pl-sm q-pr-sm q-pt-xs q-bt-xs bugetTotal bugetTotalRight">
        {{ t('budget.total') }}
      </div>
      <div class="q-pl-sm q-pr-sm q-pt-xs q-bt-xs bugetTotal">
        ¥ {{ budgetSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useBudget } from 'src/stores/budgetData';
import { OptionData } from '../type/budget'
import { chartOptions } from '../consts/Budget.const'
import { useOrganization } from 'src/stores/organization';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import { getLastMonthString } from 'src/shared/utils/utils';
import branchDropdown from './branchDropdown.vue';
import { useI18n } from 'vue-i18n';

const apexchart = VueApexCharts;
const { t } = useI18n({ useScope: 'global' });

const budgetStore = useBudget();
const organization = useOrganization()

const options = ref<OptionData>({ occupation: [] });
const loading = ref(true);
const monthItems = ref(getLastMonthString(3));
const budgetSum = ref(<number>0)
const branchId = ref(<string>'')
chartOptions.value.xaxis.categories = monthItems.value.monthsJp as never[]

const series = ref(<{ name: string, data: number[] }[]>[])

onMounted(async () => {
  loading.value = true
  options.value = await budgetStore.getOptionData(organization.currentOrganizationId);
  updateSeries();
  loading.value = false;
});

watchCurrentOrganization(async (v) => {
  loading.value = true
  options.value = await budgetStore.getOptionData(v);
  updateSeries()
  loading.value = false;
})

const getBranchId = (branch: string) => {
  branchId.value = branch
  updateSeries();
}

const updateSeries = async () => {
  series.value = await budgetStore.getChartData(options.value['media'], monthItems.value.monthsEn, branchId.value, organization.currentOrganizationId)
  budgetSum.value = 0
  series.value.forEach(item => {
    budgetSum.value += item.data.reduce((a, b) => a + b, 0)

  })
}

watch(() => budgetStore.loadChartData, (newValue) => {
  if (newValue) {
    updateSeries();
  }
})

</script>
<style scoped>
.bugetTotal {
  border: 1px solid gray
}

.bugetTotalRight {
  border-right: none
}
</style>
