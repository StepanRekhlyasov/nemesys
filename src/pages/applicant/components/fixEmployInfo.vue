<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <span class="text-primary text-h6 q-pt-md"> {{ $t('applicant.list.fixEmployment.fixDestinationOffice') }} </span>
      <q-btn :label="$t('common.addNew')" color="primary" icon="mdi-plus-thick" size="sm" @click="drawerRight = true"
        class="no-shadow q-ml-lg" />
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
      <template v-slot:body-cell-fixDate="props">
        <q-td :props="props">
          <template v-if="props.row.status">
            <span class="row">{{ props.row.data }}</span>
            <span class="row text-uppercase">{{ props.row.status }}</span>
          </template>
          <span v-if="!props.row.status">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-workDay="props">
        <q-td :props="props">
          <template v-if="props.row.inspectionStatus">
            <span class="row">{{ props.row.inspectionDate }}</span>
            <span class="row text-uppercase">{{ props.row.inspectionStatus }}</span>
          </template>
          <span v-if="!props.row.inspectionStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-informalOfferDate="props">
        <q-td :props="props">
          <template v-if="props.row.offerStatus">
            <span class="row">{{ props.row.offerDate }}</span>
            <span class="row text-uppercase">{{ props.row.offerStatus }}</span>
          </template>
          <span v-if="!props.row.offerStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-hiringDate="props">
        <q-td :props="props">
          <template v-if="props.row.admissionStatus">
            <span class="row">{{ props.row.admissionDate }}</span>
            <span class="row text-uppercase">{{ props.row.admissionStatus }}</span>
          </template>
          <span v-if="!props.row.admissionStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat
            @click="showEditDialog(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn style="color: #222222" icon="delete" size="sm" round flat @click="showDeleteDialog(props.row)" />
        </q-td>
      </template>

    </q-table>

  </q-card>

<q-drawer
  v-model="drawerRight"
  show :width="800"
  :breakpoint="500" side="right"
  overlay elevated>
  <FixEmployCreate
    v-if="drawerRight"
    :fixData="fixData"
    @close="drawerRight=false"
    :applicant="applicant"
    @updateList="loadContactData"
    @updateDoc="updateData"/>
</q-drawer>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount } from 'vue';
import { collection, serverTimestamp, getFirestore, query, onSnapshot, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';
import FixEmployCreate from './components/fixEmployCreate.component.vue'

export default {
  name: 'contactInfo',
  components: {
    FixEmployCreate
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
    const drawerRight = ref(false);
    const options = [
      'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
    ]
    const fixData = ref({})

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
          label: t('applicant.list.fixEmployment.fixedDestination'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'fixDate',
          required: true,
          label: t('applicant.list.fixEmployment.fixDate'),
          field: 'fixDate',
          align: 'left',
        },
        {
          name: 'workDay',
          required: true,
          label: t('applicant.list.fixEmployment.workDay'),
          field: 'workDay',
          align: 'left',
        },
        {
          name: 'informalOfferDate',
          label: t('applicant.list.fixEmployment.informalOfferDate'),
          field: 'informalOfferDate',
          align: 'left',
        },
        {
          name: 'hiringDate',
          label: t('applicant.list.fixEmployment.hiringDate'),
          field: 'hiringDate',
          align: 'left',
        },
        {
          name: 'memo',
          label: t('applicant.list.fixEmployment.memo'),
          field: 'memo',
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

    loadContactData()
    function loadContactData() {
      const q = query(collection(db, 'applicants/' + props.applicant.id + '/fix'), where('deleted', '==', false), orderBy('created_at', 'desc'));
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
      drawerRight,
      fixData,

      options,
      loadContactData,
      async updateData(data){
        if (fixData.value.id){
          data['updated_at'] = serverTimestamp();
          await updateDoc(
            doc(db, 'applicants/' + props.applicant.id + '/fix/'+ fixData.value.id),
            data
          );
        }
        fixData.value = {...fixData.value, ...data}
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
          doc(db, 'applicants/' + props.applicant.id + '/fix/' + deleteItemId.value),
          updateData
        );

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
        });
      },
      getUserName(uid) {
        const value = users.value.find(x => x['id'] === uid)
        if (value) {
          return value['name'];
        }
        return '';
      },
      showEditDialog(data) {
        fixData.value = data;
        drawerRight.value = true;
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
            doc(db, 'applicants/' + props.applicant.id + '/fix/' + data.id),
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

