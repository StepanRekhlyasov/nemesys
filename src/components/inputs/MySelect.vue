<template>
  <div class="myWrapper">
    <q-select
      :rules="rules"
      class="mySelect"
      :outlined="outlined"
      :dense="dense"
      :clearable="true"
      v-bind="$attrs"
      :options="optionsList"
      :disable="loading || outerLoading || outerDisable"
      :loading="loading || outerLoading"
      v-model="inputVal"
      bg-color="white"
      :label="$t(label)"
      emit-value
      map-options
      @update:model-value="(newVal)=>{
        emit('update:modelValue', newVal);
        emit('update');
      }"
    />
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { selectOptions } from 'src/shared/model';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBackOrder } from 'src/stores/backOrder';
import { ValidationRule } from 'quasar';

type optionToFetch = 'usersInCharge' | 'branchIncharge' | 'backOrder'

const emit = defineEmits(['update', 'update:modelValue'])
const props = withDefaults(defineProps<{
  modelValue?: string | undefined,
  options?: selectOptions[],
  optionToFetch?: optionToFetch,
  width?: string,
  height?: string,
  clientFactory?: string,
  rules?: ValidationRule[],
  label?: string,
  dense?: boolean,
  outlined?: boolean,
  outerLoading?: boolean,
  outerDisable?: boolean
}>(),{
  width: '100%',
  height: 'auto',
  label: 'common.pleaseSelect',
  dense: true,
  outlined: true,
})
const optionsList = ref(props.options)
const loading = ref(false)
const inputVal = ref(props.modelValue)

const organization = useOrganization()
const backOrderStore = useBackOrder()
const { state, currentOrganizationId } = storeToRefs(organization)
onMounted(async ()=>{
  if(props.optionToFetch){
    switch (props.optionToFetch) {
      case 'usersInCharge':
        if(state.value.currentOrganizationUsers){
          optionsList.value = mapToSelectOptions(state.value.currentOrganizationUsers)
        }
      break;
      case 'branchIncharge':
        if(state.value.currentOrganizationBranches){
          optionsList.value = mapToSelectOptions(state.value.currentOrganizationBranches)
        }
      break;
      default:
      break;
    }
  }
  loading.value = false
})
watch(()=>props.options, (newValue)=>{
  optionsList.value = newValue
})
watch(()=>currentOrganizationId.value, ()=>{
  if(props.optionToFetch){
    loading.value = true
  }
})
watch(()=>state.value.currentOrganizationBranches, ()=>{
  if(props.optionToFetch === 'branchIncharge'){
    optionsList.value = mapToSelectOptions(state.value.currentOrganizationBranches)
    inputVal.value = ''
    loading.value = false
  }
})
watch(()=>state.value.currentOrganizationUsers, ()=>{
  if(props.optionToFetch === 'usersInCharge'){
    optionsList.value = mapToSelectOptions(state.value.currentOrganizationUsers)
    inputVal.value = ''
    loading.value = false
  }
})
watch(()=>props.clientFactory, async (newValue)=>{
  if(props.optionToFetch === 'backOrder' && newValue){
    loading.value = true
    const backOrders = await backOrderStore.getClientFactoryBackOrder(newValue)
    optionsList.value = backOrders.map((row)=>{
      return {
        value: row.id,
        label: row.id
      }
    })
    inputVal.value = ''
    loading.value = false
  }
})
</script>
<style lang="scss" scoped>
.mySelect{
  white-space: nowrap;
}
.myWrapper{
  width: v-bind(width);
}
</style>