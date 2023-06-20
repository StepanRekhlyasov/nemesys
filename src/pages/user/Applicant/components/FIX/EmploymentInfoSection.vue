<template>
  <DropDownEditGroup
      :isEdit="edit.includes('employmentInfo')"
      :label="$t('applicant.list.fixEmployment.employmentInfo')"
      @openEdit="emit('openEdit'); resetData();"
      @closeEdit="emit('closeEdit'); resetData();"
      @onSave="emit('save', 'employmentInfo', data)"
      :isDisabledButton="disableLevel < 3">
    <div class="row q-pb-sm">
      <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.status')" 
        :value="fixData.admissionStatus? 'OK' : 'NG' " valueClass="text-uppercase col-3 q-pl-md">
        <q-checkbox v-model="data['admissionStatus']" label="OK" @click="data['admissionDate'] = ''" :disable="disableLevel < 3"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
        <q-checkbox v-model="data['admissionStatus']" label="NG" class="q-ml-sm" :disable="disableLevel < 3"
          unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary"/>
      </labelField>

      <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.date')" :value="fixData.admissionDate">
        <q-input dense outlined bg-color="white" v-model="data['admissionDate']"  :disable="loading || disableLevel < 3">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['admissionDate']" mask="YYYY/MM/DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </labelField>
    </div>
    

    <template v-if="!data['admissionStatus']">
        <div class="row q-pb-sm">
          <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.offer.reasonNG')" 
          :value="fixData['admissionReason']" valueClass="col-9 q-pl-md">    
            <div class="row">
              <div class="col-9 q-pl-md">
                <q-radio v-model="data['admissionReason']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" />
                <q-radio v-model="data['admissionReason']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" />
                <q-radio v-model="data['admissionReason']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" />
                <q-radio v-model="data['admissionReason']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" />
              </div>
              <div class="col-3">
                <q-select 
                  v-if="data['admissionReason'] && data['admissionReason'] !== 'notCovered'" 
                  v-model="data['admissionReasonDetal']"
                  :disable="loading"
                  :options="statusOptions"                        
                  emit-value map-options dense outlined
                  :label="$t('common.pleaseSelect')" 
                />
              </div>
            </div>
          </labelField>
        </div>
      </template>

    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.reasonNotJoining')" 
        :value="fixData.reasonNotJoining" valueClass="col-9 q-pl-md">
        <q-input dense outlined bg-color="white"
          v-model="data['reasonNotJoining']" :disable="loading || disableLevel < 3" />
      </labelField>
    </div>

    <div class="row q-pb-sm self-center">
      <labelField 
        :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.chargeOfAdmission')"
        :value="usersListOption
          .filter(user => user.value === fixData['chargeOfAdmission'])
          .map(user => user.label).join('')">
        <q-select
          v-model="data['chargeOfAdmission']"
          :disable="loading || disableLevel < 3"
          emit-value map-options dense outlined
          :options="usersListOption" :label="$t('common.pleaseSelect')" />
      </labelField>

      <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.attendant.endDate')" :value="fixData.endDate">
        <q-input dense outlined bg-color="white" v-model="data['endDate']" :disable="loading">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['endDate']" mask="YYYY/MM/DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.memo')" 
        :value="fixData.admissionMemo" value-class="col-9 q-pl-md">
        <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white"
          v-model="data['admissionMemo']" :disable="loading || disableLevel < 3" />
      </labelField>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

import { ApplicantFix, FixEmploymentInfo, selectOptions } from 'src/shared/model'
import { ref, watch } from 'vue';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit']);
const statusOptions = ref<selectOptions[]> ([]);

const data = ref<Partial<FixEmploymentInfo>>({});
resetData();

function resetData() {
  data.value = {
    admissionStatus: props.editData['admissionStatus'] || false,
    admissionDate: props.editData['admissionDate'] || '',
    admissionReason: props.editData['admissionReason'] || '',
    admissionReasonDetal: props.editData['admissionReasonDetal'] || '',
		reasonNotJoining: props.editData['reasonNotJoining'] || '',
    chargeOfAdmission: props.editData['chargeOfAdmission'] || '',
    endDate: props.editData['endDate'] || '',
    admissionMemo: props.editData['admissionMemo'] || '',
  }
}


watch(() => [data.value['admissionReason']], () => {
  if ('admissionStatus' in data.value && data.value['admissionStatus'] == false) {
    switch(data.value['admissionReason']){
      case('notApplicable'):
        statusOptions.value = notApplicableFixList;
      break;
      case('decided'):
        statusOptions.value = decidedFixList;
      break;
      case('notCovered'):
        statusOptions.value = [];
      break;
      case('registrationDeclined'):
        statusOptions.value = registrationDeclinedFixList;
      break;
    }
    data.value['admissionReasonDetal'] = '';
  }
}, {deep: true, immediate: true}) 


watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 
</script>

<style>

</style>