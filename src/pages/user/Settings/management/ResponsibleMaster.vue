<template>
  <PageHeader>
    <div :class="isAdmin ? '' : 'text-h6 q-pr-md text-primary'">
      <q-icon v-if="!isAdmin" name="mdi-cog-outline" :color="color" class="q-pr-sm" size="md" />
      {{ isAdmin ? $t('menu.admin.userSearch') : $t('menu.users') }}
    </div>
  </PageHeader>

  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :clear-button-text-color="textColor" :search-button-color="color" :on-click-search="() => searchUsers()"
      :on-click-clear="() => { search = ''; loadUsersList(); }" v-model:model-value="search">
      <template v-slot:rigthButton>
        <DefaultButton :color="color" label-key="settings.users.addUser" @click="openDialog = true" />
      </template>
    </SearchField>
  </q-card>

  <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
    <q-card-section class="q-pa-none">
      <q-table :columns="columns" :rows="usersListData" row-key="id" v-model:pagination="pagination" hide-pagination
        class="no-shadow" :loading="loading" :visible-columns="visibleColumns">

        <template v-slot:body-cell-edit="props">
          <EditButton :props="props" :color="color"
            :on-edit="() => { editableUser = JSON.parse(JSON.stringify(props.row)); discardChanges() }"
            :on-save="() => editUser(props.row)" @onEditableRowChange="(row) => editableRow = row"
            :editable-row="editableRow" />
        </template>

        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            {{ props.row.email }}
          </q-td>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <q-input :color="color" v-if="isRowSelected(props.rowIndex)" v-model="props.row.displayName" />
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ props.row.displayName }}
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-select v-if="isRowSelected(props.rowIndex)" outlined dense v-model="props.row.role"
              :options="mapToSelectOptions(roles)" bg-color="white" :label="$t('common.pleaseSelect')" emit-value
              map-options :color="color" :disable="loading" />
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ roles && roles[props.row.role]?.displayName }}
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-branch="props">
          <q-td :props="props">
            <q-select v-if="isRowSelected(props.rowIndex)" outlined dense v-model="props.row.branch_id"
              :options="mapToSelectOptions(branches)" bg-color="white" :disable="loading"
              :label="$t('common.pleaseSelect')" emit-value :color="color" map-options />
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ branches && branches[props.row?.branch_id]?.name }}
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-hidden="props">
          <q-td :props="props">
            <q-checkbox v-if="isRowSelected(props.rowIndex)" v-model="props.row.hidden"
              :label="$t('settings.branch.hide')" :disable="loading" :color="color"
              checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md" />
            <template v-if="!isRowSelected(props.rowIndex)">
              <q-icon name="mdi-check-bold" v-if="props.row.hidden" />
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-create_at="props">
          <q-td :props="props">
            {{ props.row.create_at.date }}
          </q-td>
        </template>

        <template v-slot:body-cell-updated_at="props">
          <q-td :props="props">
            {{ props.row.updated_at.date }}
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
        <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
          :max="(usersListData.length / pagination.rowsPerPage) >= 1 ? usersListData.length / pagination.rowsPerPage : 1"
          direction-links outline />
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="openDialog" @hide="editableUser = undefined">
    <ResponsibleCreateForm @closeDialog="openDialog = false; loadUsersList()" :roles="roles" :branches="branches" />
  </q-dialog>
</template>

<script lang="ts">
import { doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Role, User, UserPermissionNames } from 'src/shared/model/Account.model';
import { toDateObject, sortDate } from 'src/shared/utils/utils';
import { getRoles, getUsersByPermission, mapToSelectOptions } from 'src/shared/utils/User.utils';
import { QTableProps, useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import ResponsibleCreateForm from './components/ResponsibleCreate.form.vue';
import { useRoute } from 'vue-router'
import { useOrganization } from 'src/stores/organization';
import EditButton from 'components/EditButton.vue';
import PageHeader from 'src/components/PageHeader.vue';
import SearchField from 'src/components/SearchField.vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import { getAllBranches, getVisibleColumns } from './handlers/ResponsibleMaster';
import { useUserStore } from 'src/stores/user';

export default {
  name: 'responcibleMasterManagement',
  components: {
    ResponsibleCreateForm,
    EditButton,
    PageHeader,
    SearchField,
    DefaultButton
  },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const route = useRoute()
    const search = ref('');
    const roles = ref({})
    const branches = ref({})
    const loading = ref(false)
    const organization = useOrganization()
    const usersListData: Ref<User[]> = ref([]);
    const copyUsersListData: Ref<User[]> = ref([]);
    const isAdmin = route.meta.isAdmin
    // dialog data
    const openDialog = ref(false)
    const editableUser: Ref<User | undefined> = ref(undefined)
    const editableRow = ref(-1);
    const color = isAdmin ? 'accent' : 'primary'
    const textColor = isAdmin ? 'accent' : 'black'
    // Table data
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const selected: Ref<User[]> = ref([])
    const userStore = useUserStore()

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'edit',
        label: '',
        field: ''
      }, {
        name: 'email',
        required: true,
        label: t('settings.users.email'),
        field: 'email',
        align: 'left',
        sortable: true,
      }, {
        name: 'name',
        required: true,
        label: t('settings.users.person_name'),
        field: 'displayName',
        align: 'left',
        sortable: true,
      }, {
        name: 'role',
        required: true,
        label: t('settings.users.role'),
        field: 'role_name',
        align: 'left',
        sortable: true,
      }, {
        name: 'branch',
        label: t('settings.users.branch_name'),
        field: 'branch',
        align: 'left',
        sortable: true,
      }, {
        name: 'hidden',
        required: true,
        label: t('settings.users.hidden'),
        field: 'hidden',
        align: 'left',
        sortable: true,
      }, {
        name: 'create_at',
        required: true,
        label: t('settings.users.create_at'),
        field: 'create_at',
        align: 'left',
        sortable: true,
        sort: sortDate
      }, {
        name: 'updated_at',
        label: t('settings.users.last_update'),
        field: 'updated_at',
        align: 'left',
        sortable: true,
        sort: sortDate
      }, {
        name: 'delete',
        label: '',
        field: ''
      }
    ])

    const visibleColumns = ref<string[]>()
    onMounted(() => {
      visibleColumns.value = getVisibleColumns(columns.value, isAdmin)
    })

    watch(() => organization.currentOrganizationId, () => {
      loadUsersList()
    })

    loadUsersList()
    async function loadUsersList() {
      loading.value = true;
      try {
        if (organization.currentOrganizationId) {
          const usersSnapshot = isAdmin ? getUsersByPermission(db, UserPermissionNames.UserUpdate, search.value) : getUsersByPermission(db, UserPermissionNames.ContentsRead, search.value, organization.currentOrganizationId);
          const rolesSnapshot = getRoles(db);

          usersSnapshot.then(users => {
            let list: User[] = [];
            users?.forEach((doc) => {
              const data = doc.data();
              data['id'] = doc.id;
              list.push({ ...data as User, id: doc.id, create_at: toDateObject(data.create_at), updated_at: toDateObject(data.updated_at) });
            });
            usersListData.value = list;
            copyUsersListData.value = list
          })

          rolesSnapshot.then(role => {
            const list = {}
            role.forEach((doc) => {
              const data = doc.data() as Role
              list[doc.id] = data
            })
            roles.value = list;
          })
          branches.value = await getAllBranches(db)
          Promise.all([usersSnapshot, rolesSnapshot]).then(() => {
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

    function isRowSelected(row: number) {
      return row == editableRow.value
    }

    function discardChanges() {
      usersListData.value = JSON.parse(JSON.stringify(copyUsersListData.value))
    }

    async function editUser(user: User) {
      const isUserChanged = !(user.displayName == editableUser.value?.displayName && user.role == editableUser.value?.role && user.branch_id == editableUser.value?.branch_id && user.hidden == editableUser.value?.hidden);
      if (!isUserChanged) {
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
      visibleColumns,
      textColor,
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
          ok: {
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
          },
        }).onOk(async () => {
          try {
            loading.value = true;
            await userStore.editUser(user.id, {
              deleted: true,
              deletedAt: serverTimestamp(),
              updated_at: serverTimestamp()
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
      discardChanges,
    }
  }
}
</script>

<style lang="scss"></style>
