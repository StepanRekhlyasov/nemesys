<template>
  <DropDownEditGroup
    :isEdit="edit.includes('employmentInfo')"
    :label="$t('applicant.list.fixEmployment.employmentInfo')"
    @openEdit="emit('openEdit'); resetData();"
    @closeEdit="emit('closeEdit'); resetData();"
    @onSave="saveHandler()"
    :isDisabledButton="disableLevel < 3">
    <q-form ref="form">
      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.status')" 
          :value="fixData[statusKey] === true ? 'OK' : fixData[statusKey] === false ?'NG' : '-'" valueClass="text-uppercase col-3 q-pl-md" required>
          <q-field dense :outlined="false" class="q-pb-none" borderless hide-bottom-space
            v-model="data['admissionStatus']" :rules="[() => 'admissionStatus' in data || '']">
            <q-checkbox v-model="data['admissionStatus']" label="OK" @click="emit('disableChange')" :disable="disableLevel < 3"
              checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
            <q-checkbox v-model="data['admissionStatus']" label="NG" class="q-ml-sm" :disable="disableLevel < 3"
              unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary"/>
          </q-field>
        </labelField>

        <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.date')" 
          :value="fixData.admissionDate" required>
          <q-input dense outlined bg-color="white" v-model="data['admissionDate']"  
            :disable="loading || disableLevel < 3" :rules="[creationRule, validateDate]" hide-bottom-space>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['admissionDate']" mask="YYYY/MM/DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data['admissionDate']" mask="YYYY/MM/DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </labelField>
      </div>
      
      <div class="row q-pb-sm" v-if="!data['admissionStatus']">
        <NGReasonSelect
          :value="data[reasonKey]?$t('applicant.list.fixEmployment.' + data[reasonKey]) + (data[detailKey]?' (' + $t('applicant.list.fixEmployment.' + data[detailKey])+ ')' : '') : ''"
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

      <div class="row q-pb-sm self-center">
        <labelField 
          :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.chargeOfAdmission')"
          :value="usersListOption
            .filter(user => user.value === fixData['chargeOfAdmission'])
            .map(user => user.label).join('')" required>
          <q-select
            v-model="data['chargeOfAdmission']"
            :rules="[creationRule]" hide-bottom-space
            :disable="loading || disableLevel < 3"
            emit-value map-options dense outlined
            :options="usersListOption" :label="$t('common.pleaseSelect')" />
        </labelField>

        <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.attendant.endDate')" :value="myDateFormat(fixData.endDate, 'YYYY/MM/DD')">
          <q-input dense outlined bg-color="white" v-model="data['endDate']" :disable="loading">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['endDate']" mask="YYYY/MM/DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
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
    </q-form>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';
import { ApplicantFix, FixEmploymentInfo, selectOptions } from 'src/shared/model'
import { Ref, ref, watch } from 'vue';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods';
import { validateDate } from 'src/shared/constants/Form.const';
import { creationRule } from 'src/components/handlers/rules';
import { QForm } from 'quasar';
import { myDateFormat } from 'src/shared/utils/utils';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit']);
const data = ref<Partial<FixEmploymentInfo>>({});

/** NGReasonSelect handlers */
const reasonKey = 'admissionReasonNG' /** change reason key */
const detailKey = 'admissionReasonNGDetail' /** change reason detail key */
const tabKey = 'employmentInfo' /** change tab key */
const statusKey = 'admissionStatus' /** change status key */
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

resetData();
function resetData() {
  data.value = {
    admissionStatus: props.editData['admissionStatus'] || false,
    admissionDate: props.editData['admissionDate'] || '',
    admissionReasonNG: props.editData['admissionReasonNG'] || '',
    admissionReasonNGDetail: props.editData['admissionReasonNGDetail'] || '',
    chargeOfAdmission: props.editData['chargeOfAdmission'] || '',
    endDate: props.editData['endDate'] || '',
    admissionMemo: props.editData['admissionMemo'] || '',
  }
}

watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 
</script>