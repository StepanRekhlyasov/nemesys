<template>
  <labelField 
    :edit="edit"
    :label="label"
    valueClass="col-9 q-pl-md">
    <div class="row" style="gap: 15px;">
      <q-field :error="errorReason" dense :outlined="false" class="q-pb-none">
        <q-radio 
          v-model="inputReasonVal" 
          @update:model-value="(newVal)=>{ emit('update:reasonValue', newVal);}" 
          val="excluded" 
          :label="$t('applicant.list.fixEmployment.notApplicable')"
          :error="errorReason"
        />
        <q-radio 
          v-model="inputReasonVal" 
          @update:model-value="(newVal)=>{ emit('update:reasonValue', newVal);}"  
          val="anotherCompany" 
          :label="$t('applicant.list.fixEmployment.decided')" 
          class="q-ml-sm" 
          :error="errorReason"
        />
        <q-radio 
          v-model="inputReasonVal" 
          @update:model-value="(newVal)=>{ emit('update:reasonValue', newVal);}"  
          val="break_contact" 
          :label="$t('applicant.list.fixEmployment.notCovered')"
          class="q-ml-sm" 
          :error="errorReason"
        />
        <q-radio 
          v-model="inputReasonVal" 
          @update:model-value="(newVal)=>{ emit('update:reasonValue', newVal);}"  
          val="decline" 
          :label="$t('applicant.list.fixEmployment.registrationDeclined')" 
          class="q-ml-sm" 
          :error="errorReason"
        />
      </q-field>
      <div class="col-3">
        <q-select 
          :disable="disable"
          v-if="reasonValue && reasonValue !== 'break_contact'" 
          v-model="inputDetailedVal"                       
          emit-value map-options dense outlined
          :options="statusOptions"
          :label="$t('common.pleaseSelect')" 
          @update:model-value="(newVal)=>{
            emit('update:detailedValue', newVal);
          }"
          :error="errorDetail"
        />
      </div>
    </div>
  </labelField>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import labelField from 'src/components/form/LabelField.vue';
import { selectOptions } from 'src/shared/model';
import { notApplicableFixList } from 'src/shared/constants/Applicant.const';
import { decidedFixList } from 'src/shared/constants/Applicant.const';
import { registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

const emit = defineEmits(['update', 'update:detailedValue', 'update:reasonValue'])
const props = withDefaults(defineProps<{
  reasonValue?: string,
  detailedValue?: string,
  edit?: boolean,
  label: string,
  disable?: boolean,
  hightlightError?: string[]
}>(), {
  edit: false
})
const inputReasonVal = ref(props.reasonValue)
const inputDetailedVal = ref(props.detailedValue)
const errorReason = computed(()=>props.hightlightError?.includes('reason'))
const errorDetail = computed(()=>props.hightlightError?.includes('detail'))

const statusOptions = computed<selectOptions[]>(() => {
  switch(props.reasonValue){
    case('excluded'):
        return notApplicableFixList.value;
    case('anotherCompany'):
      return decidedFixList.value;
    case('break_contact'):
      return [];  
    case('decline'):
      return registrationDeclinedFixList.value;
    default:
      return []
  }
});
watch(() => inputReasonVal.value, () => {
  inputDetailedVal.value = ''
  emit('update:detailedValue', '');
})
watch(() => props.detailedValue, (newValue)=>{
  inputDetailedVal.value = newValue
  emit('update:detailedValue', newValue);
})
watch(() => props.edit, (newValue) => {
  if(!newValue){
    inputReasonVal.value = props.reasonValue
    inputDetailedVal.value = props.detailedValue
    emit('update:reasonValue', inputReasonVal.value);
    emit('update:detailedValue', inputDetailedVal.value);
  }
})

</script>