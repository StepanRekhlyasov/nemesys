<template>
  <q-form ref="boCommonForm">
 <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('client.list.client') }}
          </div>
          <div class="col-3">
            {{ $t('applicant.list.fixEmployment.office') }}
          </div>
          <div class="col-3">
            {{ $t('clientFactory.drawer.details.industry') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="props.client" v-model="selectedJobData['cfClient']">
              <template v-if="!selectedJobData['cfClient']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="props.office" v-model="selectedJobData['cfOffice']" :disable="props.office.length == 0" >
              <template v-if="!selectedJobData['cfOffice']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-6 q-pr-sm">
            <q-select outlined dense :options="industryName" v-model="selectedJobData['industry']" :disable="industryName.length == 0" >
              <template v-if="!selectedJobData['industry']" v-slot:selected>
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
          <div class="row ">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['prefectures']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['municipalities']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['street']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['buidingName']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-9">
            {{ $t('job.facilityForm') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.numberEmployees') }}
          </div>
        </div>
        <div class="row">
            <div class="col-9 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['cfFacilityType']" hide-bottom-space />
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
      </q-form>
</template>
<script lang="ts" setup>
import { JobData } from 'src/shared/model/Jobs.model';
import {  onMounted,ref, watch,computed,ComputedRef } from 'vue';
import { applicantClassification } from 'src/shared/constants/Applicant.const';
import {  salaryTypeList } from 'src/shared/constants/JobAd.const';
import {Client,ClientOffice} from 'src/shared/model/Client.model'
import { useJobSearch } from 'src/stores/jobSearch'
import { DocumentData } from 'firebase/firestore';
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const props = defineProps<{
    client:Client[],
    office:ClientOffice[]
}>()
const jobItems = ref({});
const industryName = ref<Array<{ label: string; value: string }>>([]);
const jobItemOptions = ref({});
const transactionTypeOptions = ref(applicantClassification);
const salaryTypeOption = ref(salaryTypeList);
const transactionText = ref('')
const industriesData:DocumentData = ref({})
const jobSearchStore = useJobSearch()

onMounted(async()=>{
  await jobSearchStore.loadJobItemSettingData(jobItemOptions, jobItems)
  await jobSearchStore.loadJobItemData(jobItems)
 industriesData.value = await jobSearchStore.getIndustries()
 await getIndustryName()
 console.log(industryName.value)
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
const getIndustryName = async () => {
 const industryData = await jobSearchStore.getIndustries()

  if (Array.isArray(industryData)) {
    const industryArray = industryData
      .map((data) => ({
        label: data['industryName'],
        value: data['industryName'],
      }));

    industryName.value = industryArray;
  }
};
const setEmptyIfUndefined = (value) => {
  return value !== undefined ? value : '';
};
const storeCfInformationData = async (newVal) => {
  selectedJobData.value['prefectures'] = setEmptyIfUndefined(newVal['prefecture'])
  selectedJobData.value['municipalities'] = setEmptyIfUndefined(newVal['municipality'])
  selectedJobData.value['street'] = setEmptyIfUndefined(newVal['street'])
  selectedJobData.value['buildingName'] = setEmptyIfUndefined(newVal['building'])
  selectedJobData.value['cfFacilityType'] = setEmptyIfUndefined(newVal['facilityType'])
};
defineExpose({ storeCfInformationData })
</script>
