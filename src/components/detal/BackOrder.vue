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
    <template v-slot:header-cell-name="props">
      <q-th :props="props">
        {{$t('client.backOrder.caseType')}}<br/>
        {{$t('client.backOrder.transactionType')}}<br/>
      </q-th>
    </template>

    <template v-slot:header-cell-qualification="props">
      <q-th :props="props">
        {{$t('client.backOrder.reqQualification')}}<br/>
        {{$t('client.backOrder.experienceReq')}}<br/>
      </q-th>
    </template>

    <template v-slot:header-cell-age="props">
      <q-th :props="props">
        {{$t('client.backOrder.upperAgeLimit')}}<br/>
        {{$t('client.backOrder.employmentStatus')}}<br/>
        {{$t('client.backOrder.dispatchPrice')}}<br/>
      </q-th>
    </template>

    <template v-slot:header-cell-work="props">
      <q-th :props="props">
        {{$t('client.backOrder.workingDays')}}<br/>
        {{$t('client.backOrder.workingDaysWeek')}}<br/>
      </q-th>
    </template>

    <template v-slot:header-cell-content="props">
      <q-th :props="props">
        {{$t('client.backOrder.businessContent')}}<br/>
        {{$t('client.backOrder.otherNotes')}}<br/>
      </q-th>
    </template>

    <template v-slot:header-cell-workingTime="props">
      <q-th :props="props">
        {{$t('client.backOrder.workingHoursEarly')}}<br/>
        {{$t('client.backOrder.workingHoursDay')}}<br/>
        {{$t('client.backOrder.workingHoursLate')}}<br/>
        {{$t('client.backOrder.workingHoursNight')}}<br/>
      </q-th>
    </template>

    <template v-slot:body-cell-type="props">
      <q-td :props="props" >
        {{$t('client.backOrder.'+props.row.typeCase)}}<br/>
        {{$t('client.backOrder.'+props.row.typeTransaction)}}
      </q-td>
    </template>

    <template v-slot:body-cell-qualification="props">
      <q-td :props="props" >
        {{props.row.qualifications}}<br/>
        {{props.row.experience}}
      </q-td>
    </template>

    <template v-slot:body-cell-age="props">
      <q-td :props="props" >
        {{props.row.ageLimit}}<br/>
        {{$t('client.backOrder.'+props.row.status)}}<br/>
        {{props.row.unitPrice}}
      </q-td>
    </template>

    <template v-slot:body-cell-work="props">
      <q-td :props="props" >
        {{props.row.posibleDays}} 日／月<br/>
        {{props.row.posibleObsidianDays}}
      </q-td>
    </template>

    <template v-slot:body-cell-content="props">
      <q-td :props="props" >
        {{props.row.buissnesDescription}}<br/>
        {{props.row.otherNotes}}
      </q-td>
    </template>

    <template v-slot:body-cell-workingTime="props">
      <q-td :props="props" >
        {{props.row.early}}<br/>
        {{props.row.datetime}}<br/>
        {{props.row.shortened}}<br/>
        {{props.row.nightShift}}
      </q-td>
    </template>

  </q-table>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import {  ref, computed, Ref } from 'vue';
import { backOrderData } from 'src/shared/constants/BackOrder.const'
import { BackOrderModel } from 'src/shared/model/BackOrder.model';
export default {
  name: 'TeleAppointHistory',
  components: {
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const historyData: Ref<BackOrderModel[]> = ref([])
    const selected: Ref<BackOrderModel[]> = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
      {
          name: 'type',
          required: true,
          label: t('client.backOrder.caseType'),
          align: 'left',
          field: 'type',
          sortable: false,
        },{
          name: 'qualification',
          required: true,
          label: t('client.teleAppoint.date') ,
          field: 'qualification',
          align: 'left',
        },{
          name: 'age',
          required: true,
          label: t('client.teleAppoint.teleAppointmentResult') ,
          field: 'age',
          align: 'left',
        },{
          name: 'work',
          label: t('client.backOrder.workingDays') ,
          field: 'work',
          align: 'left',
        },{
          name: 'content',
          label: t('client.backOrder.businessContent') ,
          field: 'content',
          align: 'left',
        },{
          name: 'dateRegistration',
          label: t('client.backOrder.dateOfRegistration') ,
          field: 'dateRegistration',
          align: 'left',
        },{
          name: 'customerRepresentative',
          label: t('client.backOrder.customerReprisentative'),
          field: 'customerRepresentative',
          align: 'left'
        },{
          name: 'workingTime',
          label: t('client.backOrder.workingHoursEarly'),
          field: 'workingTime',
          align: 'left'
        }
      ];
  });

  loadTeleAppointmentData()
    function loadTeleAppointmentData() {
      historyData.value = backOrderData
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
