<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="bg-grey-2 q-pa-xs q-mb-none">
      <q-btn :label="$t('applicant.list.contacts.closeContactForm')" :icon="'arrow_drop_up'" flat size="md"
        class="text-grey-9" @click="resetData" v-if="showAddForm" />
      <q-btn :label="$t('applicant.list.contacts.openContactForm')" :icon="'arrow_drop_down'" flat size="md"
        class="text-grey-9" @click="showAddForm = true" v-else />
    </q-card-section>

    <q-card-section class="q-pa-sm bg-grey-2 q-mt-none" v-if="showAddForm">
      <q-form ref="applicantForm" @submit="onSubmit" @reset="resetData">
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

    <q-table :columns="columns" :rows="contactListData" row-key="id" 
      v-model:pagination="pagination" hide-pagination>
      <template v-slot:body-cell-contactMethod="props">
        <q-td :props="props">
          <template v-if="isRowSelected(props.rowIndex)">            
            <q-radio v-model="editableContect.contactMethod" val="phone" :label="$t('applicant.list.contacts.phone')" />
            <q-radio v-model="editableContect.contactMethod" val="sms" label="SMS" class="q-ml-sm" />
          </template>
          <template v-if="!isRowSelected(props.rowIndex)">
            <div v-if="props.value == 'phone'">
              {{ $t('applicant.list.contacts.phone') }}
            </div>
            <div v-else-if="props.value == 'sms'">
              SMS
            </div>
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-content="props">
        <q-td :props="props">
          <q-input v-if="isRowSelected(props.rowIndex)" outlined dense v-model="editableContect.content" />
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.content }}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-note="props">
        <q-td :props="props">
          <q-input v-if="isRowSelected(props.rowIndex)" outlined dense v-model="editableContect.note" />
          <template v-if="!isRowSelected(props.rowIndex)">
            {{ props.row.note }}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ toDate(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <EditButton :props="props" color="primary"
          :disable="loading"
          :on-edit="() => { 
            editableContect = JSON.parse(JSON.stringify(props.row))
            editableContect.created_at = props.row.created_at
          }"
          :on-save="() => onUpdate(props.rowIndex)" 
          @onEditableRowChange="(row) => {
            editableRow = row
          }"
          :editable-row="editableRow" 
          :key="props.rowIndex"
        />
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn icon="mdi-delete-outline" flat @click="showDeleteDialog(props.row.id)"/>
        </q-td>
      </template>

    </q-table>
  </q-card>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { ref, onMounted} from 'vue';
import { addDoc, collection, serverTimestamp, getFirestore, where, updateDoc, doc, orderBy, DocumentData } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';
import EditButton from 'src/components/EditButton.vue';
import { getAuth } from '@firebase/auth';
import { Applicant } from 'src/shared/model';
import { usersInCharge, contactColumns as columns } from 'src/shared/constants/Applicant.const';
import { useApplicant } from 'src/stores/applicant';

const props = defineProps<{
  applicant: Applicant
}>()
const { t } = useI18n({ useScope: 'global' });
const auth = getAuth()
const contactListData = ref<DocumentData[]>([])

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

const loading = ref(false);
const showAddForm = ref(false);
const editableRow = ref(-1)
const editableContect = ref<DocumentData>({})
const contactData = ref({
});

const db = getFirestore();
const $q = useQuasar();
const applicantStore = useApplicant()
const user : {
  uid: string
} | null = $q.localStorage.getItem('user');

const users = usersInCharge
function isRowSelected(row ) {
  return row == editableRow.value
}
const updateContactList = async () => {
  contactListData.value = await applicantStore.getApplicantContactData(props.applicant.id, [where('deleted', '==', false), orderBy('created_at', 'desc')])
}
onMounted( () => {
  updateContactList()
});

async function onSubmit() {
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
  try {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = user?.uid;
    await addDoc(
      collection(db, 'applicants/' + props.applicant.id + '/contacts'),
      data
    );
    loading.value = false;
    contactData.value = {};
    await updateContactList()
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: t('success'),
    });
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
}
function resetData() {
  contactData.value = {};
  showAddForm.value = false;
}
async function onUpdate(index : number) {     
  try {
    loading.value = true;
    const updateData = {}
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;
    updateData['content'] = editableContect.value.content  || '';
    updateData['note'] = editableContect.value.note || '';
    updateData['contactMethod'] = editableContect.value.contactMethod || '';
    await updateDoc(
      doc(db, 'applicants/' + props.applicant.id + '/contacts/' + editableContect.value['id']),
      updateData
    );
    contactListData.value[index] = editableContect.value;
    loading.value = false;
  } catch (e) {
    console.log(e) 
    loading.value = false;
  }
}
function getUserName(uid : string) {
  const value = users.value.find(x => x['value'] === uid)
  if (value) {
    return value['label'];
  }
  return '';
}
function showDeleteDialog(id : string) {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    let updateData = {}
    updateData['deleted'] = true;
    updateData['deleted_by'] = user?.uid;
    updateData['deleted_at'] = serverTimestamp();
    await updateDoc(
      doc(db, 'applicants/' + props.applicant.id + '/contacts/' + id),
      updateData
    );
    await updateContactList()
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: t('success'),
    });
  })
}
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}
</style>

