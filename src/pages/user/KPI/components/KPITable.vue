<template>
  <q-table
    class="kpiTable"
    :columns="columns"
    :rows="rowsCalculated"
    separator="cell"
    dense
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:body-cell-name="props">
      <q-td 
        class="clickable" 
        @click="()=>{
          emit('openDrawer', props.row)
        }" 
      >{{ props.row.name }}</q-td>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { QTableProps, exportFile, useQuasar } from 'quasar';
import { actualFiguresColumns, everydayColumns, unitPriceColumns, applicationAttributeColumns } from '../const/kpi.const'
import { Applicant } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
  rows: QTableProps['rows'],
  mode: string,
  item: string
}>()

const rowsCalculated = computed(()=>{
  const firstRow : QTableProps['rows'] = [
    {
      name: t('KPI.total'),
    }
  ]
  return firstRow.concat(props.rows)
})

const columns = computed(()=>{
  if(props.mode === 'day'){
    return everydayColumns.value
  }
  if(props.item === 'actualFigures'){
    return actualFiguresColumns.value
  }
  if(props.item === 'unitPrice'){
    return unitPriceColumns.value
  }
  if(props.item === 'applicationAttribute'){
    return applicationAttributeColumns.value
  }
  return []
})

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant | null)
}>()

const exportTable = () => {
  if(!props.rows || !columns.value){
    return
  }
  const csvData = props.rows.map((row) => Object.values(row));
  const csvHeaders = columns.value.map((column) => column.label);
  
  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map((row) => row.join(',')),
  ].join('\n');
 const status = exportFile(
    'table-export.csv',
    csvContent,
    'text/csv'
  )
   if (status !== true) {
    Alert.warning($q, t);
  }
}
defineExpose({ exportTable })
</script>
<style lang="scss">
.kpiTable{
  overflow: auto;
  th {
    background-color: $primary;
    color: #fff;
    border-color: #fff;
  }
  tbody {
    tr:first-child {
      background-color: #B7B7B7;
      td{
        border-color: #fff;
      }
    }
  }
}
.clickable {
  cursor: pointer;
  color: $primary;
  &:hover{
    text-decoration: underline;
  }
}
</style>