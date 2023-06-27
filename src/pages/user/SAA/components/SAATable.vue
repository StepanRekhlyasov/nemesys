<template>
  <q-table
    class="saaTable"
    :columns="columns"
    :rows="rows"
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
import { QTableProps, exportFile } from 'quasar';
import { saaTableColumns as columns } from '../const/saa.const'
import { Applicant } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  rows: QTableProps['rows']
}>()
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
    Alert.warning(status);
  }
}
defineExpose({ exportTable })
</script>
<style lang="scss">
.saaTable{
  overflow: auto;
  th {
    background-color: $primary;
    color: #fff;
    border-color: #fff;
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
