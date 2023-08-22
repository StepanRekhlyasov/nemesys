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
                <q-input outlined dense v-model="applicantData['name']" bg-color="white" :rules="[creationRule]"
                  hide-bottom-space />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.kanaName') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['kanaName']" :rules="[creationRule, isKatakanaRule]"
                  @update:model-value="v => { applicantData['kanaName'] = toKatakana(v) }"
                  hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.postCode') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <div class="row  flex justify-center centers items-center">
                  <div class="col-8">
                    <q-input class="col" outlined dense v-model="applicantData['postCode']" :rules="[creationRule]"
                    :placeholder="$t('common.noHyphen')"  hide-bottom-space bg-color="white" />
                  </div>
                  <div class="col-4 text-center justify-center">
                    <q-btn @click="fetchAddress" dense> {{  $t('applicant.add.addressSearch') }}</q-btn>
                  </div>
                </div>
              </div>
            </div>
            <AddressDialog @keep-details="(value) => { keepDetails = value }" :openDialog="showAddress"
              :addressList="addressList" @getAddress="getAddress" :key="applicantData['postCode']" />
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.prefecture') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-select outlined dense :options="prefectureOption" v-model="applicantData['prefecture']"
                  :rules="[creationRule]" hide-bottom-space bg-color="white" :label="$t('common.pleaseSelect')" emit-value
                  map-options use-input input-debounce="0" @filter="filterPrefecturre" @update:model-value="applicantData['municipalities'] = ''; applicantData['street'] = ''" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.municipalities') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-select outlined dense :disable="!fetchMunicipalities" emit-value bg-color="white"
                  :options="municipalities" v-model="applicantData['municipalities']" :label="$t('common.pleaseSelect')"
                  :rules="[creationRule]" hide-bottom-space use-input input-debounce="0" @filter="filterMunicipalities"
                  @update:model-value="applicantData['street'] = ''" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.street') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['street']" :rules="[creationRule]" hide-bottom-space
                  bg-color="white" />
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
                <q-input outlined dense v-model="applicantData['phone']" :placeholder="$t('rule.onlyNumber')"
                  @input="v => { applicantData['phone'] = v.replace(/[a-zA-Z0-9]/g, '') }"
                  :rules="[creationRule, phoneRule]" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.email') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['email']"
                  :rules="[(val) => !!val || '', (val) => validateEmail(val) || '']" hide-bottom-space bg-color="white" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.status') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-pl-sm">
                <q-select outlined dense v-model="applicantData['status']" :options="statusOption" bg-color="white"
                  :rules="[creationRule]" hide-bottom-space :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.branchIncharge') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-ml-sm bg-white">
                <select-branch :organization-id="organizationStore.currentOrganizationId"
                  v-model="applicantData['branchIncharge']" use-chips :rules="[creationRule]" hide-bottom-space
                  @on-start-loading="disableSubmit = true; applicantData['branchIncharge'] = ''"
                  @on-end-loading="disableSubmit = false" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm q-mb-md q-pt-sm">
                {{ $t('clientFactory.drawer.details.industry') }}<span style="color: red">*</span>
              </div>
              <div class="col-6 q-ml-sm ">
                <q-select
                  :disable="!industries.length"
                  v-model="applicantData['industry']"
                  emit-value
                  map-options
                  outlined
                  dense
                  use-chips
                  bg-color="white"
                  :options="industries"
                  option-label="industryName"
                  option-value="."
                  @update:model-value="onIndustrySelected"
                  > <template v-if="!applicantData['industry']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template></q-select>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.sex') }} <span style="color: red">*</span>
              </div>
              <div class="col-8 q-pl-sm">
                <q-field ref="toggle" borderless dense v-model="applicantData['sex']" :rules="[creationRule]"
                  hide-bottom-space>
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
                  :rules="[(val) => !!val || '', validateDate]" hide-bottom-space>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="applicantData['dob']" default-view="Years" :options="limitDate">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
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
                <q-field ref="toggle" borderless dense v-model="applicantData['occupation']" :rules="[creationRule]"
                  hide-bottom-space>
                  <template v-slot:control>
                    <q-radio
                      v-for="occupation in occupationOptions"
                      :key="occupation"
                      v-model="applicantData['occupation']"
                      :val="occupation"
                      :label="(occupation)"
                    />
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pt-md q-pb-sm ">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.qualification') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-field ref="toggle" borderless dense v-model="applicantData['qualification']" hide-bottom-space>
                  <template v-slot:control>
                    <q-checkbox
                      v-for="qualification in certificateOptions"
                      :key="qualification"
                      v-model="applicantData['qualification']"
                      :val="qualification"
                      :label="(qualification)"
                    />
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pt-md q-pb-sm ">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.applicationMedia') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-select outlined dense v-model="applicantData['media']" :options="mediaList" option-label="name" option-value="id" bg-color="white"
                  hide-bottom-space :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>
            <div class="row q-pt-md q-pb-sm ">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.applicationMetod') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-select outlined dense :options="applicationMethodOption" emit-value map-options bg-color="white"
                  v-model="applicantData['applicationMetod']" :disable="loading" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.applicationDate') }} <span style="color: red">*</span>
              </div>
              <div class="col-6 q-pl-sm">
                <q-input dense outlined bg-color="white" v-model="applicantData['applicationDate']"
                  :rules="[(val) => !!val || '', validateDate]" hide-bottom-space>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="applicantData['applicationDate']" mask="YYYY/MM/DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="applicantData['applicationDate']" mask="YYYY/MM/DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-time>
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
                <q-file name="applicant_image" v-model="applicantImage" multiple use-chips outlined dense bg-color="white"
                  @update:model-value="onFileChange" accept=".jpg, image/*">
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
          <q-btn :label="$t('common.register')" type="submit" color="primary" :loading="loading"
            :disable="disableSubmit" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { QForm } from 'quasar';
import { Ref, ref, watch, onBeforeMount } from 'vue';
import { serverTimestamp, Timestamp, } from 'firebase/firestore';
import { limitDate, toMonthYear } from 'src/shared/utils/utils'
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { applicationMethod, statusList } from 'src/shared/constants/Applicant.const';
import { ApplicantStatus } from 'src/shared/model';
import SelectBranch from '../Settings/management/components/SelectBranch.vue';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import { requiredFields } from 'src/shared/constants/Applicant.const';
import { validateEmail, validateDate } from 'src/shared/constants/Form.const';
import { Alert } from 'src/shared/utils/Alert.utils';
import { creationRule, isKatakanaRule, phoneRule } from 'src/components/handlers/rules';
import { getAddresses } from 'src/shared/constants/Municipalities.const';
import AddressDialog from './components/AddressDialog.vue';
import { getMunicipalities } from 'src/shared/constants/Municipalities.const';
import { toKatakana } from 'src/shared/utils/ToKatakana.utils.ts';
import { useIndsutry } from 'src/stores/industry';
import { storeToRefs } from 'pinia';
import { Media } from 'src/shared/model/Media.model';
import { useMedia } from 'src/stores/media';
const { getAllmedia } = useMedia();

const applicantDataSample = {
  qualification: [],
  status: ApplicantStatus.UNSUPPORTED,
  lon: 0,
  lat: 0
};
const organizationStore = useOrganization();
const applicantStore = useApplicant();
const industryStore = useIndsutry()
const applicantData = ref(JSON.parse(JSON.stringify(applicantDataSample)));
const prefectureOption = ref(prefectureList.value);
const applicationMethodOption = ref(applicationMethod)
const statusOption = ref(statusList);
const disableSubmit = ref(false)
const applicantForm: Ref<QForm | null> = ref(null);
const loading = ref(false);
const imageURL = ref('');
const applicantImage = ref<FileList | []>([]);
const municipalities = ref<string[]>([])
const occupationOptions = ref<string[]>([]);
const certificateOptions = ref<string[]>([]);
const showAddress = ref(false)
const addressList = ref(<{ prefecture: string, municipality: string, street: string }[]>[]);
const keepDetails = ref(false)
const fetchMunicipalities = ref(false)
const { industries } = storeToRefs(industryStore)
const mediaList = ref<Media[]>([]);


watch(() => applicantData.value.postCode, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    showAddress.value = false;
    keepDetails.value = false;
    applicantData.value.prefecture = '';
    applicantData.value.municipalities = '';
    applicantData.value.street = '';
  }
})
watch(() => applicantData.value.prefecture, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal) {
    fetchMunicipalities.value = false
    municipalities.value = await getMunicipalities(newVal)
    fetchMunicipalities.value = true
  } else {
    fetchMunicipalities.value = false
  }
}, { immediate: true })

async function onIndustrySelected() {
  if (applicantData.value.industry) {
    const reqName = applicantData.value.industry.industryName;
    applicantData.value['industry'] = applicantData.value.industry.industryName;

    const cerResult = await industryStore.getCertificate(reqName);
    const occResult = await industryStore.getOccupation(reqName);
    occupationOptions.value = occResult ? occResult.occupationTitles : [];
    certificateOptions.value = cerResult ? cerResult.certificateTitles : [];
    console.log(cerResult.certificateTitles)
    console.log(occResult.occupationTitles)
  }
}

async function fetchAddress() {
  const pincode = applicantData.value.postCode
  const address = await getAddresses(pincode)
  if (!address) {
    Alert.warning('Invalid pin entered!');
    return;
  }
  showAddress.value = true
  addressList.value = address.address;
}

const fetchMedia = async () => {
    mediaList.value = await getAllmedia();
}

onBeforeMount(() => {
    fetchMedia();
})

function resetData() {
  applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
  imageURL.value = '';
  applicantImage.value = [];
  if (applicantForm.value) {
    applicantForm.value.resetValidation();
  }
}
function onFileChange(files: FileList) {
  imageURL.value = '';
  if (files && files.length > 0) {
    const file = files[0];
    imageURL.value = URL.createObjectURL(file);
  }
}
const filterMunicipalities = async (val: string, update) => {
  if (val === '' && applicantData.value.prefecture) {
    update(async () => {
      municipalities.value = await getMunicipalities(applicantData.value.prefecture)
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    municipalities.value = municipalities.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};

const filterPrefecturre = async (val: string, update) => {
  if (val === '') {
    update(async () => {
      prefectureOption.value = prefectureList.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    prefectureOption.value = prefectureOption.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
};

async function onSubmit() {
  loading.value = true;
  let data = JSON.parse(JSON.stringify(applicantData.value));
  data['created_at'] = serverTimestamp();
  data['updated_at'] = serverTimestamp();

  if (!data.applicationDate) {
    data.applicationDate = new Date()
  }
  data['applicationDate'] = Timestamp.fromDate(new Date(data.applicationDate));
  data['invitationDate'] = data['applicationDate'];
  data['currentStatusTimestamp'] = data['applicationDate'];
  data['statusChangeTimestamp'] = { [data['status']]: data['applicationDate'] }
  data['currentStatusMonth'] = toMonthYear(data['applicationDate']);

  data['address'] = [data['prefecture'], data['municipalities'], data['street'], data['apartment']].join(' ')


  /** required fields */
  for (const [key, value] of Object.entries(requiredFields.value)) {
    if (typeof data[key] == 'undefined') {
      data[key] = value
    }
  }
  /** required fields */
  data['dob'] = Timestamp.fromDate(new Date(data.dob));
  data['deleted'] = false;
  try {
    await applicantStore.createApplicant(data, applicantImage.value);
    applicantStore.state.needsApplicantUpdateOnMounted = true
    applicantForm.value?.reset();
  } catch (error) {
    Alert.warning(error);
  }
  loading.value = false;
}
const getAddress = (index: number) => {
  if (index >= 0) {
    const add = addressList.value[index];
    applicantData.value.prefecture = add.prefecture;
    applicantData.value.municipalities = add.municipality;
    applicantData.value.street = add.street;
  }
  showAddress.value = false
}
</script>
