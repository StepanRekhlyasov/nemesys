<template>
  <q-table :columns="columns" :loading="loading" :rows="rows" hide-pagination :rows-per-page-options="[0]" class="variousFeeAggregates--table" :separator="'cell'">
    <template v-slot:loading>
      <q-inner-loading showing color="accent" />
    </template>
    <template v-slot:body="props">
      <q-tr 
        class="tr-expandable"
        :props="props" 
        :class="{ 'tr-expanded' : props.expand }" 
      >
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
        <template v-if="col.name=='expandButton'">
          <q-btn dense @click="props.expand = !props.expand" class="billing--btn">
            <svg class="details--arrow" :class="{'details--arrow-reverse':props.expand}" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0H0.5L5.5 8L10.5 0Z" fill="white"/></svg>{{ $t('billing.feeAggregates.details') }}
          </q-btn>
        </template>
        <template v-else-if="col.name=='createInvoice'">
          <q-btn dense @click="props.expand = !props.expand" class="billing--btn">
            {{ $t('billing.feeAggregates.createInvoice') }}
          </q-btn>
        </template>
        <template v-else-if="col.name=='createSmsUsageDetails'">
          <q-btn dense @click="props.expand = !props.expand" class="billing--btn">
            {{ $t('billing.feeAggregates.createSmsUsageDetails') }}
          </q-btn>
        </template>
        <template v-else-if="col.name=='createFaxUsageDetails'">
          <q-btn dense @click="props.expand = !props.expand" class="billing--btn">
            {{ $t('billing.feeAggregates.createFaxUsageDetails') }}
          </q-btn>
        </template>
        <template v-else>
          {{ col.value }}
        </template>
        </q-td>
      </q-tr>
      <ExpandRow v-if="props.expand" :props="props"/>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import ExpandRow from './ExpandRow.vue';
import { QTableProps } from 'quasar';
import { AggregatesDummyData } from '../types/billing.types';

defineProps<{
  rows: AggregatesDummyData[],
  columns: QTableProps['columns'],
  loading: boolean
}>()
</script>
<style lang="scss">
.variousFeeAggregates--table{
  overflow: hidden;
  border-radius: 0;
  .tr-expandable {
    position: relative;
    &.tr-expanded:after {
      transform: scaleX(1);
      transform-origin: 0 50%;
      transition-delay: 0.1s;
    }
    &:after {
      width: 10px;
      height: 100%;
      display: block;
      content: "";
      padding-top: 4px;
      background-color: $accent;
      transform-origin: 0 50%;
      transform: scaleX(0);
      left: 0;
      bottom: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
    }
  }
  th {
    background-color: $accent;
    white-space: break-spaces;
    color: #fff;
    border-color: #000;
  }
  td {
    border-color: #000;
  }
  .details--arrow{
    margin-right: 8px;
  }
  .details--arrow-reverse{
    transform: rotate(180deg);
  }
}
.billing--btn{
  background-color: $accent;
  color: #fff;
  padding: 0 15px;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  .q-btn__content{
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>