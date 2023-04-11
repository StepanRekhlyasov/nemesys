<template>
  <DropDownEditGroup
      :isEdit="edit.includes('employmentInfo')"
      :label="$t('applicant.list.fixEmployment.employmentInfo')"
      @openDropDown="emit('openEdit')"
      @closeDropDown="emit('closeEdit')"
      @onSave="emit('save')"
      :isDisabledButton="disableLevel < 3">
    <div class="row q-pb-sm">
      <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.status')" :value="fixData.admissionStatus" valueClass="text-uppercase">
        <q-radio v-model="data['admissionStatus']" val="ok" label="OK" @click="data['admissionDate'] = ''" :disable="disableLevel < 3"/>
        <q-radio v-model="data['admissionStatus']" val="ng" label="NG" class="q-ml-sm" :disable="disableLevel < 3"/>
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

    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.reasonNotJoining')" 
        :value="fixData.reasonNotJoining" valueClass="col-9">
        <q-input dense outlined bg-color="white"
          v-model="data['reasonNotJoining']" :disable="loading || disableLevel < 3" />
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField 
        :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.chargeOfAdmission')"
        :value="usersListOption
          .filter(user => user.value === data['chargeOfAdmission'])
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
        :value="fixData.admissionMemo" value-class="col-9">
        <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white"
          v-model="data['admissionMemo']" :disable="loading || disableLevel < 3" />
      </labelField>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';

import { ApplicantFix, selectOptions } from 'src/shared/model'
import { ref } from 'vue';

const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])

const data = ref(props.editData)
</script>

<style>

</style>