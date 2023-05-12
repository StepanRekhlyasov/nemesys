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
      <q-table :columns="columns" :rows="usersListData" row-key="id" :rows-per-page-options="[0]" hide-pagination
        class="no-shadow" :loading="loading" :visible-columns="visibleColumns">

        <template v-slot:body-cell-edit="props">
          <EditButton :props="props" :color="color"
            :on-edit="() => { sortable = false; editableUser = JSON.parse(JSON.stringify(props.row)); discardChanges() }"
            :on-save="async () => { await editUser(props.row); sortable = true }"
            @onEditableRowChange="(row) => editableRow = row" :editable-row="editableRow" />
        </template>

        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            {{ props.row.email }}
          </q-td>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <q-input :color="color" v-if="isRowSelected(props.rowIndex)" v-model="editableUser!.displayName" />
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
      <div class="row justify-start q-mt-md q-mb-md pagination">
        <TablePagination :isAdmin="isAdmin" ref="paginationRef" :pagination="pagination"
          @on-data-update="(user) => onDataUpdate(user as User[])" @on-loading-state-change="(v) => loading = v"
          :disable="!sortable" />
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="openDialog" @hide="editableUser = undefined">
    <ResponsibleCreateForm @closeDialog="openDialog = false; refresh()" :roles="roles" :branches="branches"
      :is-admin="isAdmin" />
  </q-dialog>
</template>

<script setup lang="ts">
import { getFirestore, orderBy, serverTimestamp, Timestamp } from '@firebase/firestore';
import { onBeforeMount, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Role, User } from 'src/shared/model/Account.model';
import { toDateObject } from 'src/shared/utils/utils';
import { getRoles, mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useQuasar } from 'quasar';
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
import TablePagination from 'src/components/pagination/TablePagination.vue'
import { PaginationExposedMethods } from 'src/components/pagination/types';
import { ResponsibleMasterColumns as columns, sortable } from './consts/ResponsibleMasterColumns'

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

const pagination = ref({
  rowsPerPage: 100,
  path: 'users',
  order: orderBy('name', 'asc'),
  constraints: getConstraints(isAdmin, organization.currentOrganizationId)
});

const userStore = useUserStore()
const rolesData = ref<Role[]>([])

const visibleColumns = ref<string[]>()
onBeforeMount(async () => {
  visibleColumns.value = getVisibleColumns(columns.value, isAdmin)
  rolesData.value = await getRoles(db)
  if (!isAdmin) {
    branches.value = await organization.getBranchesInOrganization(organization.currentOrganizationId)
  }
})

const paginationRef = ref<PaginationExposedMethods | null>(null)

watch(() => organization.currentOrganizationId, async () => {
  const newConstraints = getConstraints(isAdmin, organization.currentOrganizationId)
  paginationRef.value?.setConstraints(newConstraints)
  paginationRef.value?.queryFirstPage()
})

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
  if (isAdmin) {
    filterRoles(list)
  }
  roles.value = list;
}

async function refresh() {
  await paginationRef.value?.refreshPage()
}

async function searchUsers() {
  loading.value = true
  const users = await userStore.searchUsers(search.value)
  setUsers(users)
  loading.value = false
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

  if (!editableUser.value) {
    return
  }

  user.displayName = editableUser.value.displayName
  user.role = editableUser.value.role
  user.branch_id = editableUser.value.branch_id
  user.hidden = editableUser.value.hidden

  loading.value = true
  try {
    await userStore.editUser(user.id, {
      displayName: user.displayName,
      role: user.role,
      branch_id: user.branch_id,
      hidden: user.hidden,
      updated_at: serverTimestamp()
    })
    await refresh();
    loading.value = false
    Alert.success($q, t);
  } catch (error) {
    console.log(error)
    Alert.warning($q, t);
    loading.value = false;
  }

}

async function deleteAccount(user: User) {
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
      refresh();
      Alert.success($q, t)
    } catch (e) {
      console.log(e)
      Alert.warning($q, t)
      loading.value = false;
    }
  })
}
</script>
