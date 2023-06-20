<template>
    <DropDownEditGroup
      :isEdit="edit.includes('jobOffersInfo')"
      :label="$t('applicant.list.fixEmployment.jobOffersInfo')"
      @openEdit="emit('openEdit')"
      @closeEdit="emit('closeEdit')"
      @onSave="emit('save', 'jobOffersInfo', data)"
      :isDisabledButton="disableLevel < 2">

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.status')" 
          :value="fixData.offerStatus? 'OK' : 'NG' " valueClass="text-uppercase col-3  q-pl-md">
          <q-checkbox v-model="data['offerStatus']" label="OK" @click="emit('disableChange');data['offerDate'] = '';"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 2"/>
          <q-checkbox v-model="data['offerStatus']" label="NG" class="q-ml-sm" @click="emit('disableChange')"
            unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 2"/>
        </labelField>

        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.date')" :value="fixData.offerDate" >
          <q-input dense outlined bg-color="white" v-model="data['offerDate']"  :disable="loading || disableLevel < 2">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['offerDate']" mask="YYYY/MM/DD">
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

      <template v-if="!data['offerStatus']">
        <div class="row q-pb-sm">
          <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.reasonNG')" 
          :value="fixData.offerReasonNG" valueClass="col-9 q-pl-md">    
            <div class="row">
              <div class="col-9 q-pl-md">
                <q-radio v-model="data['offerReason']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" />
                <q-radio v-model="data['offerReason']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" />
                <q-radio v-model="data['offerReason']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" />
                <q-radio v-model="data['offerReason']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" />
              </div>
              <div class="col-3">
                <q-select 
                  v-if="data['offerReason'] && data['offerReason'] !== 'notCovered'" 
                  v-model="data['offerReasonDetal']"
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
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.chargeOfOffer')"
          :value="usersListOption
            .filter(user => user.value === fixData['chargeOfOffer'])
            .map(user => user.label).join('')"
          valueClass="col-9 q-pl-md">
          <q-select
            v-model="data['chargeOfOffer']"
            :disable="loading || disableLevel < 2"
            emit-value map-options dense outlined
            :options="usersListOption" :label="$t('common.pleaseSelect')" />
        </labelField>
      </div>

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.memo')" 
          :value="fixData.offerMemo" valueClass="col-9 q-pl-md">
          <q-input  dense outlined bg-color="white"
            v-model="data['offerMemo']" :disable="loading || disableLevel < 2" />
        </labelField>
      </div>
    </DropDownEditGroup>  
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

import { ApplicantFix, FixJobOffersInfo, selectOptions } from 'src/shared/model'
import { ref, watch } from 'vue';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])
const data = ref<Partial<FixJobOffersInfo>>({})
const statusOptions = ref<selectOptions[]> ([]);

resetData();

function resetData(){
  data.value = {
    offerStatus: props.editData['offerStatus'] || false,
    offerDate: props.editData['offerDate'] || '',
    offerReasonNG: props.editData['offerReason'] || '',
    offerReasonDetal: props.editData['offerReasonDetal'] || '',
    chargeOfOffer: props.editData['chargeOfOffer'] || '',
    offerMemo: props.editData['offerMemo'] || '',
  }
}


watch(() => [data.value['offerReason']], () => {
  if ('offerStatus' in data.value && data.value['offerStatus'] == false) {
    switch(data.value['offerReason']){
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
    data.value['offerReasonDetal'] = '';
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