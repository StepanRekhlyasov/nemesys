<template>
    <div  class="new">
      <q-card-section class="bg-grey-3 q-pa-md">
        <div class="row">
          <div class="text-h6 q-pr-md text-primary">
            <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md"/>
            {{$t('menu.item')}}
          </div>
          <q-btn
            color="primary"
            text-color="white"
            class="no-shadow"
            icon="mdi-plus"
            :label="$t('settings.item.addItem')"
            @click="openDialog=true" />
        </div>
      </q-card-section>
      <q-separator color="grey-5" size="2px"/>
      <q-card-section>
        <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
          <q-card-section class="row text-center">
            <span class="row content-center">{{$t('common.keyboard')}}</span>
            <q-input v-model="search.queryText" square outlined class="col-6 q-mr-md q-ml-md bg-grey-2 input-md" dense>
              <template v-slot:append>
                <q-icon v-if="search.queryText" name="close" @click="search.queryText='';loadData();" class="cursor-pointer" />
              </template>
            </q-input>
            <div class="row content-center q-pr-md">
              <span class="row content-center q-pr-md">{{$t('settings.branch.flag')}}</span>
              <q-select v-model="search.flag" :options="flagOptions" dense borderless/>
            </div>
            <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md" unelevated @click="loadData"/>
          </q-card-section>
          <q-card-section class="q-pa-none" >
            <q-table
              :columns="columns"
              :rows="branches"
              row-key="id"
              :loading="loading"
              v-model:pagination="pagination"
              hide-pagination
              class="no-shadow"
              >
              <template v-slot:body-cell-delete="props">
                <q-td :props="props" auto-width>
                  <q-btn icon="mdi-delete-outline" flat @click="deleteItem(props.row)"/>
                </q-td>
              </template>

              <template v-slot:body-cell-segment="props">
                <q-td :props="props">
                  <span>{{props.row.segment && $t('settings.item.classification.'+props.row.segment)}}</span>
                </q-td>
              </template>


              <template v-slot:body-cell-edit="props">
                <q-td :props="props" auto-width>
                  <q-btn icon="edit" color="primary" flat @click="edit=props.row;openDialog=true;"/>
                </q-td>
              </template>

              <template v-slot:body-cell-hidden="props">
                <q-td :props="props">
                  <q-icon name="mdi-check-bold" v-if="props.row.hidden === true"/>
                </q-td>
              </template>

              <template v-slot:body-cell-prefectures="props">
                <q-td :props="props">
                  <span v-if="props.row.prefectures">{{$t('prefectures.'+props.row.prefectures)}}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-flag="props">
                <q-td :props="props">
                  <span v-if="props.row.flag">{{$t('settings.branch.flags.'+(props.row.flag?'valid': ''))}}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-created_at="props">
                <q-td :props="props">
                  {{props.row.created_at.date}}<br/>
                  {{props.row.created_at.time}}
                </q-td>
              </template>

              <template v-slot:body-cell-updated_at="props">
                <q-td :props="props">
                  {{props.row.updated_at.date}}<br/>
                  {{props.row.updated_at.time}}
                </q-td>
              </template>
            </q-table>
            <div class="row justify-start q-mt-md q-mb-md pagination">
                <q-pagination
                  v-model="pagination.page"
                  color="grey-8"
                  padding="5px 16px"
                  gutter="md"
                  :max="(branches.length/pagination.rowsPerPage) >= 1 ?  branches.length/pagination.rowsPerPage : 1"
                  direction-links
                  outline
                />
              </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </div>
    <q-dialog v-model="openDialog" @hide="edit=undefined">
        <ItemCteateForm @closeDialog="loadData();openDialog=false;" :edit="edit" />
    </q-dialog>
  </template>

  <script lang="ts">
  import { doc, getFirestore, updateDoc} from '@firebase/firestore';
  import { computed, Ref, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Accaunt } from 'src/shared/model/Account.model';
  import { getItem, ItemsSearch } from 'src/shared/utils/User.utils';
  import { toDateObject } from 'src/shared/utils/utils';
  import { useQuasar } from 'quasar';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { itemFlags, Item } from 'src/shared/model/system';
  import ItemCteateForm from './components/ItemCreate.form.vue';
  import { segment } from 'src/shared/constants/Item.const';
import { useOrganization } from 'src/stores/organization';

  export default {
    name: 'ItemMaster',
    components: {
      ItemCteateForm
    },
    setup(){
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      const $q = useQuasar();

      const search: Ref<ItemsSearch> = ref({
        queryText: '',
        flag: itemFlags.All
      });
      const branches: Ref<Item[]> = ref([])
      const selected: Ref<Accaunt[]> = ref([])
      const loading = ref(false);
      const edit: Ref<Item | undefined> = ref(undefined)

      // dialog date
      const openDialog = ref(false)

      // table date
      const pagination = ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      });
      const columns = computed(() => [
      {
        name: 'edit',
      }, {
        name: 'segment',
        required: true,
        label: t('settings.item.id') ,
        field: 'segment',
        align: 'left',
      }, {
        name: 'name',
        label: t('settings.item.name') ,
        field: 'name',
        align: 'left',
      }, {
        name: 'itemName',
        required: true,
        label: t('settings.item.itemName') ,
        field: 'itemName',
        align: 'left',
      },{
        name: 'displayOrder',
        required: true,
        label: t('settings.item.displayOrder') ,
        field: 'displayOrder',
        align: 'left',
      },{
        name: 'flag',
        required: true,
        label: t('settings.item.flag') ,
        field: 'flag',
        align: 'left',
      },{
        name: 'created_at',
        required: true,
        label: t('settings.branch.create_at') ,
        field: 'created_at',
        align: 'left',
      },{
        name: 'updated_at',
        label: t('settings.branch.last_update') ,
        field: 'updated_at',
        align: 'left',
      },{
        name: 'delete'
      }])
      const flagOptions = computed(() => [{
        label: t('settings.branch.flags.all'),
        value: itemFlags.Valid
      },{
        label: t('settings.branch.flags.valid'),
        value: itemFlags.All
      }])

      const organization  = useOrganization()

      watch(()=> organization.currentOrganizationId, ()=>{
        loadData()
      })

      loadData()
      async function loadData() {
        loading.value = true;
        edit.value=undefined;
        try {
          if (organization.currentOrganizationId) {
            const branchesSnapshot = getItem(db, organization.currentOrganizationId, search.value);

            branchesSnapshot.then(branch => {
              const list: Item[] = []
              branch.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id
                list.push({...data, created_at: toDateObject(data.created_at), updated_at: toDateObject(data.updated_at)} as Item)
              })
              branches.value = list;
            })
          }
          loading.value = false;
        } catch (e) {
            console.log(e)
            loading.value = false;
            Alert.warning($q, t);
        }
      }

      return {
        search,
        columns,
        pagination,
        selected,
        loading,
        segment,

        openDialog,
        edit,
        loadData,
        deleteItem(item) {
          $q.dialog({
            title: t('common.delete'),
            message: t('settings.branch.deletedInfo'),
            ok:{
              label: t('common.delete'),
              color: 'negative',
              class: 'no-shadow',
              unelevated: true
            },
          }).onOk(async () => {
            try{
              loading.value = true;
              const boRef = doc(db, 'organization/'+organization.currentOrganizationId+'/item/'+item.id);
              await updateDoc(boRef, {
                deleted: true
              })
              loadData();
              Alert.success($q, t)
            } catch (e) {
              console.log(e)
              Alert.warning($q, t)
              loading.value = false;
            }
          })
        },

        branches,
        flagOptions
      }
    }
  }
  </script>

  <style>

  </style>
