<template>
  <div>
    <branchDropdown @getBranchId="getBranchId" />
    <apexchart width="90%" type="bar" height="200px" :options="chartOptions" :series="series"></apexchart>
    <!-- -->
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

const apexchart = VueApexCharts;

const budgetStore = useBudget();
const organization = useOrganization()

const options = ref<OptionData>({ occupation: [] });
const loading = ref(true);
const monthItems = ref(getLastMonthString(3));
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
