<template>  
  <DropDownEditGroup
    :isEdit="edit.includes('info')"
    :label="$t('applicant.list.fixEmployment.info')"
    @openEdit="emit('openEdit'); resetData();"
    @closeEdit="emit('closeEdit'); resetData();"
    @onSave="saveHandler()">
    <q-form ref="form">
    <div class="row q-pb-sm">
      <labelField :label="$t('applicant.list.fixEmployment.status')" :edit="edit.includes('info')" 
        :value="fixData[statusKey] === true ? 'OK' : fixData[statusKey] === false ?'NG' : '-'" valueClass="text-uppercase col-3 q-pl-md self-center" required>
        <q-field dense :outlined="false" class="q-pb-none" borderless hide-bottom-space
            v-model="data['fixStatus']" :rules="[() => 'fixStatus' in data || '']">
          <q-checkbox v-model="data['fixStatus']" label="OK" @click="data['data'] = '';emit('disableChange')"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
          <q-checkbox v-model="data['fixStatus']" label="NG" class="q-ml-sm" @click="emit('disableChange')" 
            unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary"/>
        </q-field>
      </labelField>
      <labelField :label="$t('applicant.list.fixEmployment.date')" :edit="edit.includes('info')" :value="fixData.fixDate" required valueClass="col-3 q-pl-md self-center">
        <q-input v-if="edit.includes('info')" dense outlined bg-color="white" v-model="data['fixDate']" :disable="loading" hide-bottom-space :rules="[creationRule, validateDate]">
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
    <div class="row q-pb-sm" v-if="!data['fixStatus']"> 
      <NGReasonSelect
        :value="data[reasonKey]?$t('applicant.list.fixEmployment.' + data[reasonKey]) + (data[detailKey]?' (' + $t('applicant.list.fixEmployment.' + data[detailKey])+ ')':''):''"
        :edit="edit.includes(tabKey)" 
        :label="$t('applicant.list.fixEmployment.'+reasonKey)"
        :reasonValue="data[reasonKey]"
        @update:reasonValue="(newValue : string) => data[reasonKey] = newValue"
        :detailedValue="data[detailKey]"
        @update:detailedValue="(newValue : string) => data[detailKey] = newValue"
        :disable="loading"
        :hightlightError="hightlightError"
      />
    </div>
    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('info')"
        :value="usersListOption
          .filter(user => user.value === fixData['chargeOfFix'])
          .map(user => user.label).join('')"
        :label="$t('applicant.list.fixEmployment.chargeOfFix')"
        valueClass="col-9 q-pl-md" required>  

        <q-select
          v-if="edit.includes('info')"
          v-model="data['chargeOfFix']"
          :disable="loading"
          emit-value map-options dense outlined hide-bottom-space
          :rules="[creationRule]"
          :options="usersListOption" 
          :label="$t('common.pleaseSelect')" />
      </labelField>
    </div>
      <div class="row q-pb-sm">
        <labelField 
          :edit="edit.includes('info')" 
          :label="$t('applicant.list.fixEmployment.fixMemo')" 
          :value="fixData['fixMemo']" valueClass="col-9 q-pl-md">
          <q-input dense outlined bg-color="white"
            v-model="data['fixMemo']" :disable="loading" />
        </labelField>
      </div>
    </q-form>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';
import { ApplicantFix, FixMainInfo, selectOptions } from 'src/shared/model';
import { Ref, ref, watch } from 'vue';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods'
import { creationRule } from 'src/components/handlers/rules';
import { validateDate } from 'src/shared/constants/Form.const';
import { QForm } from 'quasar';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[]
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])
const data = ref<Partial<FixMainInfo>>({});

/** NGReasonSelect handlers */
const reasonKey = 'fixReasonNG' /** change reason key */
const detailKey = 'fixReasonNGDetail' /** change reason detail key */
const tabKey = 'info' /** change tab key */
const statusKey = 'fixStatus' /** change status key */
const hightlightError = ref<string[]>([])
const form: Ref<QForm|null> = ref(null);

const saveHandler = () => {
  form.value?.validate().then(success => {
    if (success) {
      if(useSaveHandler(data, hightlightError, reasonKey, detailKey, statusKey)){
        emit('save', tabKey, data.value);
        resetData();
      }
    }
  })
}
useNGWatchers(data, hightlightError, reasonKey, detailKey, statusKey)
/** NGReasonSelect handlers */

watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 

resetData();
function resetData() {
  data.value = {
    fixStatus: props.editData['fixStatus'] || false,
    fixDate: props.editData['fixDate'] || '',
    fixReasonNG: props.editData['fixReasonNG'] || '',
    fixReasonNGDetail: props.editData['fixReasonNGDetail'] || '',
    chargeOfFix: props.editData['chargeOfFix'] || '',
    fixMemo: props.editData['fixMemo'] || '',
  };
  form.value?.resetValidation
}

</script>

<style>

</style>