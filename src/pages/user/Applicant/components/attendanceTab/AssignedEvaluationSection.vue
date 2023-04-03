<template>
  <DropDownEditGroup
  :isEdit="edit"
  :label="'4.'+ $t('applicant.attendant.assignedEvaluation')"
  @openEdit="edit = true"
  @closeEdit="edit=false"
  @onSave="save">
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
  </DropDownEditGroup>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { expertiseLevelList } from 'src/shared/constants/Applicant.const';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';

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
  components: {
    DropDownEditGroup
  },
  setup(props) {
    const edit = ref(false);
    const expertiseLevelOptions = ref(expertiseLevelList)
    const loading = ref(false);
    const data =  ref({
      language: props?.applicant['language'] || '',
      attendingDate: props?.applicant['attendingDate'] || '',
      staffRank: props?.applicant['staffRank'] || '',
    })

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();

    return {
      edit,
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
