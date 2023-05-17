<template>
  <PageHader>
    {{ $t('menu.admin.billingHistory') }}
  </PageHader>
  <PageHader>
    <!-- remove after development ready -->
    <div style="color:red;">Fake data (Applicant) on this page / このページのダミーデータ</div>
  </PageHader>
  <q-card flat class="q-pt-md q-pb-md q-px-lg headInputsWrapper">
    {{ $t('billing.feeAggregates.monthOfIssue') }}
    <YearMonthPicker v-model="selectedDate" :isAdmin="true" :height="'36px'"/>
    <SearchField :isTitle="false" :on-click-search="() => { searchBillingHistory() }"
    :on-click-clear="() => { refresh() }" v-model:model-value="search"
    >
    </SearchField>
  </q-card>
  <BillingHistoryTable :columns="columns" :rows="rows" :loading="loading"/>
  <TablePagination 
    :isAdmin="true" 
    ref="paginationRef" 
    :pagination="pagination" 
    @on-loading-state-change="(v) => loading = v" 
    @on-data-update="async (newData) => {
      rows = (newData as Applicant[])
    }"
  />
</template>
<script setup lang="ts">
import { QueryFieldFilterConstraint, orderBy, where } from 'firebase/firestore';
import PageHader from 'src/components/PageHeader.vue'
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { computed, ref, watch } from 'vue';
import { Applicant } from 'src/shared/model';
import SearchField from 'src/components/SearchField.vue';
import BillingHistoryTable from './components/BillingHistoryTable.vue'
import { billingHistoryColumns as columns } from './consts/BillingManagment'

const selectedDate = ref('')
const search = ref('')
const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null);
const rows = ref<Applicant[]>([])
const loading = ref(true)
const constraints = computed(()=>{
  const result : QueryFieldFilterConstraint[] = []
  if(selectedDate.value){
    result.push(where('yearMonth', '==', selectedDate.value))
  }
  if(search.value){
    result.push(where('name', '>=', search.value))
    result.push(where('name', '<=', search.value+'\uf8ff'))
  }
  return result
})
const searchBillingHistory = async () => {
  paginationRef.value?.setConstraints(constraints.value)
  await paginationRef.value?.queryFirstPage()
}
const refresh = async () => {
  search.value = ''
  paginationRef.value?.setConstraints(constraints.value)
  await paginationRef.value?.queryFirstPage()
}
/** todo */
const pagination = ref({
  rowsPerPage: 10,
  path: 'applicants', // todo
  order: orderBy('name', 'asc'), // todo
  constraints: constraints.value // todo
});

watch(()=>selectedDate.value, (newValue)=>{
  console.log('new date choosen: '+ newValue) // todo
})
</script>
<style lang="scss">
.headInputsWrapper{
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  .q-pt-sm{
    padding: 0;
  }
}
</style>