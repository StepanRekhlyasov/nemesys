<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-form class="q-gutter-none" ref="clientForm">
      <q-card-section class="q-pa-none q-pt-sm scroll">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t('client.add.officeName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-select outlined v-model="clientData['office']" :options="officeList" dense emit-value map-options
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="clientData['name']" :placeholder="$t('client.add.clientLabel')"
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
                  <q-input outlined dense v-model="clientData['prefecture']"
                    :placeholder="$t('client.add.prefectureLabel')" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.municipalities') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['municipality']"
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
                  <q-input outlined dense v-model="clientData['street']" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">{{ $t('client.add.addressBuildingName') }}</q-item-label>
                  <q-input outlined dense v-model="clientData['building']" />
                </div>
              </div>

              <div class="row q-mt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.longitude') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense type="number" v-model.number="clientData['lon']"
                    :placeholder="$t('client.add.latitudeLabel')" step="any" lazy-rules
                    :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm ">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.latitude') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense type="number" v-model.number="clientData['lat']"
                    :placeholder="$t('client.add.latitudeLabel')" step="any" lazy-rules
                    :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('office.clientInformation') }}
              </q-item-label>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.representativeName') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['representativeName']"
                    :placeholder="$t('client.add.managerLabel')" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.established') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['established']" placeholder="2000-07" />
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.capital') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['capital']" placeholder="1,000,000" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.earnings') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['earnings']" placeholder="1,000,000" />
                </div>
              </div>

              <div class="row">
                <div class="col-12 q-pt-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.companyProfile') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['companyProfile']" />
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientType') }}
              </q-item-label>
              <div class="row q-pt-sm">
                <q-checkbox size="xs" v-model="clientData['nursing']" :label="$t('client.add.nurse')" val="nurse" />
                <q-checkbox size="xs" v-model="clientData['nursing']" :label="$t('client.add.nursing')" class="q-ml-md"
                  val="nursing" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <div class="q-gutter-sm">
              <q-item-label class="q-pb-xs">{{
                $t('client.add.facilityType')
              }}</q-item-label>
              <q-checkbox size="xs" v-model="clientData['facilityType']" :val="option.value" :label="option.name"
                v-for="option in facilityOp" :key="option.value" />
            </div>
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
                  <q-input outlined dense v-model="clientData['tel']" :placeholder="$t('client.add.phoneLabel')"
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    FAX
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['fax']" :placeholder="$t('client.add.phoneLabel')"
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.email') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['mailaddress']"
                    :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm q-pt-lg">
                  <q-checkbox size="xs" v-model="clientData['flg_faxng']" :label="$t('client.add.faxReceptionNG')" />
                </div>
              </div>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.homePage') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['homePage']" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('office.numberEmployees') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['numberEmployees']" />

                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-checkbox size="xs" v-model="clientData['conclusionDispatchContract']"
                    :label="$t('client.add.conclusionDispatchContract')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-checkbox size="xs" v-model="clientData['conclusionReferralContract']"
                    :label="$t('client.add.conclusionReferralContract')" />
                </div>
              </div>

            </q-item-section>
          </q-item>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">{{
                $t('office.contractInfo')
              }}</q-item-label>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.contractUnit') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['contractUnit']" />
                </div>
                <div class="col-6 q-pl-sm q-pt-lg">
                  <q-checkbox size="xs" v-model="clientData['conclusionContract']"
                    :label="$t('client.list.presenceContract')" />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.contractor') }} : TEL
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['personInChargeTel']"
                    :placeholder="$t('client.add.phoneLabel')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.contractor') }} : FAX
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['personInchargeFax']"
                    :placeholder="$t('client.add.phoneLabel')" />
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.contractor') }} : MAIL
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['personInchargeMail']"
                    :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.contractor') }} : {{ $t('client.list.personIncharge') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['personIncharge']"
                    :placeholder="$t('client.add.managerLabel')" />
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
import { addDoc, collection, serverTimestamp, getFirestore, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { facilityList } from 'src/shared/constants/Organization.const';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'addClient',

  setup(props: object, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const db = getFirestore();

    const clientDataSample = { nursing: [], facilityType: [], conclusionDispatchContract: false, conclusionContract: false, conclusionReferralContract: false, flg_faxng: false }
    const clientData = ref(JSON.parse(JSON.stringify(clientDataSample)));
    const facilityOp = facilityList;
    const unsubscribe = ref();
    const officeList = ref([]);
    const clientForm = ref<QForm | null>(null);


    const addClient = async () => {
      let data = clientData.value;
      if (!data['office']) {
        Alert.warning($q, t)
        return false
      }
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      data['headquarter'] = false;
      const clientRef = collection(db, 'office/' + data['office'] + '/clients/');
      await addDoc(clientRef, data);

      context.emit('closeDialog')
      clientData.value = JSON.parse(JSON.stringify(clientDataSample));
      clientForm.value?.resetValidation();

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: t('success'),
      });
    };
    loadOffice();
    function loadOffice() {
      const qOffice = query(collection(db, 'office/'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribe.value = onSnapshot(qOffice, (querySnapshot) => {
        let items: object[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ label: doc.data().name, value: doc.id });
        });
        officeList.value = items as never;
      },
        (error) => {
          console.log(error)
        });
    }


    return {
      clientData,
      facilityOp,
      officeList,

      clientForm,

      addClient,

      validate() {
        clientForm.value?.validate().then(success => {
          if (success) {
            addClient()
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
