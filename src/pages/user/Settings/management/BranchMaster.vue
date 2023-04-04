<template>
  <div class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div class="text-h6 q-pr-md text-primary">
          <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md" />
          {{ $t('menu.branches') }}
        </div>
        <q-btn color="primary" text-color="white" class="no-shadow" icon="mdi-plus"
          :label="$t('settings.branch.addBranch')" @click="openDialog = true" />
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px" />
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{ $t('common.keyboard') }}</span>
          <q-input v-model="search.queryText" square outlined class="col-6 q-mr-md q-ml-md bg-grey-2 input-md" dense>
            <template v-slot:append>
              <q-icon v-if="search.queryText" name="close" @click="search.queryText = ''; loadBranchesList();"
                class="cursor-pointer" />
            </template>
          </q-input>
          <div class="row content-center q-pr-md">
            <span class="row content-center q-pr-md">{{ $t('settings.branch.flag') }}</span>
            <q-select v-model="search.flag" :options="flagOptions" option-value="flag" option-label="label" emit-value
              map-options dense />
          </div>
          <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md" unelevated
            @click="loadBranchesList" />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-table :columns="columns" :rows="branches" row-key="id" :loading="loading" v-model:pagination="pagination"
            hide-pagination class="no-shadow">
            <template v-slot:body-cell-delete="props">
              <q-td :props="props" auto-width>
                <q-btn icon="delete" flat @click="deleteBranch(props.row)" />
              </q-td>
            </template>

            <template v-slot:body-cell-edit="props">
              <q-td :props="props" auto-width>
                <q-btn icon="edit" flat @click="editBranch = props.row; openDialog = true;" />
              </q-td>
            </template>

            <template v-slot:body-cell-hidden="props">
              <q-td :props="props">
                <q-checkbox v-model="props.row.hidden" :disable="true" checked-icon="mdi-checkbox-intermediate"
                  unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md" />
              </q-td>
            </template>

            <template v-slot:body-cell-prefectures="props">
              <q-td :props="props">
                <span v-if="props.row.prefectures">{{ $t('prefectures.' + props.row.prefectures) }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-flag="props">
              <q-td :props="props">
                <span v-if="props.row.flag">{{ $t('settings.branch.flags.' + (props.row.flag)) }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-created_at="props">
              <q-td :props="props">
                {{ props.row.created_at.date }}<br />
                {{ props.row.created_at.time }}
              </q-td>
            </template>

            <template v-slot:body-cell-updated_at="props">
              <q-td :props="props">
                {{ props.row.updated_at.date }}<br />
                {{ props.row.updated_at.time }}
              </q-td>
            </template>
          </q-table>
          <div class="row justify-start q-mt-md q-mb-md pagination">
            <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
              :max="(branches.length / pagination.rowsPerPage) >= 1 ? branches.length / pagination.rowsPerPage : 1"
              direction-links outline />
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </div>
  <q-dialog v-model="openDialog" @hide="editBranch = undefined">
    <DialogWrapper>
      <BranchCreateForm @closeDialog="loadBranchesList(); openDialog = false;" :editBranch="editBranch" color="primary" />
    </DialogWrapper>
  </q-dialog>
</template>

<script lang="ts">
import { getFirestore, serverTimestamp } from '@firebase/firestore';
import { computed, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { BranchesSearch } from 'src/shared/utils/User.utils';
import { Branch, branchFlags } from 'src/shared/model/Branch.model';
import BranchCreateForm from 'src/components/organization/BranchCreate.form.vue';
import { QTableProps, useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useOrganization } from 'src/stores/organization';
import { flagOptions } from 'src/components/handlers/flagOptions';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
export default {
  name: 'branchMaster',
  components: {
    BranchCreateForm,
    DialogWrapper
  },
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();

    const search: Ref<BranchesSearch> = ref({
      queryText: '',
      flag: branchFlags.All,
    });
    const branches: Ref<Branch[]> = ref([])
    const loading = ref(false);
    const editBranch: Ref<Branch | undefined> = ref(undefined)

    // dialog date
    const openDialog = ref(false)

    // table date
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });
    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'edit',
        label: '',
        field: '',
      }, {
        name: 'name',
        required: true,
        label: t('settings.branch.name'),
        field: 'name',
        align: 'left',
      }, {
        name: 'prefecture',
        label: t('settings.branch.prefectures'),
        field: 'prefecture',
        align: 'left',
      }, {
        name: 'phone',
        required: true,
        label: t('settings.branch.phone'),
        field: 'phone',
        align: 'left',
      }, {
        name: 'flag',
        required: true,
        label: t('settings.branch.flag'),
        field: 'flag',
        align: 'left',
      }, {
        name: 'hidden',
        required: true,
        label: t('settings.users.hidden'),
        field: 'hidden',
        align: 'left',
      }, {
        name: 'created_at',
        required: true,
        label: t('settings.branch.create_at'),
        field: 'created_at',
        align: 'left',
      }, {
        name: 'updated_at',
        label: t('settings.branch.last_update'),
        field: 'updated_at',
        align: 'left',
      }, {
        name: 'delete',
        label: '',
        field: '',
      }])

    const organization = useOrganization()

    watch(() => organization.currentOrganizationId, () => {
      loadBranchesList()
    })

    loadBranchesList()
    async function loadBranchesList() {
      loading.value = true;
      editBranch.value = undefined;
      try {
        if (organization.currentOrganizationId) {
          branches.value = Object.values(await organization.getBranches(db, organization.currentOrganizationId, search.value)).reduce((prev, curr) => {
            return prev.concat(curr)
          }, [])
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
      loading,

      openDialog,
      editBranch,
      loadBranchesList,
      deleteBranch(branch) {
        $q.dialog({
          title: t('common.delete'),
          message: t('settings.branch.deletedInfo'),
          ok: {
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
          },
        }).onOk(async () => {
          try {
            loading.value = true;
            await organization.editBranch(db, { deleted: true, deletedAt: serverTimestamp(), updated_at: serverTimestamp() }, organization.currentOrganizationId, branch.businessId, branch.id)
            loadBranchesList();
            Alert.success($q, t)
          } catch (e) {
            console.log(e)
            Alert.warning($q, t)
            loading.value = false;
          }
        })
      },

      branches,
      branchFlags,
      flagOptions
    }
  }
}
</script>

<style></style>