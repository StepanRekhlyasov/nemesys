<template>
        <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('client.backOrder.list.id') }}
          </div>
          </div>
          <div class="col-3 q-pr-sm">
      <q-select outlined dense :options="props.boid" emit-value map-options v-model="selectedJobData['boId']">
      <template v-if="!selectedJobData['boId']" v-slot:selected>
        <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
      </template>
    </q-select>
  </div>
<div class="row q-mt-sm">
  <div class="col-3">
    {{ $t('job.projectType') }}
    <span class="text-red-5">*</span>
  </div>
  <div class="col-3">
    {{ $t('job.add.salaryType') }}
    <span class="text-red-5">*</span>
  </div>
  <div class="col-3">
    {{ $t('client.backOrder.businessContent') }}
  </div>
  <div class="col-3">
    {{ $t('client.backOrder.employmentStatus') }}
  </div>
</div>
<div class="row">
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['boProjectType']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['boSalaryType']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['businessContent']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['boEmploymentStatus']" hide-bottom-space />
  </div>
</div>
<div class="row ">
  <div class="col-3">
    {{ $t('backOrder.create.paycheck') }}
  </div>
  <div class="col-3">
    {{ $t('client.backOrder.payday') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.benefit') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.bonus') }}
  </div>
</div>
<div class="row">
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['payCheck']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['boPayDay']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['boBenefit']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['bonus']" hide-bottom-space />
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
    <q-input outlined dense v-model="selectedJobData['workingHoursEarly']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['workingHoursDay']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['workingHoursLate']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['workingHoursNight']" hide-bottom-space />
  </div>
</div>
<div class="row q-mt-md">
  <div class="col-3">
    {{ $t('backOrder.create.shiftRemarks') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.numberWorkingDays') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.workingDays') }}
  </div>
  <div class="col-3">
    {{ $t('client.backOrder.holidayAnnual') }}
  </div>
</div>
<div class="row">
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['shiftRemarks']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['numberWorkingDays']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['workingDays']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['holidayAnnual']" hide-bottom-space />
  </div>
</div>
<div class="row q-mt-md">
  <div class="col-3">
    {{ $t('office.referralFee') }}
  </div>
  <div class="col-3">
    {{ $t('office.referralFeeAmount') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.ageLimit') }}
  </div>
  <div class="col-3">
    {{ $t('office.retirementAge') }}
  </div>
</div>
<div class="row">
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['referralFee']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['referralFeeAmount']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['ageLimit']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['retirementAge']" hide-bottom-space />
  </div>
</div>
<div class="row q-mt-md">
  <div class="col-3">
    {{ $t('client.backOrder.transportationExpenses') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.overtimeWork') }}
  </div>
  <div class="col-3">
    {{ $t('backOrder.create.overtimeRemarks') }}
  </div>
  <div class="col-3">
    {{ $t('client.list.memo') }}
  </div>
</div>
<div class="row">
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['botransportationExpenses']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['overtimeWork']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['overtimeRemarks']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['memo']" hide-bottom-space />
  </div>
</div>
</template>
<script lang="ts" setup>
import {ref,computed,ComputedRef} from 'vue'
import { useJobSearch } from 'src/stores/jobSearch'
import { JobData } from 'src/shared/model/Jobs.model';
const props = defineProps<{
 boid:Array<{ label: string; value: string }>,
}>()
const jobSearchStore = useJobSearch()
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const getSpecifiedBoidData = async (data) => {
  selectedJobData.value['workingDays'] = data['workingDays']
  selectedJobData.value['overtimeWork'] = data['overtimeWork']
  selectedJobData.value['overtimeRemarks'] = data['overtimeRemarks']
  selectedJobData.value['holidayAnnual'] = data['annualHolidays']
  selectedJobData.value['boBenefit'] = data['benefit']
  selectedJobData.value['bonus'] = data['bonus']
  selectedJobData.value['botransportationExpenses'] = data['travellingExpenses']
  selectedJobData.value['boEmploymentStatus'] = data['employmentType']
  selectedJobData.value['boPayDay'] = data['payday']
  selectedJobData.value['payCheck'] = data['payment']
  selectedJobData.value['shiftRemarks'] = data['shiftRemarks']
  selectedJobData.value['businessContent'] = data['work_content']
  selectedJobData.value['numberWorkingDays'] = data['daysPerWeekList']
  selectedJobData.value['retirementAge'] = data['retirementAge']
  selectedJobData.value['boRequiredQualification'] = data['requiredQualifications']
  selectedJobData.value['experienceReq'] = data['experienceReq']
  selectedJobData.value['experienceRemarks'] = data['experienceRemarks']
  selectedJobData.value['pickDrop'] = data['pickDrop']
  selectedJobData.value['availabilityOnCallSupport'] = data['onCallSupport']
  selectedJobData.value['workingHoursEarly'] = data['workingHoursEarly_min']+'-'+data['workingHoursEarly_max']
  selectedJobData.value['workingHoursDay'] = data['workingHoursDay_min']+'-'+data['workingHoursDay_max']
  selectedJobData.value['workingHoursLate'] = data['workingHoursLate_min']+'-'+data['workingHoursLate_max']
  selectedJobData.value['workingHoursNight'] = data['workingHoursNight_min']+'-'+data['workingHoursNight_max']
};
defineExpose({ getSpecifiedBoidData })
</script>

