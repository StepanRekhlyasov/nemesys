<template>
  <q-table
    :columns="columns"
    :rows="memoData"
    :loading="loadData"
    row-key="id"
    selection="multiple"
    v-model:selected="selected"
    v-model:pagination="pagination"
    hide-pagination>

    <template v-slot:top >
      <q-btn color="primary" icon="mdi-plus-thick" class="no-shadow q-ml-md"  :label="$t('common.add')" @click="showMemoAdd"/>
      <q-btn color="negative" class="no-shadow q-ml-md" v-if="selected.length >0" :label="$t('common.delete')"  @click="deleteMemo"/>
    </template>

    <template v-slot:body-cell-edit="props">
      <q-td :props="props">
        <q-btn icon="mdi-pencil-outline"  color="grey-8" flat @click="showEditDialog(props.row)"/>
      </q-td>
    </template>


  </q-table>

  <!-- Add Dialog Window -->
  <q-dialog v-model="openMemoAdd">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6 text-primary text-weight-bold">{{$t('detal.memo.addNewMemo')}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row q-pt-none">
          <span class="col-2">
            {{$t('detal.memo.contents')}}
          </span>
          <div class="col-10">
            <q-input
              v-model="content"
              filled
              type="textarea"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" v-if="dialogType === 'create'">
          <q-btn :label="$t('detal.memo.addNew')" color="primary" @click="addNewMemo"/>
        </q-card-actions>

        <q-card-actions align="center" v-if="dialogType === 'update'">
          <q-btn :label="$t('detal.memo.addNew')" color="primary" @click="updateMemo()"/>
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed, Ref } from 'vue';
import { collection, where, query, getFirestore, getDocs, doc as docDb, getDoc, serverTimestamp, addDoc, updateDoc } from 'firebase/firestore';
import { ClientMemo } from 'src/shared/model/Client.model';
import { toDate } from 'src/shared/utils/utils';
import { getAuth } from '@firebase/auth';
export default {
  name: 'MemoComponent',
  props:{
    client: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const auth = getAuth();

    const memoData: Ref<ClientMemo[]> = ref([])
    const selected: Ref<ClientMemo[]> = ref([])
    const selectMemo: Ref<ClientMemo | undefined> = ref()
    const loadData: Ref<boolean> = ref(true);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const openMemoAdd =  ref(false)
    const dialogType: Ref<'create' | 'update'> = ref('create')
    const content = ref('');

    const columns = computed(() => {
      return [
      {
          name: 'displayName',
          required: true,
          label: t('detal.memo.registredUser'),
          align: 'left',
          field: 'displayName',
          sortable: false,
        },{
          name: 'content',
          label: t('detal.memo.contents') ,
          field: 'content',
          align: 'left',
        },{
          name: 'created_date',
          label: t('detal.memo.creationDay') ,
          field: 'created_date',
          align: 'left',
        },{
          name: 'updated_date',
          label: t('detal.memo.updateDate') ,
          field: 'updated_date',
          align: 'left',
        },{
          name: 'edit',
          align: 'left',
        }
      ];
    });


    const loadMemoData = async ():Promise<void> =>{
      loadData.value = true
      const q = query(collection(db, 'clients/' + props.client.clientId + '/memo'), where('deleted', '==', false));
      try{
        const memo = await getDocs(q)
        const data = memo.docs.map(async (doc) => {
          let content = doc.data();
          const user = (await getDoc(docDb(db, 'users/' + content.created_user))).data();
          return {
            ...content,
            id: doc.id,
            user: user,
            displayName: user?.displayName,
            created_date: toDate(content.created_date),
            updated_date: toDate(content.updated_date)
          } as ClientMemo
        })
        Promise.all(data).then(ret => memoData.value=ret)
        loadData.value = false
      } catch (e) {
        console.log(e)
      }
    }

    const addNewMemo = async () => {
      const data = {}
      data['content'] = content.value;
      data['created_date'] = serverTimestamp();
      data['updated_date'] = serverTimestamp();
      data['deleted'] = false;
      data['created_user'] = auth.currentUser?.uid;
      try{
        await addDoc(
          collection(db, 'clients/'+props.client.clientId+'/memo'),
          data
        );
        await loadMemoData();
        openMemoAdd.value = false;
      } catch (e) {
      }
    }

    const deleteMemo = async () => {
      const ret = selected.value.map( async (memo) => {
        const memoRef = docDb(db, 'clients/'+props.client.clientId+'/memo/'+memo.id);
        await updateDoc(memoRef, {
          deleted: true
        })
      })
      Promise.all(ret)
      await loadMemoData();
      selected.value = [];
    }

    const showMemoAdd = () => {
      openMemoAdd.value = true;
      dialogType.value = 'create';
    }

    const showEditDialog = (editmemo) => {
      openMemoAdd.value = true;
      dialogType.value = 'update';
      selectMemo.value = editmemo;
      content.value = editmemo.content;
    }

    const updateMemo = async () => {
      try {
        const memoRef = docDb(db, 'clients/'+props.client.clientId+'/memo/'+selectMemo.value?.id);
        await updateDoc(memoRef, {
          content: content.value
        })
        loadMemoData();
        openMemoAdd.value = false;
      } catch {

      }
    }

    loadMemoData()

    return {
      openMemoAdd,
      content,
      selected,
      loadData,
      dialogType,

      columns,
      addNewMemo,
      showMemoAdd,
      updateMemo,
      loadMemoData,
      showEditDialog,
      deleteMemo,
      pagination,
      memoData
    }
  }
}
</script>

<style>

</style>
