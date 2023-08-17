<template>
  <q-table :columns="columns" :rows="backOrderData" row-key="id" v-model:pagination="pagination" hide-pagination
    class="q-py-none no-shadow CFDrawerBO">
    <template v-slot:body-cell-boid="props">
      <q-td :props="props">
        <q-btn v-if="theme==='primary'" flat dense no-caps @click="openDrawer(props.row)" :color="theme" :label="props.row.boId"
          class="q-pa-none text-body1" />
        <div v-else>{{ props.value }}</div>
      </q-td>
    </template>
    <template v-if="theme==='primary'" v-slot:body-cell-select="props">
      <q-td :props="props">
        <q-checkbox v-model="props.row.selected" />
      </q-td>
    </template>

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
    <template v-slot:body-cell-dateRegistration="props">
      <q-td :props="props">
        {{ (props.row.dateOfRegistration) }}<br />
      </q-td>
    </template>

    <template v-slot:body-cell-qualification="props">
      <q-td :props="props">
        {{ props.row.qualifications && props.row.qualifications.length ? props.row.qualifications.map(q =>
          $t('applicant.qualification.' + q)).join(', ') : '' }}<br />
        {{ props.row.experienceReq }}
      </q-td>
    </template>

    <template v-slot:body-cell-age="props">
      <q-td :props="props">
        {{ props.row.upperAgeLimit }}<br />
        {{ props.row.employmentType && Array.isArray(props.row.employmentType) ? props.row.employmentType.map((row : string) => $t('client.backOrder.' + row)).join(', ') : '-' }}<br />
      </q-td>
    </template>

    <template v-slot:body-cell-work="props">
      <q-td :props="props">
        {{ $t('backOrder.daysPerWeek.'+props.row.daysPerWeekList) }}<br />
        {{ props.row.workingDays && Array.isArray(props.row.workingDays) ? props.row.workingDays.map(days => $t('weekDay.' + days)).join(', '):'-' }}
      </q-td>
    </template>

    <template v-slot:body-cell-content="props">
      <q-td :props="props">
        {{ props.row.work_content }}<br />
        {{ props.row.memo_house }}
      </q-td>
    </template>

    <template v-slot:body-cell-workingTime="props">
      <q-td :props="props">
        {{ props.row.workingHoursEarly_min }} - {{ props.row.workingHoursEarly_max }}<br />
        {{ props.row.workingHoursDay_min }} - {{ props.row.workingHoursDay_max }}<br />
        {{ props.row.workingHoursLate_min }} - {{ props.row.workingHoursLate_max }}<br />
        {{ props.row.workingHoursNight_min }} - {{ props.row.workingHoursNight_max }}
      </q-td>
    </template>

    <template v-slot:top v-if="theme==='primary'">
      <q-checkbox val="xs" class="q-pt-sm" color="blue" v-model="selected" />
      <div class="q-ml-sm q-pt-sm">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
      <q-btn class="no-shadow q-ml-md q-mt-sm q-py-none q-px-md " :label="$t('common.delete')"
        :class="selectedCount() == 0 ? 'bg-secondary' : 'bg-red'" :text-color="selectedCount() > 0 ? 'white' : 'black'"
        :disable="selectedCount() == 0" @click="deleteSelected()" />
      <q-btn :color="theme" text-color="white" icon="mdi-plus-thick" class="no-shadow q-mt-sm q-px-md q-ml-md" dense
        :label="$t('common.add')" @click="addNewBo" />
    </template>

  </q-table>
  <Pagination :theme="theme" :rows="backOrderData" @updatePage="pagination.page = $event" v-model:pagination="pagination" />
  <q-drawer v-model="cteateBoDrawer" :width="1000" :breakpoint="500" side="right" overlay elevated bordered>
    <createBO :clientId="clientId" :original-office-id="originalOfficeId" :officeId="officeId" :type="typeBoCreate" @close-dialog="cteateBoDrawer = false" @fetch-bo="fetchBOData()"
    v-if="cteateBoDrawer"
    />
  </q-drawer>
  <InfoBO ref="infoDrawer" @openSearchByMap="showSearchByMap = true" @passClientToMapSearch="(clientValue) => {
    selectedClient = clientValue
  }" />
  <SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient"
    @close="showSearchByMap = false"></SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { BackOrderModel } from 'src/shared/model/BackOrder.model';
import { Client } from 'src/shared/model/Client.model'
import { ref, Ref, watch, onMounted } from 'vue';
import { useBackOrder } from 'src/stores/backOrder';
import { useQuasar } from 'quasar';
import InfoBO from 'src/pages/user/BackOrder/components/info/InfoBO.vue';
import SearchByMapDrawer from 'src/pages/user/BackOrder/components/info/searchByMapDrawer.vue';
import createBO from 'src/pages/user/BackOrder/components/create/createBO.vue';
import { BackOrderColumns } from 'src/shared/constants/BackOrder.const';
import Pagination from 'src/components/client-factory/PaginationView.vue';
import { QTableProps } from 'quasar';
import { useRoute } from 'vue-router';

const route = useRoute()
const theme = route.meta.isAdmin ? 'accent' : 'primary'
const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{ clientId: string; officeId?: string; originalOfficeId?: string }>();
const selected = ref(false);
const backOrderData: Ref<BackOrderModel[]> = ref([]);
const showSearchByMap = ref(false)
const typeBoCreate: Ref<'referral' | 'dispatch'> = ref('referral')
const selectedBo = ref<BackOrderModel | undefined>();
const selectedClient = ref<Client | undefined>(undefined);
const cteateBoDrawer = ref(false);
const columns = ref<QTableProps | Ref>(BackOrderColumns);
const loading = ref(false);
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);
const $q = useQuasar();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
});

const backOrderStore = useBackOrder();

const showDeleteDialog = async (ids: string[]) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel')
  }).onOk(async () => {
    loading.value = true
    await backOrderStore.deleteBO(ids);
    loading.value = false
    const data = await backOrderStore.getCfBoOfCurrentOrganization(props.officeId?props.officeId:props.originalOfficeId,theme==='accent')
    backOrderData.value = data.map(row => {
      return { ...row, selected: false };
    });

  });
};

const deleteSelected = () => {
  const boItem = backOrderData.value.filter(row => row['selected']);
  let items: string[] = [];
  for (const item of boItem) {
    items.push(item['id']);
  }
  showDeleteDialog(items);
};

const fetchBOData = async () => {
  loading.value = true;
  const data = await backOrderStore.getCfBoOfCurrentOrganization(props.officeId?props.officeId:props.originalOfficeId,theme==='accent')
  backOrderData.value = data.map((row) => {
    return { ...row, selected: false, boid: row.boId };
  });
  backOrderData.value.sort((a,b)=>Number(b.boId)-Number(a.boId))
  loading.value = false;
};
const openDrawer = (data) => {
  if (data) {
    selectedBo.value = data;
    backOrderStore.state.selectedBo = selectedBo.value as BackOrderModel
    infoDrawer.value?.openDrawer(data);
  }
}
watch(() => selected.value, (newValue) => {
  for (let i = 0; i < backOrderData.value.length; i++) {
    backOrderData.value[i]['selected'] = newValue;
  }
});
onMounted(async () => {
  fetchBOData();
});

const selectedCount = () => {
  return backOrderData.value.filter(row => row['selected']).length;
};

function addNewBo() {
  $q.dialog({
    color:theme,
    title: t('backOrder.selectBOType'),
    cancel: t('backOrder.type.dispatch'),
    ok: t('backOrder.type.referral'),
  })
    .onOk(() => {
      typeBoCreate.value = 'referral';
      cteateBoDrawer.value = true
    })
    .onCancel(() => {
      typeBoCreate.value = 'dispatch';
      cteateBoDrawer.value = true

    });
}

</script>

<style lang="scss">
.CFDrawerBO {
  tbody {
    background-color: #efeded;
  }
}
</style>

