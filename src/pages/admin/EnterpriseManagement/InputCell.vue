<template>
  <q-td>
    <template v-if="!editing">
      {{ text }}
    </template>
    <q-input v-else color="accent" :model-value="text" @update:model-value="(v) => emit('update:modelValue', v)" />
  </q-td>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';

interface InputCellProps extends Omit<QInputProps, 'modelValue'> {
  editing: boolean;
  text: string
}

defineProps<InputCellProps>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null) }>()

</script>

<style scoped></style>
