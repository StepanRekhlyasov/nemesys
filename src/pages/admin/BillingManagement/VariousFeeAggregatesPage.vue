<template>
  <PageHeader>
    {{ $t('menu.admin.variousFeeAggregates') }} ({{ $t('billing.feeAggregates.byMonth') }}・{{ $t('billing.feeAggregates.byCompany') }})
  </PageHeader>
  <DevWarning />
  <q-card flat class="q-pt-md q-pb-md q-px-lg">
    <div class="monthPicker">
      {{ $t('billing.feeAggregates.monthOfIssue') }}
      <YearMonthPicker v-model="selectedDate" :isAdmin="true" :height="'36px'"/>
    </div>
  </q-card>
  <VariousFeeAggregatesTable :columns="columns" :rows="rows" :loading="loading"/>
  <TablePagination 
    :isAdmin="true" 
    ref="paginationRef" 
    :pagination="pagination" 
    @on-loading-state-change="(v) => loading = v" 
    @on-data-update="async (newData) => {
      rows = aggregatesDummyData // dummy data
    }"
  />
</template>
<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue'
import { ref, watch } from 'vue';
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue'
import TablePagination from 'src/components/pagination/TablePagination.vue';
import VariousFeeAggregatesTable from './components/VariousFeeAggregatesTable.vue'
import { orderBy } from 'firebase/firestore';
import { feeAggregatesColumns as columns } from './consts/BillingManagment'
import { AggregatesDummyData } from './types/billing.types'; // dummy model
import { aggregatesDummyData } from './consts/BillingManagment'; // dummy model
import DevWarning from 'src/components/DevWarning.vue';

const loading = ref(true)
const selectedDate = ref('')
const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null);
const rows = ref<AggregatesDummyData[]>([])


/** todo */
const pagination = ref({
  rowsPerPage: 20,
  path: 'licenses', // todo
  order: orderBy('date', 'asc'), // todo
  constraints: [] // todo
});

watch(()=>selectedDate.value, (newValue)=>{
  console.log('new date choosen: '+ newValue) // todo
})
</script>
<style lang="scss" scoped>
.monthPicker{
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>