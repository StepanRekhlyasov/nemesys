<template>
  <q-card-section class="q-pa-none">
    <q-table
      :columns="inquiresTableColumns"
      :rows="inquiresTableRows"
      row-key="id"
      v-model:pagination="pagination"
      hide-pagination class="no-shadow bg-grey-2"
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

            <q-btn v-else-if="col.name === 'delete'" icon="delete" flat @click="deleteInquiry(props.row.id)" />
            <span v-else>{{ col.value }}</span>
          </q-td>

        </q-tr>
      </template>
    </q-table>
    <div class="row justify-start q-mt-md q-mb-md pagination q-mx-md">
      <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
        :max="(inquiresTableRows.length / pagination.rowsPerPage) >= 1 ? inquiresTableRows.length / pagination.rowsPerPage : 1"
        direction-links outline />
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { QTableProps, useQuasar } from 'quasar';
  import { ref, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useInquiry } from 'src/stores/inquiry';
  import { cloneToRaw } from 'src/shared/utils/utils';
  import { InquiryDataRow } from 'src/shared/model';
  import { INQUIRY_STATUS } from '../types/inquiryTypes';


  const { t } = useI18n({ useScope: 'global' });
  const $q = useQuasar();

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
      field: 'number'
  }, {
      name: 'status',
      required: true,
      label: t('inquiry.table.status'),
      field: 'status',
      align: 'left',
      sortable: false,
  }, {
      name: 'category',
      required: true,
      label: t('inquiry.table.category'),
      field: 'category',
      align: 'left',
      sortable: false,
  }, {
      name: 'subject',
      required: true,
      label: t('inquiry.table.subject'),
      field: 'subject',
      align: 'left',
      sortable: false,
  }, {
      name: 'companyID',
      required: true,
      label: t('inquiry.table.companyID'),
      field: 'companyID',
      align: 'left',
      sortable: false,
  }, {
      name: 'recievedDate',
      required: true,
      label: t('inquiry.table.recievedDate'),
      field: 'issueDate',
      align: 'left',
      sortable: false,
  }, {
      name: 'responseDate',
      required: true,
      label: t('inquiry.table.responseDate'),
      field: 'answerDate',
      align: 'left',
      sortable: false,
  }, {
      name: 'delete',
      label: '',
      field: ''
  }])

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




  const deleteInquiry = (inquiryId: string) => {
    $q.dialog({
        title: t('common.delete'),
        message: t('releaseNotes.table.deletedInfo'),
        ok: {
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
        },
    }).onOk(async () => {
        try {
            loading.value = true;
            await inquiryStore.deleteInquiryData(inquiryId)
            await loadCurrentInquires();
            loading.value = false;
            Alert.success()
        } catch (e) {
            console.error(e)
            Alert.warning(e)
            loading.value = false;
        }
    })
  }
</script>
