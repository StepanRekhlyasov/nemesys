<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-form class="q-gutter-none" ref="officeForm">
      <q-card-section class="q-pa-none q-pt-sm scroll">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t('client.add.officeName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="officeData['name']" :placeholder="$t('client.add.clientLabel')"
                lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.parentClientName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="officeData['client_name']" :placeholder="$t('client.add.clientLabel')"
                lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.address') }}
              </q-item-label>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.prefectures') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['prefecture']"
                    :placeholder="$t('client.add.prefectureLabel')" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.municipalities') }} 
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['municipality']"
                    :placeholder="$t('client.add.municipalitieLabel')" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('applicant.add.street') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['street']" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">{{ $t('client.add.addressBuildingName') }}</q-item-label>
                  <q-input outlined dense v-model="officeData['building']" />
                </div>
              </div>

              <div class="row q-mt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs"> 
                    {{ $t('client.add.longitude') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense type="number" v-model.number="officeData['lon']"
                    :placeholder="$t('client.add.latitudeLabel')" step="any" lazy-rules
                    :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm ">
                  <q-item-label class="q-pb-xs"> 
                    {{ $t('client.add.latitude') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense type="number" v-model.number="officeData['lat']"
                    :placeholder="$t('client.add.latitudeLabel')" step="any" lazy-rules
                    :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.officeInfo') }}
              </q-item-label>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    TEL
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['tel']" :placeholder="$t('client.add.phoneLabel')"
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    FAX
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['fax']" :placeholder="$t('client.add.phoneLabel')"
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.email') }}
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['mailaddress']"
                    :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm q-pt-lg">
                  <q-checkbox size="xs" v-model="officeData['flg_faxng']"
                    :label="$t('client.add.faxReceptionNG')" />
                </div>
              </div>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.homePage') }}
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['homePage']" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.numberEmployees') }}
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['numberEmployees']" />

                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-checkbox size="xs" v-model="officeData['conclusionDispatchContract']"
                    :label="$t('client.add.conclusionDispatchContract')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-checkbox size="xs" v-model="officeData['conclusionReferralContract']"
                    :label="$t('client.add.conclusionReferralContract')" />
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <div class="q-gutter-sm">
              <q-item-label class="q-pb-xs">{{
                $t('client.add.facilityType')
              }}</q-item-label>
              <q-checkbox size="xs" v-model="officeData['facilityType']" :val="option.value" :label="option.name"
                v-for="option in facilityOp" :key="option.value" />
            </div>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">{{
                $t('client.add.contactInfo')
              }}</q-item-label>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.personIncharge') }}
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['personIncharge']"
                    :placeholder="$t('client.add.managerLabel')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.personInChargeTel') }}
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['personInChargeTel']"
                    :placeholder="$t('client.add.phoneLabel')" />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.personIncharge') }} : MAIL
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['personInchargeMail']"
                    :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.personIncharge') }} : FAX
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['personInchargeFax']"
                    :placeholder="$t('client.add.phoneLabel')" />
                </div>
              </div>
            </q-item-section>
          </q-item>





        </q-list>

      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { ref, SetupContext } from 'vue'; //ref,
import { useQuasar, QForm } from 'quasar';
import { useI18n } from 'vue-i18n';
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';
import { facilityList } from 'src/shared/constants/Organization.const';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'addOffice',

  setup(props: object, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const db = getFirestore();
    const officeDataSample = { facilityType: [], conclusionDispatchContract: false, conclusionReferralContract: false, flg_faxng: false }
    const officeData = ref(JSON.parse(JSON.stringify(officeDataSample)));
    const facilityOp = facilityList;

    const officeForm = ref<QForm | null>(null);


    const addOffice = async () => {
      let data = JSON.parse(JSON.stringify(officeData.value));
      if (!data['name']) {
        Alert.warning($q, t)
        return false
      }
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      const officeRef = collection(db, 'office/');
      const docRef = await addDoc(officeRef, data);
      
      data['name'] = data['client_name'];
      delete data['client_name'];
      data['headquarter'] = true;
      data['nursing'] = [];
      data['office'] = docRef.id;
      const clientRef = collection(db, 'office/' + docRef.id + '/clients/');
      await addDoc(clientRef, data);

      context.emit('closeDialog')
      officeData.value = JSON.parse(JSON.stringify(officeDataSample));
      officeForm.value?.resetValidation();

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: t('success'),
      });
    };


    return {
      officeData,
      facilityOp,
      officeForm,

      addOffice,

      validate() {
        officeForm.value?.validate().then(success => {
          if (success) {
            addOffice()
          }
          else {
            Alert.warning($q, t);
          }
        })
      }


    }
  }
}
</script>
