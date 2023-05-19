<template>
  <q-table :columns="columns" :loading="loading" :rows="rows" hide-pagination :rows-per-page-options="[0]" class="billingHistory--table" :separator="'horizontal'">
    <template v-slot:loading>
      <q-inner-loading showing color="accent" />
    </template>
    <template v-slot:body-cell-no="props">
      <q-td :props="props">No.</q-td>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div class="name">{{props.row.name}}</div>
        <div class="id">{{props.row.id}}</div>
      </q-td>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Applicant } from 'src/shared/model';

defineProps<{
  rows: Applicant[],
  columns: QTableProps['columns'],
  loading: boolean
}>()
</script>
<style lang="scss">
.billingHistory--table{
  .id {
    color:#626262;
    font-size:10px
  }
  .name {
    color: $accent;
    font-size: 16px;
  }
}
</style>