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
      <q-td class="clickable" @click="showDrawer=!showDrawer">{{ props.row.displayName?props.row.displayName:props.row.name }}</q-td>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { QTableProps, exportFile } from 'quasar';
import { saaTableColumns as columns } from '../const/saa.const'
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';

const props = defineProps<{
  rows: QTableProps['rows']
}>()
const showDrawer = ref(false)
const exportTable = () => {
  if(!props.rows || !columns.value){
    return
  }
  const csvHeaders = columns.value.map((column) => {
    return column.label
  });
  const csvData = props.rows.map((row) => Object.values(row));

  const csvContent = '\uFEFF'+[
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
  width: 100%;
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
