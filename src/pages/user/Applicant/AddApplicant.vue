<template>
  <q-card class="no-shadow full-width bg-grey-1">
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t('menu.newApplicant') }}</div>
    </q-card-section>
    <q-separator color="white" size="2px" />
    <q-card-section class="bg-grey-3">
      <q-form ref="applicantForm" @submit="onSubmit" @reset="resetData" greedy>
        <div class="row">
          <div class="col-6">
            <div class="row">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.name') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['name']" bg-color="white"
                  :rules="[(val) => !!val || '']" hide-bottom-space />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.kanaName') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['kanaName']" 
                  :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.postCode') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['postCode']"
                  :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.prefecture') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-select outlined dense :options="prefectureOption" v-model="applicantData['prefecture']"
                  :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" 
                  :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.municipalities') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['municipalities']"
                  :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.street') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['street']"
                :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.apartment') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['apartment']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.phone') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['phone']" @input="v => { applicantData['phone'] = v.replace(/[a-zA-Z0-9]/g,'') }" 
                :rules="phoneRules" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.email') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['email']"
                :rules="[(val) => !!val || '', (val) => validateEmail(val) || '' ]" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.status') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-pl-sm">
                <q-select outlined dense v-model="applicantData['status']" :options="statusOption" bg-color="white"
                :rules="[(val) => !!val || '']" hide-bottom-space :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.branchIncharge') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-ml-sm bg-white">
                <select-branch 
                  :organization-id="organizationStore.currentOrganizationId" 
                  v-model="applicantData['branchIncharge']" 
                  :rules="[(val) => !!val || '']" 
                  hide-bottom-space
                  @on-start-loading="disableSubmit = true; applicantData['branchIncharge'] = ''"
                  @on-end-loading="disableSubmit = false"
                />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.sex') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">                
                <q-field                
                  ref="toggle" borderless dense
                  v-model="applicantData['sex']"
                  :rules="[(val) => !!val || '']" hide-bottom-space> 
                  <template v-slot:control>      
                    <q-radio v-model="applicantData['sex']" val="male" :label="$t('applicant.add.male')" />
                    <q-radio v-model="applicantData['sex']" val="female" :label="$t('applicant.add.female')" />
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.dob') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-pl-sm">
                <q-input dense outlined bg-color="white" v-model="applicantData['dob']"
                  :rules="[(val) => !!val || '', validateDate]" hide-bottom-space >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="applicantData['dob']" default-view="Years" :options="limitDate">
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
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.occupation') }} <span style="color: red">*</span>
              </div>
              <div class="col-9 q-pl-sm">
                <q-field                
                  ref="toggle" borderless dense
                  v-model="applicantData['occupation']"
                  :rules="[(val) => !!val || '']" hide-bottom-space> 
                  <template v-slot:control>                    
                    <q-radio v-model="applicantData['occupation']" val="nurse" :label="$t('applicant.add.nurse')" />
                    <q-radio v-model="applicantData['occupation']" val="nursingCare"
                      :label="$t('applicant.add.nursingCare')" />
                    <q-radio v-model="applicantData['occupation']" val="lifeCounselor"
                      :label="$t('applicant.add.lifeCounselor')" />
                    <q-radio v-model="applicantData['occupation']" val="careManager"
                      :label="$t('applicant.add.careManager')" />
                    <q-radio v-model="applicantData['occupation']" val="others" :label="$t('applicant.add.others')" />
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pt-md q-pb-sm ">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.qualification') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-field                
                  ref="toggle" borderless dense
                  v-model="applicantData['qualification']"
                  :rules="[(val) => !!val || '']" hide-bottom-space> 
                  <template v-slot:control>       
                    <q-checkbox v-model="applicantData['qualification']" val="registeredNurse"
                      :label="$t('applicant.add.registeredNurse')" />
                    <q-checkbox v-model="applicantData['qualification']" val="assistantNurse"
                      :label="$t('applicant.add.assistantNurse')" />
                    <q-checkbox v-model="applicantData['qualification']" val="newcomer"
                      :label="$t('applicant.add.newcomer')" />
                    <q-checkbox v-model="applicantData['qualification']" val="careWorker"
                      :label="$t('applicant.add.careWorker')" />
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.applicationDate') }} <span style="color: red">*</span> 
              </div>
              <div class="col-6 q-pl-sm">
                <q-input dense outlined bg-color="white" v-model="applicantData['applicationDate']"
                :rules="[(val) => !!val || '', validateDate]" hide-bottom-space >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="applicantData['applicationDate']" mask="YYYY/MM/DD">
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
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.image') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-file name="applicant_image" v-model="applicantImage" multiple use-chips outlined dense
                  bg-color="white" @update:model-value="onFileChange" accept=".jpg, image/*">
                  <template v-slot:append>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <div class="">
                  <q-img :src="imageURL" spinner-color="white" style="height: 150px; max-width: 150px" v-if="imageURL"
                    class="q-mt-sm" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <q-separator color="white" size="2px" class="q-mt-md" />
        <div class="q-pt-sm">
          <q-btn :label="$t('common.submit')" type="submit" color="primary" :loading="loading" :disable="disableSubmit" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
 
<script lang="ts" setup>
import { QForm } from 'quasar';
import { Ref, ref } from 'vue';
import { serverTimestamp, Timestamp, } from 'firebase/firestore';
import { limitDate, toMonthYear } from 'src/shared/utils/utils'
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { statusList } from 'src/shared/constants/Applicant.const';
import { ApplicantStatus } from 'src/shared/model';
import SelectBranch from '../Settings/management/components/SelectBranch.vue';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import { requiredFields } from 'src/shared/constants/Applicant.const';
import { validateEmail, validateDate} from 'src/shared/constants/Form.const';
import { Alert } from 'src/shared/utils/Alert.utils';

const applicantDataSample = {
  qualification: [],
  status: ApplicantStatus.UNSUPPORTED,
  lon: 0,
  lat: 0
};
const organizationStore = useOrganization();
const applicantStore = useApplicant();

const applicantData = ref(JSON.parse(JSON.stringify(applicantDataSample)));
const prefectureOption = ref(prefectureList);
const statusOption = ref(statusList);
const disableSubmit = ref(false)
const applicantForm: Ref<QForm|null> = ref(null);
const loading = ref(false);
const imageURL = ref('');
const applicantImage = ref<FileList | []>([]);
const phoneRules = [
  (val) => val&&!!val || '',
  (val) => {
    const reg = /^[a-zA-Z0-9]+$/
    return reg.test(val) || ''
  }
] 

function resetData() {
  applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
  imageURL.value = '';
  applicantImage.value = [];
  if (applicantForm.value) {
    applicantForm.value.resetValidation();
  }
}
function onFileChange(files : FileList) {
  imageURL.value = '';
  if (files && files.length > 0) {
    const file = files[0];
    imageURL.value = URL.createObjectURL(file);
  }
}

async function onSubmit() {
  loading.value = true;
  let data = JSON.parse(JSON.stringify(applicantData.value));
  data['created_at'] = serverTimestamp();
  data['updated_at'] = serverTimestamp();
  
  if(!data.applicationDate){
    data.applicationDate = new Date()
  }
  data['applicationDate'] = Timestamp.fromDate(new Date(data.applicationDate));
  data['currentStatusTimestamp'] = data['applicationDate'] ;
  data['statusChangeTimestamp'] = { [data['status']] : data['applicationDate'] }
  data['currentStatusMonth'] = toMonthYear(data['applicationDate']);

  data['address'] = [data['prefecture'], data['municipalities'], data['street'], data['apartment']].join(' ')
  
 
  /** required fields */
  for(const [key, value] of Object.entries(requiredFields.value)){
    if(typeof data[key] == 'undefined'){
      data[key] = value
    }
  }
  /** required fields */
  data['dob'] = Timestamp.fromDate(new Date(data.dob));
  data['deleted'] = false;
  try{
    await applicantStore.createApplicant(data, applicantImage.value)
    Alert.success();
    applicantStore.state.needsApplicantUpdateOnMounted = true
    applicantForm.value?.reset();
  } catch(error){
    Alert.warning(error);
  }
  loading.value = false;
}
</script>