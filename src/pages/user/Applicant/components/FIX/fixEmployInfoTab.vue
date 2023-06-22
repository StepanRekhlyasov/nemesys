<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <span class="text-primary text-h6 q-pt-md"> {{ $t('applicant.list.fixEmployment.fixDestinationOffice') }} </span>
      <q-btn :label="$t('common.addNew')" color="primary" icon="mdi-plus-thick" size="sm" @click="drawerRight = true;fixData={}"
        class="no-shadow q-ml-lg" />
    </q-card-section>

    <q-table :columns="columns" :rows="contactListData" row-key="id" v-model:pagination="pagination" hide-pagination>

      <template v-slot:body-cell-contactMethod="props">
        <q-td :props="props"
          :class="rowColor(props.row)" >
          <div v-if="props.value == 'phone'">
            {{ $t('applicant.list.contacts.phone') }}
          </div>
          <div v-else-if="props.value == 'sms'">
            SMS
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <span class="row">{{
            applicantStore.state.clientList?.
            find(client => client.id == props.row.client)?.name
          }}</span>
          <span class="row">{{
            applicantStore.state.clientList?.
            find(client => client.id == props.row.client)?.office?.
            find(office => office.id == props.row.office)?.name
          }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          {{props.value}}
        </q-td>
      </template>

      <template v-slot:body-cell-fixDate="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <span class="row" v-if="props.row.fixStatus">{{ props.row.fixDate }}</span>
          <span class="row text-uppercase">{{ props.row.fixStatus? 'OK' : 'fixStatus' in props.row ? 'NG' : '-' }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-workDay="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <template v-if="props.row.fixStatus">
            <span class="row" v-if="props.row.inspectionStatus">{{ props.row.inspectionDate }}</span>
            <span class="row text-uppercase">
              {{ props.row.inspectionStatus? 'OK' : 'inspectionStatus' in props.row ? 'NG' : '-' }}
            </span>
          </template>
          <span v-if="!props.row.fixStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-informalOfferDate="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <template v-if="props.row.offerStatus">
            <span class="row">{{ props.row.offerDate }}</span>
            <span class="row text-uppercase">{{ props.row.offerStatus? 'OK' : 'NG'  }}</span>
          </template>
          <span v-if="!props.row.offerStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-hiringDate="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <template v-if="props.row.admissionStatus">
            <span class="row">{{ props.row.admissionDate }}</span>
            <span class="row text-uppercase">{{ props.row.admissionStatus? 'OK' : 'NG'  }}</span>
          </template>
          <span v-if="!props.row.admissionStatus">-</span>
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat
            @click="showEditDialog(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-memo="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
          {{ props.row.admissionMemo || props.row.offerMemo || props.row.inspectionMemo || props.row.fixMemo }}
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props"
          :class="rowColor(props.row)">
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
    :disableLevel="disableLevel"
    @updateList="loadContactData"
    @updateDoc="updateData"/>
</q-drawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount, Ref } from 'vue';
import { collection, serverTimestamp, getFirestore, query, onSnapshot, where } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import FixEmployCreate from './fixEmployCreate.vue'
import { useApplicant } from 'src/stores/applicant';
import { useFix } from 'src/stores/fix';
import { User, ApplicantFix, Applicant } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { toDateFormat } from 'src/shared/utils/utils';

const props = defineProps<{
  applicant: Applicant
}>()

const { t } = useI18n({ useScope: 'global' });

const applicantStore = useApplicant();
const fixStore = useFix();
const db = getFirestore();
const $q = useQuasar();

const contactListData: Ref<ApplicantFix[]> = ref([]);
const users:Ref<User[]> = ref([]);
const drawerRight = ref(false);
const disableLevel = ref(0);
const fixData = ref<Partial<ApplicantFix>>({})
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
      label: t('applicant.list.fixEmployment.fixMemo'),
      field: 'fixMemo',
      align: 'left',
    },
    {
      name: 'delete',
      align: 'left',
    }
  ];
});
const unsubscribeUsers = ref();

loadContactData()
async function loadContactData() {
  contactListData.value  = await fixStore.getFixData(props.applicant.id)
}

loadUsers()
function loadUsers() {
  const q = query(collection(db, 'users/'), where('deleted', '==', false));
  unsubscribeUsers.value = onSnapshot(q, (querySnapshot) => {
    let userList: User[] = [];
    querySnapshot.forEach((doc) => {
      userList.push({ id: doc.id, ...doc.data() } as User);
    });
    users.value = userList;
  });
}

onBeforeUnmount(() => {
  unsubscribeUsers.value();
});

function mutateDatesInData(data){
  const keys = ['fixDate', 'offerDate', 'admissionDate', 'inspectionDate', 'endDate']
  keys.map((key)=>{
    if(data[key]){
      data[key] = toDateFormat(data[key])
    }
  })
  return data
}

async function updateData(data){
  if (fixData.value?.id){
    data['updated_at'] = serverTimestamp();
    await fixStore.updateFix(fixData.value.id, data)
  }
  data = mutateDatesInData(data)
  fixData.value = {
    ...fixData.value, 
    ...data
  }
  const updateIndex = contactListData.value.findIndex((contact => contact.id == fixData.value?.id))
  contactListData.value[updateIndex] = {...contactListData.value[updateIndex], ...fixData.value}
  await applicantStore.saveFixDataToApplicant(fixData.value)
  disableChange();
}

function disableChange() {
  let level = 0;
  if(fixData.value){
    if (fixData.value['fixStatus']) {
      level = 1
    }
    if (fixData.value['inspectionStatus']) {
      level = 2
    }
    if (fixData.value['offerStatus']) {
      level = 3
    }
  }
  disableLevel.value = level
}

function showEditDialog(data) {
  fixData.value = data;
  drawerRight.value = true;
  disableChange();
}
function rowColor(row) {
  if ((row.fixStatus && row.inspectionStatus && row.offerStatus && row.admissionStatus )
    || !row.fixStatus || !row.inspectionStatus || !row.offerStatus || !row.admissionStatus ) {
    return ''
  }
  return 'bg-light-blue-1'
}
function showDeleteDialog(data) {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    const user = $q.localStorage.getItem('user');
    if (!user) {
      return ;}

    let updateData = {}
    updateData['deleted'] = true;
    updateData['deleted_by'] = user['uid'];
    updateData['deleted_at'] = serverTimestamp();

    await fixStore.updateFix(data.id, updateData)
    loadContactData();
    Alert.success($q, t)
  })
}
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}
</style>

