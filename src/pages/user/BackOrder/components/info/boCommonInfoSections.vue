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
      :value="!edit? (bo['dateOfRegistration']):''">
      <q-input v-if="edit" dense outlined bg-color="white" v-model="formattedDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dateOfRegistration']" default-view="Years" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
      </q-input>
    </LabelField>
    <labelField :label="$t('backOrder.create.registrant')" :edit="false" :value="getRegistrant(data['registrant'])"/>
  </div>

  <div class="row q-pt-sm">
      <LabelField :label="$t('backOrder.create.approvalOrNot')" :edit="edit"
        :value="!edit?bo['approvalOrNot'] ? $t('common.yes') : $t('common.no'):''">
        <q-toggle v-model="data['approvalOrNot']"  :disable="loading"/>
        <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['approvalOrNot']?$t('common.yes'):$t('common.no') }}</span>
      </LabelField>
    <LabelField :label="$t('backOrder.create.uniformAvailability')" :edit="edit"
        :value="!edit? data['uniformAvailability']:''" >
      <q-input v-model="data['uniformAvailability']" outlined dense :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.filingRemarks')" :edit="edit"
      :value="!edit? bo['filingRemarks']:''">
      <q-input v-model="data['filingRemarks']" outlined dense :disable="loading"/>
    </LabelField>
    <LabelField :label="$t('backOrder.create.availabilityOfLunch')" :edit="edit"
      :value="data['availabilityOfLunch'] && !edit ? `${data['availabilityOfLunch']}` : ''" >
      <q-input v-model="data['availabilityOfLunch']" outlined dense :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.availabilityOfGarage')" :edit="edit"
      :value="!edit? data['availabilityOfGarage'] ? $t('common.yes') : $t('common.no'):''">
      <q-toggle v-model="data['availabilityOfGarage']"  :disable="loading"/>
      <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['availabilityOfGarage'] ? $t('common.yes') : $t('common.no') }}</span>
    </LabelField>
    <LabelField :label="$t('backOrder.create.smoking')" :edit="edit" :value="data['smoking'] && !edit ? $t(`smoking.${data['smoking']}`) : ''  " >
      <q-select v-if="edit" outlined dense :options="smokingStatusOptions"
        emit-value map-options v-model="data['smoking']" :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.parkingRemarks')" :edit="edit"
      :value="!edit? data['parkingRemarks']:''">
      <q-input v-model="data['parkingRemarks']" outlined dense :disable="loading"/>
    </LabelField>
    <LabelField :label="$t('backOrder.create.smokingRemarks')" :edit="edit" :value="!edit? data['smokingRemarks']:''" >
      <q-input v-model="data['smokingRemarks']" outlined dense :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.commutingByCar')" :edit="edit"
      :value="!edit? data['commutingByCar']:''">
      <q-input v-model="data['commutingByCar']" outlined dense :disable="loading"/>
    </LabelField>
    <LabelField :label="$t('backOrder.ageLimit')" :edit="edit"
    :value="data['upperAgeLimit'] && !edit ? `${data['upperAgeLimit']} ${$t('common.ageShort')}` : ''" >
    <q-input v-model="data['upperAgeLimit']" outlined dense :disable="loading" type="number"/>
  </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.medicalExamination')" :edit="edit"
      :value="!edit? data['medicalExamination']:''">
      <q-input v-model="data['medicalExamination']" outlined dense :disable="loading"/>
    </LabelField>
    <LabelField :label="$t('backOrder.create.vaccination')" :edit="edit" :value="!edit? data['vaccination']:''" >
      <q-input v-model="data['vaccination']" outlined dense :disable="loading"/>
    </LabelField>
  </div>

  <div class="row q-pt-md">
    <LabelField :label="$t('backOrder.create.numberUsers')" :edit="edit"
      :value="data['numberUsers'] && !edit ? `${data['numberUsers']}${$t('common.reputation')}` : ''">
      <q-input v-model="data['numberUsers']" outlined dense :disable="loading" type="number"/>
    </LabelField>
    <LabelField :label="$t('backOrder.numberEmployees')" :edit="edit"
      :value="data['numberEmployees'] && !edit ? `${data['numberEmployees']}${$t('common.reputation')}` : ''" >
      <q-input v-model="data['numberEmployees']" outlined dense :disable="loading" type="number"/>
    </LabelField>
  </div>

  <div class="row q-pt-sm">
    <LabelField :label="$t('backOrder.create.levelOfCare')" :edit="edit"
      :value="!edit? data['levelOfCare']:''">
      <q-input v-model="data['levelOfCare']" outlined dense :disable="loading"/>
    </LabelField>
    <LabelField :label="$t('backOrder.create.memo')" :edit="edit" :value="!edit? data['memo']:''" >
      <q-input v-model="data['memo']" outlined dense :disable="loading"/>
    </LabelField>
  </div>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { ref, computed } from 'vue';
import LabelField from 'src/components/form/LabelField.vue';
import { smokingStatusList } from 'src/shared/constants/Applicant.const';
import { useUserStore } from 'src/stores/user'
import { myDateFormat } from 'src/shared/utils/utils';

const userStore = useUserStore();

const props = defineProps<{
  bo: BackOrderModel
}>();

const backOrderStore = useBackOrder();
const edit = ref(false);
const loading = ref(false);
const data = computed(() => props.bo as BackOrderModel)
const smokingStatusOptions = ref(smokingStatusList);

async function save() {
  loading.value = true;
  try {
    if(data.value.dateOfRegistration){
      data.value.dateOfRegistration = myDateFormat(data.value.dateOfRegistration)
    }
    await backOrderStore.updateBackOrder({id: props.bo.id, ...data.value} as BackOrderModel);
    edit.value = false;
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}

const formattedDate = computed(()=> {
      return myDateFormat(data.value['dateOfRegistration'])
})

const userNames = ref<{ [id: string]: string }>({});
const getRegistrant = (registrant: string | undefined) => {
  const userDisplayName = ref('');

  if (registrant && !userNames.value[registrant]) {
    userStore
      .getUserById(registrant)
      .then((user) => {
        if(user?.branchName){
          userNames.value[registrant] = user?.displayName + ' / ' + user.branchName || '';
        }
        else{
          userNames.value[registrant] = user?.displayName || '';
        }
        userDisplayName.value = userNames.value[registrant];
      })
      .catch(() => {
        userDisplayName.value = '';
      });
  } else {
    userDisplayName.value = userNames.value[registrant];
  }

  return userDisplayName.value;
};

</script>

<style>

</style>
