<template>
  <q-select outlined dense v-model:model-value="modelValue" :options="branches" :disable="loading" :loading="loading"
    :label="$t('common.pleaseSelect')" emit-value map-options :rules="props.rules" hide-bottom-space/>
</template>

<script setup lang="ts">
import { QSelectProps, ValidationRule } from 'quasar';
import { selectOptions } from 'src/shared/model';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { onMounted, ref, watch } from 'vue';

const organization = useOrganization()

interface SelectBranchProps extends Omit<QSelectProps, 'modelValue'> {
  organizationId: string,
  rules?: ValidationRule[]
}
const loading = ref(true)
const branches = ref<selectOptions[]>([])
const modelValue = ref('')
onMounted(async () => {
  branches.value = mapToSelectOptions(await organization.getBranchesInOrganization(props.organizationId))
  loading.value = false
})

const props = defineProps<SelectBranchProps>()
watch(()=>props.organizationId, async (newValue)=>{
  loading.value = true
  branches.value = mapToSelectOptions(await organization.getBranchesInOrganization(newValue))
  loading.value = false
})
</script>
