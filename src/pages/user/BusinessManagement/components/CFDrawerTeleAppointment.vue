<template>
  <q-card class="no-shadow full-width q-ma-none">
    <q-card-section class="bg-grey-3 q-ma-xs q-pa-xs" v-if="!showAddForm">
      <q-btn
        :label="$t('client.tele.openTeleAppointForm')"
        :icon="'mdi-arrow-down-bold-circle-outline'"
        flat
        size="md"
        class="text-grey-9"
        @click="showAddForm = true"
      />
    </q-card-section>
    <q-card-section class="q-ma-sm q-pa-sm bg-grey-2" v-if="showAddForm">
      <q-form ref="applicantForm" @submit="onSubmit" @reset="onReset">
        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('client.tele.list.teleAppointmentResult') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="teleData['result']" val="notConnected" :label="$t('client.tele.notConnected')" />
            <q-radio v-model="teleData['result']" val="connected" :label="$t('client.tele.connected')" class="q-ml-sm" />
          </div>
        </div>
        <div class="row q-pt-sm" v-if="teleData['result'] != 'notConnected'">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.jobResult') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio v-model="teleData['jobResult']" val="noJobOffer" :label="$t('client.tele.noJobOffer')" />
            <q-radio v-model="teleData['jobResult']" val="noNeedContact" :label="$t('client.tele.noNeedContact')" class="q-ml-sm" />
            <q-radio v-model="teleData['jobResult']" val="needForRecruiting" :label="$t('client.tele.needForRecruiting')" class="q-ml-sm" />
          </div>
        </div>
        <div class="row q-pt-md q-pb-sm" v-if="teleData['result'] != 'notConnected' && teleData['jobResult'] != 'noJobOffer' && teleData['jobResult'] != 'noNeedContact'">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.requiredService') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-checkbox v-model="teleData['requiredService']" val="referral" :label="$t('client.tele.reqRecruitmentServicesOption.referral')" />
            <q-checkbox v-model="teleData['requiredService']" val="introduction" :label="$t('client.tele.reqRecruitmentServicesOption.introduction')" />
            <q-checkbox v-model="teleData['requiredService']" val="referralNTTP" :label="$t('client.tele.reqRecruitmentServicesOption.referralNTTP')" />
            <q-checkbox v-model="teleData['requiredService']" val="dispatch" :label="$t('client.tele.reqRecruitmentServicesOption.dispatch')" />
          </div>
        </div>
        <div class="row">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('detal.teleAppoint.remark') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input outlined dense v-model="teleData['remark']" class="bg-white" />
          </div>
        </div>
        <div class="q-pt-sm">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" icon="mdi-plus-thick" class="no-shadow q-ml-md" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>
    <q-table :columns="columns" :rows="historyData" row-key="id" v-model:pagination="pagination" hide-pagination class="q-pl-sm q-mr-xs" :loading="loading">
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil" size="sm" round color="primary" flat @click="showEditDialog(props.row)" />
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
          <div>{{ formatDate(props.value, 'date') }}</div>
          <div>{{ formatDate(props.value, 'time') }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn size="sm" icon="delete" class="delete_btn" flat @click="showDeleteDialog([props.row.id])" />
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, onBeforeUnmount, onMounted, watch, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { TeleColumns } from 'src/shared/constants/TeleAppoint.const';
import { useTele } from 'src/stores/TeleAppointment';
import {  TeleAppointmentHistory, UserTele  } from 'src/shared/model/TeleAppoint.model';
import { DocumentData } from 'firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';
import { QTableProps } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
  columns: QTableProps['columns'];
  historyData:QTableProps['rows']
  clientId: string;
}>();
const historyData: DocumentData = ref([]);

const teleStore = useTele();
const columns = ref(TeleColumns);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
});
const loading = ref(false);
const showAddForm = ref(false);
const teleData:DocumentData = ref({
      requiredService: [],
      result:'',
      jobResult:'',

    });
const $q = useQuasar();
const unsubscribe = ref();
const unsubscribeUsers = ref();
const dialogType = ref('create');
const users: Ref<UserTele[]> = ref([]);

const fetchTeleData = async () => {
  loading.value = true;
  historyData.value = await teleStore.loadTeleAppointmentData(props.clientId);
  users.value = await teleStore.loadUsers();
  loading.value = false;
};

const showDeleteDialog = async (Teleid: string[]) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    loading.value = true;
    await teleStore.deleteTele(Teleid, props.clientId);
    loading.value = false;
    historyData.value = fetchTeleData();
    Alert.success();
  });
};

const showEditDialog = async (data: TeleAppointmentHistory[]) => {
  dialogType.value = 'update';
  teleData.value = JSON.parse(JSON.stringify(data));
  showAddForm.value = true;
};

const getUserName = (uid: string) => {
const value = users.value.find(x => x['id'] === uid);
  if (value) {
    return value['name'];
  }
  return '';
};

const formatDate = (dateTime: Date | string, type: 'date' | 'time') => {
  if (dateTime instanceof Date) {
    if (type === 'date') {
      return dateTime.toLocaleDateString();
    } else if (type === 'time') {
      return dateTime.toLocaleTimeString(undefined, { hour12: false });
    }
  } else if (typeof dateTime === 'string') {
    const date = new Date(dateTime);
    if (type === 'date') {
      return date.toLocaleDateString();
    } else if (type === 'time') {
      return date.toLocaleTimeString(undefined, { hour12: false });
    }
  }
  return '';
};
const onSubmit = async () => {
  loading.value = true;
  let data: TeleAppointmentHistory[] = teleData.value;
  if (!data['result']) {
   Alert.warning()
    return;
  }

  try {
    if (dialogType.value == 'update') {
       await teleStore.updateData(props.clientId, data);
        historyData.value = fetchTeleData();
    } else {
       await teleStore.addData(props.clientId, data);
        historyData.value = fetchTeleData();
    }
    loading.value = false;
    Alert.success()
    teleData.value = {
      requiredService: [],
    };
    dialogType.value = 'create';
  } catch (error) {
    loading.value = false;
    Alert.warning(error)
  }
};

const onReset = () => {
  teleData.value = {
    requiredService: [],
  };
  dialogType.value = 'create';
};
watch(
  () => teleData.value.result,
  (newVal) => {
    if (newVal == 'notConnected') {
      teleData.value.requiredService = [];
      teleData.value.jobResult = '';
    }
  }
);

watch(
  () => teleData.value.jobResult,
  (newVal) => {
    if (newVal == 'noJobOffer' || newVal == 'noNeedContact') {
      teleData.value.requiredService = [];
    }
  }
);

onMounted(() => {
  fetchTeleData();
});

onBeforeUnmount(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
  if (unsubscribeUsers.value) {
    unsubscribeUsers.value();
  }
});

</script>

<style scoped>
  .row {
    margin-bottom: 10px;
  }
  .delete_btn{
    background-color: white;
    width: 1px;
  }
</style>
