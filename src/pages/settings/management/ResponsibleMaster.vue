<template>
  <div  class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div :class="isAdmin ?'text-h6 q-pr-md' : 'text-h6 q-pr-md text-primary'"  >
          <q-icon v-if="!isAdmin" name="mdi-cog-outline" :color="color" class="q-pr-sm" size="md"/>
          {{ isAdmin ? $t('menu.admin.userSearch') : $t('menu.users')}}
        </div>
        <q-btn :color="color" text-color="white" class="no-shadow" icon="mdi-plus" :label="$t('settings.users.addUser')"  @click="openDialog=true"/>
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px"/>
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{$t('common.keyboard')}}</span>
          <q-input v-model="search" square outlined dense class="col-6 q-mr-md q-ml-md bg-grey-2 input-md">
            <template v-slot:append>
              <q-icon v-if="search" name="close" @click="search='';loadUsersList();" class="cursor-pointer" />
            </template>
          </q-input>
          <q-btn @click="searchUsers" :label="$t('common.search')" :color="color" text-color="white" size="md"/>
        </q-card-section>
        <q-card-section class="q-pa-none" >
          <q-table
            :columns="columns"
            :rows="usersListData"
            row-key="id"
            v-model:pagination="pagination"
            hide-pagination
            class="no-shadow"
            :loading="loading"
            >

            <template v-slot:body-cell-edit="props">
                <q-td :props="props" auto-width>
                  <q-btn v-if="!isRowSelected(props.rowIndex)" icon="edit" flat @click="editableRow=props.rowIndex; editableUser=JSON.parse(JSON.stringify(props.row))" :color="color"/>
                  <q-btn v-if="editableRow>=0 && isRowSelected(props.rowIndex)" flat icon="mdi-content-save" @click="editUser(props.row)"/>
                </q-td>
            </template>

            <template v-slot:body-cell-email="props">
              <q-td :props="props">
                  {{ props.row.email }}
              </q-td>
            </template>

            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-input v-if="isRowSelected(props.rowIndex)" v-model="props.row.displayName"/>
                <template v-if="!isRowSelected(props.rowIndex)">
                  {{ props.row.displayName }}
                </template>
              </q-td>
            </template>

              <template v-slot:body-cell-role="props">
                <q-td :props="props">
                  <q-select
                  v-if="isRowSelected(props.rowIndex)"
                  outlined
                  dense
                  v-model="props.row.role"
                  :options="mapToSelectOptions(roles)"
                  bg-color="white"
                  :label="$t('common.pleaseSelect')"
                  emit-value
                  map-options
                  :disable="loading" />
                  <template v-if="!isRowSelected(props.rowIndex)">
                    {{roles && roles[props.row.role]?.displayName}}
                  </template>
                </q-td>
              </template>

              <template v-slot:body-cell-branch="props">
                <q-td :props="props">
                <q-select
                v-if="isRowSelected(props.rowIndex)"
                outlined dense
                v-model="props.row.branch_id"
                :options="mapToSelectOptions(branches)"
                bg-color="white"
                :disable="loading"
                :label="$t('common.pleaseSelect')"
                emit-value
                map-options />
                <template v-if="!isRowSelected(props.rowIndex)">
                    {{branches && branches[props.row?.branch_id]?.name}}
                </template>
                </q-td>
              </template>

              <template v-slot:body-cell-hidden="props">
                <q-td :props="props">
                <q-checkbox
                v-if="isRowSelected(props.rowIndex)"
                v-model="props.row.hidden"
                :label="$t('settings.branch.hide')"
                :disable="loading"
                checked-icon="mdi-checkbox-intermediate"
                unchecked-icon="mdi-checkbox-blank-outline"
                class="q-pr-md"/>
                  <template v-if="!isRowSelected(props.rowIndex)">
                    <q-icon name="mdi-check-bold" v-if="props.row.hidden"/>
                  </template>
                </q-td>
              </template>

              <template v-slot:body-cell-create_at="props">
                <q-td :props="props">
                  {{props.row.create_at.date}}
                </q-td>
              </template>

              <template v-slot:body-cell-updated_at="props">
                <q-td :props="props">
                  {{props.row.updated_at.date}}
                </q-td>
              </template>

              <template v-slot:body-cell-delete="props">
                <q-td :props="props" auto-width>
                  <q-btn icon="delete" flat @click="deleteAccaunt(props.row)" />
                </q-td>
              </template>
              <template v-slot:loading>
                <q-inner-loading showing :color="color" />
              </template>
          </q-table>
          <div class="row justify-start q-mt-md q-mb-md pagination">
              <q-pagination
                v-model="pagination.page"
                color="grey-8"
                padding="5px 16px"
                gutter="md"
                :max="(usersListData.length/pagination.rowsPerPage) >= 1 ?  usersListData.length/pagination.rowsPerPage : 1"
                direction-links
                outline
              />
            </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </div>
  <q-dialog v-model="openDialog" @hide="editableUser=undefined">
    <ResponsibleCreateForm  @closeDialog="openDialog = false; loadUsersList()" :roles="roles" :branches="branches"/>
  </q-dialog>
</template>

<script lang="ts">
import { doc, getFirestore, serverTimestamp, updateDoc} from '@firebase/firestore';
import { computed, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Accaunt, Role, UserPermissionNames } from 'src/shared/model/Accaunt.model';
import { getOrganizationId, toDateObject, sortDate } from 'src/shared/utils/utils';
import { getBranches, getRoles, getUsersByPermission, mapToSelectOptions } from 'src/shared/utils/User.utils';
import { Branch } from 'src/shared/model/Branch.model';
import { QTableProps, useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import ResponsibleCreateForm from './components/ResponsibleCreate.form.vue';
import { useRoute } from 'vue-router'

export default {
  name: 'responcibleMasterManagement',
  components:{
    ResponsibleCreateForm
  },
  setup(){
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const route = useRoute()
    const search = ref('');
    const roles = ref({})
    const branches = ref({})
    const loading = ref(false)
    const usersListData: Ref<Accaunt[]> = ref([]);
    const isAdmin = route.meta.isAdmin
    // dialog data
    const openDialog = ref(false)
    const editableUser: Ref<Accaunt | undefined> = ref(undefined)
    const editableRow = ref(-1);
    const color = isAdmin ? 'accent' : 'primary'

    // Table data
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const selected: Ref<Accaunt[]> = ref([])

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'edit',
        label: '',
        field:''
      },{
        name: 'email',
        required: true,
        label: t('settings.users.email') ,
        field: 'email',
        align: 'left',
        sortable: true,
      }, {
        name: 'name',
        required: true,
        label: t('settings.users.person_name') ,
        field: 'displayName',
        align: 'left',
        sortable: true,
      }, {
        name: 'role',
        required: true,
        label: t('settings.users.role') ,
        field: 'role_name',
        align: 'left',
        sortable: true,
      }, {
        name: 'branch',
        required: true,
        label: t('settings.users.branch_name') ,
        field: 'branch',
        align: 'left',
        sortable: true,
      },{
        name: 'hidden',
        required: true,
        label: t('settings.users.hidden') ,
        field: 'hidden',
        align: 'left',
        sortable: true,
      },{
        name: 'create_at',
        required: true,
        label: t('settings.users.create_at') ,
        field: 'create_at',
        align: 'left',
        sortable: true,
        sort: sortDate
      },{
        name: 'updated_at',
        label: t('settings.users.last_update') ,
        field: 'updated_at',
        align: 'left',
        sortable: true,
        sort: sortDate
      },{
        name: 'delete',
        label: '',
        field:''
      }
    ])

    loadUsersList()
    async function loadUsersList() {
      loading.value = true;
      try {
        const active_organization_id = getOrganizationId($q)
        if (active_organization_id) {
          const usersSnapshot = isAdmin ?  getUsersByPermission(db, UserPermissionNames.UserUpdate, search.value) : getUsersByPermission(db, UserPermissionNames.ContentsRead, search.value, active_organization_id);
          const rolesSnapshot = getRoles(db);
          const branchesSnapshot = getBranches(db, active_organization_id);

          usersSnapshot.then(users => {
            let list: Accaunt[] = [];
            users?.forEach((doc) => {
              const data = doc.data();
              data['id'] = doc.id;
              list.push({ ...data as Accaunt, id: doc.id, create_at: toDateObject(data.create_at), updated_at: toDateObject(data.updated_at)});
            });
            usersListData.value = list;
          })

          rolesSnapshot.then(role => {
            const list = {}
            role.forEach((doc) => {
              const data = doc.data() as Role
              list[doc.id] = data
            })
            roles.value = list;
          })

          branchesSnapshot.then(branch => {
            const list = {}
            branch.forEach((doc) => {
              const data = doc.data() as Branch;
              list[doc.id] = data
            })
            branches.value = list;
          })
          Promise.all([usersSnapshot, rolesSnapshot, branchesSnapshot]).then(() => {
            loading.value = false;
          })
        }
      } catch (e) {
        console.log(e)
        loading.value = false;
        Alert.warning($q, t)
      }
    }

    function searchUsers() {
      loadUsersList()
    }

    function isRowSelected(row:number){
      return row == editableRow.value
    }

    async function editUser(user: Accaunt) {
      const isUserChanged = !(user.displayName == editableUser.value?.displayName && user.role == editableUser.value?.role && user.branch_id == editableUser.value?.branch_id && user.hidden == editableUser.value?.hidden);
      editableRow.value = -1;
      if(!isUserChanged){
        return;
      }
      loading.value = true
      try {
      const boRef = doc(db, 'users/' + user.id);
      await updateDoc(boRef, {
        updated_at: serverTimestamp(),
        hidden: !!user.hidden,
        displayName: user.displayName,
        role: user.role,
        branch_id: user.branch_id,
      });
      await loadUsersList();
      loading.value = false
      Alert.success($q, t);
      } catch (error) {
        console.log(error)
        Alert.warning($q, t);
        loading.value = false;
      }

    }


    return {
      isAdmin,
      editableRow,
      search,
      columns,
      pagination,
      selected,
      loading,
      color,
      editableUser,
      openDialog,
      route,
      roles,
      usersListData,
      branches,
      loadUsersList,
      deleteAccaunt(user) {
        $q.dialog({
          title: t('common.delete'),
          message: t('settings.users.deletedInfo'),
          ok:{
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
          },
        }).onOk(async () => {
          try{
            loading.value = true;
            const boRef = doc(db, 'users/'+user.uid);
            await updateDoc(boRef, {
              deleted: true
            })
            loadUsersList();
            Alert.success($q, t)
          } catch (e) {
            console.log(e)
            Alert.warning($q, t)
            loading.value = false;
          }
        })
      },
      searchUsers,
      sortDate,
      isRowSelected,
      editUser,
      mapToSelectOptions,
    }
  }
}
</script>

<style lang="scss">
</style>

