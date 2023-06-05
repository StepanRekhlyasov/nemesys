<template>
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
    clearable
    @update:model-value="(newVal)=>{
      emit('update:modelValue', newVal);
      emit('update');
    }"
  />
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { selectOptions } from 'src/shared/model';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useApplicant } from 'src/stores/applicant';
import { useOrganization } from 'src/stores/organization';
import { onMounted, ref } from 'vue';

type optionToFetch = 'usersInCharge' | 'branchIncharge'

const emit = defineEmits(['update', 'update:modelValue'])
const props = defineProps<{
  modelValue?: string | undefined,
  options?: selectOptions[],
  optionToFetch?: optionToFetch
}>()
const optionsList = ref(props.options)
const loading = ref(false)
const inputVal = ref(props.modelValue)
onMounted(async ()=>{
  if(props.optionToFetch){
    switch (props.optionToFetch) {
      case 'usersInCharge':
        loading.value = true
        const applicantStore = useApplicant()
        await applicantStore.fetchUsersInChrage()
        optionsList.value = applicantStore.state.usersInCharge.map((doc) => {
          return {
            label: doc.displayName,
            value: doc.id
          }
        });
        loading.value = false
      break;
      case 'branchIncharge':
        loading.value = true
        const organization = useOrganization()
        optionsList.value = mapToSelectOptions(await organization.getBranchesInOrganization(organization.currentOrganizationId))
        loading.value = false
      break;
      default:
        console.log('wrong prop')
    }
  }
})
watch(()=>props.options, (newValue)=>{
  optionsList.value = newValue
})
</script>
<style lang="scss" scoped>
.mySelect{
  white-space: nowrap;
}
</style>