<template>
  <q-form @submit="save">
    <DropDownEditGroup
      :isHiddenActions="bo?true:false"
      :isEdit="edit"
      :label="'3.'+ $t('applicant.attendant.personal')"
      @openEdit="edit = true"
      @closeEdit="edit=false; resetData();"
      @onSave="save">
      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular">
          <div class="flex items-center justify-end" style="height: 40px;">{{ $t('applicant.attendant.smoking') }}</div>
          <div v-if="edit && data['smokingWhat'] && data['smoking']==='yes'" style="height: 40px;" class="flex items-center justify-end">{{ $t('smoking.type') }}</div>
          <div v-if="edit && data['smokingStop'] && data['smoking']==='yes'" style="height: 40px;" class="flex items-center justify-end">{{ $t('smoking.stop') }}</div>
        </div>
        <div class="col-4 q-pl-md blue ">
          <span v-if="!edit" class="flex items-center justify-start" style="height: 40px;">
            <span>
              {{ $t('smoking.'+applicant.smoking) }}
            </span>
            <span>
              {{ applicant.smoking === 'yes'?' / ' + $t('smoking.type') + ' : ' + $t('smoking.'+applicant.smokingWhat) : ''}}
            </span>
            <span>
              {{ applicant.smoking === 'yes'?' / ' + $t('smoking.stop') + ' : ' + $t('smoking.'+applicant.smokingStop) : ''}}
            </span>
          </span>
          <q-select v-if="edit" outlined dense :options="smokingStatusOptions"
            emit-value map-options v-model="data['smoking']" :disable="loading"/>
          <q-select v-if="edit && data['smoking']==='yes'" outlined dense :options="[
            {
              label: $t('smoking.paper'),
              value: 'paper'
            },{
              label: $t('smoking.electronic'),
              value: 'electronic'
            }
          ]"
            emit-value map-options v-model="data['smokingWhat']" :disable="loading"/>
          <q-select v-if="edit && data['smokingWhat'] && data['smoking']==='yes'" outlined dense :options="[
            {
              label: $t('smoking.can'),
              value: 'can'
            },{
              label: $t('smoking.cant'),
              value: 'cant'
            }
          ]"
            emit-value map-options v-model="data['smokingStop']" :disable="loading"/>
        </div>
        <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.tattoos') }}
        </div>
        <div class="col-3 q-pl-md blue flex items-center">
          <span v-if="!edit">{{ applicant.tattoos?$t('tattoos.'+applicant.tattoos):''}}</span>
          <q-radio
            v-else
            v-for="option in tattoosOptions"
            :key="option.value"
            :val="option.value"
            :label="option.label"
            v-model="data['tattoos']"
            :disable="loading"
          />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.marriedStatus') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.marriedStatus?$t('marriedStatus.'+applicant.marriedStatus):''}}</span>
          <q-radio
            v-else
            v-for="option in marriedOptions"
            :key="option.value"
            :val="option.value"
            :label="option.label"
            v-model="data['marriedStatus']"
            :disable="loading"
          />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.liveTogether') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.liveTogether?$t('tattoos.'+applicant.liveTogether):''}}</span>
          <q-radio
            v-else
            v-for="option in tattoosOptions"
            :key="option.value"
            :val="option.value"
            :label="option.label"
            v-model="data['liveTogether']"
            :disable="loading"
          />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.childrenNumber') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.childrenNumber}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['childrenNumber']" :disable="loading" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.cohabitation') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.cohabitation}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['cohabitation']" :disable="loading" />
        </div>
      </div>
      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.childrenAge') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.childrenAge}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['childrenAge']" :disable="loading" />
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
        <div class="col-3 q-pl-md blue flex items-center">
          <span v-if="!edit">{{ applicant.interviewsWaitingList? applicant.interviewsWaitingList : ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['interviewsWaitingList']" :disable="loading" type="number"/><span class="q-ml-sm">{{$t('applicant.attendant.items')}}</span>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.temporaryCompaniesRegistered') }}
        </div>
        <div class="col-3 q-pl-md blue flex items-center">
          <span v-if="!edit">{{ applicant.temporaryCompaniesRegistered? applicant.temporaryCompaniesRegistered : ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['temporaryCompaniesRegistered']" :disable="loading" type="number" /><span class="q-ml-sm">{{ $t('applicant.attendant.companies') }}</span>
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
import { Applicant, ApplicantInputs, BackOrderModel } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant,
  bo?:BackOrderModel
}>()

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
    smokingWhat: props?.applicant['smokingWhat'],
    smokingStop: props?.applicant['smokingStop'],
    tattoos: props?.applicant['tattoos'],
    marriedStatus: props?.applicant['marriedStatus'],
    liveTogether: props?.applicant['liveTogether'],
    cohabitation: props?.applicant['cohabitation'],
    childrenNumber: props?.applicant['childrenNumber'],
    childrenAge: props?.applicant['childrenAge'],
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
