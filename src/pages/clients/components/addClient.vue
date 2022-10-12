<template>
  <q-card style="width: 1000px; max-width: 80vw">
    <q-card-section class="row q-pb-sm q-pt-sm">
      <div class="text-h6">{{ $t('client.add.newReg') }} </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />
    <q-form class="q-gutter-none" @submit="addClient">
      <q-card-section class="q-pa-none q-pt-sm scroll" style="max-height: 80vh">

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="clientData['name']" :placeholder="$t('client.add.clientLabel')"
                lazy-rules :rules="[(val) => (val && val.length > 0) || '']" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientBasicInfo') }}
              </q-item-label>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    TEL
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['tel']" :placeholder="$t('client.add.phoneLabel')" />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-item-label class="q-pb-xs">
                    FAX
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['fax']" :placeholder="$t('client.add.phoneLabel')" />
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{$t('client.add.email') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['office_mailaddress']"
                    :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm">
                </div>
              </div>

              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs">
                    {{$t('client.add.manager') }}
                  </q-item-label>
                  <q-input outlined dense v-model="clientData['manager']"
                    :placeholder="$t('client.add.managerLabel')" />
                </div>
                <div class="col-6 q-pl-sm">
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.jobType') }}
              </q-item-label>
              <div>
                <q-checkbox v-model="clientData['nursing']" dense :label="$t('client.add.nurse')" val="nurse" />
                <q-checkbox v-model="clientData['nursing']" dense :label="$t('client.add.nursing')" class="q-ml-md"
                  val="nursing" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">{{
              $t('client.add.copInfo')
              }}</q-item-label>
              <q-input outlined dense type="textarea" v-model="clientData['coperationInfo']" rows="3" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pt-sm q-pb-xs text-weight-bolder">{{$t('client.add.longLatInfo') }}
              </q-item-label>
              <q-checkbox class="q-ml-none" size="xs" v-model="clientData['cal_from_office_info']"
                :label="$t('client.add.calOfficeInfo')" />

              <div class="row q-mt-sm">
                <div class="col-6 q-pr-sm">
                  <q-item-label class="q-pb-xs"> {{$t('client.add.longitude') }}</q-item-label>
                  <q-input outlined dense type="number" v-model.number="clientData['lon']"
                    :placeholder="$t('client.add.latitudeLabel')" />
                </div>
                <div class="col-6 q-pl-sm ">
                  <q-item-label class="q-pb-xs"> {{$t('client.add.latitude') }}</q-item-label>
                  <q-input outlined dense type="number" v-model.number="clientData['lat']"
                    :placeholder="$t('client.add.latitudeLabel')" />
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pt-sm q-pb-xs text-weight-bolder">{{$t('client.add.contractUnit') }}
              </q-item-label>
              <div class="row">
                <q-radio class="q-ma-none " dense v-model="clientData['contractUnit']" checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye" val="corporateBatch" :label="$t('client.add.corporateBatch')" />
                <q-radio class="q-ma-sm" dense v-model="clientData['contractUnit']" checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye" val="businessOffice" :label="$t('client.add.businessOffice')" />
              </div>
            </q-item-section>
          </q-item>



        </q-list>

      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-white text-teal col-auto">
        <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
        <q-btn color="primary" :label="$t('client.add.addClientButton')" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { ref, SetupContext } from 'vue'; //ref,
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';

export default {
  name: 'addClient',

  setup(props: object, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const db = getFirestore();
    const clientData = ref({ nursing: [], cal_from_office_info: false });


    const addClient = async () => {
      let data = clientData.value;
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      const clientRef = collection(db, 'clients/');
      await addDoc(clientRef, data);
      context.emit('closeDialog')
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: t('success'),
      });
    };


    return {
      clientData,

      addClient,
    }
  }
}
</script>
