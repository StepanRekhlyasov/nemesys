<template>
  <DropDownEditGroup
  :isEdit="edit"
  :label="'4.'+ $t('applicant.attendant.assignedEvaluation')"
  @openEdit="edit = true"
  @closeEdit="edit=false; resetData();"
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
        <span>{{ staffRank}}</span>
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
        <span v-if="!edit" class="text_dots">{{ applicant.remarks}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['remarks']" :disable="loading" />
      </div>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { expertiseLevelList } from 'src/shared/constants/Applicant.const';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { useApplicant } from 'src/stores/applicant';
import { Applicant, ApplicantInputs } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant
}>();
const applicantStore = useApplicant();
const staffRank = computed(() => props.applicant['staffRank'] && RankCount.getRank(props.applicant['staffRank']))
const edit = ref(false);
const expertiseLevelOptions = ref(expertiseLevelList)
const loading = ref(false);
const defaultData = ref<Partial<ApplicantInputs>>({})
const data = ref<Partial<ApplicantInputs>>({})

function resetData() {
  defaultData.value = {
    language: props?.applicant['language'],
    staffRank: props?.applicant['staffRank'],
    comprehension: props?.applicant['comprehension'],
    remarks: props?.applicant['remarks']
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData()

async function save() {
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    edit.value = false;
    Alert.success()
  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}
</script>
