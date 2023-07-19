<template>
  <div class="row q-pb-md" v-if="!hideMapButton">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn :label="$t('backOrder.searchByMap')" class="q-ml-md" outline color="primary"
        @click="emit('openSearchByMap')" />
    </div>
  </div>
  <q-card-section class=" q-pa-none">
    <q-table :columns="columns" :loading="loading" :rows="staffList" row-key="id" class="no-shadow"
      table-class="text-grey-8" table-header-class="text-grey-9" v-model:pagination="pagination">
      <template v-slot:body-cell-name="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary" :label="props.value"
            class="q-pa-none text-body1" />
        </q-td>
      </template>
      <template v-slot:body-cell-statusThisTime="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ t(`applicant.statusOption.${props.row.status}`) }}
        </q-td>
      </template>
      <template v-slot:body-cell-distanceBusiness="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.distanceBusiness }} Km
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
          <matchDegreeTable :bo="bo" :staff="popupStaff" :matchedData="matchedData"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Close" @click="closePopup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card-section>
  <ApplicantDetails :bo="bo" ref="detailsDrawer" />
</template>

<script lang="ts" setup>
import { BackOrderModel, ApplicantForCandidateSearch } from 'src/shared/model';
import { ref, onMounted, watch, ComputedRef } from 'vue';
import { BackOrderStaff } from '../../consts/BackOrder.const';
import { useBackOrder } from 'src/stores/backOrder';
import { useApplicant } from 'src/stores/applicant'
import { useClient } from 'src/stores/client'
import { where } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { radius } from '../../consts/BackOrder.const';
import { QTableProps } from 'quasar';
import { Applicant } from 'src/shared/model';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import matchDegreeTable from './matchDegreeTable.vue';

const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
const backOrderStore = useBackOrder()

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
  // rowsNumber: xx if getting data from a server
});

const columns = ref<QTableProps | ComputedRef>(BackOrderStaff)
const matchedData = ref({});

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};
const props = withDefaults(defineProps<{
  bo: BackOrderModel,
  hideMapButton?: boolean
}>(), {
  hideMapButton: false
}
)
const popupVisible = ref(false);
const popupStaff = ref({});

const openPopup = (staff) => {
  popupStaff.value = staff;
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};

watch(() => radius.value, async () => {
  await getFormatedData();
  if (radius.value) {
    staffList.value = staffList.value.filter((staff) => staff.distanceBusiness <= radius.value)
    staffList.value.sort((a, b) => a.distanceBusiness - b.distanceBusiness);
  }
  else {
    loading.value = true;
    await getFormatedData();
    loading.value = false;
  }
})

const calculateDistance = async () => {
  const client = await getClient.fetchClientsById(props.bo.client_id);
  const clientLocation = {
    lat: client['lat'],
    lon: client['lon'],
  };

  staffList.value.forEach(staff => {
    const staffLocation = {
      lat: staff.lat,
      lon: staff.lon,
    };
    const distance = backOrderStore.getDistance(clientLocation, staffLocation);
    staff.distanceBusiness = distance;
  });
};

const calculateMatchDegree = () => {

  staffList.value.forEach((staff) => {
   matchedData.value[staff.id] = backOrderStore.matchData(staff, props.bo);
  })
  staffList.value.sort((a, b) => b.matchDegree - a.matchDegree);
}

const loading = ref<boolean>(false);
const { t } = useI18n({ useScope: 'global' });
const getApplicant = useApplicant();
const getClient = useClient();

onMounted(async () => {
  loading.value = true;
  await getFormatedData();
  loading.value = false;
})

const getFormatedData = async () => {
  staffList.value = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]) as ApplicantForCandidateSearch[];
  await calculateDistance();
  calculateMatchDegree();
}

const emit = defineEmits(['openSearchByMap']);
const staffList = ref<ApplicantForCandidateSearch[]>([])

</script>
