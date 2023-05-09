<template>
  <q-card class="no-shadow bg-grey-3">
    <q-card-section class="text-white bg-primary no-border-radius" >
      <div class="row">
        <div class="flex items-end ">
          <q-btn dense flat icon="close" class="q-mr-md " @click="emits('closeDialog')"/>
        </div>
        <div>
          <div class="row text-subtitle2">
            {{ `${client['client_name']} / ${client['companyProfile']}` }}
          </div>
          <div class="row text-h6 text-weight-bold q-pr-xs">
            バックオーダー新規追加／{{  $t(`backOrder.type.${type}`) }}
          </div>
        </div>
      </div>
    </q-card-section >
    <q-card-section class="bg-white">        
      <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold q-mr-md" size="sm" @click="addBackOrder"/>
      <q-btn :label="$t('common.cancel')" outline  color="primary" class="text-weight-bold" @click="emits('closeDialog')" size="sm"/>
    </q-card-section>
    <q-separator color="grey-3" size="2px" />
    <q-card-section class="bg-white">
      <q-form >
        <!-- Basic Info Section -->
        <basic-info-section :backOrder="backOrderData" :loading="loading" :client="client" />
        <!-- Working Type Section -->
        <q-card-section>
          <div class="row text-primary text-h6" >
            {{'■ '+ $t('backOrder.create.workingType') }}
          </div>
          <div class="row ">
            <labelField :label="$t('backOrder.create.typeOfEmployment')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
              {{ $t('client.backOrder.introduction') }}
            </labelField>
          </div>
        </q-card-section>
        <!-- BO Generation Route Section -->
        <q-card-section>
          <div class="row text-primary text-h6" >
            {{'■ '+ $t('backOrder.create.BOGenerationRoute') }}
          </div>
          <div class="row ">
            <labelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
              <q-radio v-model="backOrderData['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall" :disable="loading"/>
              <q-radio v-model="backOrderData['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading"/>
            </labelField>
          </div>
        </q-card-section>
        <!-- Introduction Section -->
        <introduction-section :backOrder="backOrderData" :loading="loading" :type="type"/>
        <!-- Employment Conditions Section -->
        <employment-conditions-section :backOrder="backOrderData" :loading="loading"  :type="type"/>
        <!-- Paycheck Section -->
        <paycheck-section :backOrder="backOrderData" :loading="loading" />
        <!-- Tasks Section -->
        <template v-if="type=='referral'">
          <tasks-section :backOrder="backOrderData" :loading="loading" />
        </template>
        <!-- In House Information Section -->
        <template v-if="type=='referral'">
          <in-house-info-section :backOrder="backOrderData" :loading="loading"/>
        </template>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { BackOrderModel, Client } from 'src/shared/model';
import { ref } from 'vue';
import employmentConditionsSection from './employmentConditionsSection.vue';
import PaycheckSection from './PaycheckSection.vue';
import TasksSection from './TasksSection.vue';
import LabelField from 'src/components/form/LabelField.vue';
import InHouseInfoSection from './InHouseInfoSection.vue';
import IntroductionSection from './IntroductionSection.vue';
import BasicInfoSection from './BasicInfoSection.vue';
import { useBackOrder } from 'src/stores/backOrder';

const emits = defineEmits(['closeDialog']);
const backOrderStore = useBackOrder();
const props = defineProps<{
  client: Client,
  type: 'dispatch' | 'referral'
}>()
const loading = ref(false);
const backOrderData = ref({
  working_days_week: [] as string[],
  workingDays: 'shiftSystem',
  type: props.type
} as BackOrderModel);

async function addBackOrder() {
  if (props.client.id){
    await backOrderStore.addBackOrder(backOrderData.value, props.client.id)
  }
}

</script>