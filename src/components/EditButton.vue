<template>
  <q-td auto-width key="EditButton">
    <q-btn v-if="!editingMode" icon="edit" flat @click="emit('onEditableRowChange', props.rowIndex); onEdit();"
      :color="color" :disable="disable" />
    <q-btn v-if="editingMode" flat icon="mdi-content-save" @click="async () => {
      const saved = await onSave();
      if (saved === false) {
        return
      }
      emit('onEditableRowChange', -1)
    }" :color="color" :disable="disable" type="submit" />
    <q-btn v-if="editingMode && cancelButton" @click="emit('onExitEditingMode')" icon="mdi-close" :color="color"
      :disable="disable" flat />
  </q-td>
</template>

<script setup lang="ts">
import { QTableSlots } from 'quasar'
import { computed } from 'vue'

interface EditButtonProps {
  props: Parameters<QTableSlots[`body-cell-${string}`] | QTableSlots['body']>[0]
  color: string
  editableRow: number
  onEdit: () => void
  onSave: () => Promise<boolean | void>
  disable?: boolean
  cancelButton?: boolean
}
const editingMode = computed(() => {
  return componentProps.editableRow >= 0 && componentProps.props.rowIndex === componentProps.editableRow
})
const componentProps = defineProps<EditButtonProps>()

const emit = defineEmits<{
  (e: 'onEditableRowChange', value: number): void
  (e: 'onExitEditingMode'): void
}>();

</script>
