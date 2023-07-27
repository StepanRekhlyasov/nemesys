<template>
 <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('client.list.client') }}
          </div>
          <div class="col-3">
            {{ $t('applicant.list.fixEmployment.office') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="clientList" v-model="selectedJobData['cfClient']">
              <template v-if="!selectedJobData['cfClient']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="officeList" v-model="selectedJobData['cfOffice']" :disable="officeList.length == 0">
              <template v-if="!selectedJobData['cfOffice']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('settings.branch.prefectures') }}
          </div>
          <div class="col-3">
            {{ $t('settings.branch.municipalities') }}
          </div>
          <div class="col-3">
            {{ $t('applicant.add.street') }}
          </div>
          <div class="col-3">
            {{ $t('client.add.buildingName') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="prefectureList"  emit-value map-options
              v-model="selectedJobData['prefectures']">
              <template v-if="!selectedJobData['prefectures']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="selectedJobData['municipalities']">
              <template v-if="!selectedJobData['municipalities']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['street']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['buidingName']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-6">
            {{ $t('job.facilityForm') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.numberEmployees') }}
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-pr-md">
            <q-select outlined dense :options="facilityTypeOption" emit-value map-options option-label="name"
              v-model="selectedJobData['facilityType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['facilityType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['numberEmployees']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('job.add.salaryType') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.salary') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.bonuses') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.payday') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="selectedJobData['cfSalaryType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['cfSalaryType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfSsalary']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfBonuses']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfPayday']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.overtime') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.retirementAge') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.welfare') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.leaveChildcare') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['overtime']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfRetirementAge']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['welfare']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['leaveChildcare']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursEarly') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursDay') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursLate') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursNight') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfWorkingHoursEarly']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfWorkingHoursDay']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfWorkingHoursLate']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfWorkingHoursNight']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.businessContent') }}
          </div>
          <div class="col-3">
            {{ $t('client.add.smokingPermitted') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.holidayAnnual') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.holidaysWeekly') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfBusinessContent']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options v-model="selectedJobData['smokingPermitted']"
             >
              <template v-if="!selectedJobData['smokingPermitted']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfHolidayAnnual']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['holidaysWeekly']" hide-bottom-space />
          </div>
        </div>

</template>
<script lang="ts" setup>
import { JobData } from 'src/shared/model/Jobs.model';
import {  onMounted,ref,Ref, watch,computed,ComputedRef } from 'vue';
import { applicantClassification } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import {  salaryTypeList } from 'src/shared/constants/JobAd.const';
import {Client,ClientOffice} from 'src/shared/model/Client.model'
import { useJobSearch } from 'src/stores/jobSearch'
import { DocumentData } from 'firebase/firestore';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const jobItems = ref({});
const jobItemOptions = ref({});
const transactionTypeOptions = ref(applicantClassification);
const facilityTypeOption = ref(facilityList);
const salaryTypeOption = ref(salaryTypeList);
const transactionText = ref('')
const clientList:Ref<Client[]> = ref([]);
const officeList:Ref<ClientOffice[]> = ref([]);
const industriesData:DocumentData = ref({})
const unsubscribeOffice = ref();
const jobSearchStore = useJobSearch()
onMounted(async()=>{
  clientList.value = await jobSearchStore.loadClientsData()
  await jobSearchStore.loadJobItemSettingData(jobItemOptions, jobItems)
  await jobSearchStore.loadJobItemData(jobItems)
 industriesData.value = await jobSearchStore.getIndustries()
})
watch(
  () => (selectedJobData.value.transactionType),
  (newVal,) => {
    transactionText.value = '';
    let obj = transactionTypeOptions.value.find(o => o.value === newVal);
    if (obj) {
      transactionText.value = obj.label;
    }
  }
)
watch(
  () => (selectedJobData.value.cfClient),
    async (newVal,oldVale) => {
    officeList.value = [];
    if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
    }
    if(oldVale){
      selectedJobData.value.cfOffice=''
    }
    if (newVal) {
      officeList.value = await jobSearchStore.loadOfficeData(newVal['id'])

    }
  }
)

</script>
