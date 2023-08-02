<template>
 <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('job.add.salaryType') }}
          </div>
          <div class="col-3">
            {{ $t('job.add.salaryCap') }}
          </div>
          <div class="col-3">
            {{ $t('job.add.minSalary') }}
          </div>
          <div class="col-3">
            {{ $t('office.payDay') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['salaryTypeText']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['salaryCap']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['minSalary']" hide-bottom-space />
          </div>
          <div class="col-3">
            <q-input outlined dense v-model="selectedJobData['payday']" hide-bottom-space />
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('client.backOrder.employmentStatus') }}
          </div>
          <div class="col-4">
            {{ $t('client.backOrder.bonuses') }}
          </div>
          <div class="col-4">
            {{ $t('client.backOrder.transportationExpenses') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="employmentStatusOption" emit-value map-options
              v-model="selectedJobData['employmentStatus']">
              <template v-if="!selectedJobData['employmentStatus']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="[]" emit-value map-options v-model="selectedJobData['bonuses']">
              <template v-if="!selectedJobData['bonuses']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-input outlined dense v-model="selectedJobData['transportationExpenses']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-pt-sm">
          <div class="col-12">
            {{ $t('job.add.treatmentBenefits') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select outlined dense :options="[]" emit-value map-options v-model="selectedJobData['benefits']">
              <template v-if="!selectedJobData['benefits']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
</template>
<script lang="ts" setup>
import { employmentStatusList } from 'src/shared/constants/JobAd.const';
import {ref,computed,ComputedRef} from 'vue'
import { useJobSearch } from 'src/stores/jobSearch'
import { JobData } from 'src/shared/model/Jobs.model';
const jobSearchStore = useJobSearch()
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const employmentStatusOption = ref(employmentStatusList);
</script>
