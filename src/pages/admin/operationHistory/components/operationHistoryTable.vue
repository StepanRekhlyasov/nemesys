<template>
  <q-card-section class="q-pa-none">
    <q-table
      :columns="historyTableColumns"
      :rows="historyTableRows"
      row-key="id"
      v-model:pagination="pagination"
      hide-pagination
      class="no-shadow bg-grey-2"
      color="primary"
      table-header-style="background-color: #ffffff"
      :loading="loading">

    </q-table>
    <div class="row justify-start q-mt-md q-mb-md pagination q-mx-md">
      <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
        :max="(historyTableRows.length / pagination.rowsPerPage) >= 1 ? historyTableRows.length / pagination.rowsPerPage : 1"
        direction-links outline />
    </div>
  </q-card-section>
</template>

<script lang="ts">
 import { date, QTableProps } from 'quasar';
 import { ref, onMounted, Ref, computed } from 'vue';
 import { useI18n } from 'vue-i18n';
 import { query, doc, collection, getDocs, getFirestore, orderBy, getDoc } from '@firebase/firestore';


 export default {
   name: 'OperationHistoryTable',

   setup() {
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      const historyTableRows: Ref<unknown[]> = ref([])
      const loading = ref(true)
      const historyTableColumns = computed<QTableProps['columns']>(() => [
        {
          name: 'number',
          label: 'No.',
          field: 'number'
        }, {
          name: 'operation',
          required: true,
          label: t('operationHistory.table.operation'),
          field: 'typeOperation',
          align: 'left',
          sortable: false,
        }, {
          name: 'executionDate',
          required: true,
          label: t('operationHistory.table.executionDate'),
          field: 'date',
          align: 'left',
          sortable: false,
        }, {
          name: 'performer',
          required: true,
          label: t('operationHistory.table.performer'),
          field: 'executor',
          align: 'left',
          sortable: false,
        }, {
          name: 'note',
          required: true,
          label: t('operationHistory.table.note'),
          field: 'note',
          align: 'left',
          sortable: false,
        }])

     const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    onMounted(async () => {
      const docWholeSnap = await getDocs(query(collection(db, 'maintainModeEvent'), orderBy('date', 'desc')));

      if (!docWholeSnap.empty) {
        docWholeSnap.docs.map( (item, index) => {
          getDoc(doc(db, 'users/', item.data().executor)).then(executor => {
            console.log(executor, 'executor')
            historyTableRows.value = [...historyTableRows.value, {
              number: index + 1,
              typeOperation: t('operationHistory.' + [item.data().typeOperation]),
              date: date.formatDate(item.data().date.toDate(), 'YYYY-MM-DD HH:mm:ss'),
              executor:  executor?.data()?.name,
              note: item.data().note,
            }]
          })

        })

      }

      loading.value = false

    });

     return {
      pagination,
      historyTableColumns,
      historyTableRows,
      loading
     }
   }
 }
</script>
