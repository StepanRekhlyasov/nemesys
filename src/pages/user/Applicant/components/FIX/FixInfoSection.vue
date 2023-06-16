<template>  
  <DropDownEditGroup
    :isEdit="edit.includes('info')"
    :label="$t('applicant.list.fixEmployment.info')"
    @openEdit="emit('openEdit'); resetData();"
    @closeEdit="emit('closeEdit'); resetData();"
    @onSave="emit('save', 'info', data); resetData();">
    <div class="row q-pb-sm">
      <labelField :label="$t('applicant.list.fixEmployment.status')" :edit="edit.includes('info')" 
        :value="fixData.fixStatus? 'OK' : 'NG' " valueClass="text-uppercase col-3 q-pl-md">
        <q-checkbox v-model="data['fixStatus']" label="OK" @click="data['data'] = '';emit('disableChange')"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
        <q-checkbox v-model="data['fixStatus']" label="NG" class="q-ml-sm" @click="emit('disableChange')" 
          unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary"/>
      </labelField>

      <labelField :label="$t('applicant.list.fixEmployment.date')" :edit="edit.includes('info')" :value="fixData.fixDate">
        <q-input v-if="edit.includes('info')" dense outlined bg-color="white" v-model="data['fixDate']" :disable="loading">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['fixDate']" mask="YYYY/MM/DD">
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
    
    <template v-if="!data['fixStatus']">
      <div class="row q-pb-sm">  
        <labelField 
          :edit="edit.includes('info') " 
          :label="$t('applicant.list.fixEmployment.reason')"
          :value="fixData.reason? $t('applicant.list.fixEmployment.'+fixData.reason) : ''"
          valueClass="col-9 q-pl-md">
          <div class="row">
            <div class="col-9 q-pl-md">
              <q-radio v-model="data['reason']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" />
              <q-radio v-model="data['reason']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" />
              <q-radio v-model="data['reason']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" />
              <q-radio v-model="data['reason']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" />
            </div>
            <div class="col-3">
              <q-select 
                v-if="data['reason'] && data['reason'] !== 'notCovered'" 
                v-model="data['reasonDetal']"
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
        :edit="edit.includes('info')"
        :value="usersListOption
          .filter(user => user.value === fixData['contactPerson'])
          .map(user => user.label).join('')"
        :label="$t('applicant.list.fixEmployment.contactPerson')"
        valueClass="col-9 q-pl-md">  

        <q-select
          v-if="edit.includes('info')"
          v-model="data['contactPerson']"
          :disable="loading"
          emit-value map-options dense outlined
          :options="usersListOption" 
          :label="$t('common.pleaseSelect')" />
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('info')" 
        :label="$t('applicant.list.fixEmployment.memo')" 
        :value="fixData['memo']" valueClass="col-9 q-pl-md">

        <q-input dense outlined bg-color="white"
          v-model="data['memo']" :disable="loading" />
      </labelField>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';

import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';
import { ApplicantFix, selectOptions } from 'src/shared/model';
import { ref, watch } from 'vue';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[]
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])


const data = ref();
const statusOptions = ref<selectOptions[]> ([]);
resetData();

watch(() => [data.value['reason']], () => {
  if ('fixStatus' in data.value && data.value['fixStatus'] == false) {
    switch(data.value['reason']){
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
    data.value['reasonDetal'] = '';
  }
}, {deep: true, immediate: true}) 

watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 

function resetData() {
  data.value = {
    fixStatus: props.editData['fixStatus'] || false,
    fixDate: props.editData['fixDate'] || '',
    reason: props.editData['reason'] || '',
    reasonDetal: props.editData['reasonDetal'] || '',
    contactPerson: props.editData['contactPerson'] || '',
    memo: props.editData['memo'] || '',
  };
}

</script>

<style>

</style>