<template>
  <div class="text-caption text-weight-medium">
    <div class="row q-pt-md q-pl-md">
      <div
        v-html="$t('menu.clientReg')"
        class="text-h5 text-weight-bolder"
      ></div>
    </div>
    <q-card class="q-ma-md">
      <q-form
        ref="clientForm"
        @submit="onSubmit"
        @reset="onReset"
        class="q-pa-md"
      >
        <div class="row full-width">
          <div class="col-6">
            <div class="row q-pt-sm">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.clientName') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['name']"
                  :placeholder="$t('client.add.clientLabel')"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.updatingFax') }}
              </div>
              <div class="col-8 q-pl-sm">
                <q-checkbox
                  v-model="clientData['flg_fax_updating']"
                  dense
                  :label="$t('client.add.updatingFax')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.faxReceptionNGTemp') }}
              </div>
              <div class="col-8 q-pt-xs q-pl-sm">
                <div class="row">
                  <div class="col-6 q-pt-xs">
                    <q-checkbox
                      v-model="clientData['flg_faxng_60']"
                      dense
                      :label="$t('client.add.faxReceptionNGTemp')"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="clientData['date_checkout_60']"
                      outlined
                      dense
                      mask="date"
                      :label="$t('client.add.cancelDate')"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="clientData['date_checkout_60']"
                              :locale="$i18n.locale"
                              minimal
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.faxReceptionNG') }}
              </div>
              <div class="col-8 q-pt-xs q-pl-sm">
                <q-checkbox
                  v-model="clientData['flg_faxng']"
                  dense
                  :label="$t('client.add.faxReceptionNG')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.pharmacistClient') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-checkbox
                  v-model="clientData['flg_pharmacist']"
                  dense
                  :label="$t('client.add.pharmacistClient')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-md q-pl-sm bg-indigo-1">
                {{ $t('client.add.clientType') }}
              </div>
              <div class="col-8 q-pt-md q-pl-sm">
                <div class="row">
                  <div class="col-6">
                    <q-checkbox
                      v-model="clientData['flg_nurse']"
                      dense
                      :label="$t('client.add.nurse')"
                    />
                  </div>
                  <div class="col-6">
                    <q-checkbox
                      v-model="clientData['flg_nursing']"
                      dense
                      :label="$t('client.add.nursing')"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.clientRepresentative') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['client_user_name']"
                  :placeholder="$t('client.add.clientRepLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.phoneNumber') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['tel']"
                  :placeholder="$t('client.add.phoneLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.faxNumber') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['fax']"
                  :placeholder="$t('client.add.phoneLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.email') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['mailaddress']"
                  :placeholder="
                    $t('client.add.emailLabel1') +
                    '@' +
                    $t('client.add.emailLabel2')
                  "
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.address') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['address1']"
                  :placeholder="$t('client.add.addressLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.latitude') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['lat']"
                  :placeholder="$t('client.add.latitudeLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.longitude') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  v-model="clientData['lon']"
                  :placeholder="$t('client.add.latitudeLabel')"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-pt-sm q-pl-sm bg-indigo-1">
                {{ $t('client.add.memo') }}
              </div>
              <div class="col-8 q-pt-sm q-pl-sm">
                <q-input
                  outlined
                  dense
                  type="textarea"
                  v-model="clientData['note']"
                  :placeholder="$t('client.add.memoLabel')"
                />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div
              class="q-pt-xs q-ml-sm q-mr-sm"
              v-for="item in repeatItem"
              :key="item.name"
            >
              <div class="row">
                <div
                  class="col-12 text-subtitle2 text-weight-bold q-pt-sm q-pl-md"
                  :class="item.color"
                >
                  {{ item.name }}
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pt-xs q-pl-md" :class="item.color">
                  {{ $t('client.add.priorityFlag') }}
                </div>
                <div class="col-9 q-pt-xs q-pl-sm">
                  <q-checkbox
                    v-model="clientData[item['key'] + '_priority_flag']"
                    dense
                    :label="$t('client.add.priorityFlagLabel')"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pt-md q-pl-md" :class="item.color">
                  {{ $t('client.add.phoneNumber') }}
                </div>
                <div class="col-9 q-pt-xs q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="clientData[item['key'] + '_tel']"
                    :placeholder="$t('client.add.phoneLabel')"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pt-md q-pl-md" :class="item.color">
                  {{ $t('client.add.faxNumber') }}
                </div>
                <div class="col-9 q-pt-xs q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="clientData[item['key'] + '_fax']"
                    :placeholder="$t('client.add.phoneLabel')"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pt-md q-pl-md" :class="item.color">
                  {{ $t('client.add.email') }}
                </div>
                <div class="col-9 q-pt-xs q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="clientData[item['key'] + '_mailaddress']"
                    :placeholder="
                      $t('client.add.emailLabel1') +
                      '@' +
                      $t('client.add.emailLabel2')
                    "
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pt-md q-pl-md" :class="item.color">
                  {{ $t('client.add.manager') }}
                </div>
                <div class="col-9 q-pt-xs q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="clientData[item['key'] + '_user_name']"
                    :placeholder="$t('client.add.managerLabel')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="q-pt-sm">
          <q-btn :label="$t('common.submit')" type="submit" color="primary" />
          <q-btn
            :label="$t('common.reset')"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
//import { doc, setDoc, getFirestore, serverTimestamp, getDoc, addDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'clientAdd',
  setup() {
    const { t } = useI18n({
      useScope: 'global',
    });
    const db = getFirestore();
    const clientDataSample = {
      office_priority_flag: false,
      contract_priority_flag: false,
      prsheet_priority_flag: false,
      flg_fax_updating: false,
      flg_faxng_60: false,
      flg_faxng: false,
      flg_pharmacist: false,
      flg_nurse: false,
      flg_nursing: false,
    };
    const clientData = ref(JSON.parse(JSON.stringify(clientDataSample)));

    const accept = ref(false);
    const clientForm = ref(null);

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
      clientData,
      accept,
      repeatItem,
      clientForm,

      async onSubmit() {
        let data = clientData.value;
        data['created_at'] = serverTimestamp();
        data['updated_at'] = serverTimestamp();
        data['deleted'] = false;

        try {
          const docRef = await addDoc(
            collection(db, 'clients'),
            clientData.value
          );
          console.log('Document written with ID: ', docRef.id);

          Alert.success()
          clientData.value = JSON.parse(JSON.stringify(clientDataSample));
          //clientForm.value.resetValidation();
        } catch (error) {
          console.log(error);
          Alert.warning(error)
        }
      },

      onReset() {
        clientData.value = JSON.parse(JSON.stringify(clientDataSample));
        //clientForm.value.resetValidation();
      },
    };
  },
};
</script>
