<template>
<div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.requiredQualifications') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.qualificationRemarks') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.experienceReq') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.experienceRemarks') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['boRequiredQualification']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['qualificationRemarks']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['experienceReq']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['experienceRemarks']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.pickDrop') }}
          </div>
          <div class="col-3 q-ml-sm">
            {{ $t('backOrder.availabilityOnCallSupport') }}
          </div>
          <div class="col-3">
            {{ $t('office.onCallCorrespondence') }}
          </div>
        </div>
          <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['pickDrop']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['availabilityOnCallSupport']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['onCallCorrespondence']" hide-bottom-space />
          </div>
        </div>
</template>
<script lang="ts" setup>
import {ref,computed,ComputedRef} from 'vue'
import { useJobSearch } from 'src/stores/jobSearch'
import { JobData } from 'src/shared/model/Jobs.model';
const jobSearchStore = useJobSearch()
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
</script>
