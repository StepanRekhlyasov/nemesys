<template>
  <q-card-section class="q-pa-none">
    <q-table
      :columns="notificationTableColumns"
      :rows="notificationTableRows"
      row-key="id"
      v-model:pagination="pagination"
      hide-pagination
      class="no-shadow bg-grey-2"
      color="primary"
      table-header-style="background-color: #ffffff"
      :loading="loading">

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

    </q-table>
    <div class="row justify-start q-mt-md q-mb-md pagination q-mx-md">
      <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
        :max="(notificationTableRows.length / pagination.rowsPerPage) >= 1 ? notificationTableRows.length / pagination.rowsPerPage : 1"
        direction-links outline />
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { date, QTableProps, is, useQuasar } from 'quasar';
  import { ref, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { serverTimestamp } from '@firebase/firestore';
  import EditButton from 'components/EditButton.vue';
  import { NotificationDataRow } from '../types/notificationTypes'
  import { User } from 'src/shared/model';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { deleteNotificationData, getAllNotifications, getUser, updateNotificationData } from 'src/shared/utils/ReleaseNotes/ReleaseNotes.utils';


  const { t } = useI18n({ useScope: 'global' });
  const $q = useQuasar();
  const loading = ref(true)

  const editableRow = ref<number | null>(null)
  const editableNotification = ref<NotificationDataRow>()
  const notificationTableRows = ref<NotificationDataRow[]>([])
  const notificationTableColumns = computed<QTableProps['columns']>(() => [
    {
        name: 'edit',
        label: '',
        field: ''
      }, {
      name: 'number',
      label: 'No.',
      field: 'number'
    }, {
      name: 'status',
      required: true,
      label: t('releaseNotes.table.status'),
      field: 'status',
      align: 'left',
      sortable: false,
    }, {
      name: 'category',
      required: true,
      label: t('releaseNotes.form.category'),
      field: 'category',
      align: 'left',
      sortable: false,
    }, {
      name: 'subject',
      required: true,
      label: t('releaseNotes.form.subject'),
      field: 'subject',
      align: 'left',
      sortable: false,
    }, {
      name: 'content',
      required: true,
      label: t('releaseNotes.form.content'),
      field: 'content',
      align: 'left',
      sortable: false,
    },{
      name: 'author',
      required: true,
      label: t('releaseNotes.table.author'),
      field: 'author',
      align: 'left',
      sortable: false,
    }, {
      name: 'creationDate',
      required: true,
      label: t('releaseNotes.table.creationDate'),
      field: 'creationDate',
      align: 'left',
      sortable: false,
    },{
      name: 'deliveryDate',
      required: true,
      label: t('releaseNotes.table.deliveryDate'),
      field: 'deliveryDate',
      align: 'left',
      sortable: false,
    }, {
        name: 'delete',
        label: '',
        field: ''
      }
  ])


  const user :User | null = $q.localStorage.getItem('userData');

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
  });

  const loadCurrentNotifications = async () => {
    notificationTableRows.value = []
    const docWholeSnap = await getAllNotifications();
    if (!docWholeSnap.empty) {
      docWholeSnap.docs.forEach( async (item, index) => {
        const author = await getUser(item.data().author)

        if (author.id) {
          notificationTableRows.value = [...notificationTableRows.value, {
            number: index + 1,
            id: item.id,
            status: t('releaseNotes.' + item.data().status),
            category: t('releaseNotes.form.options.' + item.data().category),
            subject: item.data().subject,
            content: item.data().content,
            author: author?.data()?.name,
            creationDate: date.formatDate(item.data().dateCreation.toDate(), 'YYYY-MM-DD HH:mm:ss'),
            deliveryDate: date.formatDate(item.data().dateDelivery.toDate(), 'YYYY-MM-DD HH:mm:ss'),
          }]
        }
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

    if (!isNotificationChanged) {
      return
    }
    if (user) {
      loading.value = true
      try {
        await updateNotificationData(notification.id, {
          updated_at: serverTimestamp(),
          author: user.id,
          subject: notification.subject,
          content: notification.content
        });
        await loadCurrentNotifications();
        loading.value = false
        Alert.success($q, t);
      } catch (error) {
        console.log(error)
        Alert.warning($q, t);
        loading.value = false;
      }
    }
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
        await deleteNotificationData(notificationId)
        await loadCurrentNotifications();
        loading.value = false;
        Alert.success($q, t)
      } catch (e) {
        console.log(e)
        Alert.warning($q, t)
        loading.value = false;
      }
    })
  }

</script>
