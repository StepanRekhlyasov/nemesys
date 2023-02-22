<template>
  <q-form @submit="save">
    <div class="row q-pb-md justify-between">
      <div class="flex self-center">
        <span class="text-primary text-h6">4.{{ $t('applicant.attendant.assignedEvaluation') }}</span>
        <div>
          <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
            class="text-grey-9" @click="show = false" v-if="show" />
          <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
            class="text-grey-9" @click="show = true" v-else />
        </div>
      </div>
      <div class="col-3 text-right" v-if="show">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" type="submit" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm"/>
      </div>
    </div>
    <template v-if="show">
      <div class="row q-pa-sm ">
        <span class="col-3 text-blue text-weight-regular self-center text-subtitle1">[{{ $t('applicant.attendant.attendeeEvaluation') }}]</span>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.language') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.language?$t('applicant.attendant.'+applicant.language):''}}</span>
          <q-select v-if="edit" outlined dense :options="expertiseLevelOptions"
            emit-value map-options v-model="data['language']" :disable="loading"/>
        </div>
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.comprehension') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.comprehension?$t('applicant.attendant.'+applicant.comprehension):''}}</span>
          <q-select v-if="edit" outlined dense :options="expertiseLevelOptions"
            emit-value map-options v-model="data['comprehension']" :disable="loading"/>
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.staffRank') }}
        </div>
        <div class="col-3 q-pl-md blue ">
          <span v-if="!edit">{{ applicant.staffRank || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['staffRank']" :disable="loading" />
        </div>
      </div>

      <div class="row q-pa-sm ">
        <span class="col-3 text-blue text-weight-regular self-center text-subtitle1">[{{ $t('applicant.attendant.otherRemarks') }} ]</span>
      </div>

      <div class="row q-pb-sm">
        <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.attendant.remarks') }}
        </div>
        <div class="col-9 q-pl-md blue ">
          <span v-if="!edit" class="text_dots">{{ applicant.remarks || ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white"
            v-model="data['remarks']" :disable="loading" />
        </div>
      </div>


    </template>
  </q-form>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { expertiseLevelList } from 'src/shared/constants/Applicant.const';

export default {
  name: 'assignedEvaluationComponent',
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
    const expertiseLevelOptions = ref(expertiseLevelList)
    const loading = ref(false);
    const data =  computed(() => {
      return {
        language: props?.applicant['language'] || '',
        attendingDate: props?.applicant['attendingDate'] || '',
        staffRank: props?.applicant['staffRank'] || '',
      }
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
      expertiseLevelOptions,

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
