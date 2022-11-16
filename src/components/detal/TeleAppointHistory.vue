<template>
  <q-card class="no-shadow full-width">
    <q-card-section>
      <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">
        <div class="row q-pt-sm">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('client.tele.list.teleAppointmentResult') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="teleData['result']" val="notConnected" :label="$t('client.tele.notConnected')" />
            <q-radio v-model="teleData['result']" val="connected" :label="$t('client.tele.connected')"
              class="q-ml-sm" />
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.jobResult') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="teleData['jobResult']" val="noJobOffer" :label="$t('client.tele.noJobOffer')" />
            <q-radio v-model="teleData['jobResult']" val="noNeedContact" :label="$t('client.tele.noNeedContact')"
              class="q-ml-sm" />
            <q-radio v-model="teleData['jobResult']" val="needForRecruiting"
              :label="$t('client.tele.needForRecruiting')" class="q-ml-sm" />
          </div>
        </div>


        <div class="row q-pt-md q-pb-sm ">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.requiredService') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-checkbox v-model="teleData['requiredService']" val="referral"
              :label="$t('client.tele.reqRecruitmentServicesOption.referral')" />
            <q-checkbox v-model="teleData['requiredService']" val="introduction"
              :label="$t('client.tele.reqRecruitmentServicesOption.introduction')" />
            <q-checkbox v-model="teleData['requiredService']" val="referralNTTP"
              :label="$t('client.tele.reqRecruitmentServicesOption.referralNTTP')" />
            <q-checkbox v-model="teleData['requiredService']" val="dispatch"
              :label="$t('client.tele.reqRecruitmentServicesOption.dispatch')" />
          </div>
        </div>

        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.remark') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input outlined dense v-model="teleData['remark']" />
          </div>
        </div>

        <div class="q-pt-sm">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" :loading="loading" icon="add" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>

    <q-separator size="2px" />

    <q-table :columns="columns" :rows="historyData" row-key="id" selection="multiple" v-model:selected="selected"
      v-model:pagination="pagination" hide-pagination>
      <!-- <template v-slot:body-cell-name="props">
        <q-td :props="props">
          {{ props.row.name }}/{{ props.row.branch }}
        </q-td>
      </template> -->

      <template v-slot:body-cell-result="props">
        <q-td :props="props">
          <div v-if="props.value">
            {{ $t('client.tele.' + props.value) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-jobResult="props">
        <q-td :props="props">
          <div v-if="props.value">
            {{ $t('client.tele.' + props.value) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-requiredService="props">
        <q-td :props="props">
          <div v-for="item in props.value" :key="item">
            {{ $t('client.tele.reqRecruitmentServicesOption.' + item) }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ formatDate(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>

    </q-table>
  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount } from 'vue';
import { addDoc, collection, serverTimestamp, getFirestore, query, onSnapshot, where } from 'firebase/firestore';
import { useQuasar } from 'quasar';

//import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
//import { teleAppointmentData } from 'src/shared/constants/TeleAppoint.const';

export default {
  name: 'TeleAppointHistory',
  components: {
  },

  props: {
    clientId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const historyData = ref([])
    const selected = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
        {
          name: 'created_by',
          required: true,
          label: t('detal.teleAppoint.registredUser'),
          align: 'left',
          field: 'created_by',
          sortable: false,
        },
        {
          name: 'created_at',
          required: true,
          label: t('detal.teleAppoint.date'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'result',
          required: true,
          label: t('detal.teleAppoint.teleAppointmentResult'),
          field: 'result',
          align: 'left',
        },
        {
          name: 'jobResult',
          label: t('detal.teleAppoint.jobResult'),
          field: 'jobResult',
          align: 'left',
        },
        {
          name: 'requiredService',
          label: t('detal.teleAppoint.requiredService'),
          field: 'requiredService',
          align: 'left',
        },
        {
          name: 'remark',
          label: t('detal.teleAppoint.remark'),
          field: 'remark',
          align: 'left',
        },
      ];
    });

    const loading = ref(false);
    const teleData = ref({
      requiredService: []
    });

    const clientID = ref(props.clientId);
    const db = getFirestore();
    const $q = useQuasar();
    const unsubscribe = ref();
    const unsubscribeUsers = ref();

    loadTeleAppointmentData()
    function loadTeleAppointmentData() {
      const q = query(collection(db, 'clients/' + props.clientId + '/teleAppointments'), where('deleted', '==', false));
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        let teleAppointmentData  = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data['id'] = doc.id;
          teleAppointmentData.push({ id: doc.id, ...data});
        });
        historyData.value = teleAppointmentData;
      });
    }

    const users  = ref([]);
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
      historyData,
      selected,
      pagination,

      teleData,
      loading,
      clientID,

      async onSubmit() {
        loading.value = true;
        let data = teleData.value;
        data['created_at'] = serverTimestamp();
        data['updated_at'] = serverTimestamp();
        data['deleted'] = false;
        let user = $q.localStorage.getItem('user') ;
        data['created_by'] = user.uid;

        try {
          const docRef = await addDoc(
            collection(db, 'clients/' + props.clientId + '/teleAppointments'),
            data
          );
          console.log('Document written with ID: ', docRef.id);
          loading.value = false;

          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
          teleData.value = {
            requiredService: []
          };
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


      onReset() {
        //teleData.value = JSON.parse(JSON.stringify(applicantDataSample));
        //applicantForm.value.resetValidation();
      },

      formatDate(item) {
        if (!item) {
          return '';
        }
        return item.toDate().toLocaleTimeString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      },

      getUserName(uid) {
        const value = users.value.find(x => x['id'] === uid)
        if (value) {
          return value['name'];
        }
        return '';
      }
    };
  },
};
</script>
