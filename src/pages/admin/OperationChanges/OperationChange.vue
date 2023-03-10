<template>
  <div class="no-shadow full-width operation-change ">
    <PageHader>
      {{ $t('menu.admin.operationChange') }}
    </PageHader>
    <div class="operation-change__content q-pa-md">
      <div class="text-h5 text-weight-bold text-accent">{{ isDevMode ? $t('operationChange.disabled') : $t('operationChange.active') }}</div>
      <div class="row q-mt-md q-gutter-md">
        <q-btn
          :ripple="false"
          color="secondary"
          no-caps
          class="text-grey-9 q-py-none text-weight-bold text-caption"
          :disable="!isDevMode"
          @click="() => openOperationDialog('resume')"
        >
          {{ $t('operationChange.resume') }}
        </q-btn>

        <q-btn
          :ripple="false"
          color="negative"
          no-caps
          class="q-py-none text-weight-bold text-caption"
          :disable="isDevMode"
          @click="() => openOperationDialog('stop')"
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
      :dialogMode="dialogMode"
    />
  </q-dialog>
</template>

<script lang="ts" setup>
  import {computed, ref, onMounted } from 'vue';
  import { useMaintainModeStore } from 'src/stores/admin/maintainMode';
  import { parseDateSecondsToHours } from 'src/shared/utils/Admin.utils';
  import { QueryDocumentSnapshot, DocumentData, serverTimestamp } from '@firebase/firestore';
  import { useQuasar, date } from 'quasar';
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
  import DialogFormOperationChange from './components/DialogForm.vue'
  import PageHader from 'src/components/PageHeader.vue'
  import { useOperationChange } from 'src/stores/admin/operationChange';


  const $q = useQuasar();
  const { t } = useI18n({ useScope: 'global' });
  const store = useMaintainModeStore()
  const operationStore = useOperationChange()
  const isDevMode = computed(() => store.maintainMode);
  const wholeOperationDocs = ref<QueryDocumentSnapshot<DocumentData>[]>([])
  const user :User | null = $q.localStorage.getItem('userData');

  const openDialog = ref(false);
  const dialogMode = ref('')
  const arrayOfStopOperationTime = ref<number[]>([])
  const arrayOfWorkOperationTime = ref<number[]>([])

  const information =  ref({
      continiousOperatingTime: '',
      maxOperatingTime: '',
      totalHoursWorked: '',
      continiousStopTime: '',
      maxStopTime: '',
      totalStoppedTime: '',
  })


  onMounted(async () => {
    await operationStore.getOperationDocs()

    if (!Array.isArray(operationStore.state.operationStoppedDocs)) {
      wholeOperationDocs.value = operationStore.state.operationStoppedDocs.docs
    }

    if (!Array.isArray(operationStore.state.operationWorkingDocs)) {
      const amountOfOperatingTime = date.getDateDiff(new Date(), operationStore.state.operationWorkingDocs.docs[0].data().date.toDate(), 'seconds')
      information.value.continiousOperatingTime = isDevMode.value ? t('operationChange.stopped') : parseDateSecondsToHours(amountOfOperatingTime)

      if (!isDevMode.value) {
        arrayOfWorkOperationTime.value = [...arrayOfWorkOperationTime.value, amountOfOperatingTime ]
      }

      operationStore.state.operationWorkingDocs.docs.forEach(item => {
        arrayOfStopOperationTime.value = [...arrayOfStopOperationTime.value, item.data().timeFromPreviousOperation]
      })

    }

    if (!Array.isArray(operationStore.state.operationStoppedDocs)) {
      const amountOfStoppedTime = date.getDateDiff(new Date(), operationStore.state.operationStoppedDocs.docs[0].data().date.toDate(), 'seconds')
      information.value.continiousStopTime = isDevMode.value ?  parseDateSecondsToHours(amountOfStoppedTime) : t('operationChange.working')

      if (isDevMode.value) {
        arrayOfStopOperationTime.value = [...arrayOfStopOperationTime.value, amountOfStoppedTime ]
      }

      operationStore.state.operationStoppedDocs.docs.forEach(item => {
        arrayOfWorkOperationTime.value = [...arrayOfWorkOperationTime.value, item.data().timeFromPreviousOperation]
      })
    }

    if (arrayOfWorkOperationTime.value.length) {
      const maxWorkPeriod = arrayOfWorkOperationTime.value.sort((a, b) => b - a)
      information.value.maxOperatingTime =  parseDateSecondsToHours(maxWorkPeriod[0])

      const totalSecondsOfWorking = arrayOfWorkOperationTime.value.reduce((acc, item) => {
        return acc + item
      }, 0)
      information.value.totalHoursWorked  = parseDateSecondsToHours(+totalSecondsOfWorking)
    }

    if (arrayOfStopOperationTime.value.length) {
      const maxStopPeriod = arrayOfStopOperationTime.value.sort((a, b) => b - a)
      information.value.maxStopTime =  parseDateSecondsToHours(maxStopPeriod[0])

      const totalSecondsOfStop = arrayOfStopOperationTime.value.reduce((acc, item) => {
        return acc + item
      }, 0)
      information.value.totalStoppedTime  = parseDateSecondsToHours(+totalSecondsOfStop)
    }


  });

  const stopOperation = async (note: string) => {
    if (user) {
      try {
        const res = await operationStore.addOperation({
          typeOperation: 'stop' ,
          date: serverTimestamp(),
          executor: user.id,
          note,
          timeFromPreviousOperation: date.getDateDiff(new Date(), wholeOperationDocs.value[0].data().date.toDate(), 'seconds')
        })

        if (res.id) {
          openDialog.value = false
          Alert.success($q, t)
          store.setMaintainModeEnabled()
        }
      } catch {
        Alert.warning($q, t)
      }
    }

  }

  const resumeOperation = async (note: string) => {
      if (user) {
        try {
          const res = await operationStore.addOperation({
            typeOperation: 'resume' ,
            date: serverTimestamp(),
            executor: user.id,
            note,
            timeFromPreviousOperation: date.getDateDiff(new Date(), wholeOperationDocs.value[0].data().date.toDate(), 'seconds')
          })

          if (res.id) {
            openDialog.value = false
            Alert.success($q, t)
            store.setMaintainModeDisabled()
          }
        } catch {
          Alert.warning($q, t)
        }
    }
  }

  const openOperationDialog = (mode: 'resume' | 'stop') => {
    dialogMode.value = mode,
    openDialog.value = true
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
