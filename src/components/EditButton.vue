<template>
  <q-td auto-width key="EditButton">
    <q-btn v-if="props.rowIndex !== editableRow" icon="edit" flat
      @click="emit('onEditableRowChange', props.rowIndex); onEdit();" :color="color" :disable="disable" />
    <q-btn v-if="editableRow >= 0 && props.rowIndex === editableRow" flat icon="mdi-content-save"
      @click="onSave(); emit('onEditableRowChange', -1)" :color="color" :disable="disable" />
  </q-td>
</template>

<script setup lang="ts">
import { QTableSlots } from 'quasar'

interface EditButtonProps {
  props: Parameters<QTableSlots[`body-cell-${string}`] | QTableSlots['body']>[0]
  color: string
  editableRow: number
  onEdit: () => void
  onSave: () => Promise<void>
  disable?: boolean
}

defineProps<EditButtonProps>()

const emit = defineEmits<{ (e: 'onEditableRowChange', value: number): void }>();

</script>
