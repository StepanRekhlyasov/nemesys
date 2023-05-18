<template>
  <q-td auto-width colspan="100%" class="q-pa-none">
    <q-table hide-pagination :rows-per-page-options="[0]" class="variousFeeAggregates--table" :separator="'cell'">
      <template v-slot:header>
        <q-tr>
          <q-th rowspan="2">{{ $t('billing.feeAggregates.utilizationSystem') }}</q-th>
          <q-th colspan="5">{{ $t('billing.feeAggregates.license') }}</q-th>
          <q-th colspan="3">SMS</q-th>
          <q-th colspan="3">FAX</q-th>
        </q-tr>
        <q-tr>
          <q-th>{{ $t('billing.feeAggregates.businessName') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.branchName') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.usageCount') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.unitPrice') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.billingAmount') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.usageCount') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.unitPrice') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.billingAmount') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.usageCount') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.unitPrice') }}</q-th>
          <q-th>{{ $t('billing.feeAggregates.billingAmount') }}</q-th>
        </q-tr>
      </template>
    </q-table>
  </q-td>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { AggregatesDummyData } from '../types/billing.types';
const props = defineProps<{
  props: {
    row: AggregatesDummyData
  }
}>()
onMounted(()=>{
  console.log('Fetch expand info:', props.props.row)
})
</script>
<style scoped>
  .q-table__container{
    border-radius: 0;
  }
  .q-pa-none {
    padding: 0!important;
  }
</style>