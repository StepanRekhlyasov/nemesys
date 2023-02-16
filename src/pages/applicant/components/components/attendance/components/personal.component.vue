<template>
  <q-form @submit="save">
    <div class="row q-pb-md justify-between">
      <div class="flex self-center">
        <span class="text-primary text-h6">3.{{ $t('applicant.attendant.personal') }}</span>
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
        {{ $t('applicant.attendant.smoking') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.smoking?$t('smoking.'+applicant.smoking):''}}</span>
        <q-select v-if="edit" outlined dense :options="smokingStatusOptions"
          emit-value map-options v-model="data['smoking']" :disable="loading"/>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.tattoos') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.tattoos?$t('tattoos.'+applicant.tattoos):''}}</span>
        <q-select v-if="edit" outlined dense :options="tattoosOptions"
          emit-value map-options v-model="data['tattoos']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.marriedStatus') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.marriedStatus?$t('marriedStatus.'+applicant.marriedStatus):''}}</span>
        <q-select v-if="edit" outlined dense :options="marriedOptions"
          emit-value map-options v-model="data['marriedStatus']" :disable="loading"/>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.liveTogether') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.liveTogether?$t('tattoos.'+applicant.liveTogether):''}}</span>
        <q-select v-if="edit" outlined dense :options="tattoosOptions"
          emit-value map-options v-model="data['liveTogether']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.cohabitation') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.cohabitation || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['cohabitation']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.children') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.children || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['children']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.medicalHistory') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.medicalHistory || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['medicalHistory']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.vaccinationStatus') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.vaccinationStatus || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['vaccinationStatus']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.startCaring') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.startCaring || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['startCaring']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.interviewsWaitingList') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.interviewsWaitingList? applicant.interviewsWaitingList+' '+$t('applicant.attendant.items') : ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['interviewsWaitingList']" :disable="loading" type="number"/>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.temporaryCompaniesRegistered') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.temporaryCompaniesRegistered? applicant.temporaryCompaniesRegistered+' '+$t('applicant.attendant.items') : ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['temporaryCompaniesRegistered']" :disable="loading" type="number" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.startedInCaregiving') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.startedInCaregiving || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['startedInCaregiving']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.daysVisitAtWork') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.daysVisitAtWork || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['daysVisitAtWork']" :disable="loading" />
      </div>
    </div>

    </template>
  </q-form>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { marriedStatusList, smokingStatusList, tattoosStatusList } from 'src/shared/constants/Applicant.const';

export default {
  name: 'personalStatusComponent',
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
    const smokingStatusOptions = ref(smokingStatusList)
    const marriedOptions = ref(marriedStatusList)
    const tattoosOptions = ref(tattoosStatusList)

    const data = ref( {
      smoking: props?.applicant['smoking'] || '',
      tattoos: props?.applicant['tattoos'] || '',
      marriedStatus: props?.applicant['marriedStatus'] || '',
      liveTogether: props?.applicant['marriedStatus'] || '',
      cohabitation: props?.applicant['cohabitation'] || '',
      children: props?.applicant['children'] || '',
      medicalHistory: props?.applicant['medicalHistory'] || '',
      vaccinationStatus: props?.applicant['vaccinationStatus'] || '',
      startCaring: props?.applicant['startCaring'] || '',
      interviewsWaitingList: props?.applicant['interviewsWaitingList'] || '',
      temporaryCompaniesRegistered: props?.applicant['temporaryCompaniesRegistered'] || '',
      startedInCaregiving: props?.applicant['startedInCaregiving'] || '',
      daysVisitAtWork: props?.applicant['daysVisitAtWork'] || '',
    })

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();

    return {
      edit,
      show,
      data,
      loading,

      smokingStatusOptions,
      marriedOptions,
      tattoosOptions,

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
      }
    }
  }
}
</script>

<style>

</style>
