<template>
  <q-table
    :columns="columns"
    :rows="historyData"
    row-key="id"
    selection="multiple"
    v-model:selected="selected"
    v-model:pagination="pagination"
    hide-pagination
  >
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        {{props.row.name}}/{{props.row.branch}}
      </q-td>
    </template>

    <template v-slot:body-cell-result="props">
      <q-td :props="props">
        {{$t('client.tele.'+props.row.result)}}
      </q-td>
    </template>

    <template v-slot:body-cell-jobResult="props">
      <q-td :props="props">
        <div v-if="props.row.jobResult">
          {{$t('client.tele.'+props.row.jobResult)}}
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import {  ref, computed, Ref } from 'vue';
import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
import { teleAppointmentData } from 'src/shared/constants/TeleAppoint.const';
export default {
  name: 'TeleAppointHistory',
  components: {
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const historyData: Ref<TeleAppointmentHistory[]> = ref([])
    const selected: Ref<TeleAppointmentHistory[]> = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
      {
          name: 'name',
          required: true,
          label: t('detal.teleAppoint.registredUser'),
          align: 'left',
          field: 'name',
          sortable: false,
        },
        {
          name: 'date',
          required: true,
          label: t('detal.teleAppoint.date') ,
          field: 'date',
          align: 'left',
        },
        {
          name: 'result',
          required: true,
          label: t('detal.teleAppoint.teleAppointmentResult') ,
          field: 'result',
          align: 'left',
        },
        {
          name: 'jobResult',
          label: t('detal.teleAppoint.jobResult') ,
          field: 'jobResult',
          align: 'left',
        },
        {
          name: 'requiredService',
          label: t('detal.teleAppoint.requiredService') ,
          field: 'requiredService',
          align: 'left',
        },
        {
          name: 'remark',
          label: t('detal.teleAppoint.remark') ,
          field: 'remark',
          align: 'left',
        },
      ];
  });

  loadTeleAppointmentData()
    function loadTeleAppointmentData() {
      historyData.value = teleAppointmentData
    }

    return {
      columns,
      historyData,
      selected,
      pagination
    };
  },
};
</script>
