<template>
  <DropDownEditGroup
    :isEdit="edit.includes('jobOffersInfo')"
    :label="$t('applicant.list.fixEmployment.jobOffersInfo')"
    @openEdit="emit('openEdit');resetData();"
    @closeEdit="emit('closeEdit');resetData();"
    @onSave="saveHandler()"
    :isDisabledButton="disableLevel < 2">
    <q-form ref="form">
      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.status')" 
          :value="fixData[statusKey] === true ? 'OK' : fixData[statusKey] === false ?'NG' : '-'" valueClass="text-uppercase col-3  q-pl-md" required>
          <q-field dense :outlined="false" class="q-pb-none" borderless hide-bottom-space
            v-model="data['offerStatus']" :rules="[() => 'offerStatus' in data || '']">
            <q-checkbox v-model="data['offerStatus']" label="OK" @click="emit('disableChange');data['offerDate'] = '';"
              checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 2"/>
            <q-checkbox v-model="data['offerStatus']" label="NG" class="q-ml-sm" @click="emit('disableChange')"
              unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 2"/>
          </q-field>
        </labelField>

        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.date')" 
          :value="fixData.offerDate" required>
          <q-input dense outlined bg-color="white" v-model="data['offerDate']"  
            :disable="loading || disableLevel < 2" :rules="[creationRule, validateDate]" hide-bottom-space>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['offerDate']" mask="YYYY/MM/DD">
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
      <div class="row q-pb-sm" v-if="!data['offerStatus']">
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
      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.chargeOfOffer')"
          :value="usersListOption
            .filter(user => user.value === fixData['chargeOfOffer'])
            .map(user => user.label).join('')"
          required valueClass="col-9 q-pl-md">
          <q-select
            v-model="data['chargeOfOffer']"
						:rules="[creationRule]" hide-bottom-space
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
    </q-form>
  </DropDownEditGroup>  
</template>

<script lang="ts" setup>
import { QForm } from 'quasar';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';

import { ApplicantFix, FixJobOffersInfo, selectOptions } from 'src/shared/model'
import { Ref, ref, watch } from 'vue';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods';
import { creationRule } from 'src/components/handlers/rules';
import { validateDate } from 'src/shared/constants/Form.const';

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
const form: Ref<QForm|null> = ref(null);

resetData();

function resetData(){
  data.value = {
    offerStatus: props.editData['offerStatus'] || false,
    offerDate: props.editData['offerDate'] || '',
    offerReasonNG: props.editData['offerReasonNG'] || '',
    offerReasonNGDetail: props.editData['offerReasonNGDetail'] || '',
    chargeOfOffer: props.editData['chargeOfOffer'] || '',
    offerMemo: props.editData['offerMemo'] || '',
  }
}

/** NGReasonSelect handlers */
const reasonKey = 'offerReasonNG' /** change reason key */
const detailKey = 'offerReasonNGDetail' /** change reason detail key */
const tabKey = 'jobOffersInfo' /** change tab key */
const statusKey = 'offerStatus' /** change status key */
const hightlightError = ref<string[]>([])
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
</script>

<style>

</style>