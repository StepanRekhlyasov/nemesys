
<template>
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="jobForm" @submit="saveJobAd">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="hideDrawer" />
                      <div class="q-mr-sm">
                          <div>
                              {{ transactionText }}
                              <span v-if="projectText">/ {{ projectText }}</span>
                          </div>
                          <div class="text-h6">{{ jobAdData['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="jobAdData['id'] ? $t('job.jobUpdate') : $t('jobAd.issuanceJobAd')" type="submit" />
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
          <q-card-section v-if="isDrawer">
              <div class="row text-primary text-body1">
                  ■ {{ $t('jobAd.add.job') }}
              </div>

              <div class="row">
                  {{ $t('job.add.jobName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-select outlined dense :options="jobList" emit-value map-options v-model="jobAdData['jobId']"
                          lazy-rules :rules="[(val) => (val && val.length > 0) || '']" option-label="name">
                          <template v-if="!jobAdData['jobId']" v-slot:selected>
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
                      <q-input outlined dense v-model="jobAdData['name']" hide-bottom-space lazy-rules
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
                      <q-input outlined dense v-model="jobAdData['dateIssue']" mask="date"
                          :rules="['date', (val) => (val && val.length > 0) || '']" lazy-rules hide-bottom-space>
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                      <q-date v-model="jobAdData['dateIssue']">
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
                                      <q-date v-model="jobAdData['publicationPeriod']" range>
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
                          v-model="jobAdData['media']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobAdData['media']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="publicationFormatOptions" emit-value map-options
                          v-model="jobAdData['publicationFormat']" option-value="id" option-label="name">
                          <template v-if="!jobAdData['publicationFormat']" v-slot:selected>
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
                  <q-toggle v-model="jobAdData['areaFlag']" dense class="q-ml-sm q-mr-sm" />
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
                          <q-input outlined dense v-model="jobAdData[item.value]" hide-bottom-space
                              v-if="item.type == 'text'" readonly />
                          <q-select outlined dense :options="options[item.option]" emit-value map-options
                              v-model="jobAdData[item.value]" v-else-if="item.type == 'select'" option-value="id"
                              option-label="name">
                              <template v-if="!jobAdData[item.value]" v-slot:selected>
                                  <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                              </template>
                          </q-select>
                      </div>
                  </div>
              </div>
          </q-card-section>
      </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref,Ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { paymentTypeList, salaryTypeList, statusList, mediaList, formatSettingItemList } from 'src/shared/constants/JobAd.const';
import { useJobPostingHistory } from 'src/stores/jobPostingHistory'
import {JobModel,JobFormat} from 'src/shared/model/Jobs.model'
const jobPostingHistoryStore = useJobPostingHistory()
const props = defineProps({
  selectedJob: {
      type: Object,
      required: true
  },
  isDrawer: {
      type: Boolean,
      required: true
  }
}
)
const emit = defineEmits<{
  (e: 'hideDrawer')
}>()

const hideDrawer = () => {
  jobAdData.value = { ...jobAdDataObject }
  emit('hideDrawer')
}
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const jobAdDataObject = {
  id: props?.selectedJob['id'] || null,
  name: props?.selectedJob['name'] || '',
  jobId: '',
  publicationPeriod: '',
  areaFlag: true,
  media: props?.selectedJob['media'] || '',
  dateIssue: props?.selectedJob['dateIssue'] || '',
  publicationFormat: '',

}
const jobAdData = ref({ ...jobAdDataObject })
const mediaOptions = ref(mediaList);
const facilityText = ref('');
const unsubscribe = ref();
const unsubscribeOffice = ref();
const unsubscribePhrase = ref();
const jobList:Ref<JobModel[]> = ref([]);
const transactionText = ref('')
const projectText = ref('')
const paymentText = ref('')
const salaryTypeText = ref('')
const statusText = ref('')
const formatedPublicationPeriod = ref('')
const jobForm = ref();
const formatSettingItems = ref(formatSettingItemList);
const options = ref({});
const unsubscribeFormat = ref()
const publicationFormatOptions:Ref<JobFormat[]> = ref([])

onMounted(async () => {
  jobList.value = await jobPostingHistoryStore.getJobsdata()
      if (props?.selectedJob['jobId'] && !jobAdData.value.jobId) {
          jobAdData.value.jobId = props?.selectedJob['jobId'] || '';
      }
  jobAdData.value.publicationPeriod = props?.selectedJob['publicationPeriod'] || '';

  getPhrase();
  publicationFormatOptions.value = await jobPostingHistoryStore.getJobFormatData()
      if (props?.selectedJob['publicationFormat'] && !jobAdData.value.publicationFormat) {
          jobAdData.value.publicationFormat = props?.selectedJob['publicationFormat'] || '';
      }

})

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
  () => (jobAdData.value.jobId),
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
  () => (jobAdData.value.publicationPeriod),
  (newVal,) => {
      formatedPublicationPeriod.value = '';
      if (newVal) {
          formatedPublicationPeriod.value = newVal['from'] + ' ~ ' + newVal['to']
      }
  }
)

watch(
  () => (jobAdData.value.publicationFormat),
  (newVal,) => {
      if (jobAdData.value.publicationFormat) {
          const obPublicationFormat = publicationFormatOptions.value.find(o => o['value'] === newVal);
          if (obPublicationFormat) {
              formatSettingItems.value.forEach(item => {
                  if (props?.selectedJob[item.value]) {
                      jobAdData.value[item.value] = props?.selectedJob[item.value];
                  } else {
                      jobAdData.value[item.value] = obPublicationFormat[item.value] || '';
                  }
              });
          }
      }
  }
)

const saveJobAd = async () => {
  try {
      if (jobAdData.value.id) {
          await jobPostingHistoryStore.updateFormData(jobAdData.value)
          hideDrawer()

      } else {
         await jobPostingHistoryStore.addFormData(jobAdData.value)
         hideDrawer()
      }

      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });
      jobAdData.value = { ...jobAdDataObject }
      jobForm.value.resetValidation();
  } catch (error) {
      console.log(error);
      $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: t('failed'),
      });
  }
}

const getPhrase = async () => {
  if (unsubscribePhrase.value) {
      unsubscribePhrase.value();
  }
   const data = await jobPostingHistoryStore.getPhraseData(options)
  options.value = data
}


</script>
