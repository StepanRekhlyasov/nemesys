<template>
  <q-card flat class=" bg-grey-2">
   <q-card-section>
     <q-form ref="notificationForm" class="q-mb-xs notification-create">
      <div class="row items-center q-gutter-md q-mb-xs">
        <div class="col-2 text-right">
          <span>{{ $t('releaseNotes.form.category') }}</span>
        </div>
        <q-option-group
          v-model="category"
          :options="NOTIFICATION_OPTIONS"
          color="accent"
          inline
        />
      </div>

      <div class="row items-center q-gutter-md q-mb-xs">
        <div class="col-2 text-right">
          <span>{{ $t('releaseNotes.form.subject') }}</span>
        </div>
        <q-input
            dense  v-model="subject" borderless input-style="height: 28px;" input-class="notification-create__field notification-create__field--grow" autogrow/>
      </div>

      <div class="row items-center q-gutter-md q-mb-xs">
        <div class="col-2 text-right">
          <span>{{ $t('releaseNotes.form.content') }}</span>
        </div>
        <q-input
            dense v-model="content" borderless input-style="min-height: 45px;" input-class="notification-create__field notification-create__field--grow" autogrow />
      </div>

      <div class="row items-center q-gutter-md q-mb-sm">
        <div class="col-2 text-right">
          <span>{{ $t('releaseNotes.form.date') }}</span>
        </div>
        <div style="max-width: 300px">
          <q-input
            type="date"
            borderless
            v-model="date"
            dense
            input-style="height: 28px;" input-class="notification-create__field q-mb-xs"
          />
          <q-input
            type="time"
            borderless
            v-model="time"
            dense
            input-style="height: 28px;" input-class="notification-create__field q-mb-xs"
          />
        </div>
      </div>
      <div class="row items-center q-mx-lg q-mb-xs">
        <div class="offset-md-2 row q-gutter-sm">
          <q-btn
            :ripple="false"
            color="accent"
            class="q-py-none text-weight-bold text-caption "
            size="sm"
            @click="publishNotification"
            :disable="!category || !subject || !content || !!date || !!time"
            style="margin-left: 2px;"
          >
            {{ $t('releaseNotes.form.deliverNow') }}
          </q-btn>

          <q-btn
            class="q-py-none text-weight-bold text-accent"
            size="sm"
            outline
            color="accent"
            no-caps
            :unelevated="false"
            :disable="!category || !subject || !content || !date || !time"
            @click="delayedPublish"
            >
            {{ $t('releaseNotes.form.deliverReserve') }}
          </q-btn>

          <q-btn
            class="q-py-none text-weight-bold text-accent"
            size="sm"
            outline
            color="accent"
            no-caps
            :unelevated="false"
            @click="clearAllValues"
            >
            {{ $t('releaseNotes.form.cancel') }}
          </q-btn>
        </div>
      </div>

    </q-form>
   </q-card-section>
 </q-card>
</template>

<script lang="ts" setup>
import { serverTimestamp } from '@firebase/firestore';
  import { useQuasar } from 'quasar';
  import { ref, computed , onMounted } from 'vue'
  import { DELIVERY_STATUS } from '../types/notificationTypes'
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
  import { QForm } from 'quasar';
  import { Timestamp } from 'firebase/firestore';
  import { useReleaseNotes } from 'src/stores/releaseNotes';
  const notificationForm = ref<QForm | null>(null);
  const emit = defineEmits<{
    (e:'changeKey');
  }>()
  const $q = useQuasar();

  const { t } = useI18n({ useScope: 'global' });

  const store = useReleaseNotes()

  const user :User | null = $q.localStorage.getItem('userData');

  const category = ref('')
  const subject = ref('')
  const content = ref('')
  const date = ref('')
  const time = ref('')

  const NOTIFICATION_OPTIONS =computed(() => {
    return [
    {
      label: t('releaseNotes.form.options.op1') ,
      value: 'op1'
    },
    {
      label: t('releaseNotes.form.options.op2') ,
      value: 'op2'
    },
  ]
  })

    const publishNotification = async () => {
      if (user) {
        try {
          const res = await store.publishNotificationData({
          author: user.id,
          category: category.value,
          dateCreation: serverTimestamp(),
          dateDelivery: serverTimestamp(),
          subject: subject.value,
          content: content.value,
          status: DELIVERY_STATUS.delivered,
        })

          if (res.id) {
          clearAllValues()
          notificationForm.value?.resetValidation();
          }
        } catch(e) {
          Alert.warning(e)
        }
      }
      emit('changeKey');
    }

   const delayedPublish = async () => {
    if (user) {
      try {
        const res = await store.publishNotificationData({
          author: user.id,
          dateCreation: serverTimestamp(),
          dateDelivery: new Date(`${date.value} ${time.value}`),
          category: category.value,
          subject: subject.value,
          content: content.value,
          status: DELIVERY_STATUS.notDelivered,
        })

        if (res.id) {
           clearAllValues()
          notificationForm.value?.resetValidation();
        }
      } catch(e) {
        Alert.warning(e)
      }
    }
    emit('changeKey');
  }


  const clearAllValues = () => {
      category.value = ''
      subject.value = ''
      content.value = ''
      date.value = ''
      time.value = ''
    }

    const updateScheduledNotifications = async () => {
  try {
    const querySnapshot = await store.getAllNotifications();
    const notifications = querySnapshot.docs;

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 330);

    for (const notification of notifications) {
      const dateDeliveryObject = notification.data().dateDelivery;

      if (dateDeliveryObject instanceof Timestamp) {
        const dateDelivery = dateDeliveryObject.toDate();

        dateDelivery.setMinutes(dateDelivery.getMinutes() + 330);

        if (dateDelivery instanceof Date && dateDelivery <= currentTime) {

          await store.updateNotificationData(notification.id, {
            status: DELIVERY_STATUS.delivered,
          });
        }
      }
    }
  } catch (e) {

    console.error('Error updating scheduled notifications:', e);
  }
};





onMounted(async () => {
  await updateScheduledNotifications();
});
</script>

<style lang="scss">
@import "src/css/imports/colors";
  .notification-create {
    &__field {
      border: 1px solid $input-border;
      border-radius: 3px;
      max-height: 28px;
      width: 350px;
      height: 28px;
      padding: 6px 10px;
      margin: auto;

      &--grow {
        max-height: fit-content;
        resize: vertical;
        min-height: 45px;
        padding-top: 0;
      }
    }
  }

</style>
