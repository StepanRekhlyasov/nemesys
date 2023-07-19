<template>
  <q-card class="no-shadow full-width">

    <q-card-section v-if="!bo" class="q-pa-sm bg-grey-2 q-mt-none">
      <q-form ref="applicantForm" @submit="onSubmit">
        <div class="row q-pt-sm">
          <div class="col-2 text-right self-center q-pr-sm">
            {{ $t('applicant.attendant.content') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input outlined dense v-model="data['content']" class="bg-white" type="textarea"/>
          </div>
        </div>

        <div class="q-pt-sm">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" icon="mdi-plus-thick"
            class="no-shadow q-ml-md" :disable="!data['content']" />
        </div>
      </q-form>
    </q-card-section>

    <q-table :columns="columns" :rows="memoListData" v-model:selected="selectedMemo" :loading="loadData" row-key="id"
      selection="multiple" v-model:pagination="pagination" hide-pagination>

      <template v-if="!bo" v-slot:top>
        <q-btn color="negative" class="no-shadow q-ml-md" v-if="selectedMemo.length > 0" :label="$t('common.delete')"
          @click="deleteItem" />
      </template>

      <template v-slot:body-cell-created_user="props">
        <q-td :props="props">
          {{ props.row.user.displayName }}
        </q-td>
      </template>

        <template v-slot:body-cell-content="props">
          <q-td :props="props" style="white-space: break-spaces;">
            <q-input v-if="isRowSelected(props.rowIndex) && !bo" type="textarea" outlined dense v-model="editableContect['content']" />
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ props.row.content }}
            </template>
          </q-td>
        </template>

      <template v-if="!bo" v-slot:body-cell-edit="props">
        <EditButton :props="props" color="primary"
          :on-edit="() => { editableContect = JSON.parse(JSON.stringify(props.row)) }"
          :on-save="() => onUpdate(props.rowIndex)" @onEditableRowChange="(row) => editableRow = row"
          :editable-row="editableRow" :key="props.rowIndex" />
      </template>

    </q-table>

  </q-card>
</template>

<script lang="ts" setup>
import { computed, Ref, ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { Applicant, ApplicantMemo, BackOrderModel } from 'src/shared/model';
import { QTableProps, useQuasar } from 'quasar';
import { collection, where, query, getFirestore, getDocs, doc as docDb, getDoc, serverTimestamp, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth, User } from '@firebase/auth';
import { toDate } from 'src/shared/utils/utils';
import EditButton from 'src/components/EditButton.vue';

const props = defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()


const db = getFirestore();
const auth = getAuth();

const data = ref({});
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();

const editableRow = ref(-1)
const editableContect = ref({})
const memoListData: Ref<ApplicantMemo[]> = ref([])
const selectedMemo: Ref<ApplicantMemo[]> = ref([])
const loadData = ref(false)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

const columns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'created_user',
      required: true,
      label: t('detal.memo.registredUser'),
      align: 'left',
      field: 'created_user',
      sortable: true,
    },{
      name: 'content',
      label: t('detal.memo.contents'),
      field: 'content',
      align: 'left',
    }, {
      name: 'created_date',
      label: t('detal.memo.creationDay'),
      field: 'created_date',
      align: 'left',
      sortable: true,
    },{
      name: 'updated_at',
      label: t('detal.memo.updateDate'),
      field: 'updated_at',
      align: 'left',
      sortable: true,
    },{
      name: 'edit',
      field: '',
      label: '',
      align: 'left',
    }
  ];
});

const loading = ref(false);


const loadMemoData = async () => {
  loadData.value = true
  const q = query(collection(db, 'applicants/' + props.applicant.id + '/memo'), where('deleted', '==', false));
  try {
    const memo = await getDocs(q)
    const data = memo.docs.map(async (doc) => {
      let content = doc.data();
      const user = (await getDoc(docDb(db, 'users/' + content.created_user))).data();
      return {
        ...content,
        id: doc.id,
        user: user,
        created_date: toDate(content.created_date),
        updated_at: toDate(content.updated_at),
      } as ApplicantMemo
    })
    Promise.all(data).then(ret => memoListData.value = ret)
    loadData.value = false
  } catch (e) {
    Alert.warning(e)
    console.log(e)
  }
}

loadMemoData()


async function onSubmit() {
  loading.value = true;
  let returnData = data.value;
  try {
    returnData['content'] = data.value['content'];
    returnData['created_date'] = serverTimestamp();
    returnData['updated_at'] = serverTimestamp();
    returnData['deleted'] = false;
    returnData['created_user'] = auth.currentUser?.uid;
    await addDoc(
      collection(db, 'applicants/' + props.applicant.id + '/memo'),
      returnData
    )

    loading.value = false;
    data.value = {};
    await loadMemoData();
    Alert.success();
  } catch (error) {
    console.log(error);
    loading.value = false;
    Alert.warning(error)
  }
}
async function onUpdate(index) {
  try {
    if (!editableContect.value) {
      return;
    }
    loading.value = true;
    let updateData = {}
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;
    updateData['content'] = editableContect.value['content'] || '';

    await updateDoc(
      doc(db, 'applicants/' + props.applicant.id + '/memo/' + editableContect.value['id']),
      updateData
    );
    memoListData.value[index] = editableContect.value as ApplicantMemo;
    await loadMemoData();
    loading.value = false;
  } catch (e) {
    Alert.warning(e)
    console.log(e)
    loading.value = false;
  }
}
async function deleteItem() {
  if (!selectedMemo.value) {
    return false;
  }
  const user = $q.localStorage.getItem('user') as User;

  let updateData = {}
  updateData['deleted'] = true;
  updateData['deleted_by'] = user.uid;
  updateData['deleted_at'] = serverTimestamp();
  const ret = selectedMemo.value.map(async (memo) => {
    await updateDoc(
      docDb(db, 'applicants/' + props.applicant.id + '/memo/' + memo.id),
      updateData
    );
  })
  Promise.all(ret)
  await loadMemoData();
  selectedMemo.value = [];
}
function isRowSelected(row) {
  return row == editableRow.value
}
</script>

<style></style>
