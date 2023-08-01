<template>
  <div class="row">
          {{ $t('job.add.jobName') }}
          <span class="text-red-5">*</span>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input outlined dense v-model="selectedJobData['name']" :placeholder="$t('client.add.clientLabel')" lazy-rules
              :rules="[(val) => (val && val.length > 0) || '']" />
          </div>
        </div>


        <div class="row">
          <div class="col-4">
            {{ $t('job.add.transactionType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.projectType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('client.add.facilityType') }}
            <span class="text-red-5">*</span>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="transactionTypeOptions" emit-value map-options
              v-model="selectedJobData['transactionType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['transactionType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="projectTypeOptions" emit-value map-options v-model="selectedJobData['projectType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['projectType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-select outlined dense :options="facilityTypeOption" emit-value map-options option-label="name"
              v-model="selectedJobData['facilityType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['facilityType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.paymentType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.add.salaryType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.add.status') }}
            <span class="text-red-5">*</span>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="paymentTypeOption" emit-value map-options v-model="selectedJobData['paymentType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['paymentType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="selectedJobData['salaryType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['salaryType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-select outlined dense :options="statusOption" emit-value map-options v-model="selectedJobData['status']" lazy-rules
              :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!selectedJobData['status']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('client.list.client') }}
          </div>
          <div class="col-4">
            {{ $t('applicant.list.fixEmployment.office') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="clientList" v-model="selectedJobData['client']">
              <template v-if="!selectedJobData['client']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="officeList" v-model="selectedJobData['office']" :disable="officeList.length == 0">
              <template v-if="!selectedJobData['office']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.email') }}
          </div>
          <div class="col-4">
            {{ $t('applicant.add.phone') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['email']"
              :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" hide-bottom-space />
          </div>
          <div class="col-4 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['phone']" :placeholder="$t('client.add.phoneLabel')"
              hide-bottom-space />
          </div>
        </div>
</template>
<script lang="ts" setup>
import { JobData } from 'src/shared/model/Jobs.model';
import {  onMounted,ref,Ref, watch,computed,ComputedRef } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { paymentTypeList, salaryTypeList, statusList } from 'src/shared/constants/JobAd.const';
import {Client,ClientOffice} from 'src/shared/model/Client.model'
import { useJobSearch } from 'src/stores/jobSearch'
import { DocumentData } from 'firebase/firestore';
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const jobItems = ref({});
const jobItemOptions = ref({});
const paymentTypeOption = ref(paymentTypeList);
const statusOption = ref(statusList);
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const facilityTypeOption = ref(facilityList);
const salaryTypeOption = ref(salaryTypeList);
const projectText:Ref<string> = ref('')
const transactionText = ref('')
const clientList:Ref<Client[]> = ref([]);
const officeList:Ref<ClientOffice[]> = ref([]);
const unsubscribeOffice = ref();
const industriesData:DocumentData = ref({})
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
  () => (selectedJobData.value.projectType),
  (newVal,) => {
    projectText.value = '';
    let obj = projectTypeOptions.value.find(o => o.value === newVal);
    if (obj) {
      projectText.value = obj.label;
    }
  }
)
watch(
  () => (selectedJobData.value.client),
    async (newVal,oldVale) => {
    officeList.value = [];
    if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
    }
    if(oldVale){
      selectedJobData.value.office=''
    }
    if (newVal) {
      officeList.value = await jobSearchStore.loadOfficeData(newVal['id'])

    }
  }
)
</script>
