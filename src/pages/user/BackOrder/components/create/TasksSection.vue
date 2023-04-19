<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.tasks') }}
    </div>
    <div class="row ">
      <labelField :label="$t('backOrder.create.tasks')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['tasks']" outlined dense :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row ">
      <labelField :label="$t('backOrder.create.pickDrop')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-toggle v-model="data['pickDrop']" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ data['pickDrop']?$t('common.yes'):$t('common.no') }}</span>
      </labelField>
    </div>
    
    <div class="row">
      <labelField :label="$t('backOrder.create.onCallSupport')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 row">
        <q-toggle v-model="data['onCallSupport']"  :disable="loading"/>
        <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['onCallSupport']?$t('common.yes'):$t('common.no') }}</span>
        <span class="col-2 q-ma-sm flex-center">{{ $t('backOrder.create.onCallRemarks') }}</span>
        <q-input v-model="data['onCallRemarks']" outlined dense  :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row">
      <labelField :label="$t('backOrder.create.welfare')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['welfare']" outlined dense  :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.childcare')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['tasks_childcare']" outlined dense  :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.retirementAge')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['retirementAge_tasks']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.age') }}</span>
      </labelField>
    </div>
  </q-card-section> 
</template>

<script lang="ts" setup>
import LabelField from 'src/components/form/LabelField.vue';
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: BackOrderModel,
  loading: boolean
}>()

const data = ref(props.backOrder)
</script>

<style>

</style>