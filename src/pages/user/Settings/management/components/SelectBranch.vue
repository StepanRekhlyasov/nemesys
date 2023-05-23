<template>
  <q-select 
    outlined 
    dense 
    v-model:model-value="modelValue" 
    :options="branches" 
    :disable="loading" 
    :loading="loading"
    :label="$t('common.pleaseSelect')" 
    emit-value map-options 
    :clearable="clearable"
  />
</template>

<script setup lang="ts">
import { QSelectProps } from 'quasar';
import { selectOptions } from 'src/shared/model';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { onBeforeMount, ref } from 'vue';

const organization = useOrganization()

interface SelectBranchProps extends Omit<QSelectProps, 'modelValue'> {
  organizationId?: string,
  clearable?: boolean
}
const loading = ref(true)
const branches = ref<selectOptions[]>([])
const modelValue = ref('')
const props = withDefaults(defineProps<SelectBranchProps>(),{
  clearable: true
})

onBeforeMount(async () => {
  const organizationId = props.organizationId?props.organizationId:organization.currentOrganizationId
  branches.value = mapToSelectOptions(await organization.getBranchesInOrganization(organizationId))
  loading.value = false
})
</script>
