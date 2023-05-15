<template>
  <q-card class="no-shadow full-width bg-grey-1">
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t('menu.newApplicant') }}</div>
    </q-card-section>

    <q-separator color="white" size="2px" />

    <q-card-section class="bg-grey-3">

      <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">
        <div class="row">
          <div class="col-6">
            <div class="row">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.name') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['name']" bg-color="white"
                  :rules="[(val) => !!val || '']" hide-bottom-space />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.kanaName') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['kanaName']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.postCode') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['postCode']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.prefecture') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-select outlined dense :options="prefectureOption" v-model="applicantData['prefecture']"
                  bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.municipalities') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['municipalities']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.street') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['street']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.apartment') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['apartment']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.phone') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['phone']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.email') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input outlined dense v-model="applicantData['email']" bg-color="white" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.status') }}
              </div>
              <div class="col-6 q-pl-sm">
                <q-select outlined dense v-model="applicantData['status']" :options="statusOption" bg-color="white"
                  :label="$t('common.pleaseSelect')" emit-value map-options />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.branchIncharge') }}
              </div>
              <div class="col-6 q-ml-sm bg-white">
                <select-branch :organization-id="organizationStore.currentOrganizationId" v-model="applicantData['branchIncharge']" />
              </div>
            </div>


          </div>
          <div class="col-6">

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.sex') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-radio v-model="applicantData['sex']" val="male" :label="$t('applicant.add.male')" />
                <q-radio v-model="applicantData['sex']" val="female" :label="$t('applicant.add.female')" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.dob') }}
              </div>
              <div class="col-6 q-pl-sm">
                <q-input dense outlined bg-color="white" v-model="applicantData['dob']">
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
                {{ $t('applicant.add.occupation') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-radio v-model="applicantData['occupation']" val="nurse" :label="$t('applicant.add.nurse')" />
                <q-radio v-model="applicantData['occupation']" val="nursingCare"
                  :label="$t('applicant.add.nursingCare')" />
                <q-radio v-model="applicantData['occupation']" val="lifeCounselor"
                  :label="$t('applicant.add.lifeCounselor')" />
                <q-radio v-model="applicantData['occupation']" val="careManager"
                  :label="$t('applicant.add.careManager')" />
                <q-radio v-model="applicantData['occupation']" val="others" :label="$t('applicant.add.others')" />
              </div>
            </div>

            <div class="row q-pt-md q-pb-sm ">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.qualification') }}
              </div>
              <div class="col-9 q-pl-sm">
                <q-checkbox v-model="applicantData['qualification']" val="registeredNurse"
                  :label="$t('applicant.add.registeredNurse')" />
                <q-checkbox v-model="applicantData['qualification']" val="assistantNurse"
                  :label="$t('applicant.add.assistantNurse')" />
                <q-checkbox v-model="applicantData['qualification']" val="newcomer"
                  :label="$t('applicant.add.newcomer')" />
                <q-checkbox v-model="applicantData['qualification']" val="careWorker"
                  :label="$t('applicant.add.careWorker')" />
              </div>
            </div>

            <div class="row q-pt-sm">
              <div class="col-3 text-right self-center q-pr-sm">
                {{ $t('applicant.add.applicationDate') }}
              </div>
              <div class="col-6 q-pl-sm">
                <q-input dense outlined bg-color="white" v-model="applicantData['applicationDate']">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="applicantData['applicationDate']" mask="YYYY/MM/DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="applicantData['applicationDate']" mask="YYYY/MM/DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
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
          <q-btn :label="$t('common.submit')" type="submit" color="primary" :loading="loading" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>

  </q-card>
</template>
 
<script lang="ts">
import { useQuasar, date, QForm } from 'quasar';
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  collection,
  setDoc,
  doc,
  getFirestore,
  serverTimestamp,
Timestamp,
} from 'firebase/firestore';
import { limitDate } from 'src/shared/utils/utils'
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';

import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { statusList } from 'src/shared/constants/Applicant.const';
import { ApplicantStatus } from 'src/shared/model';
import SelectBranch from '../Settings/management/components/SelectBranch.vue';
import { useOrganization } from 'src/stores/organization';

export default {
  name: 'applicantAdd',
  components: {
    SelectBranch
  },
  setup() {
    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();
    const db = getFirestore();
    const applicantDataSample = {
      qualification: [],
      status: ApplicantStatus.UNSUPPORTED,
    };
    const organizationStore = useOrganization()

    const applicantData = ref(JSON.parse(JSON.stringify(applicantDataSample)));
    const prefectureOption = ref(prefectureList);
    const statusOption = ref(statusList);

    const accept = ref(false);
    const applicantForm: Ref<QForm|null> = ref(null);
    const loading = ref(false);
    const imageURL = ref('');
    const applicantImage = ref([]);

    async function saveApplicantData(docRef, data) {
      try {
        await setDoc(
          docRef,
          data
        );
        loading.value = false;
        imageURL.value = '';
        applicantImage.value = [];

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
        });
        applicantForm.value?.reset();
      } catch (error) {
        console.log(error);
        loading.value = false;
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: t('failed'),
        });
      }
    }
    
    function onReset() {
      applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
      if (applicantForm.value) {
        applicantForm.value.resetValidation();
      }
    }

    return {
      applicantData,
      accept,
      applicantForm,
      prefectureOption,
      statusOption,
      loading,
      onReset,
      imageURL,
      applicantImage,
      organizationStore,
      limitDate,
      async onSubmit() {
        loading.value = true;
        let data = applicantData.value;
        data['created_at'] = serverTimestamp();
        data['updated_at'] = serverTimestamp();
        data['currentStatusMonth'] = Timestamp.now().toDate().getMonth()+1;
        data['currentStatusTimestamp'] = serverTimestamp();
        data['statusChangeTimestamp'] = { [data['status']] : serverTimestamp() }
        data['deleted'] = false;
        const docRef = doc(collection(db, 'applicants'));

        data['id'] = docRef.id;
        if (data['dob']){
         data['dob'] = data['dob'].replaceAll('/', '-') + 'T00:00:00+00:00' 
        }

        if (applicantImage.value && applicantImage.value.length > 0) {
          const file = applicantImage.value[0];
          const storage = getStorage();
          const storageRef = refStorage(storage, 'applicants/' + docRef.id + '/image/' + file['name']);

          uploadBytes(storageRef, file).then(async (snapshot) => {
            data['imagePath'] = snapshot.ref.fullPath;
            data['imageURL'] = await getDownloadURL(storageRef)
            saveApplicantData(docRef, data);
          }).catch((error) => {
            console.log(error);
            $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: t('failed'),
            });
          });
        }
        else {
          saveApplicantData(docRef, data);
        }
      },

      onFileChange(files) {
        imageURL.value = '';
        if (files && files.length > 0) {
          const file = files[0];
          imageURL.value = URL.createObjectURL(file);
        }
      }
    };
  },
};
</script>