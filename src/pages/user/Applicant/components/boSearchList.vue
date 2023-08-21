<template>
  <div class="row q-pb-md" v-if="!hideMapButton">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn :label="$t('backOrder.searchByMap')" class="q-ml-md" outline color="primary"
        @click="emit('openSearchByMap')" />
    </div>
  </div>
  <q-card-section class=" q-pa-none">
    <q-table :columns="columns" :loading="loading" :rows="allBoList" row-key="id" class="no-shadow"
      table-class="text-grey-8" table-header-class="text-grey-9" v-model:pagination="pagination">
      <template v-slot:body-cell-boId="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn flat dense no-caps color="primary" @click="openDrawer(props.row)" :label="props.row.boId"
            class="q-pa-none text-body1" />
        </q-td>
      </template>
      <template v-slot:body-cell-dealType="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ t(`applicant.add.${props.row.typeCase}`) }}
        </q-td>
      </template>
      <template v-slot:body-cell-distanceBusiness="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.distanceBusiness }} Km
        </q-td>
      </template>
      <template v-slot:body-cell-clientName="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.clientName?props.row.clientName.slice(0,7):'-' }}{{ props.row.clientName && props.row.clientName.length>7?'...':'' }}
        </q-td>
      </template>
      <template v-slot:body-cell-officeName="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.officeName?props.row.officeName.slice(0,7):'-' }}{{ props.row.officeName && props.row.officeName.length>7?'...':'' }}
        </q-td>
      </template>
      <template v-slot:body-cell-matchDegree="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn @click="openPopup(props.row)" dense no-caps color="primary" :label='props.row.matchDegree' flat>%</q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="popupVisible">
      <q-card>
        <q-card-section>
          <matchDegreeTable :bo="popupBo" :staff="applicant" :matchedData="matchedData"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Close" @click="closePopup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card-section>
  <InfoBO ref="infoDrawer" @openSearchByMap="showSearchByMap = true" @passClientToMapSearch="(clientValue) => {
    selectedClient = clientValue
  }" :isHiddenDetails="true"/>
  <SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient"
  @close="showSearchByMap = false"></SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { BackOrderModel, BoForMapSearch, Client } from 'src/shared/model';
import { ref, onMounted, watch, ComputedRef } from 'vue';
import { BackOrderStaffApplicant } from 'src/pages/user/BackOrder/consts/BackOrder.const';
import { useBackOrder } from 'src/stores/backOrder';
import { useI18n } from 'vue-i18n';
import { radius } from 'src/pages/user/Applicant/const/index';
import { QTableProps } from 'quasar';
import { Applicant } from 'src/shared/model';
import matchDegreeTable from 'src/pages/user/Applicant/components/matchDegreeTable.vue';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import InfoBO from 'src/pages/user/BackOrder/components/info/InfoBO.vue';
import SearchByMapDrawer from 'src/pages/user/BackOrder/components/info/searchByMapDrawer.vue';
import { boMapDrawerValue } from '../const';
import { Timestamp, where } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';
import { myDateFormat } from 'src/shared/utils/utils';

const showSearchByMap = ref(false)
const selectedClient = ref<Client | undefined>(undefined);

const organization = useOrganization()
const backOrderStore = useBackOrder()
const allBoList = ref<BoForMapSearch[]>([])
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
});

const selectedBo = ref<BackOrderModel | undefined>();
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);

const openDrawer = (data) => {
  if (data) {
    selectedBo.value = data;
    backOrderStore.state.selectedBo = selectedBo.value as BackOrderModel
    infoDrawer.value?.openDrawer(data);
  }
}

const columns = ref<QTableProps | ComputedRef>(BackOrderStaffApplicant)
const matchedData = ref({});

const props = withDefaults(defineProps<{
  boList: BackOrderModel[],
  applicant: Applicant,
  hideMapButton?: boolean
}>(), {
  hideMapButton: false
}
)
const popupVisible = ref(false);
const popupBo = ref({});

const openPopup = (bo) => {
  popupBo.value = bo;
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};

watch(() => radius.value, async() => {
  loading.value = true;
  await getFormatedData();
  if (radius.value) {
    allBoList.value = allBoList.value.filter((bo) => bo.distanceBusiness <= radius.value)
    allBoList.value.sort((a, b) => a.distanceBusiness - b.distanceBusiness);
  }
  loading.value = false;
})

watch(boMapDrawerValue,async ()=>{
  if(boMapDrawerValue.value){
    await getFormatedData()
  }
})

const calculateDistance = () => {
  const staffLocation = {
    lat: props.applicant['lat'],
    lon: props.applicant['lon'],
  };

  allBoList.value.forEach(bo => {
    const clientLocation = {
      lat: bo['lat'],
      lon: bo['lon'],
    };
    const distance = backOrderStore.getDistance(clientLocation, staffLocation);
    bo.distanceBusiness = distance;
  });
};

const calculateMatchDegree = () => {
  allBoList.value.forEach((bo) => {
   matchedData.value[bo.id] = backOrderStore.matchData(props.applicant, bo,true);
  })
  allBoList.value.sort((a, b) => b.matchDegree - a.matchDegree);
}

const loading = ref<boolean>(false);
const { t } = useI18n({ useScope: 'global' });

onMounted(async () => {
  loading.value = true;
  await getFormatedData();
  loading.value = false;
})

watchCurrentOrganization(async ()=>{
  loading.value = true;
  await getFormatedData();
  loading.value = false;
})

const getFormatedData = async () => {
  allBoList.value = await backOrderStore.getBOByConstraints([where('deleted', '==', false), where('organizationId', '==', organization.currentOrganizationId)]) as BoForMapSearch[];
    allBoList.value.forEach((bo)=>{
        bo['dateOfRegistration'] = myDateFormat(
          bo['dateOfRegistration'] as Timestamp
        );
    })
  calculateDistance();
  calculateMatchDegree();
}

const emit = defineEmits(['openSearchByMap']);

</script>
