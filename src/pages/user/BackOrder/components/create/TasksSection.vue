<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.tasks') }}
    </div>
    <div class="row ">
      <labelField :label="$t('backOrder.create.tasks')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10">
        <q-input v-model="data['work_content']" outlined dense :disable="loading" type="textarea" autogrow/>
      </labelField>
    </div>
    
    <div class="row ">
      <labelField :label="$t('backOrder.create.pickDrop')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex" required>
        <q-field
          borderless dense
          v-model="data['pickDrop']"
          :rules="[() => 'pickDrop' in data || '' ]" hide-bottom-space> 
          <template v-slot:control> 
            <q-toggle v-model="data['pickDrop']" :disable="loading"/>
            <span class="q-ma-sm flex-center">{{ data['pickDrop']?$t('common.yesShort'):$t('common.noShort') }}</span>
          </template>
        </q-field>
      </labelField>
    </div>
    
    <div class="row ">
      <labelField :label="$t('backOrder.create.onCallSupport')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 row" required>
        <q-field
          borderless dense
          v-model="data['onCallSupport']"
          :rules="[() => 'onCallSupport' in data || '' ]" hide-bottom-space>
          <template v-slot:control>
            <q-toggle v-model="data['onCallSupport']"  :disable="loading" />
            <span class="flex-center q-pr-md ">{{ data['onCallSupport']?$t('common.yesShort'):$t('common.noShort') }}</span>
          </template>
        </q-field>
        <span class="col-2 q-ma-sm self-center">{{ $t('backOrder.create.onCallRemarks') }}</span>
        <q-input v-model="data['onCallRemarks']" outlined dense type="textarea" autogrow :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-mt-sm" v-if="type === 'referral'">
      <labelField :label="$t('backOrder.create.welfare')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10" required>
        <q-input v-model="data['welfare']" outlined dense type="textarea" autogrow :disable="loading" :rules="[creationRule]" hide-bottom-space/>
      </labelField>
    </div>
    
    <div class="row q-mt-sm"  v-if="type === 'referral'">
      <labelField :label="$t('backOrder.create.childcare')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10" required>
        <q-input v-model="data['tasks_childcare']" outlined dense type="textarea" autogrow :disable="loading" :rules="[creationRule]" hide-bottom-space/>
      </labelField>
    </div>
    
    <div class="row q-mt-sm"  v-if="type === 'referral'">
      <labelField :label="$t('backOrder.create.retirementAge')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex">
        <q-input v-model="data['retirementAge_tasks']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.age') }}</span>
      </labelField>
    </div>
  </q-card-section> 
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { creationRule } from 'src/components/handlers/rules';
import { BackOrderModel } from 'src/shared/model';
import { ref, watch } from 'vue';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  type: 'dispatch' | 'referral'
}>()

const data = ref(props.backOrder)

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })
</script>

<style>
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
 
input[type="number"] {
    -moz-appearance: textfield;
}
</style>