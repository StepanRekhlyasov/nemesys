<template>
  <PageHeader>
    <div :class="isAdmin ? '' : 'text-h6 q-pr-md text-primary'">
      <q-icon v-if="!isAdmin" name="mdi-cog-outline" :color="color" class="q-pr-sm" size="md" />
      {{ isAdmin ? $t('menu.admin.userSearch') : $t('menu.users') }}
    </div>
  </PageHeader>
  <q-card flat class="q-pt-sm q-px-lg">
    <SearchField :clear-button-text-color="textColor" :search-button-color="color" :on-click-search="() => searchUsers()"
      :on-click-clear="() => { search = ''; refresh(); }" v-model:model-value="search">
      <template v-slot:rigthButton>
        <DefaultButton :color="color" label-key="settings.users.contactPersonName" @click="openDialog = true" />
      </template>
    </SearchField>
  </q-card>

  <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
    <q-card-section class="q-pa-none">
      <q-form ref="formRef" @submit.prevent>
        <q-table :columns="columns" :rows="usersListData" row-key="id" :rows-per-page-options="[0]" hide-pagination
          class="no-shadow" :loading="loading" :visible-columns="visibleColumns" binary-state-sort>

          <template v-slot:body-cell-edit="props">
            <EditButton :props="props" :color="color" cancelButton
              :on-edit="() => { sortable = false; editableUser = JSON.parse(JSON.stringify(props.row)); discardChanges() }"
              :on-save="async () => { return await editUser(props.row); }"
              @onEditableRowChange="(row) => editableRow = row" :editable-row="editableRow"
              @on-exit-editing-mode="{ editableRow = -1; }" />
          </template>
          <template v-slot:body-cell-email="props">
            <q-td :props="props">
              <q-input :color="color" v-if="isRowSelected(props.rowIndex)" v-model="editableUser!.email" type="email"
                :rules="[validateEmail]" hide-bottom-space />
              <template v-if="!isRowSelected(props.rowIndex)">
                {{ props.row.email }}
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-input :color="color" v-if="isRowSelected(props.rowIndex)" v-model="editableUser!.displayName"
                :rules="[creationRule]" hide-bottom-space />
              <template v-if="!isRowSelected(props.rowIndex)">
                {{ props.row.displayName }}
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-select v-if="isRowSelected(props.rowIndex)" outlined dense v-model="editableUser!.role"
                :options="mapToSelectOptions(roles)" bg-color="white" :label="$t('common.pleaseSelect')" emit-value
                map-options :color="color" :disable="loading" />
              <template v-if="!isRowSelected(props.rowIndex)">
                {{ roles && roles[props.row.role]?.displayName }}
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-branch="props">
            <q-td :props="props">
              <q-select v-if="isRowSelected(props.rowIndex)" outlined dense v-model="editableUser!.branch_id"
                :options="mapToSelectOptions(branches)" bg-color="white" :disable="loading"
                :label="$t('common.pleaseSelect')" emit-value :color="color" map-options />
              <template v-if="!isRowSelected(props.rowIndex)">
                {{ branches && branches[props.row?.branch_id]?.name }}
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-hidden="props">
            <q-td :props="props">
              <q-checkbox v-if="isRowSelected(props.rowIndex)" v-model="editableUser!.hidden"
                :label="$t('settings.branch.hide')" :disable="loading" :color="color"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md" />
              <template v-if="!isRowSelected(props.rowIndex)">
                <q-icon name="mdi-check-bold" v-if="props.row.hidden" />
              </template>
            </q-td>
          </template>

          <template v-slot:body-cell-create_at="props">
            <q-td :props="props">
              {{ props.row.create_at?.date }}
            </q-td>
          </template>

          <template v-slot:body-cell-updated_at="props">
            <q-td :props="props">
              {{ props.row?.updated_at?.date }}
            </q-td>
          </template>

          <template v-slot:body-cell-delete="props">
            <q-td :props="props" auto-width>
              <q-btn icon="delete" flat @click="deleteAccount(props.row)" />
            </q-td>
          </template>
          <template v-slot:loading>
            <q-inner-loading showing :color="color" />
          </template>
        </q-table>
      </q-form>
      <div class="row justify-start q-mt-md pagination q-ml-sm">
        <TablePaginationSimple :pagination="pagination" :is-admin="isAdmin"
          :max="(usersListData.length / pagination.rowsPerPage) >= 1 ? Math.ceil(usersListData.length / pagination.rowsPerPage) : 1"
          @on-data-update="async (page) => {
            pagination.page = page
          }" />
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="openDialog" @hide="editableRow = -1; editableUser = undefined">
    <ResponsibleCreateForm @closeDialog="openDialog = false; refresh()" :roles="roles" :branches="branches"
      :is-admin="isAdmin" />
  </q-dialog>
</template>

<script setup lang="ts">
import { serverTimestamp, Timestamp } from '@firebase/firestore';
import { onBeforeMount, Ref, ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Role, User } from 'src/shared/model/Account.model';
import { toDateObject } from 'src/shared/utils/utils';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { QForm, useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import ResponsibleCreateForm from './components/ResponsibleCreate.form.vue';
import { useRoute } from 'vue-router'
import { useOrganization } from 'src/stores/organization';
import EditButton from 'components/EditButton.vue';
import PageHeader from 'src/components/PageHeader.vue';
import SearchField from 'src/components/SearchField.vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import { filterRoles, getConstraints, getVisibleColumns } from './handlers/ResponsibleMaster';
import { useUserStore } from 'src/stores/user';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';
import { ResponsibleMasterColumns as columns, sortable } from './consts/ResponsibleMasterColumns'
import { useBranch } from 'src/stores/branch';
import { useRole } from 'src/stores/role';
import { validateEmail } from 'src/shared/constants/Form.const';
import { creationRule } from 'src/components/handlers/rules';
import { is } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const route = useRoute()
const search = ref('');
const roles = ref({})
const branches = ref({})
const loading = ref(false)
const organization = useOrganization()
const branchStore = useBranch()
const roleStore = useRole()
const usersListData: Ref<User[]> = ref([]);
const copyUsersListData: Ref<User[]> = ref([]);
const isAdmin = route.meta.isAdmin
const openDialog = ref(false)
const editableUser: Ref<User | undefined> = ref(undefined)
const editableRow = ref(-1);
const color = isAdmin ? 'accent' : 'primary'
const textColor = isAdmin ? 'accent' : 'black'
const formRef = ref<QForm | null>(null)

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

const userStore = useUserStore()
const rolesData = ref<Role[]>([])

const visibleColumns = ref<string[]>()

onMounted(async () => {
  await loadUsers()
})

onBeforeMount(async () => {
  visibleColumns.value = getVisibleColumns(columns.value, isAdmin)
  rolesData.value = await roleStore.getAllRoles()
  if (!isAdmin) {
    branches.value = await branchStore.getBranchesInOrganization(organization.currentOrganizationId)
  }
})

watch(() => organization.currentOrganizationId, async () => {
  await loadUsers();
})

const loadUsers = async () => {
  const constraints = getConstraints(isAdmin, organization.currentOrganizationId)
  const users = await userStore.getAllUsers('', '', constraints)
  onDataUpdate(users as User[])
}
function setUsers(users: User[]) {
  let userList: User[] = [];
  users?.forEach((doc) => {
    userList.push({ ...doc as User, id: doc.id, create_at: toDateObject(doc.create_at as Timestamp), updated_at: toDateObject(doc.updated_at as Timestamp) });
  });
  usersListData.value = userList;
  copyUsersListData.value = userList
}

function onDataUpdate(users: User[]) {
  setUsers(users)
  const list = {}
  rolesData.value?.forEach((doc) => {
    list[doc?.id] = doc
  })

  filterRoles(list, isAdmin)

  roles.value = list;
  loading.value = false
}

async function refresh() {
  await loadUsers()
  pagination.value.page = 1
}

async function searchUsers() {
  loading.value = true
  usersListData.value = [...copyUsersListData.value]
  usersListData.value = usersListData.value.filter(function (el) {
    return el['displayName'].toLowerCase().includes(search.value.toLowerCase()) ||el['email'].toLowerCase().includes(search.value.toLowerCase())
  });
  loading.value = false
}

function isRowSelected(row: number) {
  return row === editableRow.value
}

function discardChanges() {
  usersListData.value = JSON.parse(JSON.stringify(copyUsersListData.value))
}

async function editUser(user: User) {

  const isEqual = is.deepEqual(user, editableUser.value)
  const valid = await formRef.value?.validate()
  if (!valid || !editableUser.value) {
    return false;
  }

  if (isEqual) {
    return
  }

  user.displayName = editableUser.value.displayName
  user.role = editableUser.value.role
  user.branch_id = editableUser.value.branch_id
  user.hidden = editableUser.value.hidden
  const email = editableUser.value.email === user.email ? undefined : editableUser.value.email
  user.email = editableUser.value.email
  loading.value = true
  try {
    await userStore.editUser(user.id, {
      displayName: user.displayName,
      role: user.role,
      branch_id: user.branch_id,
      hidden: user.hidden,
      updated_at: serverTimestamp(),
      email
    })
    organization.state.currentOrganizationUsers = await organization.getCurrentUsersInChrage()
    await refresh();
    ;
  } catch (error) {
    console.log(error)
    Alert.warning(error);
  }
  loading.value = false;
  sortable.value = true
}

async function deleteAccount(user: User) {
  $q.dialog({
    title: t('common.delete'),
    message: t('settings.users.delete'),
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
      await refresh();

    } catch (e) {
      console.log(e)
      Alert.warning(e)
      loading.value = false;
    }
  })
}
</script>
