<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.inHouseInformation') }}
    </div>

    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.referralFee')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['retirementAge']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">%</span>
      </labelField>
    </div>

    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.referralFeeAmount')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['stipulatedAmount']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.yen') }}</span>
      </labelField>
    </div>
      
    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.retirementAge')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['retirementAge_house']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.age') }}</span>
      </labelField>
    </div>
      
    <div class="row q-mt-sm">
      <labelField :label="$t('client.list.memo')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['memo_house']" outlined dense :disable="loading"/>
      </labelField>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import LabelField from 'src/components/form/LabelField.vue';
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean
}>()

const data = ref(props.backOrder)
</script>

<style>

</style>