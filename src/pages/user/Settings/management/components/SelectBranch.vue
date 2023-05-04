<template>
  <q-select outlined dense v-model:model-value="modelValue" :options="branches" :disable="loading" :loading="loading"
    :label="$t('common.pleaseSelect')" emit-value map-options />
</template>

<script setup lang="ts">
import { QSelectProps } from 'quasar';
import { selectOptions } from 'src/shared/model';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { onBeforeMount, ref } from 'vue';

const organization = useOrganization()

interface SelectBranchProps extends Omit<QSelectProps, 'modelValue'> {
  organizationId: string
}
const loading = ref(true)
const branches = ref<selectOptions[]>([])
const modelValue = ref('')
onBeforeMount(async () => {
  branches.value = mapToSelectOptions(await organization.getBranchesInOrganization(props.organizationId))
  loading.value = false
})

const props = defineProps<SelectBranchProps>()

</script>

<style scoped></style>
