<template>
  <q-form @submit="save">
    <DropDownEditGroup
      :isEdit="edit"
      :label="'3.'+ $t('applicant.attendant.personal')"
      @openEdit="edit = true"
      @closeEdit="edit=false; resetData();"
      @onSave="save">
      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.smoking') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.smoking?$t('smoking.'+applicant.smoking):''}}</span>
          <q-select v-if="edit" outlined dense :options="smokingStatusOptions"
            emit-value map-options v-model="data['smoking']" :disable="loading"/>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.tattoos') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.tattoos?$t('tattoos.'+applicant.tattoos):''}}</span>
          <q-select v-if="edit" outlined dense :options="tattoosOptions"
            emit-value map-options v-model="data['tattoos']" :disable="loading"/>
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.marriedStatus') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.marriedStatus?$t('marriedStatus.'+applicant.marriedStatus):''}}</span>
          <q-select v-if="edit" outlined dense :options="marriedOptions"
            emit-value map-options v-model="data['marriedStatus']" :disable="loading"/>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.liveTogether') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.liveTogether?$t('tattoos.'+applicant.liveTogether):''}}</span>
          <q-select v-if="edit" outlined dense :options="tattoosOptions"
            emit-value map-options v-model="data['liveTogether']" :disable="loading"/>
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.cohabitation') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.cohabitation}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['cohabitation']" :disable="loading" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.children') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.children}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['children']" :disable="loading" />
        </div>
      </div>

      <div class="row q-pa-md"></div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.medicalHistory') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.medicalHistory}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['medicalHistory']" :disable="loading" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.vaccinationStatus') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.vaccinationStatus}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['vaccinationStatus']" :disable="loading" />
        </div>
      </div>

      <div class="row q-pa-md"></div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.startCaring') }}
        </div>
        <div class="col-9 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.startCaring}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['startCaring']" :disable="loading" />
        </div>
      </div>

      <div class="row q-pa-md"></div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.interviewsWaitingList') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.interviewsWaitingList? applicant.interviewsWaitingList+' '+$t('applicant.attendant.items') : ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['interviewsWaitingList']" :disable="loading" type="number"/>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.temporaryCompaniesRegistered') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.temporaryCompaniesRegistered? applicant.temporaryCompaniesRegistered+' '+$t('applicant.attendant.items') : ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['temporaryCompaniesRegistered']" :disable="loading" type="number" />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.startedInCaregiving') }}
        </div>
        <div class="col-9 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.startedInCaregiving}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['startedInCaregiving']" :disable="loading" />
        </div>
      </div>

      <div class="row q-pa-md"></div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.daysVisitAtWork') }}
        </div>
        <div class="col-9 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.daysVisitAtWork}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['daysVisitAtWork']" :disable="loading" />
        </div>
      </div>
    </DropDownEditGroup>
  </q-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { marriedStatusList, smokingStatusList, tattoosStatusList } from 'src/shared/constants/Applicant.const';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { Applicant, ApplicantInputs } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant
}>();
const applicantStore = useApplicant();
const edit = ref(false);
const loading = ref(false);
const smokingStatusOptions = ref(smokingStatusList)
const marriedOptions = ref(marriedStatusList)
const tattoosOptions = ref(tattoosStatusList)
const defaultData = ref<Partial<ApplicantInputs>>({})
const data = ref<Partial<ApplicantInputs>>({})

function resetData() {
  defaultData.value = {
    smoking: props?.applicant['smoking'],
    tattoos: props?.applicant['tattoos'],
    marriedStatus: props?.applicant['marriedStatus'],
    liveTogether: props?.applicant['liveTogether'],
    cohabitation: props?.applicant['cohabitation'],
    children: props?.applicant['children'],
    medicalHistory: props?.applicant['medicalHistory'],
    vaccinationStatus: props?.applicant['vaccinationStatus'],
    startCaring: props?.applicant['startCaring'],
    interviewsWaitingList: props?.applicant['interviewsWaitingList'],
    temporaryCompaniesRegistered: props?.applicant['temporaryCompaniesRegistered'],
    startedInCaregiving: props?.applicant['startedInCaregiving'],
    daysVisitAtWork: props?.applicant['daysVisitAtWork'],
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData()

async function save() {
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    edit.value = false;
    Alert.success()
  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}
</script>
