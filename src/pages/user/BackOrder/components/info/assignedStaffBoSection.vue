<template>
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
          {{ $t(`applicant.statusOption.${props.row.status}`) }}
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
  <ApplicantDetails ref="detailsDrawer" />
</template>

<script lang="ts" setup>
import { BackOrderModel, ApplicantForCandidateSearch } from 'src/shared/model';
import { ref, onMounted, ComputedRef } from 'vue';
import { BackOrderStaff } from '../../consts/BackOrder.const';
import { where } from 'firebase/firestore';
import { QTableProps } from 'quasar';
import { useApplicant } from 'src/stores/applicant'
import { Applicant } from 'src/shared/model';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import { useBackOrder } from 'src/stores/backOrder';
import { Alert } from 'src/shared/utils/Alert.utils';
import matchDegreeTable from './matchDegreeTable.vue';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';

const staffList = ref<ApplicantForCandidateSearch[]>([])
const columns = ref<QTableProps | ComputedRef>(BackOrderStaff)
const getApplicant = useApplicant();
const loading = ref<boolean>(false);
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
const backOrderStore = useBackOrder()
const applicantIds = ref<string[]>([]);
const matchedData = ref({});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
  // rowsNumber: xx if getting data from a server
});
const props = defineProps<{
  bo: BackOrderModel
}>();

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};

const popupVisible = ref(false);
const popupStaff = ref({});

const openPopup = (staff) => {
  popupStaff.value = staff;
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};

onMounted(async () => {
 await fetchData()
});

async function fetchData() {
  loading.value = true;
  try {
    applicantIds.value = await backOrderStore.getApplicantIds(props.bo);
    if(applicantIds.value.length){
      await getFormatedData(applicantIds.value)
    }
  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}

watchCurrentOrganization(async()=>{
  await fetchData()
})

const getFormatedData = async (applicantIds) => {
  staffList.value = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false), where('id', 'in', applicantIds)]) as ApplicantForCandidateSearch[];
  await calculateDistance();
  calculateMatchDegree();
}

const calculateMatchDegree = () => {

  staffList.value.forEach((staff) => {
    matchedData.value[staff.id] = backOrderStore.matchData(staff, props.bo);
  })
  staffList.value.sort((a, b) => b.matchDegree - a.matchDegree);
}

const calculateDistance = async () => {
  const clientLocation = {
    lat: props.bo['lat'],
    lon: props.bo['lon'],
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

</script>

<style></style>
