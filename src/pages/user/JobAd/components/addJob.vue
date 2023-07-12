<template>
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="jobForm" @submit="saveJob">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="hideDrawer" />
                      <div class="q-mr-sm">
                          <div>
                              {{ transactionText }}
                              <span v-if="projectText">/ {{ projectText }}</span>
                          </div>
                          <div class="text-h6">{{ jobData['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="jobData['id'] ? $t('job.jobUpdate') : $t('job.jobReg')" type="submit" />
                      <q-btn outline size="sm" :label="$t('job.autoJobCreation')" class="q-ml-md"
                          style="height: 30px" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="isDrawer">
              <div class="row text-primary text-body1">
                  ■ {{ $t('job.add.basicInfo') }}
              </div>

              <div class="row">
                  {{ $t('job.add.jobName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="jobData['name']" :placeholder="$t('client.add.clientLabel')"
                          lazy-rules :rules="[(val) => (val && val.length > 0) || '']" />
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
                          v-model="jobData['transactionType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['transactionType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="projectTypeOptions" emit-value map-options
                          v-model="jobData['projectType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['projectType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-select outlined dense :options="facilityTypeOption" emit-value map-options
                          option-label="name" v-model="jobData['facilityType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['facilityType']" v-slot:selected>
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
                      <q-select outlined dense :options="paymentTypeOption" emit-value map-options
                          v-model="jobData['paymentType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['paymentType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="salaryTypeOption" emit-value map-options
                          v-model="jobData['salaryType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['salaryType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-select outlined dense :options="statusOption" emit-value map-options
                          v-model="jobData['status']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobData['status']" v-slot:selected>
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
                      <q-select outlined dense :options="clientList" v-model="jobData['client']">
                          <template v-if="!jobData['client']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="officeList" v-model="jobData['office']"
                          :disable="officeList.length == 0">
                          <template v-if="!jobData['office']" v-slot:selected>
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
                      <q-input outlined dense v-model="jobData['email']"
                          :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')"
                          hide-bottom-space />
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-input outlined dense v-model="jobData['phone']" :placeholder="$t('client.add.phoneLabel')"
                          hide-bottom-space />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('job.add.jobContent') }}
              </div>
              <div v-for="item in jobItems" :key="item['id']">
                  <div class="row q-pt-sm">
                      <div class="col-4">
                          {{ item['name'] }}
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-12">
                          <q-select outlined dense :options="jobItemOptions[item['id']]" emit-value map-options
                              v-model="jobData['jobContent'][item['name']]" option-value="name" option-label="name">
                              <template v-if="!jobData['jobContent'][item['name']]" v-slot:selected>
                                  <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                              </template>
                          </q-select>
                      </div>
                  </div>
              </div>
              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('job.add.employmentContract') }}
              </div>

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
                      <q-input outlined dense v-model="jobData['salaryTypeText']" hide-bottom-space />
                  </div>
                  <div class="col-3 q-pr-sm">
                      <q-input outlined dense v-model="jobData['salaryCap']" hide-bottom-space />
                  </div>
                  <div class="col-3 q-pr-sm">
                      <q-input outlined dense v-model="jobData['minSalary']" hide-bottom-space />
                  </div>
                  <div class="col-3">
                      <q-input outlined dense v-model="jobData['payday']" hide-bottom-space />
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
                          v-model="jobData['employmentStatus']">
                          <template v-if="!jobData['employmentStatus']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="[]" emit-value map-options v-model="jobData['bonuses']">
                          <template v-if="!jobData['bonuses']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-input outlined dense v-model="jobData['transportationExpenses']" hide-bottom-space />
                  </div>
              </div>

              <div class="row q-pt-sm">
                  <div class="col-12">
                      {{ $t('job.add.treatmentBenefits') }}
                  </div>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-select outlined dense :options="[]" emit-value map-options v-model="jobData['benefits']">
                          <template v-if="!jobData['benefits']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <!-- Employment Conditions -->
              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('job.add.employmentConditions') }}
              </div>

              <div class="row q-pt-sm">
                  <div class="col-4">
                      {{ $t('job.add.experienceRequired') }}
                  </div>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="jobData['experienceRequired']" hide-bottom-space />
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
                      <q-select outlined dense :options="[]" emit-value map-options
                          v-model="jobData['requiredQualification']">
                          <template v-if="!jobData['requiredQualification']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="halfYearExpOption" emit-value map-options
                          v-model="jobData['halfYearExp']">
                          <template v-if="!jobData['halfYearExp']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-input outlined dense v-model="jobData['upperAgeLimit']" hide-bottom-space />
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
                          v-model="jobData['indeedJobCategory']">
                          <template v-if="!jobData['indeedJobCategory']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="resumeRequiredOption" emit-value map-options
                          v-model="jobData['presenceAbsenceResume']">
                          <template v-if="!jobData['presenceAbsenceResume']" v-slot:selected>
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
                      <q-select outlined dense v-model="jobData['indeedTag']" emit-value map-options use-chips
                          multiple input-debounce="0" :options="indeedTagOptions" options-html use-input>
                          <template v-if="!jobData['indeedTag']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>

                  </div>
              </div>
          </q-card-section>
      </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { paymentTypeList, salaryTypeList, statusList, employmentStatusList, reqList, indeedJobCategoryList, indeedTagList, indeedTagJobType, indeedTagCoronaType, resumeRequiredList } from 'src/shared/constants/JobAd.const';
import { DocumentData } from 'firebase/firestore';
import { useJobSearch } from 'src/stores/jobSearch'
const jobSearchStore = useJobSearch()
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
  jobData.value = { ...jobDataObject }
  emit('hideDrawer')
}
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const jobDataObject = {
  id: props?.selectedJob['id'] || null,
  name: props?.selectedJob['name'] || '',
  client: '',
  indeedTag: props?.selectedJob['indeedTag'] || [],
  transactionType: '',
  projectType: '',
  facilityType: props?.selectedJob['facilityType'] || '',
  paymentType: props?.selectedJob['paymentType'] || '',
  salaryType: props?.selectedJob['salaryType'] || '',
  status: props?.selectedJob['status'] || '',
  office: props?.selectedJob['office'] || '',
  email: props?.selectedJob['email'] || '',
  phone: props?.selectedJob['phone'] || '',
  jobContent: props?.selectedJob['jobContent'] || {},
  salaryTypeText: props?.selectedJob['salaryTypeText'] || '',
  salaryCap: props?.selectedJob['salaryCap'] || '',
  minSalary: props?.selectedJob['minSalary'] || '',
  payday: props?.selectedJob['payday'] || '',
  employmentStatus: props?.selectedJob['employmentStatus'] || '',
  bonuses: props?.selectedJob['bonuses'] || '',
  transportationExpenses: props?.selectedJob['transportationExpenses'] || '',
  benefits: props?.selectedJob['benefits'] || '',
  experienceRequired: props?.selectedJob['experienceRequired'] || '',
  requiredQualification: props?.selectedJob['requiredQualification'] || '',
  upperAgeLimit: props?.selectedJob['upperAgeLimit'] || '',
  indeedJobCategory: props?.selectedJob['indeedJobCategory'] || '',
  presenceAbsenceResume: props?.selectedJob['presenceAbsenceResume'] || '',
  halfYearExp: props?.selectedJob['halfYearExp'] || '',

}
const jobData = ref({ ...jobDataObject })
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const facilityTypeOption = ref(facilityList);
const paymentTypeOption = ref(paymentTypeList);
const salaryTypeOption = ref(salaryTypeList);
const statusOption = ref(statusList);
const indeedTagOptions = ref(indeedTagList);
const employmentStatusOption = ref(employmentStatusList);
const resumeRequiredOption = ref(resumeRequiredList);
const halfYearExpOption = ref(reqList);
const indeedJobCategorOption = ref(indeedJobCategoryList);

const unsubscribe = ref();
const unsubscribeOffice = ref();
const clientList:DocumentData = ref([]);
const officeList:DocumentData = ref([]);
const transactionText = ref('')
const projectText = ref('')
const jobForm = ref();
const jobItems = ref({});
const jobItemOptions = ref({});

onMounted(async () => {
  clientList.value = await jobSearchStore.loadClientsData()
  jobData.value.transactionType = props?.selectedJob['transactionType'] || '';
  jobData.value.projectType = props?.selectedJob['projectType'] || '';
  jobData.value.client = props?.selectedJob['client'] || '';
  await jobSearchStore.loadJobItemSettingData()
})
onBeforeUnmount(() => {
  if (unsubscribe.value) {
      unsubscribe.value();
  }
  if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
  }

})
watch(
  () => (jobData.value.transactionType),
  (newVal,) => {
      transactionText.value = '';
      let obj = transactionTypeOptions.value.find(o => o.value === newVal);
      if (obj) {
          transactionText.value = obj.label;
      }
  }
)
watch(
  () => (jobData.value.projectType),
  (newVal,) => {
      projectText.value = '';
      let obj = projectTypeOptions.value.find(o => o.value === newVal);
      if (obj) {
          projectText.value = obj.label;
      }
  }
)
watch(
  () => (jobData.value.indeedTag),
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
watch(
  () => (jobData.value.client),
  (newVal,) => {
      officeList.value = [];
      if (unsubscribeOffice.value) {
          unsubscribeOffice.value();
      }
      if (newVal.value) {
         officeList.value = jobSearchStore.loadOfficeData(newVal.value)
      }
  }
)
const saveJob = async () => {
  try {
      if (jobData.value.id) {
          await jobSearchStore.updateFormData(jobData.value)
          hideDrawer()

      } else {
         await jobSearchStore.addFormData(jobData.value)
         hideDrawer()
      }

      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });
      jobData.value = { ...jobDataObject }
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
</script>
