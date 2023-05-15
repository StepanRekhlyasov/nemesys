<template>
    <DropDownEditGroup
      :isEdit="edit.includes('jobOffersInfo')"
      :label="$t('applicant.list.fixEmployment.jobOffersInfo')"
      @openEdit="emit('openEdit')"
      @closeEdit="emit('closeEdit')"
      @onSave="emit('save')"
      :isDisabledButton="disableLevel < 2">

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.status')" :value="fixData.offerStatus" valueClass="text-uppercase col-3">
          <q-radio v-model="data['offerStatus']" val="ok" label="OK" @click="data['offerDate'] = '';emit('disableChange')" :disable="disableLevel < 2"/>
          <q-radio v-model="data['offerStatus']" val="ng" label="NG" class="q-ml-sm" @click="emit('disableChange')" :disable="disableLevel < 2"/>
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

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.reasonNG')" :value="fixData.offerReasonNG" valueClass="col-9">                
          <q-input dense outlined bg-color="white"
            v-model="data['offerReasonNG']" :disable="loading || disableLevel < 2" />
        </labelField>
      </div>

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.chargeOfOffer')"
          :value="usersListOption
            .filter(user => user.value === data['chargeOfOffer'])
            .map(user => user.label).join('')"
          valueClass="col-9">
          <q-select
            v-model="data['chargeOfOffer']"
            :disable="loading || disableLevel < 2"
            emit-value map-options dense outlined
            :options="usersListOption" :label="$t('common.pleaseSelect')" />
        </labelField>
      </div>

      <div class="row q-pb-sm">
        <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.memo')" :value="fixData.offerMemo" valueClass="col-9">
          <q-input  dense outlined bg-color="white"
            v-model="data['offerMemo']" :disable="loading || disableLevel < 2" />
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