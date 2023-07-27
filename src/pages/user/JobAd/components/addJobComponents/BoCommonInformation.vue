<template>        <div class="row q-mt-sm">
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
    <q-select outlined dense :options="projectTypeOptions" emit-value map-options v-model="selectedJobData['boProjectType']"
      lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
      <template v-if="!selectedJobData['boProjectType']" v-slot:selected>
        <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
      </template>
    </q-select>
  </div>
  <div class="col-3 q-pr-sm">
    <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="selectedJobData['boSalaryType']"
      lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
      <template v-if="!selectedJobData['boSalaryType']" v-slot:selected>
        <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
      </template>
    </q-select>
  </div>
  <div class="col-3 q-pr-sm">
    <q-input outlined dense v-model="selectedJobData['businessContent']" hide-bottom-space />
  </div>
  <div class="col-3 q-pr-sm">
    <q-select outlined dense :options="employmentStatusOption" emit-value map-options
      v-model="selectedJobData['boEmploymentStatus']">
      <template v-if="!selectedJobData['boEmploymentStatus']" v-slot:selected>
        <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
      </template>
    </q-select>
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
    <q-select outlined dense  emit-value map-options
      v-model="selectedJobData['overtimeWork']">
      <template v-if="!selectedJobData['overtimeWork']" v-slot:selected>
        <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
      </template>
    </q-select>
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
import {  salaryTypeList, employmentStatusList  } from 'src/shared/constants/JobAd.const';
import { occupationList } from 'src/shared/constants/Applicant.const';
import {ref,computed,ComputedRef} from 'vue'
import { useJobSearch } from 'src/stores/jobSearch'
import { JobData } from 'src/shared/model/Jobs.model';

const salaryTypeOption = ref(salaryTypeList);
const employmentStatusOption = ref(employmentStatusList);
const projectTypeOptions = ref(occupationList);
const jobSearchStore = useJobSearch()
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
</script>

