<template>
  <q-table class="saaTable" :columns="columns" :rows="rowsWithaverage" separator="cell" dense :rows-per-page-options="[0]"
    hide-pagination>
    <template v-slot:body-cell-name="props">
      <q-td class="clickable" @click="openPentagon(averageRow, props.row)" v-if="props.rowIndex > 0">{{
        props.row.displayName ? props.row.displayName : props.row.name }}</q-td>
      <q-td v-else>{{ props.row.name }}</q-td>
    </template>
  </q-table>
  <pentagonDiagram v-model="showDrawer" :data="pentagonData" @closeDrawer="showDrawer = false" :showDrawer="showDrawer">
  </pentagonDiagram>
</template>
<script setup lang="ts">
import { QTableProps, exportFile, date } from 'quasar';
import { saaTableColumns as columns } from '../const/saa.const'
import { Alert } from 'src/shared/utils/Alert.utils';
import { computed, ref } from 'vue';
import { SaaRowData } from '../const/model';
import pentagonDiagram from './pentagonDiagram.vue'

const props = defineProps<{
  rows: SaaRowData[]
}>()

const pentagonAverage = ref<number[]>([])
const pentagonRow = ref<number[]>([])
const pentagonLabels = ref<string[]>([])
const pentagonName = ref<string>('')

const pentagonData = computed(() => {
  return {
    average: pentagonAverage.value,
    row: pentagonRow.value,
    labels: pentagonLabels.value,
    name: pentagonName.value
  }
})
function openPentagon(average: SaaRowData, row: SaaRowData) {
  pentagonLabels.value = [];
  pentagonAverage.value = [];
  pentagonRow.value = [];
  ['chargeOfAdmission', 'chargeOfOffer', 'chargeOfInspection', 'chargeOfFix'].forEach((key) => {
    pentagonAverage.value.push(average[key])
    pentagonRow.value.push(row[key])
    pentagonLabels.value.push(key)
  })
  pentagonName.value = row.name
  pentagonLabels.value.push('BoQty')
  pentagonAverage.value.push((average.BO_NC + average.BO_N))
  pentagonRow.value.push((row.BO_NC + row.BO_N))

  if (showDrawer.value) {
    showDrawer.value = false;
    setTimeout(() => {
      showDrawer.value = true
    }, 300)
  } else {
    showDrawer.value = true
  }
}

const averageRow = computed(() => {
  const averageRowResult: Partial<SaaRowData> = {}
  averageRowResult.name = 'average'
  const rowsLength = props.rows.length
  const statusCountFields = ['chargeOfFix', 'chargeOfInspection', 'chargeOfOffer', 'chargeOfAdmission', 'numberOfCalls', 'numberOfFax', 'BO_NC', 'BO_N', 'dispatch', 'introduction', 'TTP', 'chargeOfFixRate', 'chargeOfInspectionRate', 'chargeOfOfferRate', 'chargeOfAdmissionRate', 'personOK', 'personNG', 'personOKRate', 'companyOK', 'companyNG', 'companyOKRate']
  statusCountFields.forEach((field) => {
    const result = averageRowResult[field] = parseFloat((props.rows.reduce((accumulator, currentValue) => parseInt(currentValue[field]) ? accumulator + parseInt(currentValue[field]) : accumulator, 0) / rowsLength).toFixed(1))
    if (['chargeOfFixRate', 'chargeOfInspectionRate', 'chargeOfOfferRate', 'chargeOfAdmissionRate'].includes(field)) {
      averageRowResult[field] = isNaN(result) ? '-' : result + '%'
    } else {
      averageRowResult[field] = isNaN(result) ? '-' : result
    }
  })
  return averageRowResult as SaaRowData
})

const rowsWithaverage = computed<QTableProps['rows']>(() => {
  return [averageRow.value].concat(props.rows)
})

const showDrawer = ref(false)
const exportTable = () => {
  if (!props.rows || !columns.value) {
    return
  }
  const csvHeaders = columns.value.map((column) => {
    return column.label
  });
  const csvData = props.rows.map((row) => Object.values(row));

  const csvContent = '\uFEFF' + [
    csvHeaders.join(','),
    ...csvData.map((row) => row.join(',')),
  ].join('\n');

  const formattedString = date.formatDate(Date.now(), 'YYYYMMDDHHmmss')

  const status = exportFile(
    `saa-export-${formattedString}.csv`,
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
.saaTable {
  overflow: auto;
  width: 100%;

  th {
    background-color: $primary;
    color: #fff;
    border-color: #fff;
  }

  tbody {
    tr:first-child {
      background-color: #B7B7B7;

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
