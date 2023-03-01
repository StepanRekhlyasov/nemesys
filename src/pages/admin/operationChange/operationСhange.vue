<template>
  <div class="no-shadow full-width operation-change ">
    <div class="operation-change__header q-py-sm q-px-md">
      <div class="text-h6 text-accent">{{ $t('menu.admin.operationChange') }}</div>
    </div>
    <div class="operation-change__content q-pa-md">
      <div class="text-h5 text-weight-bold text-accent">{{ isDevMode ? $t('operationChange.disabled') : $t('operationChange.active') }}</div>
      <div class="row q-mt-md q-gutter-md">
        <q-btn
          :ripple="false"
          color="secondary"
          no-caps
          class="text-grey-9 q-py-none text-weight-bold text-caption"
          :disable="!isDevMode"
          @click="resumeOperation"
        >
          {{ $t('operationChange.resume') }}
        </q-btn>

        <q-btn
          :ripple="false"
          color="negative"
          no-caps
          class="q-py-none text-weight-bold text-caption"
          :disable="isDevMode"
          @click="openDialog=true;"
          >
          {{ $t('operationChange.stop') }}
        </q-btn>
      </div>
      <div class="q-px-md q-py-lg row">
        <div class="col-4 grid-style-transition">
          <q-list dense>
            <q-item  v-for="(value, name, index) in information" :key="index">
                <q-item-section>
                  <q-item-label class="text-right q-mr-md text-accent"> {{  $t(`operationChange.information.${[name]}`) }}</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-item-label caption> {{ value }}
                </q-item-label>
                </q-item-section>
            </q-item>

          </q-list>
        </div>
      </div>
    </div>
  </div>
  <q-dialog v-model="openDialog">
    <DialogFormOperationChange
      @closeDialog="openDialog=false;"
      @stopOperation="stopOperation"
      @resumeOperation="resumeOperation"
    />
  </q-dialog>
</template>

<script lang="ts">
  import {computed, ref, Ref, onMounted } from 'vue';
  import { useMaintainModeStore } from 'src/stores/admin/maintainMode';
  import { getMaintainEnabledEvent, parseDateSecondsToHours } from 'src/shared/utils/Admin.utils';
  import { getFirestore, updateDoc, addDoc, doc, collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, orderBy, limit } from '@firebase/firestore';
  import { useQuasar, date } from 'quasar';
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
  import DialogFormOperationChange from './components/dialogForm.vue'

  export default {
    name: 'OperationСhangePage',

    components: {
      DialogFormOperationChange
    },
    setup() {
      const $q = useQuasar();
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      const store = useMaintainModeStore()
      const isDevMode = computed(() => store.maintainMode);
      const wholeOperationDocs: Ref<QueryDocumentSnapshot<DocumentData>[]> = ref([])
      const user :User | null = $q.localStorage.getItem('userData');

      const openDialog = ref(false);

      const information =  ref({
          continiousOperatingTime: '',
          maxOperatingTime: '',
          totalHoursWorked: '',
          continiousStopTime: '',
          maxStopTime: '',
          totalStoppedTime: '',
      })


    onMounted(async () => {
      const docWholeSnap = await getDocs(query(collection(db, 'maintainModeEvent'), orderBy('date', 'desc')));
      const docStoppedSnap = await getDocs(query(collection(db, 'maintainModeEvent'), where('typeOperation', '==', 'stop'), orderBy('date', 'desc')));
      const docWorkingSnap = await getDocs(query(collection(db, 'maintainModeEvent'), where('typeOperation', '==', 'resume'), orderBy('date', 'desc')));

      if (!docWholeSnap.empty) {
        wholeOperationDocs.value = docWholeSnap.docs
      }

      if (!docWorkingSnap.empty) {
        console.log(docWorkingSnap.docs[0].data())
        const amountOfOperatingTime = date.getDateDiff(new Date(), docWorkingSnap.docs[0].data().date.toDate(), 'seconds')
        information.value.continiousOperatingTime = isDevMode.value ? t('operationChange.stopped') : parseDateSecondsToHours(amountOfOperatingTime)
      }

      if (!docStoppedSnap.empty) {
        const amountOfStoppedTime = date.getDateDiff(new Date(), docStoppedSnap.docs[0].data().date.toDate(), 'seconds')
        information.value.continiousStopTime = isDevMode.value ?  parseDateSecondsToHours(amountOfStoppedTime) : t('operationChange.working')
      }

      // if (!docTotalSecondsWorkedSnap.empty) {
      //   const maxWorkPeriod = docTotalSecondsWorkedSnap.docs[0].data().totalWorkPeriod
      //   information.value.maxOperatingTime =  parseDateSecondsToHours(maxWorkPeriod)

      //   const totalSecondsOfWorking = docTotalSecondsWorkedSnap.docs.reduce((acc, item) => {
      //     return acc + item.data().totalWorkPeriod
      //   }, 0)
      //   information.value.totalHoursWorked  = parseDateSecondsToHours(+totalSecondsOfWorking)
      // }

      // if (!docTotalSecondsStoppedSnap.empty) {
      //   const maxStopPeriod = docTotalSecondsStoppedSnap.docs[0].data().totalStopPeriod
      //   information.value.maxStopTime =  parseDateSecondsToHours(maxStopPeriod)

      //   const totalSecondsOfStop = docTotalSecondsStoppedSnap.docs.reduce((acc, item) => {
      //   return acc + item.data().totalStopPeriod
      //   }, 0)
      // information.value.totalStoppedTime  = parseDateSecondsToHours(+totalSecondsOfStop)
      // }


    });



      const stopOperation = (note) => () => {
        if (user) {
          addDoc(collection(db, 'maintainModeEvent'), {
            typeOperation: 'stop' ,
            date: new Date(),
            executor: user.id,
            note,
            timeFromPreviousOperation: date.getDateDiff(new Date(), wholeOperationDocs.value[0].data().date.toDate(), 'seconds')
          })
          .then(() =>  {

            openDialog.value = false
            Alert.success($q, t)
            store.setMaintainModeEnabled()
          })
          .catch(() => Alert.warning($q, t))
        }

      }

      const resumeOperation =  () => {

          if (user) {
            addDoc(collection(db, 'maintainModeEvent'), {
              typeOperation: 'resume' ,
              date: new Date(),
              executor: user.id,
              note: 'resuming operation',
              timeFromPreviousOperation: date.getDateDiff(new Date(), wholeOperationDocs.value[0].data().date.toDate(), 'seconds')
            })
            .then(() =>  {

              openDialog.value = false
              Alert.success($q, t)
              store.setMaintainModeEnabled()
            })
            .catch(() => Alert.warning($q, t))
        }
      }

      return {
        isDevMode,
        information,
        stopOperation,
        resumeOperation,
        openDialog
      }
    }
  }
</script>

<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
.operation-change {
  &__header {
    border-bottom: 2px solid $grey-5;
  }
}
</style>
