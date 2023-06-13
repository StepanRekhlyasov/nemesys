<template>
  <div class="myWrapper">
    <q-select
      class="mySelect"
      outlined
      dense
      :options="optionsList"
      v-model="inputVal"
      bg-color="white"
      :label="$t('common.pleaseSelect')"
      :loading="loading"
      :disable="loading"
      emit-value
      map-options
      :clearable="clearable"
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

type optionToFetch = 'usersInCharge' | 'branchIncharge'

const emit = defineEmits(['update', 'update:modelValue'])
const props = withDefaults(defineProps<{
  modelValue?: string | undefined,
  options?: selectOptions[],
  optionToFetch?: optionToFetch,
  width?: string,
  height?: string,
  clearable?: boolean
}>(),{
  width: '100%',
  height: 'auto',
  clearable: true
})
const optionsList = ref(props.options)
const loading = ref(false)
const inputVal = ref(props.modelValue)

const organization = useOrganization()
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
        console.log('wrong prop')
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
</script>
<style lang="scss" scoped>
.mySelect{
  white-space: nowrap;
}
.myWrapper{
  width: v-bind(width);
}
</style>