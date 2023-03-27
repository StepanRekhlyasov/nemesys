<template>
  <q-card-section>
    {{ $t(headerKey) }}
  </q-card-section>
  <q-separator />
</template>

<script setup lang="ts">
import { LocalizationKeys } from 'src/shared/types/LocalizationKeys';

interface DialogHeadeProps {
  headerKey: LocalizationKeys
}

defineProps<DialogHeadeProps>()
</script>

<style scoped></style>
