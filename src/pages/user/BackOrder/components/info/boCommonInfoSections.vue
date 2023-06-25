<template>
  <div class="row q-pb-md">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm"/>
      <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm"/>
      <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm" />
    </div>
  </div>

  <div class="row">
    <LabelField :label="$t('backOrder.registeredDate')" :edit="edit" 
      :value="bo['registeredDate'] ">
      <q-input v-if="edit" dense outlined bg-color="white" v-model="data['registeredDate']">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="data['registeredDate']" mask="YYYY/MM/DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="data['registeredDate']" mask="YYYY/MM/DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </LabelField>
    <labelField :label="$t('backOrder.create.registrant')" :edit="edit" :value="data['registrant']">
      <q-input v-model="data['registrant']" outlined dense :disable="loading"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
      <LabelField :label="$t('backOrder.create.approvalOrNot')" :edit="edit" 
        :value="bo['approvalOrNot'] ? $t('common.yes') : $t('common.no')">
        <q-toggle v-model="data['approvalOrNot']"  :disable="loading"/>
        <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['approvalOrNot']?$t('common.yes'):$t('common.no') }}</span>
      </LabelField>
    <labelField :label="$t('backOrder.create.uniformAvailability')" :edit="edit" 
        :value="data['uniformAvailability']" >
      <q-input v-model="data['uniformAvailability']" outlined dense :disable="loading"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.filingRemarks')" :edit="edit" 
      :value="bo['filingRemarks'] ">
      <q-input v-model="data['filingRemarks']" outlined dense :disable="loading"/>
    </LabelField>
    <labelField :label="$t('backOrder.create.availabilityOfLunch')" :edit="edit" 
      :value="data['availabilityOfLunch'] ? `${data['availabilityOfLunch']}${$t('common.ageShort')}` : ''" >
      <q-input v-model="data['availabilityOfLunch']" outlined dense :disable="loading" type="number"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.availabilityOfGarage')" :edit="edit" 
      :value="data['availabilityOfGarage'] ? $t('common.yes') : $t('common.no')">
      <q-toggle v-model="data['availabilityOfGarage']"  :disable="loading"/>
      <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['availabilityOfGarage'] ? $t('common.yes') : $t('common.no') }}</span>
    </LabelField>
    <labelField :label="$t('backOrder.create.smoking')" :edit="edit" :value="data['smoking'] ? $t(`smoking.${data['smoking']}`) : ''  " >
      <q-select v-if="edit" outlined dense :options="smokingStatusOptions"
        emit-value map-options v-model="data['smoking']" :disable="loading"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.parkingRemarks')" :edit="edit" 
      :value="data['parkingRemarks']">
      <q-input v-model="data['parkingRemarks']" outlined dense :disable="loading"/>
    </LabelField>
    <labelField :label="$t('backOrder.create.smokingRemarks')" :edit="edit" :value="data['smokingRemarks']" >
      <q-input v-model="data['smokingRemarks']" outlined dense :disable="loading"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.commutingByCar')" :edit="edit" 
      :value="data['commutingByCar']">
      <q-input v-model="data['commutingByCar']" outlined dense :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.medicalExamination')" :edit="edit" 
      :value="data['medicalExamination']">
      <q-input v-model="data['medicalExamination']" outlined dense :disable="loading"/>
    </LabelField>
    <labelField :label="$t('backOrder.create.vaccination')" :edit="edit" :value="data['vaccination']" >
      <q-input v-model="data['vaccination']" outlined dense :disable="loading"/>
    </labelField>
  </div>

  <div class="row q-pt-md">
    <LabelField :label="$t('backOrder.create.numberUsers')" :edit="edit" 
      :value="data['numberUsers'] ? `${data['numberUsers']}${$t('common.reputation')}` : ''">
      <q-input v-model="data['numberUsers']" outlined dense :disable="loading" type="number"/>
    </LabelField>
    <labelField :label="$t('backOrder.numberEmployees')" :edit="edit" 
      :value="data['numberEmployees'] ? `${data['numberEmployees']}${$t('common.reputation')}` : ''" >
      <q-input v-model="data['numberEmployees']" outlined dense :disable="loading" type="number"/>
    </labelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.levelOfCare')" :edit="edit" 
      :value="data['levelOfCare']">
      <q-input v-model="data['levelOfCare']" outlined dense :disable="loading"/>
    </LabelField>
    <labelField :label="$t('backOrder.create.memo')" :edit="edit" :value="data['memo']" >
      <q-input v-model="data['memo']" outlined dense :disable="loading"/>
    </labelField>
  </div>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { ref } from 'vue';
import LabelField from 'src/components/form/LabelField.vue';
import { smokingStatusList } from 'src/shared/constants/Applicant.const';

const props = defineProps<{
  bo: BackOrderModel
}>();

const backOrderStore = useBackOrder();
const edit = ref(false);
const loading = ref(false);
const data = ref(props.bo);

const smokingStatusOptions = ref(smokingStatusList);

async function save() {
  loading.value = true;
  try {
    await backOrderStore.updateBackOrder({id: props.bo.id, ...data.value} as BackOrderModel);
    edit.value = false;

  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>

<style>

</style>