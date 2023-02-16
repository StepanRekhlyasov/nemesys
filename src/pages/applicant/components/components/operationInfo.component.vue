<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <span class="text-primary text-h6 q-pt-md"> {{ $t('applicant.attendant.operatingSites') }} </span>
    </q-card-section>

    <q-table :columns="columns" :rows="data" row-key="id" v-model:pagination="pagination" hide-pagination />
  </q-card>
</template>

<script lang="ts">
import { computed, ref} from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'operationInfoComponent',
  props: {
    applicant: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const data = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
        {
          name: 'created_at',
          required: true,
          label: t('applicant.attendant.placeOperation'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'contactMethod',
          required: true,
          label: t('applicant.attendant.startDate'),
          field: 'contactMethod',
          align: 'left',
        },
        {
          name: 'created_by',
          label: t('applicant.attendant.endDate'),
          field: 'created_by',
          align: 'left',
        },
        {
          name: 'content',
          label: t('applicant.attendant.companyInCharge'),
          field: 'content',
          align: 'left',
        },
        {
          name: 'note',
          label: t('applicant.attendant.operationMemo'),
          field: 'note',
          align: 'left',
        },
      ];
    });

    const loading = ref(false);

    return {
      columns,
      pagination,
      data,
      loading
    }
  }
}
</script>

<style>

</style>
