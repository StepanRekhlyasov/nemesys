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
        @click="
          () => {
            emit('openDrawer', props.row);
          }
        "
        >{{ props.row.name }}</q-td
      >
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { QTableProps, exportFile } from 'quasar';
import {
  actualFiguresColumns,
  everydayColumns,
  unitPriceColumns,
  applicationAttributeColumns,
  rateCalcuPattern
} from '../const/kpi.const';
import { Applicant } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
  rows: QTableProps['rows'];
  mode: string;
  item: string;
}>();

const calculateTotal = (rows: QTableProps['rows'] | undefined) => {
  if (!rows || rows.length == 0) return { name: t('KPI.total') };
  const total = JSON.parse(JSON.stringify(rows)).reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      if (key === 'name') return;
      if (typeof acc[key] === 'string') acc[key] = 0;
      if (typeof row[key] === 'string') row[key] = 0;
      acc[key] += row[key];
    });
    return acc;
  });

  for(const pattern of rateCalcuPattern) {
    if (total[pattern.after] && total[pattern.before]) {
      total[pattern.name] = (total[pattern.after] / total[pattern.before] * 100).toFixed(1) + '%';
    }
    else {
      total[pattern.name] = '0.0%';
    }
  }

  total['name'] = t('KPI.total');
  return total;
};

const rowsCalculated = computed(() => {
  const firstRow: QTableProps['rows'] = [calculateTotal(props.rows)];
  return firstRow.concat(props.rows);
});

const columns = computed(() => {
  if (props.mode === 'day') {
    return everydayColumns.value;
  }
  if (props.item === 'actualFigures') {
    return actualFiguresColumns.value;
  }
  if (props.item === 'unitPrice') {
    return unitPriceColumns.value;
  }
  if (props.item === 'applicationAttribute') {
    return applicationAttributeColumns.value;
  }
  return [];
});

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant | null);
}>();

const exportTable = () => {
  if (!props.rows || !columns.value) {
    return;
  }
  const csvData = props.rows.map((row) => Object.values(row));
  const csvHeaders = columns.value.map((column) => column.label);

  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map((row) => row.join(',')),
  ].join('\n');
  const status = exportFile('table-export.csv', csvContent, 'text/csv');
  if (status !== true) {
    Alert.warning(status);
  }
};
defineExpose({ exportTable });
</script>
<style lang="scss">
.kpiTable {
  overflow: auto;
  th {
    background-color: $primary;
    color: #fff;
    border-color: #fff;
  }
  tbody {
    tr:first-child {
      background-color: #b7b7b7;
      td {
        border-color: #fff;
      }
    }
  }
}
.clickable {
  cursor: pointer;
  color: $primary;
  &:hover {
    text-decoration: underline;
  }
}
</style>
