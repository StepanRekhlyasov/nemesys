<template>
  <div  class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div class="text-h6 q-pr-md text-primary">
          <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md"/>
          {{$t('menu.branches')}}
        </div>
        <q-btn
          color="primary"
          text-color="white"
          class="no-shadow"
          icon="mdi-plus"
          :label="$t('settings.branch.addBranch')"
          @click="openDialog=true" />
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px"/>
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{$t('common.keyboard')}}</span>
          <q-input :model-value="search.keyboard" square outlined class="col-6 q-mr-md q-ml-md bg-grey-2 input-md"/>
          <div class="row content-center q-pr-md">
            <span class="row content-center q-pr-md">{{$t('settings.branch.flag')}}</span>
            <q-select v-model="search.flag" :options="flagOptions" />
          </div>
          <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md"/>
        </q-card-section>
        <q-card-section class="q-pa-none" >
          <q-table
            :columns="columns"
            :rows="branches"
            row-key="id"
            selection="multiple"
            :loading="loading"
            v-model:selected="selected"
            v-model:pagination="pagination"
            hide-pagination
            class="no-shadow"
            >
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
                <span v-if="props.row.flag">{{$t('settings.branch.flags.'+props.row.flag)}}</span>
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

            <template v-slot:top >
              <q-btn color="negative" class="no-shadow" unelevated v-if="selected.length >0" :label="$t('common.delete')"  @click="deleteBranchs"/>
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
  <q-dialog v-model="openDialog">
    <BranchCreateForm @closeDialog="loadUsersList();openDialog=false"/>
  </q-dialog>
</template>

<script lang="ts">
import { doc, getFirestore, updateDoc} from '@firebase/firestore';
import { computed, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Accaunt } from 'src/shared/model/Accaunt.model';
import { getBranches } from 'src/shared/utils/User.utils';
import { Branch, branchFlags } from 'src/shared/model/Branch.model';
import { toDateObject } from 'src/shared/utils/utils';
import BranchCreateForm from './components/BranchCreate.form.vue';
export default {
  name: 'branchMaster',
  components: {
    BranchCreateForm
  },
  setup(){
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();

    const search = ref({
      keyboard: '',
      flag: branchFlags.All
    });
    const branches: Ref<Branch[]> = ref([])
    const selected: Ref<Accaunt[]> = ref([])
    const loading = ref(false);

    // dialog date
    const openDialog = ref(false)

    // table date
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const columns = computed(() => [{
      name: 'name',
      required: true,
      label: t('settings.branch.name') ,
      field: 'name',
      align: 'left',
    }, {
      name: 'prefectures',
      label: t('settings.branch.prefectures') ,
      field: 'prefecture',
      align: 'left',
    }, {
      name: 'tel',
      required: true,
      label: t('settings.branch.phone') ,
      field: 'tel',
      align: 'left',
    },{
      name: 'flag',
      required: true,
      label: t('settings.branch.flag') ,
      field: 'flag',
      align: 'left',
    },{
      name: 'hidden',
      required: true,
      label: t('settings.users.hidden') ,
      field: 'hidden',
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
    },])
    const flagOptions = computed(() => Object.keys(branchFlags).map(key => {
      return {
        label: t('settings.branch.flags.'+branchFlags[key]),
        value: branchFlags[key],
      }
    }))

    loadUsersList()
    async function loadUsersList() {
      loading.value = true;
      const branchesSnapshot = getBranches(db);

      branchesSnapshot.then(branch => {
        const list: Branch[] = []
        branch.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id
          list.push({...data, created_at: toDateObject(data.created_at), updated_at: toDateObject(data.updated_at)} as Branch)
        })
        branches.value = list;
        loading.value = false;
      })
    }

    return {
      search,
      columns,
      pagination,
      selected,
      loading,

      openDialog,
      loadUsersList,
      deleteBranchs() {
        const ret = selected.value.map( async (template) => {
          const boRef = doc(db, 'templates/'+template.id);
          await updateDoc(boRef, {
            deleted: true
          })
        })
        Promise.all(ret).then(() => {
          selected.value = [];
          loadUsersList()
        })
      },

      branches,
      branchFlags,
      flagOptions
    }
  }
}
</script>

<style>

</style>
