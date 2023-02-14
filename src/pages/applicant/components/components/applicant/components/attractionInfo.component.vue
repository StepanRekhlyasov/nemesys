<template>
  <q-form @submit="save">
    <div class="row q-pb-md justify-between">
      <div class="flex self-center">
        <span class="text-primary text-h6">{{ $t('applicant.list.info.attraction') }}</span>
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
          {{ $t('applicant.list.info.attractionsStatus') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant?.attractionsStatus || ''}}</span>
          <template v-if="edit">
            <q-radio v-model="data['attractionsStatus']" label="OK " val="ok"/>
            <q-radio v-model="data['attractionsStatus']" label="NG" val="ng"/>
          </template>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.seductionDay') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.seductionDay || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" v-model="data['seductionDay']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['seductionDay']" default-view="Years" :options="limitDate">
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
          {{ $t('applicant.list.info.employmentStatus') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.employmentStatus? $t('applicant.list.info.'+applicant.employmentStatus): ''}}</span>
          <q-select v-if="edit" outlined dense :options="employmentStatusOption" v-model="data['employmentStatus']"
            bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.seduser') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.seduser || ''}}</span>
        </div>
      </div>

       <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.classiffication') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.classiffication || ''}}</span>
          <q-select v-if="edit" outlined dense :options="classificationOption" v-model="data['classification']"
            bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.position') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.position || ''}}</span>
        </div>
      </div>

       <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.qualifications') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.qualification? applicant.qualification.map(applic => $t('applicant.add.'+applic)).join(', ') :''}}</span>
          <template v-if="edit">
            <q-checkbox v-model="data['qualification']" val="registeredNurse"
              :label="$t('applicant.add.registeredNurse')" />
            <q-checkbox v-model="data['qualification']" val="assistantNurse"
              :label="$t('applicant.add.assistantNurse')" />
            <q-checkbox v-model="data['qualification']" val="newcomer"
              :label="$t('applicant.add.newcomer')" />
            <q-checkbox v-model="data['qualification']" val="careWorker"
              :label="$t('applicant.add.careWorker')" />
          </template>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.period') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.period || ''}}</span>
        </div>
      </div>

       <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.memo') }}
        </div>
        <div class="col-9 q-pa-sm blue text-bold">
          <span v-if="!edit">{{ applicant.addres || ''}}</span>
          <q-input v-if="edit" outlined dense v-model="data['memo']" bg-color="white" />
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
import { employmentStatus } from 'src/shared/constants/Applicant.const';
import { segment } from 'src/shared/constants/Item.const';

export default {
  name: 'attractionInformationComponent',
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
    const employmentStatusOption = ref(employmentStatus);
    const classificationOption = ref(segment);
    const data = ref({
      attractionsStatus: props?.applicant['attractionsStatus'] || '',
      seductionDay: props?.applicant['seductionDay'] || '',
      employmentStatus: props?.applicant['employmentStatus'] || '',
      seduser: props?.applicant['seduser'] || '',
      classification: props?.applicant['classification'] || '',
      position: props?.applicant['position'] || '',
      qualification: props?.applicant['qualification'] || [],
      period: props?.applicant['period'] || '',
      memo: props?.applicant['memo'] || '',
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
      employmentStatusOption,
      classificationOption,

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
