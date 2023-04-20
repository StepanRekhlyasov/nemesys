<template>
  <q-input type="number" dense :model-value="minModelValue" outlined class="inline" style="max-width: 100px"
    @update:model-value="(v) => {
      emit('onMinValueUpdate', v)
    }" min="0" max="100" />
  ~
  <q-input type="number" dense :model-value="maxModelValue" outlined class="inline" style="max-width: 100px"
    @update:model-value="(v) => {
      emit('onMaxValueUpdate', v)
    }" min="0" max="100" />
  {{ $t(unitKey) }}
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import { LocalizationKeys } from 'src/shared/types/LocalizationKeys';

type InputType = string | number | null | undefined

interface DoubleNumberInputProps extends Omit<QInputProps, 'modelValue'> {
  minModelValue?: string | number,
  maxModelValue?: string | number,
  unitKey: LocalizationKeys
}

defineProps<DoubleNumberInputProps>()


const emit = defineEmits<{
  (e: 'onMinValueUpdate', value: InputType),
  (e: 'onMaxValueUpdate', value: InputType)
}>()

</script>
