
<template>
 <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
  elevated bordered>
  <q-scroll-area class="fit text-left">
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="jobForm" @submit="saveJobAd">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
                      <div class="q-mr-sm">
                          <div>
                              {{ transactionText }}
                              <span v-if="projectText">/ {{ projectText }}</span>
                          </div>
                          <div class="text-h6">{{ selectedJobPosting['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="selectedJobPosting['id'] ? $t('job.jobUpdate') : $t('jobAd.issuanceJobAd')" type="submit" />
                      <q-btn outline size="sm" :label="$t('jobAd.showPreview')" class="q-ml-md"
                          style="height: 30px" />

                      <q-btn outline size="sm" :label="$t('jobAd.jobAdAutoCreate')" class="q-ml-md"
                          style="height: 30px">
                          <q-menu>
                              <q-list style="min-width: 100px" dense>
                                  <q-item clickable v-close-popup>
                                      <q-item-section>{{ $t('jobAd.createSpecifyingFormat') }}</q-item-section>
                                  </q-item>
                                  <q-item clickable v-close-popup>
                                      <q-item-section>{{ $t('jobAd.createWithoutFormatting') }}</q-item-section>
                                  </q-item>
                                  <q-separator />
                              </q-list>
                          </q-menu>
                      </q-btn>

                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="drawerRight">
              <div class="row text-primary text-body1">
                  ■ {{ $t('jobAd.add.job') }}
              </div>

              <div class="row">
                  {{ $t('job.add.jobName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-select outlined dense :options="jobList" emit-value map-options v-model="selectedJobPosting['jobId']"
                          lazy-rules :rules="[(val) => (val && val.length > 0) || '']" option-label="name">
                          <template v-if="!selectedJobPosting['jobId']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row">
                  <div class="col-4">
                      {{ $t('job.add.transactionType') }}
                  </div>
                  <div class="col-4">
                      {{ $t('job.projectType') }}
                  </div>
                  <div class="col-4">
                      {{ $t('client.add.facilityType') }}
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="transactionText" hide-bottom-space readonly />
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="projectText" hide-bottom-space readonly />
                  </div>
                  <div class="col-4">
                      <q-input outlined dense v-model="facilityText" hide-bottom-space readonly />
                  </div>
              </div>

              <div class="row q-pt-sm">
                  <div class="col-4">
                      {{ $t('job.add.paymentType') }}
                  </div>
                  <div class="col-4">
                      {{ $t('job.add.salaryType') }}
                  </div>
                  <div class="col-4">
                      {{ $t('job.add.status') }}
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="paymentText" hide-bottom-space readonly />
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="salaryTypeText" hide-bottom-space readonly />
                  </div>
                  <div class="col-4">
                      <q-input outlined dense v-model="statusText" hide-bottom-space readonly />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('jobAd.add.media') }}
              </div>

              <div class="row q-pt-sm">
                  <div class="col-12">
                      {{ $t('jobAd.add.adName') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row q-pt-sm">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedJobPosting['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-pt-sm">
                  <div class="col-4">
                      {{ $t('jobAd.add.dateIssue') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('jobAd.add.publicationPeriod') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="selectedJobPosting['dateIssue']" mask="date"
                          :rules="['date', (val) => (val && val.length > 0) || '']" lazy-rules hide-bottom-space>
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-date v-model="selectedJobPosting['dateIssue']">
                                          <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="Close" color="primary" flat />
                                          </div>
                                      </q-date>
                                  </q-popup-proxy>
                              </q-icon>
                          </template>
                      </q-input>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="formatedPublicationPeriod" hide-bottom-space
                          :rules="[(val) => (val && val.length > 0) || '']" lazy-rules>
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-date v-model="selectedJobPosting['publicationPeriod']" range>
                                          <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="Close" color="primary" flat />
                                          </div>
                                      </q-date>
                                  </q-popup-proxy>
                              </q-icon>
                          </template>
                      </q-input>
                  </div>
              </div>

              <div class="row q-pt-sm">
                  <div class="col-4">
                      {{ $t('jobAd.add.media') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('jobAd.add.publicationFormat') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="mediaOptions" emit-value map-options
                          v-model="selectedJobPosting['media']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedJobPosting['media']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="publicationFormatOptions" emit-value map-options
                          v-model="selectedJobPosting['publicationFormat']" option-value="id" option-label="name">
                          <template v-if="!selectedJobPosting['publicationFormat']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('common.area') }}
              </div>
              <div class="row q-pt-sm">
                  <span class="q-ml-md">{{ $t('common.area') }}</span>
                  <q-toggle v-model="selectedJobPosting['areaFlag']" dense class="q-ml-sm q-mr-sm" />
                  <span>{{ $t('client.list.distanceStartingPoint') }}</span>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('formatSetting.add.formatting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add" />
              </div>
              <div v-for="item in formatSettingItems" :key="item.value">
                  <div class="row q-pt-sm">
                      <div class="col-4">
                          {{ item.name }}
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-12">
                          <q-input outlined dense v-model="selectedJobPosting[item.value]" hide-bottom-space
                              v-if="item.type == 'text'" readonly />
                          <q-select outlined dense :options="options[item.option]" emit-value map-options
                              v-model="selectedJobPosting[item.value]" v-else-if="item.type == 'select'" option-value="id"
                              option-label="name">
                              <template v-if="!selectedJobPosting[item.value]" v-slot:selected>
                                  <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                              </template>
                          </q-select>
                      </div>
                  </div>
              </div>
          </q-card-section>
      </q-form>
  </q-card>
  </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref,Ref, watch, onMounted, onBeforeUnmount,computed,ComputedRef } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { paymentTypeList, salaryTypeList, statusList, mediaList, formatSettingItemList } from 'src/shared/constants/JobAd.const';
import { useJobPostingHistory } from 'src/stores/jobPostingHistory'
import {JobModel,JobFormat} from 'src/shared/model/Jobs.model'
import { Alert } from 'src/shared/utils/Alert.utils';
import { DocumentData } from 'firebase/firestore';
import { QForm } from 'quasar';
import { JobAdData } from 'src/shared/model/Jobs.model';
const jobPostingHistoryStore = useJobPostingHistory()
const emit = defineEmits<{
  (e: 'hideDrawer')
}>()
const hideDrawer = () => {
  emit('hideDrawer')
}
const drawerRight = ref(false);
const mediaOptions = ref(mediaList);
const facilityText = ref('');
const unsubscribe = ref();
const unsubscribeOffice = ref();
const options:DocumentData = ref({});
const unsubscribePhrase = ref();
const jobList:Ref<JobModel[]> = ref([]);
const transactionText = ref('')
const projectText = ref('')
const paymentText = ref('')
const salaryTypeText = ref('')
const statusText = ref('')
const formatedPublicationPeriod = ref('')
const jobForm:Ref<QForm | null> = ref(null);
const formatSettingItems:DocumentData = ref(formatSettingItemList);
const unsubscribeFormat = ref()
const publicationFormatOptions:Ref<JobFormat[]> = ref([])
const selectedJobPosting = ref<JobAdData | ComputedRef>(
  computed(() => jobPostingHistoryStore.state.selectedJobPosting)
);

onMounted(async () => {
  jobList.value = await jobPostingHistoryStore.getJobsdata()
      if (selectedJobPosting.value['jobId'] && !selectedJobPosting.value.jobId) {
          selectedJobPosting.value.jobId = selectedJobPosting.value['jobId'] || '';
      }
  selectedJobPosting.value.publicationPeriod = selectedJobPosting.value['publicationPeriod'] || '';

  getPhrase();
  publicationFormatOptions.value = await jobPostingHistoryStore.getJobFormatData()
      if (selectedJobPosting.value['publicationFormat'] && !selectedJobPosting.value.value.publicationFormat) {
          selectedJobPosting.value.publicationFormat = selectedJobPosting.value['publicationFormat'] || '';
      }

})
const showDrawerWithData = async (data: JobAdData) => {
  if (selectedJobPosting.value.id && selectedJobPosting.value.id !== data.id) {
    drawerRight.value = false;
  }
  jobPostingHistoryStore.state.selectedJobPosting = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  jobPostingHistoryStore.state.selectedJobPosting={}
  drawerRight.value = true
}
const saveJobAd = async () => {
  try {
      if (selectedJobPosting.value.id) {
          await jobPostingHistoryStore.updateFormData(selectedJobPosting.value)
          hideDrawer()

      } else {
         await jobPostingHistoryStore.addFormData(selectedJobPosting.value)
         hideDrawer()
      }
      Alert.success()
      jobForm.value?.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }
}

const getPhrase = async () => {
  if (unsubscribePhrase.value) {
      unsubscribePhrase.value();
  }
   const data = await jobPostingHistoryStore.getPhraseData(options)
  options.value = data
}

onBeforeUnmount(() => {
  if (unsubscribe.value) {
      unsubscribe.value();
  }
  if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
  }
  if (unsubscribePhrase.value) {
      unsubscribePhrase.value();
  }
  if (unsubscribeFormat.value) {
      unsubscribeFormat.value();
  }

})

watch(
  () => (selectedJobPosting.value.jobId),
  (newVal,) => {
      transactionText.value = '';
      facilityText.value = '';
      projectText.value = '';

      const objJob = jobList.value.find(o => o['value'] === newVal);
      if (objJob) {
          const objTrans = applicantClassification.value.find(o => o.value === objJob['transactionType']);
          if (objTrans) {
              transactionText.value = objTrans.label;
          }

          const objProject = occupationList.value.find(o => o.value === objJob['projectType']);
          if (objProject) {
              projectText.value = objProject.label;
          }

          const objFacility = facilityList.value.find(o => o.value === objJob['facilityType']);
          if (objFacility) {
              facilityText.value = objFacility.name;
          }

          const objPaymentType = paymentTypeList.value.find(o => o.value === objJob['paymentType']);
          if (objPaymentType) {
              paymentText.value = objPaymentType.label;
          }

          const objStatus = statusList.value.find(o => o.value === objJob['status']);
          if (objStatus) {
              statusText.value = objStatus.label;
          }

          const objSalaryType = salaryTypeList.value.find(o => o.value === objJob['salaryType']);
          if (objSalaryType) {
              salaryTypeText.value = objSalaryType.label;
          }

      }
      getPhrase();
  }
)

watch(
  () => (selectedJobPosting.value.publicationPeriod),
  (newVal,) => {
      formatedPublicationPeriod.value = '';
      if (newVal) {
          formatedPublicationPeriod.value = newVal['from'] + ' ~ ' + newVal['to']
      }
  }
)

watch(
  () => (selectedJobPosting.value.publicationFormat),
  (newVal,) => {
      if (selectedJobPosting.value.publicationFormat) {
          const obPublicationFormat = publicationFormatOptions.value.find(o => o['value'] === newVal);
          if (obPublicationFormat) {
              formatSettingItems.value.forEach(item => {
                  if (selectedJobPosting[item.value]) {
                      selectedJobPosting.value[item.value] = selectedJobPosting[item.value];
                  } else {
                      selectedJobPosting.value[item.value] = obPublicationFormat[item.value] || '';
                  }
              });
          }
      }
  }
)
defineExpose({ showDrawerWithData ,openDrawer})
</script>
