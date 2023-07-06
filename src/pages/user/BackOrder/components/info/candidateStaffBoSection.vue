<template>
  <div class="row q-pb-md" v-if="!hideMapButton">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn :label="$t('backOrder.searchByMap')" class="q-ml-md" outline color="primary"
        @click="emit('openSearchByMap')" />
    </div>
  </div>
  <q-card-section class=" q-pa-none">
    <q-table :columns="BackOrderStaff" :loading="loading" :rows="staffList" row-key="id" class="no-shadow"
      table-class="text-grey-8" table-header-class="text-grey-9" v-model:pagination="pagination">
      <template v-slot:body-cell-statusThisTime="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ t(`applicant.statusOption.${props.row.status}`) }}
        </q-td>
      </template>
      <template v-slot:body-cell-distanceBusiness="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.distanceBusiness }} m
        </q-td>
      </template>
      <template v-slot:body-cell-matchDegree="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.matchDegree }}%
        </q-td>
      </template>
    </q-table>
  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel, ExtendedApplicant } from 'src/shared/model';
import { ref, onMounted } from 'vue';
import { BackOrderStaff } from '../../consts/BackOrder.const';
import { useBO } from '../../consts/index';
import { useApplicant } from 'src/stores/applicant'
import { useClient } from 'src/stores/client'
import { where } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
  // rowsNumber: xx if getting data from a server
});

const props = withDefaults(defineProps<{
  bo: BackOrderModel,
  hideMapButton?: boolean
}>(), {
  hideMapButton: false
}
)

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
    const distance = useBO().getDistance(clientLocation, staffLocation);
    staff.distanceBusiness = distance;
  });
};

const calculateMatchDegree = ()=>{

  staffList.value.forEach((staff)=>{

    const qualification = ref<number>(0);
    const occupation = ref<number>(0);
    const classification = ref<number>(0);
    const daysToWork = ref<number>(0);
    const daysPerWeek = ref<number>(0);
    const agePercent = ref<number>(0);

    //qualification percentage
    staff.qualification?.forEach((q)=>{
      if(props.bo.qualifications.toLowerCase()===q.toLowerCase()){
        qualification.value = 1
      }
    })

    //caseType
    if(props.bo.caseType && (staff.occupation?.toLowerCase() === props.bo.caseType?.toLowerCase())){
      occupation.value = 1
    }

    //classification
    if(props.bo.transactionType && (staff.classification?.toLowerCase() === props.bo.transactionType?.toLowerCase())){
      classification.value = 1
    }

    //daysToWork
    if(props.bo.numberWorkingDays && staff.daysToWork){
      const days = stringToNumber(props.bo.numberWorkingDays)
      if(days && days <= (staff.daysToWork)){
        daysToWork.value = 1;
      }
      else if(days){
        daysToWork.value = staff.daysToWork/days
      }
    }

    //workingDaysWeek
    if(props.bo.working_days_week && staff.daysPerWeek){
      let matchingDays = 0
      staff.daysPerWeek.forEach((daySatff)=>{
        props.bo.working_days_week.forEach((dayClient)=>{
          if(dayClient === daySatff){
            matchingDays++;
          }
        })
      })
      if(props.bo.working_days_week.length){
        daysPerWeek.value = matchingDays/props.bo.working_days_week.length
      }
    }

    //age
    if(props.bo.ageLimit && staff.dob){
      const currentDate = new Date();
      const dob = new Date(staff.dob.seconds*1000);
      let age = currentDate.getFullYear() - dob.getFullYear();
      if (currentDate.getMonth() < dob.getMonth() ||(currentDate.getMonth() === dob.getMonth() &&currentDate.getDate() < dob.getDate())){
        age--;
      }
      agePercent.value = age<props.bo.ageLimit?1:0;
      console.log(agePercent.value)
    }

    const matchPercent = ((agePercent.value+qualification.value+occupation.value+classification.value+daysPerWeek.value+daysToWork.value)/6)*100
    staff.matchDegree = Number(matchPercent.toFixed(2));
  })
  staffList.value.sort((a, b) => b.matchDegree - a.matchDegree);
}

const loading = ref<boolean>(false);
const { t } = useI18n({ useScope: 'global' });
const getApplicant = useApplicant();
const getClient = useClient();

const stringToNumber = (num: string): number | undefined => {
  const numberMap: { [key: string]: number } = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    // Add more mappings as needed
  };

  return numberMap[num];
};

onMounted(async () => {
  loading.value = true;
  staffList.value = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]) as ExtendedApplicant[];
  await calculateDistance();
  calculateMatchDegree();
  loading.value = false;
})

const emit = defineEmits(['openSearchByMap']);
const staffList = ref<ExtendedApplicant[]>([])

</script>
