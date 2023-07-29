<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-sm bg-grey-2 q-mt-none">
      <q-form  @submit="onSubmit">
        <div class="row q-pt-sm">
          <div class="self-center q-pr-sm q-pl-xl q-ml-xs">
            {{ $t('detal.memo.contents') }}
          </div>
          <div class="col-9 ">
            <q-input outlined dense v-model="data['content']" class="bg-white" />
          </div>
        </div>
        <div class="q-pt-md q-pl-xl q-ml-lg">
          <q-btn :label="$t('common.addNew')" type="submit" color="primary" icon="mdi-plus-thick"
            class="no-shadow q-ml-md" :disable="!data['content']"/>
        </div>
      </q-form>
    </q-card-section>
    <q-table
      :columns="columns"
      :rows="memoListData"
      :loading="loading"
      row-key="id"
      v-model:pagination="pagination"
      hide-pagination>

      <template v-slot:top>
      <q-checkbox val="xs" class="q-pt-sm" color="blue" v-model="selected" />
      <div class="q-ml-sm q-pt-sm">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
      <q-btn class="no-shadow q-ml-md q-mt-sm q-py-none q-px-md " :label="$t('common.delete')" :class="selectedCount() == 0 ?  'bg-secondary': 'bg-red'" :text-color="selectedCount() > 0 ? 'white' : 'black'" :disable="selectedCount() == 0" @click="deleteSelected()" />
      </template>

        <template v-slot:body-cell-created_user="props">
        <q-td :props="props">
          {{ props.row.userName.displayName}}
        </q-td>
      </template>

      <template v-slot:body-cell-select="props">
      <q-td :props="props">
        <q-checkbox v-model="props.row.selected"  />
      </q-td>
      </template>

      <template v-slot:body-cell-content="props">
        <q-td :props="props">
          <q-input v-if="isRowSelected(props.rowIndex) " outlined dense v-model="editableContect['content']" />
          <template v-if="!isRowSelected(props.rowIndex)">
           {{ props.row.content }}
           </template>
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <EditButton :props="props" color="primary"
          :on-edit="() => { editableContect = JSON.parse(JSON.stringify(props.row))}"
          :on-save="() => onUpdate(props.rowIndex)" @onEditableRowChange="(row) => editableRow = row"
          :editable-row="editableRow" :key="props.rowIndex"/>
      </template>
    </q-table>
  </q-card>
</template>
<script lang="ts" setup>
import {  Ref, ref ,onMounted,watch} from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import EditButton from 'src/components/EditButton.vue';
import { QTableProps } from 'quasar';
import { ClientMemo } from 'src/shared/model/Client.model';
import { columnsMemo } from 'src/shared/constants/memo.conts'
import {useMemo} from 'src/stores/memo'
import { useI18n } from 'vue-i18n';
const props = defineProps<{
  clientId: string;
  columns: QTableProps['columns']
}>();
const memoStore = useMemo()
const columns = ref(columnsMemo)
const data:Ref<Partial<ClientMemo>>  = ref({});
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const editableRow:Ref<number> = ref(-1)
const editableContect = ref({})
const memoListData: Ref<ClientMemo[]> = ref([])
const selected= ref(false)
const loading = ref(false)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});
const fetchMemoData = async () => {
  loading.value = true;
  const data = await memoStore.loadMemoData(props.clientId);
  memoListData.value = data.map((row) => {
    return { ...row, selected: false };
  });
  loading.value = false;
};
const showDeleteDialog = async (ids: string[]) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel')
  }).onOk(async () => {
    loading.value=true
    await memoStore.deleteMemo(ids,props.clientId);
    loading.value=false
    const data = await memoStore.loadMemoData(props.clientId)
      memoListData.value = data.map(row => {
    return { ...row, selected: false };
  });
     
  });
};
 const deleteSelected = () => {
  const boItem = memoListData.value.filter(row => row['selected']);
  let items: string[] = [];
  for (const item of boItem) {
    items.push(item['id']);
  }
  showDeleteDialog(items);
};
 const onSubmit = async () => {
  loading.value = true;
  try{
    await memoStore.addNewMemo(props.clientId,data.value['content'] || '')
    loading.value = false;
    data.value = {};
    await fetchMemoData()
    ;
  } catch (error) {
    console.log(error);
    loading.value = false;
    Alert.warning(error)
  }
}
const onUpdate = async(index:number)=> {
  try {
    if (!editableContect.value) {
      return;
    }
    loading.value = true;
    await memoStore.updateMemo(props.clientId,editableContect.value['content'],editableContect.value['id'])
     memoListData.value[index] = editableContect.value as ClientMemo;
     await fetchMemoData()
    loading.value = false;
  } catch (e) {
    Alert.warning(e)
    console.log(e)
    loading.value = false;
  }
}

const selectedCount = () => {
  return memoListData.value.filter(row => row['selected']).length;
};
const isRowSelected = (row:number) => {
  return row == editableRow.value
}
watch(() => selected.value, (newValue) => {
  for (let i = 0; i < memoListData.value.length; i++) {
    memoListData.value[i]['selected'] = newValue;
  }
});
onMounted(() => {
  fetchMemoData();
});
</script>

<style>

</style>
