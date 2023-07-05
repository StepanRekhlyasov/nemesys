<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{ '■ '+ $t('backOrder.create.paycheck') }}
    </div>
    <div class="row">      
      <labelField :label="$t('backOrder.create.hourlyMonthly')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-radio :disable="loading" :label="$t('backOrder.create.monthlySalary')" 
        val="monthlySalary" v-model="data['wage']" />
        <q-radio :disable="loading" :label="$t('backOrder.create.hourlyWage')" 
        val="hourlyWage" v-model="data['wage']" />
      </labelField>
    </div>  

    <div class="row ">
      <labelField :label="$t('backOrder.create.salary')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['salary']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.create.yenMonth') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.benefit')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['benefit']" outlined dense type="number" :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.bonus')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['bonus']" outlined dense type="number" :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesRegular')" 
        val="yesRegular" v-model="data['travelingExpenses']" />
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesDaily')" 
        val="yesDaily" v-model="data['travelingExpenses']" />
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.none')" 
        val="none" v-model="data['travelingExpenses']" />
      </labelField>
    </div>
    
    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.payday')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-input v-model="data['payday']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.create.day') }}</span>
      </labelField>
    </div>
    
    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.remarks')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-input v-model="data['remarks']" outlined dense :disable="loading"/>
      </labelField>
    </div>
    
  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';
import LabelField from 'src/components/form/LabelField.vue';

const props = defineProps<{
  backOrder: BackOrderModel,
  loading: boolean
}>()

const data = ref(props.backOrder)
</script>