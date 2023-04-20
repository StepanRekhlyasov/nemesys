<template>
  <q-card class="no-shadow bg-grey-3">
    <q-card-section class="text-white bg-primary no-border-radius" >
      <div class="row">
        <div class="flex items-end ">
          <q-btn dense flat icon="close" class="q-mr-md " @click="emits('closeDialog')"/>
        </div>
        <div>
          <div class="row text-subtitle2">
            株式会社キカリ / 特別養護老人ホームキカリ
          </div>
          <div class="row text-h6 text-weight-bold q-pr-xs">
            バックオーダー新規追加／派遣
          </div>
        </div>
      </div>
    </q-card-section >
    <q-card-section class="bg-white">        
      <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold q-mr-md" size="sm"/>
      <q-btn :label="$t('common.cancel')" outline  color="primary" class="text-weight-bold" @click="emits('closeDialog')" size="sm"/>
    </q-card-section>
    <q-separator color="grey-3" size="2px" />
    <q-card-section class="bg-white">
      <q-form >

        <q-card-section>
          <div class="row text-primary text-h6" >
            {{'■ '+ $t('backOrder.create.introduction') }}
          </div>
          <div class="row ">
            <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
              <q-input v-model="backOrderData['dateOfRegistration']" outlined dense :disable="loading"/>
            </labelField>
            <labelField :label="$t('backOrder.create.registrant')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
              <q-input v-model="backOrderData['registrant']" outlined dense :disable="loading"/>
            </labelField>
          </div>
        </q-card-section>
        <!-- Introduction Section -->
        <introduction-section :backOrder="backOrderData" :loading="loading" />
        <!-- Employment Conditions Section -->
        <employment-conditions-section :backOrder="backOrderData" :loading="loading" />
        <!-- Paycheck Section -->
        <paycheck-section :backOrder="backOrderData" :loading="loading" />
        <!-- Tasks Section -->
        <tasks-section :backOrder="backOrderData" :loading="loading" />
        <!-- In House Information Section -->
        <in-house-info-section :backOrder="backOrderData" :loading="loading"/>
      </q-form>
    </q-card-section>
  </q-card>
      
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';
import employmentConditionsSection from './employmentConditionsSection.vue';
import PaycheckSection from './PaycheckSection.vue';
import TasksSection from './TasksSection.vue';
import InHouseInfoSection from './InHouseInfoSection.vue';
import IntroductionSection from './IntroductionSection.vue';

const emits = defineEmits(['closeDialog']);
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})
const loading = ref(false)
const backOrderData = ref({
  working_days_week: [] as string[],
  workingDays: 'shiftSystem'
} as BackOrderModel)
</script>
