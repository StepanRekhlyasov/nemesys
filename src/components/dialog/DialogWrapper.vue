<template>
  <q-card style="max-width: 40vw" :style="{ width: width }" class="no-scroll">
    <slot>

    </slot>
  </q-card>
</template>

<script setup lang="ts">
interface DialogWrapperProps {
  width?: string
}
withDefaults(defineProps<DialogWrapperProps>(), {
  width: '1000px'
})
</script>



