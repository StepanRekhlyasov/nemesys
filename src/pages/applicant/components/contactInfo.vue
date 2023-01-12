<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="bg-grey-2 q-pa-xs q-mb-none">
      <q-btn :label="$t('applicant.list.contacts.closeContactForm')" :icon="'arrow_drop_up'" flat size="md"
        class="text-grey-9" @click="onReset" v-if="showAddForm" />
      <q-btn :label="$t('applicant.list.contacts.openContactForm')" :icon="'arrow_drop_down'" flat size="md"
        class="text-grey-9" @click="showAddForm = true" v-else />
    </q-card-section>

    <q-card-section class="q-pa-sm bg-grey-2 q-mt-none" v-if="showAddForm">
      <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">
        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('applicant.list.contacts.contactMethod') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="contactData['contactMethod']" val="phone" :label="$t('applicant.list.contacts.phone')" />
            <q-radio v-model="contactData['contactMethod']" val="sms" label="SMS" class="q-ml-sm" />
          </div>
        </div>

        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('applicant.list.contacts.content') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input outlined dense v-model="contactData['content']" class="bg-white" />
          </div>
        </div>

        <div class="row q-pt-sm">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('applicant.list.contacts.note') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input outlined dense v-model="contactData['note']" class="bg-white" />
          </div>
        </div>

        <div class="q-pt-sm">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" icon="mdi-plus-thick"
            class="no-shadow q-ml-md" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>

    <q-table :columns="columns" :rows="contactListData" row-key="id" v-model:pagination="pagination" hide-pagination>

      <template v-slot:body-cell-contactMethod="props">
        <q-td :props="props">
          <div v-if="props.value == 'phone'">
            {{ $t('applicant.list.contacts.phone') }}
          </div>
          <div v-else-if="props.value == 'sms'">
            SMS
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat @click="showEditDialog(props.row)" />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn style="color: #222222"  icon="delete" size="sm" round flat @click="showDeleteDialog(props.row)" />
        </q-td>
      </template>

    </q-table>
  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount } from 'vue';
import { addDoc, collection, serverTimestamp, getFirestore, query, onSnapshot, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';

//import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
//import { teleAppointmentData } from 'src/shared/constants/TeleAppoint.const';

export default {
  name: 'contactInfo',
  components: {
  },

  props: {
    applicant: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const contactListData = ref([])
    const deleteItemId = ref('');

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
        {
          name: 'edit',
          align: 'left',
        },
        {
          name: 'created_at',
          required: true,
          label: t('applicant.list.contacts.dateTime'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'contactMethod',
          required: true,
          label: t('applicant.list.contacts.contactMethod'),
          field: 'contactMethod',
          align: 'left',
        },
        {
          name: 'created_by',
          label: t('applicant.list.contacts.userInharge'),
          field: 'created_by',
          align: 'left',
        },
        {
          name: 'content',
          label: t('applicant.list.contacts.content'),
          field: 'content',
          align: 'left',
        },
        {
          name: 'note',
          label: t('applicant.list.contacts.note'),
          field: 'note',
          align: 'left',
        },
        {
          name: 'delete',
          align: 'left',
        }
      ];
    });

    const loading = ref(false);
    const showAddForm = ref(false)
    const contactData = ref({
    });

    const db = getFirestore();
    const $q = useQuasar();
    const unsubscribe = ref();
    const unsubscribeUsers = ref();

    const dialogType = ref('create')

    loadContactData()
    function loadContactData() {
      const q = query(collection(db, 'applicants/' + props.applicant.id + '/contacts'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        let contData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data['id'] = doc.id;
          contData.push({ ...data, id: doc.id, created_at: toDate(data.created_at) });
        });
        contactListData.value = contData;
      },
        (error) => {
          console.log(error)
          // ...
        });
    }


    const users = ref([]);
    loadUsers()
    function loadUsers() {
      const q = query(collection(db, 'users/'), where('deleted', '==', false));
      unsubscribeUsers.value = onSnapshot(q, (querySnapshot) => {
        let userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, name: doc.data().name });
        });
        users.value = userList;
      });
    }


    onBeforeUnmount(() => {
      unsubscribe.value();
      unsubscribeUsers.value();
    });


    return {
      columns,
      contactListData,
      pagination,

      contactData,
      showAddForm,
      loading,

      async onSubmit() {
        loading.value = true;
        let data = contactData.value;
        if (!data['contactMethod']) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: t('failed'),
          });
          return

        }
        const user = $q.localStorage.getItem('user');

        try {
          if (dialogType.value == 'update') {
            let updateData = {}
            updateData['updated_at'] = serverTimestamp();
            updateData['updated_by'] = user.uid;
            //updateData['result'] = data['result']
            updateData['content'] = data['content']
            updateData['contactMethod'] = data['contactMethod']
            updateData['note'] = data['note']

            await updateDoc(
              doc(db, 'applicants/' + props.applicant.id + '/contacts/' + data['id']),
              updateData
            );
          }
          else {
            data['created_at'] = serverTimestamp();
            data['updated_at'] = serverTimestamp();
            data['deleted'] = false;
            data['created_by'] = user.uid;

            await addDoc(
              collection(db, 'applicants/' + props.applicant.id + '/contacts'),
              data
            );
          }

          loading.value = false;
          contactData.value = {};
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
          dialogType.value = 'create';
          //applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
          //applicantForm.value.resetValidation();
        } catch (error) {
          console.log(error);
          loading.value = false;
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: t('failed'),
          });
        }
      },

      async deleteItem() {
        if (!deleteItemId.value) {
          return false;
        }
        const user = $q.localStorage.getItem('user');

        let updateData = {}
        updateData['deleted'] = true;
        updateData['deleted_by'] = user.uid;
        updateData['deleted_at'] = serverTimestamp();

        await updateDoc(
          doc(db, 'applicants/' + props.applicant.id + '/contacts/' + deleteItemId.value),
          updateData
        );

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
        });
      },
      onReset() {
        //contactData.value = JSON.parse(JSON.stringify(applicantDataSample));
        //applicantForm.value.resetValidation();
        contactData.value = {};
        dialogType.value = 'create';
        showAddForm.value = false;
      },
      getUserName(uid) {
        const value = users.value.find(x => x['id'] === uid)
        if (value) {
          return value['name'];
        }
        return '';
      },
      showEditDialog(data) {
        dialogType.value = 'update';
        contactData.value = JSON.parse(JSON.stringify(data));
        showAddForm.value = true;
      },
      showDeleteDialog(data) {
        $q.dialog({
          title: t('common.delete'),
          message: t('common.deleteInfo'),
          cancel: true,
          persistent: true,
          cancel: t('common.cancel'),
        }).onOk(async () => {
          const user = $q.localStorage.getItem('user');

          let updateData = {}
          updateData['deleted'] = true;
          updateData['deleted_by'] = user.uid;
          updateData['deleted_at'] = serverTimestamp();

          await updateDoc(
            doc(db, 'applicants/' + props.applicant.id + '/contacts/' + data.id),
            updateData
          );

          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
        })
      }

    };
  },
};
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}
</style>

