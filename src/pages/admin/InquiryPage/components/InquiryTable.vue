<template>
  <q-card-section class="q-pa-none">
    <q-table
      :columns="inquiresTableColumns"
      :rows="inquiresTableRows"
      row-key="id"
      v-model:pagination="pagination"
      class="no-shadow bg-grey-2"
      color="primary"
      table-header-style="background-color: #ffffff"
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props"  :style="props.row.status === INQUIRY_STATUS.unanswered || props.row.status === '未返信' ? 'background: #F7F0F7' : 'background: #fff'">

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <q-btn v-if="col.name === 'edit'" icon="edit" flat
                @click="() => editInquiry(props.row)" color="accent" />

            <span v-else-if="col.name === 'status'" >
              {{ $t('inquiry.'+props.row.status) }}
            </span>

            <span v-else>{{ col.value }}</span>
          </q-td>

        </q-tr>
      </template>
    </q-table>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { QTableProps } from 'quasar';
  import { ref, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useInquiry } from 'src/stores/inquiry';
  import { cloneToRaw } from 'src/shared/utils/utils';
  import { InquiryDataRow } from 'src/shared/model';
  import { INQUIRY_STATUS } from '../types/inquiryTypes';


  const { t } = useI18n({ useScope: 'global' });

  const inquiryStore = useInquiry()

  const loading = ref(true)

  const inquiresTableRows =  computed(() => inquiryStore.state.wholeInquiresData);
  const inquiresTableColumns = computed < QTableProps['columns'] > (() => [{
      name: 'edit',
      label: '',
      field: ''
  }, {
      name: 'number',
      label: 'No.',
      field: 'number',
      sortable: false,
  }, {
      name: 'status',
      required: true,
      label: t('inquiry.table.status'),
      field: 'status',
      align: 'left',
      sortable: true,
  }, {
      name: 'category',
      required: true,
      label: t('inquiry.table.category'),
      field: 'category',
      align: 'left',
      sortable: true,
  }, {
      name: 'subject',
      required: true,
      label: t('inquiry.table.subject'),
      field: 'subject',
      align: 'left',
      sortable: true,
  }, {
      name: 'companyID',
      required: true,
      label: t('inquiry.table.companyID'),
      field: 'companyID',
      align: 'left',
      sortable: true,
  }, {
      name: 'companyName',
      required: true,
      label: t('inquiry.table.companyName'),
      field: 'companyName',
      align: 'left',
      sortable: true,
  }, {
      name: 'updated_at',
      required: true,
      label: t('inquiry.table.recievedDate'),
      field: 'updated_at',
      align: 'left',
      sortable: false,
  }, 
])

  const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
  });

  onMounted(async () => {
      await inquiryStore.getAllInquires()
      loading.value = false
  });

  const editInquiry = (row: InquiryDataRow) => {
    inquiryStore.setCurrentOrganisationInfo(row.organisation)
    inquiryStore.setCurrentRowData(cloneToRaw(row))
    inquiryStore.openDrawer(true)

  }

</script>
