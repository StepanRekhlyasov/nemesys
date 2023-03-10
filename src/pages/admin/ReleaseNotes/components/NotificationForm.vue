<template>
  <q-card flat class=" bg-grey-2">
   <q-card-section>
     <q-form class="q-mb-xs notification-create">
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
            dense  v-model="subject" borderless input-style="height: 28px;" input-class="notification-create__field" />
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
            @click.once="publishNotification"
            :disable="!category || !subject || !content"
            style="margin-left: 2px;"
          >
            {{ $t('releaseNotes.form.send') }}
          </q-btn>

          <q-btn
            class="q-py-none text-weight-bold text-accent"
            size="sm"
            outline
            color="accent"
            no-caps
            :unelevated="false"
            :disable="!category || !subject || !content || !date || !time"
            @click.once="delayedPublish"
            >
            {{ $t('releaseNotes.form.delay') }}
          </q-btn>

          <q-btn
            class="q-py-none text-weight-bold text-accent"
            size="sm"
            outline
            color="accent"
            no-caps
            :unelevated="false"
            @click.once="clearAllValues"
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
  import { ref } from 'vue'
  import { DELIVERY_STATUS } from '../types/notificationTypes'
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
import { useReleaseNotes } from 'src/stores/admin/releaseNotes';

  const $q = useQuasar();

  const { t } = useI18n({ useScope: 'global' });

  const store = useReleaseNotes()

  const user :User | null = $q.localStorage.getItem('userData');

  const category = ref('')
  const subject = ref('')
  const content = ref('')
  const date = ref('')
  const time = ref('')

  const NOTIFICATION_OPTIONS = [
    {
      label: t('releaseNotes.form.options.op1') ,
      value: 'op1'
    },
    {
      label: t('releaseNotes.form.options.op2') ,
      value: 'op2'
    },
  ]


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
          status: DELIVERY_STATUS[0],
        })

          if (res.id) {
            Alert.success($q, t)
          }
        } catch {
          Alert.warning($q, t)
        }
      }

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
          status: DELIVERY_STATUS[0],
        })

        if (res.id) {
          Alert.success($q, t)
        }
      } catch {
        Alert.warning($q, t)
      }
    }
  }


  const clearAllValues = () => {
      category.value = ''
      subject.value = ''
      content.value = ''
      date.value = ''
      time.value = ''
    }


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
