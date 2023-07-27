<template>
    <q-card-section class="bg-grey-3">
    <div class="row q-pt-md q-gutter-sm applicant__inputWrapper">
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t("inquiry.table.status") }}</p>
        <q-select 
          outlined 
          dense 
          :options="[
            {
              label: $t('releaseNotes.' + DELIVERY_STATUS.delivered),
              value: DELIVERY_STATUS.delivered
            },
            {
              label: $t('releaseNotes.' + DELIVERY_STATUS.notDelivered),
              value: DELIVERY_STATUS.notDelivered
            },
          ]" 
          v-model="filter.status"
          bg-color="white" 
          :label = "$t('common.pleaseSelect')" 
          emit-value 
          map-options 
          color="accent" 
          clearable
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t("inquiry.table.category") }}</p>
        <q-input
          v-model="filter.category"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t("releaseNotes.form.subject") }}</p>
        <q-input
          v-model="filter.subject"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t("releaseNotes.table.author") }}</p>
        <q-select 
          outlined 
          dense 
          :options="authorOptions" 
          v-model="filter.author"
          bg-color="white" 
          :label = "$t('common.pleaseSelect')" 
          emit-value 
          map-options 
          color="accent" 
          clearable
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t('releaseNotes.form.content') }}</p>
        <q-input
          v-model="filter.content"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2 flex items-center">
        <p class="q-ml-md inputLabel text-capitalize q-mt-md">{{ $t('releaseNotes.table.deliveryDate') }}</p>
        <div class="flex items-center no-wrap">
          <q-input 
            type="date" 
            v-model="deliveryFrom" 
            outlined 
            dense 
            mask="YYYY/MM/DD"
            class="q-mr-xs q-ml-xs"
            bg-color="white"
            color="accent" 
          />
          ~
          <q-input 
            type="date" 
            v-model="deliveryTo" 
            outlined 
            dense 
            mask="YYYY/MM/DD"
            class="q-mr-xs q-ml-xs"
            bg-color="white"
            color="accent" 
          />
        </div>
        </div>
    </div>
  </q-card-section>
  <q-card-section class="q-pa-none">
    <q-table :columns="notificationTableColumns" :rows="tableRows" row-key="id" v-model:pagination="pagination" class="no-shadow bg-grey-2" color="primary" table-header-style="background-color: #ffffff" :loading="loading">
      <template v-slot:body-cell-edit="props">
        <EditButton color="accent" :props="props"
          :on-edit="() => {editableNotification = JSON.parse(JSON.stringify(props.row))}"
          @onEditableRowChange="(rowIndex) => editableRow = rowIndex"
          :on-save="() => editNotification(JSON.parse(JSON.stringify(props.row)))"
          :editable-row="editableRow ?? -1" />
      </template>

      <template v-slot:body-cell-subject="props">
        <q-td :props="props">
          <q-input color="accent" v-if="isRowSelected(props.rowIndex)" v-model="props.row.subject" />
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.subject }}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-content="props">
        <q-td :props="props">
          <q-input color="accent" v-if="isRowSelected(props.rowIndex)" v-model="props.row.content" />
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.content }}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props" auto-width>
          <q-btn icon="delete" flat @click="deleteNotification(props.row.id)" />
        </q-td>
      </template>

      <template v-slot:body-cell-author="props">
        <q-td :props="props">
          {{ props.row.author || t('common.userNotFound') }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          {{ $t('releaseNotes.' + props.row.status) }}
        </q-td>
      </template>

    </q-table>
  </q-card-section>
</template>

<script lang="ts" setup>
import { date, is, useQuasar } from 'quasar';
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { serverTimestamp } from '@firebase/firestore';
import EditButton from 'components/EditButton.vue';
import { DELIVERY_STATUS, NotificationDataRow } from '../types/notificationTypes'
import { User } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useReleaseNotes } from 'src/stores/releaseNotes';
import { useUserStore } from 'src/stores/user';
import { notificationTableColumns } from '../../InquiryPage/const/inquiry.const';


const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();


const releaseNoteStore = useReleaseNotes()
const userStore = useUserStore()
const filter = ref({
  status : '',
  category : '',
  subject : '',
  author : '',
  content: '',
})

const deliveryFrom = ref('')
const deliveryTo = ref('')

const loading = ref(true)

const editableRow = ref < number | null > (null)
const editableNotification = ref < NotificationDataRow > ()
const notificationTableRows = ref < NotificationDataRow[] > ([])

const authorOptions = computed(()=>{
  const users = {}
  notificationTableRows.value.forEach((row)=>{
    if(row.author){
      users[row.author] = {
        label: row.author,
        value: row.author,
      }
    }
  })
  return Object.values(users)
})
const tableRows = computed(()=>{
  let result = notificationTableRows.value
  for(const [key, value] of Object.entries(filter.value)){
    result = result.filter((row)=>{
      if(filter.value[key]){
        if(key === 'status'){
          return row[key].toLowerCase() === value.toLowerCase()
        } else {
          return row[key].toLowerCase().includes(value.toLowerCase())
        }
      } else {
        return row
      }
    })
  }
  if(deliveryFrom.value){
    result = result.filter((row)=>{
      return new Date(row.deliveryDate) >= new Date(deliveryFrom.value + ' 00:00:00')
    })
  }
  if(deliveryTo.value){
    result = result.filter((row)=>{
      return new Date(row.deliveryDate) <= new Date(deliveryTo.value + ' 23:59:59')
    })
  }
  return result
})


const user: User | null = $q.localStorage.getItem('userData');

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
});

const loadCurrentNotifications = async () => {
    notificationTableRows.value = []
    const docWholeSnap = await releaseNoteStore.getAllNotifications();
    if (!docWholeSnap.empty) {
        docWholeSnap.docs.forEach(async (item, index) => {
            const author = await userStore.getUserById(item.data().author)
            notificationTableRows.value = [...notificationTableRows.value, {
                number: index + 1,
                id: item.id,
                status: item.data().status,
                category: t('releaseNotes.form.options.' + item.data().category),
                subject: item.data().subject,
                content: item.data().content,
                author: author?.name ?? '',
                creationDate: date.formatDate(item.data().dateCreation.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                deliveryDate: date.formatDate(item.data().dateDelivery.toDate(), 'YYYY-MM-DD HH:mm:ss'),
            }]
        })

    }
}

onMounted(async () => {
    await loadCurrentNotifications();
    loading.value = false
});

const isRowSelected = (index: number) => {
  return index == editableRow.value
}

const editNotification = async (notification: NotificationDataRow) => {
  const isNotificationChanged = !is.deepEqual(notification, editableNotification.value)

  if (isNotificationChanged && user) {
      loading.value = true
      try {
          await releaseNoteStore.updateNotificationData(notification.id, {
              updated_at: serverTimestamp(),
              author: user.id,
              subject: notification.subject,
              content: notification.content
          });
          await loadCurrentNotifications();
          loading.value = false
          Alert.success();
      } catch (error) {
          console.error(error)
          Alert.warning(error);
          loading.value = false;
      }
  }
  return
}

const deleteNotification = (notificationId: string) => {
  $q.dialog({
      title: t('common.delete'),
      message: t('releaseNotes.table.deletedInfo'),
      ok: {
          label: t('common.delete'),
          color: 'negative',
          class: 'no-shadow',
          unelevated: true
      },
  }).onOk(async () => {
      try {
          loading.value = true;
          await releaseNoteStore.deleteNotificationData(notificationId)
          await loadCurrentNotifications();
          loading.value = false;
          Alert.success()
      } catch (e) {
          console.error(e)
          Alert.warning(e)
          loading.value = false;
      }
  })
}
</script>
