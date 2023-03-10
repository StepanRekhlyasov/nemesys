<template>
   <q-card style="width: 600px; max-width: 80vw">
    <q-card-section>
      <q-form class="q-mb-md">
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-icon name="mdi-alert-circle text-red" size="sm" class="content-end"/>
          <div class="text-h5 text-weight-bold text-accent">{{ $t('operationChange.modal.temporaryOperation') }}
            <span class="text-red">{{ $t('operationHistory.' + $props.dialogMode) }}</span>
            {{ $t('operationChange.modal.emit') }}
          </div>
        </div>
        <q-input v-model="note" :label="$t('operationChange.modal.note') + '*'" color="accent" aria-required="true"/>


      </q-form>
      <div class="row justify-end items-center q-gutter-sm q-mb-md">
        <q-btn
          :ripple="false"
          color="accent"
          class="q-py-none text-weight-bold text-caption "
          size="sm"
          @click.once="emitOperation"
          :disable="!note"
        >
        {{ $t('operationHistory.' + $props.dialogMode) }}
        </q-btn>

        <q-btn
          class="q-py-none text-weight-bold text-accent"
          size="sm"
          outline
          color="accent"
          no-caps
          :unelevated="false"
          @click.once="$emit('closeDialog')"
          >
          {{ $t('operationChange.modal.cancel') }}
        </q-btn>
      </div>

    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const props = defineProps<{
    dialogMode: string,
  }>()

  const emit = defineEmits<{
  (e: 'stopOperation', note: string): void
  (e: 'resumeOperation', note: string): void
}>()

  const note = ref('')

  const emitOperation = () => {
    if (props.dialogMode === 'stop') {
      emit('stopOperation', note.value);
    } else emit('resumeOperation', note.value);
  }

</script>
