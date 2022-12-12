<template>
  <div  class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div class="text-h6 q-pr-md text-primary">
          <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md"/>
          {{$t('menu.users')}}
        </div>
        <q-btn color="primary" text-color="white" class="no-shadow" icon="mdi-plus" :label="$t('settings.users.addUser')" />
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px"/>
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{$t('common.keyboard')}}</span>
          <q-input :model-value="search" square outlined dense class="col-6 q-mr-md q-ml-md bg-grey-2 input-md"/>
          <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md"/>
        </q-card-section>
        <q-card-section class="q-pa-none" >
          <q-table
            :columns="columns"
            :rows="usersListData"
            row-key="id"
            selection="multiple"
            v-model:selected="selected"
            v-model:pagination="pagination"
            hide-pagination
            class="no-shadow"
            :loading="loading"
            >
              <template v-slot:body-cell-role="props">
                <q-td :props="props" >
                  {{roles && roles[props.row.role]?.displayName}}
                </q-td>
              </template>
              <template v-slot:body-cell-branch="props">
                <q-td :props="props">
                  {{branches && branches[props.row?.branch_id]?.name}}
                </q-td>
              </template>
              <template v-slot:body-cell-hidden="props">
                <q-td :props="props">
                  <q-icon name="mdi-check-bold" v-if="props.row.hidden"/>
                </q-td>
              </template>
              <template v-slot:body-cell-create_at="props">
                <q-td :props="props">
                  {{props.row.create_at.date}}<br/>
                  {{props.row.create_at.time}}
                </q-td>
              </template>
              <template v-slot:body-cell-updateAt="props">
                <q-td :props="props">
                  {{props.row.updateAt.date}}<br/>
                  {{props.row.updateAt.time}}
                </q-td>
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
</template>

<script lang="ts">
import { getFirestore} from '@firebase/firestore';
import { computed, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Accaunt, Role } from 'src/shared/model/Accaunt.model';
import { getOrganizationId, toDateObject } from 'src/shared/utils/utils';
import { getAllUsers, getBranches, getRoles } from 'src/shared/utils/User.utils';
import { Branch } from 'src/shared/model/Branch.model';
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'responcibleMasterManagement',
  setup(){
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();

    const search = ref('');
    const roles = ref({})
    const branches = ref({})
    const loading = ref(false)
    const usersListData: Ref<Accaunt[]> = ref([]);

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const selected: Ref<Accaunt[]> = ref([])
    const columns = computed(() => [{
      name: 'email',
      required: true,
      label: t('settings.users.email') ,
      field: 'email',
      align: 'left',
    }, {
      name: 'name',
      required: true,
      label: t('settings.users.person_name') ,
      field: 'name',
      align: 'left',
    }, {
      name: 'role',
      required: true,
      label: t('settings.users.role') ,
      field: 'role_name',
      align: 'left',
    }, {
      name: 'branch',
      required: true,
      label: t('settings.users.branch_name') ,
      field: 'branch',
      align: 'left',
    },{
      name: 'hidden',
      required: true,
      label: t('settings.users.hidden') ,
      field: 'hidden',
      align: 'left',
    },{
      name: 'create_at',
      required: true,
      label: t('settings.users.create_at') ,
      field: 'create_at',
      align: 'left',
    },{
      name: 'last_update',
      label: t('settings.users.last_update') ,
      field: 'last_update',
      align: 'left',
    },])

    loadUsersList()
    async function loadUsersList() {
      loading.value = true;
      try {
        const active_organization_id = getOrganizationId($q)
        if (active_organization_id) {
          const usersSnapshot = getAllUsers(db, active_organization_id);
          const rolesSnapshot = getRoles(db);
          const branchesSnapshot = getBranches(db, active_organization_id);

          usersSnapshot.then(users => {
            let list: Accaunt[] = [];
            users.forEach((doc) => {
              const data = doc.data();
              data['id'] = doc.id;
              list.push({ ...data as Accaunt, id: doc.id, create_at: toDateObject(data.addedAt), last_update: toDateObject(data.last_update)});
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

    return {
      search,
      columns,
      pagination,
      selected,
      loading,

      roles,
      usersListData,
      branches
    }
  }
}
</script>

<style lang="scss">
</style>
