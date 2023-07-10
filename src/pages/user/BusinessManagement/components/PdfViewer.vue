<template>
  <div>
    <q-dialog style="height:100%" v-model="pdfViewer" persistent :content-css="dialogContentStyle">
      <q-card style="height:100%">
        <q-card-section>
          <iframe :src="props.url" width="1000px" height="600px"></iframe>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Close" color="primary" @click="closePdfDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { pdfViewer } from '../consts';
import { ref } from 'vue'

const props = defineProps<{
  url: string
}>()

const closePdfDialog = () => {
  pdfViewer.value = false;
};

const dialogContentStyle = ref({
  width: '90%',
});

</script>
<style lang="scss">
.q-dialog-plugin {
  width: 90%;
  max-width: 100%;
}
</style>
