<template>
  <div class="container">
    <q-select outlined dense v-model:model-value="modelValue" :options="options" :disable="loading" :loading="loading"
      :label="$t('common.pleaseSelect')" emit-value map-options :bottom-slots="showAvalibleSlots" v-bind="$attrs">

      <template v-slot:option="scope" v-if="showAvalibleSlots">
        <q-item v-bind="scope.itemProps">
          <div>
            {{ scope.opt.label }}
            <div class="text-bold">

              {{ `${t('settings.users.availableSlots')}: ${branches[scope.opt.value].licensesSlots -
                usersInBranch[scope.opt.value]}` }}
            </div>
          </div>
        </q-item>
      </template>

      <template v-slot:hint v-if="showAvalibleSlots && modelValue">
        {{ `${t('settings.users.availableSlots')}: ${branches[modelValue].licensesSlots - usersInBranch[modelValue]}` }}
      </template>

    </q-select>
  </div>
</template>

<script setup lang="ts">
import { QSelectProps, useQuasar } from 'quasar';
import { Branch, selectOptions } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useBranch } from 'src/stores/branch';
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const branchStore = useBranch()

interface SelectBranchProps extends Omit<QSelectProps, 'modelValue'> {
  organizationId: string
  showAvalibleSlots?: boolean
}
const loading = ref(true)
const options = ref<selectOptions[]>([])
const modelValue = ref('')
const emit = defineEmits(['imLoading', 'imLoaded'])
onMounted(async () => {
  emit('imLoading')
  await display(props.organizationId)
  emit('imLoaded')
})
const props = defineProps<SelectBranchProps>()
watch(() => props.organizationId, async (newValue) => {
  emit('imLoading')
  modelValue.value = ''
  await display(newValue)
  emit('imLoaded')
})

const availableSlots = computed(() => branches.value[modelValue.value]?.licensesSlots - usersInBranch.value[modelValue.value])

defineExpose({ availableSlots })

const usersInBranch = ref<{ [branchId: string]: number; }>({})
const branches = ref<{ [id: string]: Branch; }>({})
const $q = useQuasar();
async function display(organizationId: string) {
  loading.value = true
  try {
    branches.value = await branchStore.getBranchesInOrganization(organizationId)
    if (props.showAvalibleSlots) {
      usersInBranch.value = Object.fromEntries(await Promise.all(Object.values(branches.value).map((branch) => {
        return Promise.all([branch.id, branchStore.countUsersInBranch(branch.id)])
      })))
    }
    options.value = mapToSelectOptions(branches.value)
  } catch (error) {
    console.log(error)
    Alert.warning($q, t)
  }
  loading.value = false
}




</script>


<style scoped lang="scss">
.container {
  min-width: 160px;

}
</style>
