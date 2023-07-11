<template>
  <div>
    <q-dialog full-height full-width v-model="pdfViewer" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />
        <q-card-section>
          <iframe :src="props.url" frameborder="0"></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { pdfViewer } from '../consts';

const props = defineProps<{
  url: string;
}>();
</script>

<style lang="scss">
iframe {
  display: block; /* iframes are inline by default */
  background: #000;
  border: none; /* Reset default border */
  height: 80vh; /* Viewport-relative units */
  width: 93vw;
}
</style>
