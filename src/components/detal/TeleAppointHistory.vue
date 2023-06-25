<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="bg-grey-3 q-ma-sm q-pa-xs" v-if="!showAddForm">
      <q-btn
        :label="$t('client.tele.openTeleAppointForm')"
        :icon="'mdi-arrow-down-bold-circle-outline'"
        flat
        size="md"
        class="text-grey-9 "
        @click="showAddForm = true"/>
    </q-card-section>
    <q-card-section class="q-ma-sm q-pa-sm bg-grey-2 " v-if="showAddForm">
      <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">
        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('client.tele.list.teleAppointmentResult') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="teleData['result']" val="notConnected" :label="$t('client.tele.notConnected')" />
            <q-radio v-model="teleData['result']" val="connected" :label="$t('client.tele.connected')"
              class="q-ml-sm" />
          </div>
        </div>


        <div class="row q-pt-sm" v-if="teleData['result'] != 'notConnected'">
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


        <div class="row q-pt-md q-pb-sm"
          v-if="teleData['result'] != 'notConnected' && teleData['jobResult'] != 'noJobOffer' && teleData['jobResult'] != 'noNeedContact'">
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
            <q-input outlined dense v-model="teleData['remark']" class="bg-white"/>
          </div>
        </div>

        <div class="q-pt-sm">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" icon="mdi-plus-thick" class="no-shadow q-ml-md" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>

    <q-table :columns="columns" :rows="historyData" row-key="id"
      v-model:pagination="pagination" hide-pagination class="q-pl-sm " :loading="loading"   :separator="separator" >
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round color="grey-8" flat @click="showEditDialog(props.row)" />
        </q-td>
      </template>

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
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn size="sm" icon="delete" flat @click="deleteItem([props.row.id])"  />
        </q-td>
      </template>


    </q-table>
  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import { addDoc, collection, serverTimestamp, getFirestore, query, onSnapshot, where, updateDoc, doc, orderBy,writeBatch } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';

//import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
//import { teleAppointmentData } from 'src/shared/constants/TeleAppoint.const';

export default {
  name: 'TeleAppointHistory',
  components: {
  },

  props: {
    client: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const historyData = ref([])
    const selected = ref([]);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
      {
        label:'',
          name: 'edit',
          align: 'left',
          field:'edit'
        },
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
        {
      label: '',
      field: 'action',
      name: 'action',
      align: 'left',
    },
      ];
    });

    const loading = ref(false);
    const showAddForm = ref(false)
    const teleData = ref({
      requiredService: []
    });

    const db = getFirestore();
    const $q = useQuasar();
    const unsubscribe = ref();
    const unsubscribeUsers = ref();

    const dialogType = ref('create')

    loadTeleAppointmentData()
    function loadTeleAppointmentData() {
      const q = query(collection(db, 'clients/' + props.client.clientId + '/teleAppointments'), where('deleted', '==', false),  orderBy('created_at', 'desc'),);
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        let teleAppointmentData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data['id'] = doc.id;
          teleAppointmentData.push({ ...data, id: doc.id, created_at: toDate(data.created_at)});
        });
        historyData.value = teleAppointmentData;
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

    watch(
      () => (teleData.value.result),
      (newVal) => {
        if (newVal == 'notConnected') {
          teleData.value.requiredService = [];
          teleData.value.jobResult = '';
        }
      },
    ),
      watch(
        () => (teleData.value.jobResult),
        (newVal) => {
          if (newVal){
            teleData.value.result = 'connected';
          }
          if (newVal == 'noJobOffer' || newVal == 'noNeedContact') {
            teleData.value.requiredService = [];
          }
        },
      ),
      watch(
        () => (teleData.value.requiredService),
        (newVal) => {
          if (newVal.length > 0){
            teleData.value.result = 'connected';
            teleData.value.jobResult = 'needForRecruiting';
          }
        },
      )
      const Tele = async (Teleid) => {
        const user = $q.localStorage.getItem('user');
		const updateData = {}
		updateData['deleted'] = true;
		updateData['deleted_by'] = user?.uid;
		updateData['deleted_at'] = serverTimestamp();
		const batch = writeBatch(db);
		for (const id of Teleid) {
			batch.update(
        doc(db, 'clients/' + props.client.clientId + '/teleAppointments/' + id),
        updateData
      );
      console.log(id);
    }
    await batch.commit();
		return true;
	};

    return {
      columns,
      historyData,
      separator: ref('none'),
      selected,
      pagination,
      teleData,
      Tele,
      showAddForm,
      loading,

      async onSubmit() {
        loading.value = true;
        let data = teleData.value;
        if (!data['result']){
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
            updateData['result'] = data['result']
            updateData['jobResult'] = data['jobResult']
            updateData['requiredService'] = data['requiredService']
            updateData['remark'] = data['remark']

            await updateDoc(
              doc(db, 'clients/' + props.client.clientId + '/teleAppointments/' + data['id']),
              updateData
            );
          }
          else {
            data['created_at'] = serverTimestamp();
            data['updated_at'] = serverTimestamp();
            data['deleted'] = false;
            data['created_by'] = user.uid;

            await addDoc(
              collection(db, 'clients/' + props.client.clientId + '/teleAppointments'),
              data
            );
          }

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

 async deleteItem(Teleid) {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    loading.value=true
    const done = await Tele(Teleid);
    loading.value=false
    if(done){
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: t('success'),
    });
  }
  });
},

      onReset() {
        //teleData.value = JSON.parse(JSON.stringify(applicantDataSample));
        //applicantForm.value.resetValidation();
        teleData.value = {
          requiredService: []
        };
        dialogType.value = 'create';
      },
      showEditDialog(data) {
        dialogType.value = 'update';
        teleData.value = JSON.parse(JSON.stringify(data));
        showAddForm.value = true;
      },
      getUserName(uid) {
        const value = users.value.find(x => x['id'] === uid)
        if (value) {
          return value['name'];
        }
        return '';
      },
    };
  },
};
</script>

<style lang="scss">
.rightBorder {
  border-right: 2px solid white;
}
tbody{
  background-color: #efeded
}
</style>

