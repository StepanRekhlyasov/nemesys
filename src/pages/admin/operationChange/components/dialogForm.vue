<template>
   <q-card style="width: 600px; max-width: 80vw">
    <q-card-section>
      <q-form @submit="stopOperation"  class="q-mb-md">
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
          @click="stopOperation"
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
  import {  date, useQuasar } from 'quasar';
  import { ref, SetupContext } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { addDoc, collection, getFirestore } from '@firebase/firestore';
  import { useMaintainModeStore } from 'src/stores/admin/maintainMode';
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';

  export default {
    name: 'DialogFormOperationChange',

    props: {
      operationDocs: {
        type: Object,
        required: false
      },
    },
    setup(props, context: SetupContext) {
      const $q = useQuasar();
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      const user :User | null = $q.localStorage.getItem('userData');
      const store = useMaintainModeStore()
      const text = ref('')

      const stopOperation = () => {
        if (user && props.operationDocs && props.operationDocs?.value ) {
          addDoc(collection(db, 'maintainModeEvent'), {
            startDate: new Date(),
            initiator: user.id,
            endDate: null,
            totalStopPeriod: null,
            totalWorkPeriod: date.getDateDiff(new Date(), props.operationDocs?.value[0].data().endDate.toDate(), 'seconds')
          })
          .then(() =>  {
            context.emit('closeDialog');
            Alert.success($q, t)
            store.setMaintainModeEnabled()
          })
          .catch(() => Alert.warning($q, t))
        }
      }

      const exitDialog = () => {
        context.emit('closeDialog');
      }

      return {
        stopOperation,
        exitDialog,
        text
      }
    }
  }
</script>
