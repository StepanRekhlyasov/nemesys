<template>
  <div class="text-caption text-weight-medium">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.newApplicant') }}</div>
      </q-card-section>
      <q-separator color="white" size="2px" />


      <q-card-section class="bg-grey-3">

        <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">

          <div class="row">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.name') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['name']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.kanaName') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['kanaName']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.postCode') }}
            </div>
            <div class="col-3 q-pl-sm">
              <q-input outlined dense v-model="applicantData['postCode']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.prefecture') }}
            </div>
            <div class="col-3 q-pl-sm">
              <q-select outlined dense v-model="applicantData['prefecture']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.municipalities') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['municipalities']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.street') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['street']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.apartment') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['apartment']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.phone') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['phone']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.email') }}
            </div>
            <div class="col-4 q-pl-sm">
              <q-input outlined dense v-model="applicantData['email']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.status') }}
            </div>
            <div class="col-3 q-pl-sm">
              <q-select outlined dense v-model="applicantData['status']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.branchIncharge') }}
            </div>
            <div class="col-3 q-pl-sm">
              <q-select outlined dense v-model="applicantData['status']" bg-color="white" />
            </div>
          </div>

          <div class="row q-pt-md q-pb-sm ">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.sex') }}
            </div>
            <div class="col-6 q-pl-sm">
              <q-radio dense v-model="applicantData['sex']" val="male" :label="$t('applicant.add.male')" />
              <q-radio dense class="q-pl-md" v-model="applicantData['sex']" val="female"
                :label="$t('applicant.add.female')" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.dob') }}
            </div>
            <div class="col-3 q-pl-sm">
              <q-input dense outlined bg-color="white" v-model="applicantData['dob']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="applicantData['dob']">
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

          <div class="row q-pt-md q-pb-sm ">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.occupation') }}
            </div>
            <div class="col-10 q-pl-sm">
              <q-radio dense v-model="applicantData['occupation']" val="nurse" :label="$t('applicant.add.nurse')" />
              <q-radio dense class="q-pl-md" v-model="applicantData['occupation']" val="nursingCare"
                :label="$t('applicant.add.nursingCare')" />
              <q-radio dense class="q-pl-md" v-model="applicantData['occupation']" val="lifeCounselor"
                :label="$t('applicant.add.lifeCounselor')" />
              <q-radio dense class="q-pl-md" v-model="applicantData['occupation']" val="careManager"
                :label="$t('applicant.add.careManager')" />
              <q-radio dense class="q-pl-md" v-model="applicantData['occupation']" val="others"
                :label="$t('applicant.add.others')" />
            </div>
          </div>

          <div class="row q-pt-md q-pb-sm ">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.qualification') }}
            </div>
            <div class="col-10 q-pl-sm">
              <q-checkbox dense v-model="applicantData['qualification']" val="registeredNurse"
                :label="$t('applicant.add.registeredNurse')" />
              <q-checkbox dense v-model="applicantData['qualification']" val="assistantNurse"
                :label="$t('applicant.add.assistantNurse')" class="q-pl-md" />
              <q-checkbox dense v-model="applicantData['qualification']" val="newcomer"
                :label="$t('applicant.add.newcomer')" class="q-pl-md" />
              <q-checkbox dense v-model="applicantData['qualification']" val="careWorker"
                :label="$t('applicant.add.careWorker')" class="q-pl-md" />
            </div>
          </div>

          <div class="row q-pt-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('applicant.add.applicationDate') }}
            </div>
            <div class="col-3 q-pl-sm">
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


          <q-separator color="white" size="2px" class="q-mt-md" />

          <div class="q-pt-sm">
            <q-btn :label="$t('common.submit')" type="submit" color="primary" />
            <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
//import { doc, setDoc, getFirestore, serverTimestamp, getDoc, addDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';

export default {
  name: 'applicantAdd',
  setup() {
    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();
    const db = getFirestore();
    const applicantDataSample = {
      qualification: []
    };
    const applicantData = ref(JSON.parse(JSON.stringify(applicantDataSample)));

    const accept = ref(false);
    const applicantForm = ref(null);

    const repeatItem = ref([
      {
        name: t('client.add.workplaceInformation'),
        key: 'office',
        color: 'bg-blue-grey-1',
      },
      {
        name: t('client.add.contractor'),
        key: 'contract',
        color: 'bg-light-green-1',
      },
      {
        name: t('client.add.prSheetDestination'),
        key: 'prsheet',
        color: 'bg-deep-orange-1',
      },
    ]);

    return {
      applicantData,
      accept,
      repeatItem,
      applicantForm,

      async onSubmit() {
        let data = applicantData.value;
        data['created_at'] = serverTimestamp();
        data['updated_at'] = serverTimestamp();
        data['deleted'] = false;

        try {
          const docRef = await addDoc(
            collection(db, 'applicants'),
            applicantData.value
          );
          console.log('Document written with ID: ', docRef.id);

          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
          applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
          //applicantForm.value.resetValidation();
        } catch (error) {
          console.log(error);
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: t('failed'),
          });
        }
      },

      onReset() {
        applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
        //applicantForm.value.resetValidation();
      },
    };
  },
};
</script>
