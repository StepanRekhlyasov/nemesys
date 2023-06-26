<template>
  <q-table
    :columns="columns"
    :rows="backOrderData"
    row-key="id"
    v-model:pagination="pagination"
    hide-pagination
    class="q-py-none no-shadow"
  >
    <template v-slot:body-cell-select="props">
      <q-td :props="props">
        <q-checkbox v-model="props.row.selected" />
      </q-td>
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
        {{props.row.typeCase && $t('client.backOrder.'+props.row.typeCase)}}<br/>
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
        {{props.row.status && $t('client.backOrder.'+props.row.status)}}<br/>
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
        {{props.row.workingHoursEarly_min}}<br/>
        {{props.row.workingHoursDay_min}}<br/>
        {{props.row.workingHoursLate_min}}<br/>
        {{props.row.workingHoursNight_min}}
      </q-td>
    </template>

    <template v-slot:top>
      <q-checkbox val="xs" class="q-pt-sm" color="blue" v-model="selected" />
      <div class="q-ml-sm q-pt-sm">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
      <q-btn class="no-shadow q-ml-md q-mt-sm q-py-none q-px-md bg-grey-4" :label="$t('common.delete')" v-if="selectedCount() > 0" @click="deleteSelected()" />
    </template>

  </q-table>

  <q-drawer
    show
    class="bg-grey-3"
    :width="1000"
    :breakpoint="500"
    side="right"
    overlay
    elevated
    bordered
    v-model="openDialog"
  >
    <createBO :client="client" @closeDialog="openDialog = false" :type="'dispatch'" />
  </q-drawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, Ref, watch, onMounted, defineProps } from 'vue';
import { BackOrderModel } from 'src/shared/model/BackOrder.model';
import createBO from 'src/pages/user/BackOrder/components/create/createBO.vue';
import { useBackOrder } from 'src/stores/backOrder';
import { useQuasar } from 'quasar';
import { BackOrderColumns } from 'src/shared/constants/BackOrder.const';
import { Alert } from 'src/shared/utils/Alert.utils';

const { t } = useI18n({ useScope: 'global' });
const backOrderData: Ref<BackOrderModel[]> = ref([]);
const props = defineProps<{ clientId: string }>();
const selected = ref(false);
const columns = ref(BackOrderColumns);
const loading = ref(false);
const $q = useQuasar();
const openDialog: Ref<boolean> = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});
const backOrderStore = useBackOrder();

const showDeleteDialog = async (ids: string[]) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel')
  }).onOk(async () => {
    const done = await backOrderStore.deleteBackOrder(ids);
    if (done) {
     Alert.success($q,t)
    }
  });
};

const deleteSelected = () => {
  const BoItem = backOrderData.value.filter(row => row['selected']);
  let items: string[] = [];
  for (const item of BoItem) {
    items.push(item['clientId']);
  }
  showDeleteDialog(items);
};

const fetchBOData = async () => {
  loading.value = true;
  const data = await backOrderStore.getClientBackOrder(props.clientId);
  backOrderData.value = data.map(row => {
    return { ...row, selected: false };
  });
  loading.value = false;
};

watch(() => selected.value, (newValue) => {
  for (let i = 0; i < backOrderData.value.length; i++) {
    backOrderData.value[i]['selected'] = newValue;
  }
});

onMounted(fetchBOData);

const selectedCount = () => {
  return backOrderData.value.filter(row => row['selected']).length;
};
</script>

<style lang="scss">
tbody {
  background-color: #efeded;
}
</style>
