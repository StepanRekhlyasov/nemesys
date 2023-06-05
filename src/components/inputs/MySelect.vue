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
      clearable
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
import { useApplicant } from 'src/stores/applicant';
import { useOrganization } from 'src/stores/organization';
import { onMounted, ref } from 'vue';

type optionToFetch = 'usersInCharge' | 'branchIncharge'

const emit = defineEmits(['update', 'update:modelValue'])
const props = withDefaults(defineProps<{
  modelValue?: string | undefined,
  options?: selectOptions[],
  optionToFetch?: optionToFetch,
  width?: string,
  height?: string,
}>(),{
  width: '100%',
  height: 'auto'
})

const optionsList = ref(props.options)
const loading = ref(false)
const inputVal = ref(props.modelValue)
onMounted(async ()=>{
  if(props.optionToFetch){
    switch (props.optionToFetch) {
      case 'usersInCharge':
        loading.value = true
        const applicantStore = useApplicant()
       
        if(applicantStore.state.usersInCharge.length){
          optionsList.value = applicantStore.state.usersInCharge.map((doc) => {
            return {
              label: doc.displayName,
              value: doc.id
            }
          });
          loading.value = false
          break;
        }
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
        if(organization.state.branchesInOrganization && Object.keys(organization.state.branchesInOrganization).length){
          optionsList.value = mapToSelectOptions(organization.state.branchesInOrganization)
          loading.value = false
          break;
        }
        const branches = await organization.getBranchesInOrganization(organization.currentOrganizationId)
        optionsList.value = mapToSelectOptions(branches)
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
.myWrapper{
  width: v-bind(width);
}
</style>