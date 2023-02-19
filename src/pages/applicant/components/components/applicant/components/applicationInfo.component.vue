<template>
  <q-form @submit="save">
    <div class="row q-pb-md justify-between">
      <div class="flex self-center">
        <span class="text-primary text-h6">{{ $t('applicant.list.info.application') }}</span>
        <div>
          <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
            class="text-grey-9" @click="show = false" v-if="show" />
          <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
            class="text-grey-9" @click="show = true" v-else />
        </div>
      </div>
      <div class="col-3 text-right" v-if="show">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" />
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" type="submit"/>
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" />
      </div>
    </div>
    <template v-if="show">
      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.date') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.applicationDate || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" v-model="data['applicationDate']">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm">
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
                  <q-time v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.name') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.name || ''}}</span>
          <q-input  v-if="edit" dense outlined bg-color="white" v-model="data['name']" />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.media') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.media? applicant.media == 'hr' && $t('applicant.add.hr') || 'indeed' : ''}}</span>
          <template v-if="edit">
            <q-radio v-model="data['media']" label="indeed" val="indeed"/>
            <q-radio v-model="data['media']" :label="$t('applicant.add.hr')" val="hr"/>
          </template>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.kana') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.name || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" v-model="data['kana']" />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.apply') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.applicationDate || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" v-model="data['applicationDate']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['applicationDate']" default-view="Years" :options="limitDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.gender') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.sex || ''}}</span>
          <template  v-if="edit" >
            <q-radio v-model="data['sex']" :label="$t('applicant.add.male')" val="male"/>
            <q-radio v-model="data['sex']" :label="$t('applicant.add.female')" val="female"/>
          </template>
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.tel') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.phone || ''}}</span>
          <q-input v-if="edit" outlined dense v-model="data['phone']" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.birth') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.dob || ''}}</span>
          <q-input v-if="edit"  dense outlined bg-color="white" v-model="data['dob']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['dob']" default-view="Years" :options="limitDate">
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

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.email') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.email || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" v-model="data['email']" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.lon') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.lon || ''}}</span>
          <q-input
            v-if="edit"
            outlined
            dense
            v-model="data['lon']"
            :placeholder="$t('client.add.latitudeLabel')"
          />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.postCode') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.postCode || ''}}</span>
          <q-input v-if="edit" outlined dense v-model="data['postCode']" bg-color="white" />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.lat') }}
        </div>
        <div class="col-3 q-pl-md blue">
          <span v-if="!edit">{{ applicant.lat || ''}}</span>
          <q-input
            v-if="edit"
            outlined
            dense
            v-model="data['lat']"
            :placeholder="$t('client.add.latitudeLabel')"
          />
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.addres') }}
        </div>
        <div class="col-9 q-pa-sm">
          <span v-if="!edit">{{ applicant.addres || ''}}</span>
          <q-input v-if="edit" outlined dense v-model="data['addres']" />
        </div>
      </div>
    </template>
  </q-form>
</template>
<script lang="ts">
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { applicationMethod, employmentStatus } from 'src/shared/constants/Applicant.const';

export default {
  name: 'ApplicantInformationComponent',
  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const edit = ref(false);
    const show = ref(false);
    const loading = ref(false);
    const applicationMethodOption = ref(applicationMethod)
    const employmentStatusOption = ref(employmentStatus)
    const data = ref( {
      applicationDate: props?.applicant['applicationDate'] || '',
      name: props?.applicant['name'] || '',
      media: props?.applicant['media'] || '',
      kana: props?.applicant['kana'] || '',
      apply: props?.applicant['apply'] || '',
      sex: props?.applicant['sex'] || '',
      dob: props?.applicant['dob'] || '',
      phone: props?.applicant['phone'] || '',
      email: props?.applicant['email'] || '',
      lon: props?.applicant['lon'] || '',
      lat: props?.applicant['lat'] || '',
      postCode: props?.applicant['postCode'] || '',
    })
    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();
    return {
      edit,
      show,
      loading,
      data,
      applicationMethodOption,
      employmentStatusOption,

      async save() {
        loading.value = true
        try {
          await props.updateApplicant(data.value);
          Alert.success($q, t);
          edit.value = false;
        } catch (error) {
          console.log(error);
          loading.value = false;
          Alert.warning($q, t);
        }
        loading.value = false
      },
      limitDate(date) {
        return date <= new Date().toLocaleDateString('ja-JP')
      },
    }
  }

}
</script>

<style>

</style>
