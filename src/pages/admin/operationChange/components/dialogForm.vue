<template>
   <q-card style="width: 600px; max-width: 80vw">
    <q-card-section>
      <q-form class="q-mb-md">
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-icon name="mdi-alert-circle text-red" size="sm" class="content-end"/>
          <div class="text-h5 text-weight-bold text-accent">システムの稼働を一時的に<span class="text-red">停止</span>します。</div>
        </div>
        <q-input v-model="text" label="メモ*" color="accent"/>


      </q-form>
      <div class="row justify-end items-center q-gutter-sm q-mb-md">
        <q-btn
          :ripple="false"
          color="accent"
          class="q-py-none text-weight-bold text-caption "
          size="sm"
          @click="emitOperation"
        >
          実行
        </q-btn>

        <q-btn
          class="q-py-none text-weight-bold text-accent"
          size="sm"
          outline
          color="accent"
          no-caps
          :unelevated="false"
          @click="exitDialog"
          >
          キャンセル
        </q-btn>
      </div>

    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import { useQuasar } from 'quasar';
  import { ref, SetupContext } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'DialogFormOperationChange',

    props: {
      dialogMode: {
        type: String,
        required: true
      },
    },
    setup(props, context: SetupContext) {
      const $q = useQuasar();
      const { t } = useI18n({ useScope: 'global' });
      const text = ref('')

      const emitOperation = () => {
        console.log(props.dialogMode)
        if (props.dialogMode === 'stop') {
          context.emit('stopOperation', text);
        } else context.emit('resumeOperation', text);
      }

      const exitDialog = () => {
        context.emit('closeDialog');
      }

      return {
        emitOperation,
        exitDialog,
        text
      }
    }
  }
</script>
