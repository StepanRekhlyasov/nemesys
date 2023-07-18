<template>
  <q-td>
    <template v-if="!editing">
      {{ text }}
    </template>
    <q-input v-else color="accent" :model-value="model" @update:model-value="(v) => {
      emit('update:modelValue', v);
      if (v === null) {
        return
      }
      model = v.toString()
    }" v-bind="$attrs" />
  </q-td>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import { watch, ref } from 'vue';

interface InputCellProps extends Omit<QInputProps, 'modelValue'> {
  editing: boolean;
  text: string
}

const props = defineProps<InputCellProps>()

watch(() => props.editing, (newVal) => {
  if (!newVal) {
    model.value = props.text
  }
})

const model = ref(props.text)
const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null) }>()
</script>
