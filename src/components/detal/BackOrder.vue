<template>
  <q-table :columns="columns" :rows="backOrderData" row-key="id" selection="multiple" v-model:selected="selected"
    v-model:pagination="pagination" hide-pagination>
    <template v-slot:header-cell-qualification="props">
      <q-th :props="props">
        {{ $t('client.backOrder.reqQualification') }}<br />
        {{ $t('client.backOrder.experienceReq') }}<br />
      </q-th>
    </template>

    <template v-slot:header-cell-age="props">
      <q-th :props="props">
        {{ $t('client.backOrder.upperAgeLimit') }}<br />
        {{ $t('client.backOrder.employmentStatus') }}<br />
        {{ $t('client.backOrder.dispatchPrice') }}<br />
      </q-th>
    </template>

    <template v-slot:header-cell-work="props">
      <q-th :props="props">
        {{ $t('client.backOrder.workingDays') }}<br />
        {{ $t('client.backOrder.workingDaysWeek') }}<br />
      </q-th>
    </template>

    <template v-slot:header-cell-content="props">
      <q-th :props="props">
        {{ $t('client.backOrder.businessContent') }}<br />
        {{ $t('client.backOrder.otherNotes') }}<br />
      </q-th>
    </template>

    <template v-slot:header-cell-workingTime="props">
      <q-th :props="props">
        {{ $t('client.backOrder.workingHoursEarly') }}<br />
        {{ $t('client.backOrder.workingHoursDay') }}<br />
        {{ $t('client.backOrder.workingHoursLate') }}<br />
        {{ $t('client.backOrder.workingHoursNight') }}<br />
      </q-th>
    </template>

    <template v-slot:body-cell-type="props">
      <q-td :props="props">
        {{ props.row.typeCase && $t('client.backOrder.' + props.row.typeCase) }}<br />
      </q-td>
    </template>

    <template v-slot:body-cell-qualification="props">
      <q-td :props="props">
        {{ props.row.qualifications }}<br />
        {{ props.row.experience }}
      </q-td>
    </template>

    <template v-slot:body-cell-age="props">
      <q-td :props="props">
        {{ props.row.ageLimit }}<br />
        {{ props.row.status && $t('client.backOrder.' + props.row.status) }}<br />
        {{ props.row.unitPrice }}
      </q-td>
    </template>

    <template v-slot:body-cell-work="props">
      <q-td :props="props">
        {{ props.row.posibleDays }} 日／月<br />
        {{ props.row.posibleObsidianDays }}
      </q-td>
    </template>

    <template v-slot:body-cell-content="props">
      <q-td :props="props">
        {{ props.row.buissnesDescription }}<br />
        {{ props.row.otherNotes }}
      </q-td>
    </template>

    <template v-slot:body-cell-workingTime="props">
      <q-td :props="props">
        {{ props.row.workingHoursEarly_min }}<br />
        {{ props.row.workingHoursDay_min }}<br />
        {{ props.row.workingHoursLate_min }}<br />
        {{ props.row.workingHoursNight_min }}
      </q-td>
    </template>

    <template v-slot:top>
      <q-btn color="primary" icon="mdi-plus-thick" class="no-shadow " :label="$t('common.add')" @click="showAddBO" />
      <q-btn color="negative" class="no-shadow q-ml-md" v-if="selected.length > 0" :label="$t('common.delete')"
        @click="deleteBo" />
    </template>

  </q-table>

  <!-- add ot edit BO -->
  <q-drawer show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated bordered
    v-model="openDialog">
    <createBO :client="client" @closeDialog="openDialog = false" :type="'dispatch'" />
  </q-drawer>
</template>
 
<script lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed, Ref } from 'vue';
import { BackOrderModel } from 'src/shared/model/BackOrder.model';
import createBO from 'src/pages/user/BackOrder/components/create/createBO.vue';
import { useBackOrder } from 'src/stores/backOrder';
export default {
  name: 'BackOrder',
  components: {
    createBO
  },
  props: {
    client: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const backOrderData: Ref<BackOrderModel[]> = ref([])
    const selected: Ref<BackOrderModel[]> = ref([])
    const openDialog: Ref<boolean> = ref(false);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const backOrderStore = useBackOrder();

    const columns = computed(() => {
      return [
        {
          name: 'type',
          required: true,
          label: t('client.backOrder.caseType'),
          align: 'left',
          field: 'type',
          sortable: false,
        }, {
          name: 'qualification',
          required: true,
          label: t('client.teleAppoint.date'),
          field: 'qualification',
          align: 'left',
        }, {
          name: 'age',
          required: true,
          label: t('client.teleAppoint.teleAppointmentResult'),
          field: 'age',
          align: 'left',
        }, {
          name: 'work',
          label: t('client.backOrder.workingDays'),
          field: 'work',
          align: 'left',
        }, {
          name: 'content',
          label: t('client.backOrder.businessContent'),
          field: 'content',
          align: 'left',
        }, {
          name: 'dateRegistration',
          label: t('client.backOrder.dateOfRegistration'),
          field: 'created_at',
          align: 'left',
        }, {
          name: 'customerRepresentative',
          label: t('client.backOrder.customerReprisentative'),
          field: 'customerRepresentative',
          align: 'left'
        }, {
          name: 'workingTime',
          label: t('client.backOrder.workingHoursEarly'),
          field: 'workingTime',
          align: 'left'
        }
      ];
    });

    loanBoListData()
    async function loanBoListData() {
      backOrderData.value = await backOrderStore.getClientBackOrder(props.client.id)
    }

    const showAddBO = () => {
      openDialog.value = true
    }

    const deleteBo = async () => {
      try {
        await backOrderStore.deleteBackOrder(selected.value)
        await loanBoListData();
        selected.value = [];
      } catch (e) {
        console.log(e)
      }
    }

    return {
      columns,
      backOrderData,
      selected,
      pagination,
      openDialog,

      showAddBO,
      deleteBo
    };
  },
};
</script>
