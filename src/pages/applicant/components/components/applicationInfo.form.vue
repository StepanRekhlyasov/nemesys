<template>
<q-card class="no-shadow bg-grey-3">
  <q-card-section class="text-white bg-primary rounded-borders" >
    <div class="row">
      <q-btn dense flat icon="close" @click="closeDialog" class="q-mr-md"/>
    </div>
  </q-card-section>
  <q-card-actions class="q-pa-none bg-white q-pa-md">
    <q-btn :label="$t('common.save')" color="primary" @click="save"/>
    <q-btn :label="$t('common.cancel')" outline color="primary" @click="closeDialog" />
  </q-card-actions>
  <q-card-section>
    <q-form class="q-pa-md bg-white">
      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.date') }}
        </div>
        <div class="col-4 q-pl-sm">
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
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.name') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input dense outlined bg-color="white" v-model="applicantData['name']" />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.kana') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input dense outlined bg-color="white" v-model="applicantData['kana']" />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.media') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-radio v-model="applicantData['media']" label="indeed" val="indeed"/>
          <q-radio v-model="applicantData['media']" :label="$t('applicant.add.hr')" val="hr"/>
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.applicationMetod') }}
        </div>
        <div class="col-4 q-pl-sm">

          <q-select outlined dense :options="applicationMethodOption" v-model="applicantData['method']"
            bg-color="white" emit-value map-options />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.sex') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-radio v-model="applicantData['gender']" :label="$t('applicant.add.male')" val="male"/>
          <q-radio v-model="applicantData['gender']" :label="$t('applicant.add.female')" val="female"/>
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.phone') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input outlined dense v-model="applicantData['phone']" />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.dob') }}
        </div>
        <div class="col-4 q-pl-sm">
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
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.email') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input dense outlined bg-color="white" v-model="applicantData['email']" />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('client.add.longitude') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input
            outlined
            dense
            v-model="applicantData['lon']"
            :placeholder="$t('client.add.latitudeLabel')"
          />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('client.add.latitude') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input
            outlined
            dense
            v-model="applicantData['lat']"
            :placeholder="$t('client.add.latitudeLabel')"
          />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.postCode') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input outlined dense v-model="applicantData['postCode']" bg-color="white" />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.prefecture') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-select outlined dense :options="prefectureOption" v-model="applicantData['prefecture']"
            bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.street') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input outlined dense v-model="applicantData['street']" bg-color="white" />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.apartment') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input outlined dense v-model="applicantData['apartment']" bg-color="white" />
        </div>
      </div>
    </q-form>
  </q-card-section>
  <q-card-section>
    <q-form class="q-pa-md bg-white">
      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.status') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-radio v-model="applicantData['status']" label="OK " val="ok"/>
          <q-radio v-model="applicantData['status']" label="NG" val="ng"/>
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.seductionDay') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input dense outlined bg-color="white" v-model="applicantData['seductionDay']">
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
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.employmentStatus') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-select outlined dense :options="employmentStatusOption" v-model="applicantData['employmentStatus']"
            bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.category') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-select outlined dense :options="classificationOption" v-model="applicantData['classification']"
            bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.add.qualification') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-checkbox v-model="applicantData['qualification']" val="registeredNurse"
            :label="$t('applicant.add.registeredNurse')" />
          <q-checkbox v-model="applicantData['qualification']" val="assistantNurse"
            :label="$t('applicant.add.assistantNurse')" />
          <q-checkbox v-model="applicantData['qualification']" val="newcomer"
            :label="$t('applicant.add.newcomer')" />
          <q-checkbox v-model="applicantData['qualification']" val="careWorker"
            :label="$t('applicant.add.careWorker')" />
        </div>
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.period') }}
        </div>
        <div class="col-4 q-pl-sm self-center">
          <q-input outlined dense v-model="applicantData['period']" bg-color="white" />
        </div>
      </div>

      <div class="row q-pt-sm">
        <div class="col-2 text-right self-center q-pr-sm text-primary">
          {{ $t('applicant.list.info.memo') }}
        </div>
        <div class="col-4 q-pl-sm">
          <q-input outlined dense v-model="applicantData['memo']" bg-color="white" />
        </div>
      </div>

    </q-form>
  </q-card-section>
</q-card>
</template>

<script lang="ts">
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { ref, SetupContext } from 'vue';
import { useI18n } from 'vue-i18n';
import { applicationMethod, employmentStatus } from 'src/shared/constants/Applicant.const';
import { segment } from 'src/shared/constants/Item.const';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';

export default {
  name: 'applicationInfoForm',
  props: {
    applicant: {
      type: Object,
      required: true
    }
  },
  setup(props, context: SetupContext) {
    const loading = ref(false)
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const db = getFirestore();

    const prefectureOption = ref(prefectureList);
    const applicationMethodOption = ref(applicationMethod)
    const employmentStatusOption = ref(employmentStatus)
    const classificationOption = ref(segment)

    const applicantData = ref({
      reqQualification: false
    });
    console.log(props.applicant)

    if (props.applicant) {
      applicantData.value = {...applicantData.value, ...props.applicant}
    }

    return {
      applicantData,
      prefectureOption,
      applicationMethodOption,
      employmentStatusOption,
      classificationOption,

      async save() {
        loading.value = true;
        const data = applicantData.value
        try {
            const boRef = doc(db, 'applicants/'+props.applicant?.id);
            await updateDoc(boRef, {
              updated_at: serverTimestamp(),
              ...data
            })

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      },
      limitDate(date) {
        return date <= new Date().toLocaleDateString('ja-JP')
      },
      closeDialog() {
        context.emit('closeDialog')
      }
    }
  }
}
</script>

<style>

</style>
