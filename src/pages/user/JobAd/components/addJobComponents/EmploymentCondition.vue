<template>

<div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.experienceRequired') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input outlined dense v-model="selectedJobData['experienceRequired']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.requiredQualification') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.halfYearExp') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.upperAgeLimit') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="[]" emit-value map-options v-model="selectedJobData['requiredQualification']">
              <template v-if="!selectedJobData['requiredQualification']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="[]" emit-value map-options v-model="selectedJobData['halfYearExp']">
              <template v-if="!selectedJobData['halfYearExp']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-input outlined dense v-model="selectedJobData['upperAgeLimit']" hide-bottom-space />
          </div>
        </div>
        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.mediaInformation') }}
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.indeedJobCategory') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.presenceAbsenceResume') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="indeedJobCategorOption" emit-value map-options
              v-model="selectedJobData['indeedJobCategory']">
              <template v-if="!selectedJobData['indeedJobCategory']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="resumeRequiredOption" emit-value map-options
              v-model="selectedJobData['presenceAbsenceResume']">
              <template v-if="!selectedJobData['presenceAbsenceResume']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.indeedTag') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pr-sm">
            <q-select outlined dense v-model="selectedJobData['indeedTag']" emit-value map-options use-chips multiple
              input-debounce="0" :options="indeedTagOptions" options-html use-input>
              <template v-if="!selectedJobData['indeedTag']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
</template>
<script lang="ts" setup>
import {  indeedJobCategoryList, indeedTagList, indeedTagJobType, indeedTagCoronaType  , resumeRequiredList } from 'src/shared/constants/JobAd.const';
import {ref,computed,ComputedRef,watch} from 'vue'
import { useJobSearch } from 'src/stores/jobSearch'
import { JobData } from 'src/shared/model/Jobs.model';

const indeedTagOptions = ref(indeedTagList);
const resumeRequiredOption = ref(resumeRequiredList);
const indeedJobCategorOption = ref(indeedJobCategoryList);
const jobSearchStore = useJobSearch()
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
watch(
  () => (selectedJobData.value.indeedTag),
  (newVal,) => {
    let jobType = 0;
    let coronaType = 0;
    for (var i = 0; i < newVal.length; i++) {
      if (indeedTagJobType.includes(newVal[i])) {
        jobType += 1;
      }
      else if (indeedTagCoronaType.includes(newVal[i])) {
        coronaType += 1;
      }
    }
    for (var i = 0; i < indeedTagOptions.value.length; i++) {
      indeedTagOptions.value[i]['disable'] = false;
      if (indeedTagOptions.value[i]['type'] == 'job') {
        if (jobType > 4 && !newVal.includes(indeedTagOptions.value[i]['value'])) {
          indeedTagOptions.value[i]['disable'] = true;
        }

      }
      if (indeedTagOptions.value[i]['type'] == 'corona') {
        if (coronaType > 2 && !newVal.includes(indeedTagOptions.value[i]['value'])) {
          indeedTagOptions.value[i]['disable'] = true;
        }
      }
    }
  }
)
</script>
