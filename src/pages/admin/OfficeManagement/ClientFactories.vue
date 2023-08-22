<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n';
import { useClientFactory } from 'src/stores/clientFactory';
import CFPageActions from 'src/components/client-factory/CFPageActions.vue';
import ClientFactoryDrawer from './ClientFactoryDrawer.vue';
import NewClientDrawer from 'src/components/client-factory/NewClientDrawer.vue';
import NewClientFactoryDrawer from 'src/components/client-factory/NewClientFactoryDrawer.vue';
import ClientFactoryTable from 'src/components/client-factory/ClientFactoryTable.vue';
import Pagination from 'src/components/client-factory/PaginationView.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTableRow, ActionsType } from 'src/components/client-factory/types';
import { clientFactoriesToTableRows } from './handlers';
import { useClient } from 'src/stores/client';
import consts from './consts';

const { t } = useI18n({ useScope: 'global' });
const clientFactoryStore = useClientFactory()
const {clientFactories} = storeToRefs(clientFactoryStore)
const clientStore = useClient()
const { clients } = storeToRefs(clientStore)

const activeClientFactoryItem = ref<ClientFactory | null>(null)
const tableRows = ref<ClientFactoryTableRow[]>([])
const fetchData = ref(false)

const adminSelectedCFsId = ref<string[]>(clientFactoryStore.adminSelectedCFsId);
const adminCondition = ref<boolean>(clientFactoryStore.adminCondition);
// drawers
const isClientFactoryDrawer = ref(false)
const isNewClientDrawer = ref(false)
const isNewClientFactoryDrawer = ref(false)

const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 100,
    rowsNumber: tableRows.value.length
});

const paginatedTableRows = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
    const end = start + pagination.value.rowsPerPage;
    return tableRows.value.slice(start, end);
});

const resetAdminSelectedCFsId = () =>{
    adminCondition.value = false
    clientFactoryStore.adminCondition = false
    adminSelectedCFsId.value = []
    clientFactoryStore.adminSelectedCFsId = []
}

const originalOfficeId = ref('')
const clientFactoryDrawerHandler = (item: ClientFactoryTableRow) => {
    isClientFactoryDrawer.value = false
    originalOfficeId.value = item.id

    setTimeout(() => {
        activeClientFactoryItem.value = clientFactories.value.find((factory) => factory.id === item.id) as ClientFactory

        if (activeClientFactoryItem.value) {
            isClientFactoryDrawer.value = true
        }
    }, 200);
}
const selectedIds = ref<ClientFactoryTableRow[]>([])
const showDeleteDialog = ref(false)
const deletingProccess = ref(false)
const deleteClientFactories = async () => {
  deletingProccess.value = true
  await clientStore.deleteClientFactories(selectedIds.value)
  deletingProccess.value = false
  showDeleteDialog.value = false
}


watch([clients], () => {
    fetchData.value = true
    clientFactoryStore.getClientFactories(clients.value).then(() => {
      fetchData.value = false
    })
}, { deep: true, immediate: true });

watch([clientFactories,adminCondition], () => {
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
    if(adminCondition.value){
        tableRows.value = clientFactoriesToTableRows(clientFactories.value).filter((item)=>adminSelectedCFsId.value.includes(item.id))
    }
    else{
        tableRows.value = clientFactoriesToTableRows(clientFactories.value)
    }
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
}, { deep: true, immediate: true })

// client-factory drawer

const hideClientFactoryDrawer = () => {
    isClientFactoryDrawer.value = false
}

// new client drawer

const hideNewClientDrawer = () => {
    isNewClientDrawer.value = false
}

const openNewClientDrawer = () => {
    isNewClientDrawer.value = true
}

// new client-factory drawer

const hideNewClientFactoryDrawer = () => {
    isNewClientFactoryDrawer.value = false
}

const openNewClientFactoryDrawer = () => {
    isNewClientFactoryDrawer.value = true
}

</script>

<template>
    <div class="wrapper row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-2">
            <q-card-section class="bg-grey-3">
                <div class="title text-h6 text-weight-bold">{{ t('menu.admin.masterSearch') }}</div>
            </q-card-section>
            <q-separator color="grey-4" size="2px" />
            <CFPageActions
                :is-reset="adminCondition"
                :selectedIds="selectedIds"
                @open-client-drawer="openNewClientDrawer"
                @open-client-factory-drawer="openNewClientFactoryDrawer"
                @reset-selected-id="resetAdminSelectedCFsId"
                @deleteClientFactories="showDeleteDialog = true"
                :actions-type="ActionsType.ADMIN"
                theme="accent"/>
            <q-card-section class="table no-padding">
                <ClientFactoryTable
                @select-item="clientFactoryDrawerHandler"
                :isFetching="fetchData && !(adminCondition && tableRows.length===0)"
                :rows="paginatedTableRows"
                :pagination="pagination"
                :table-columns="consts.tableColumnsClientFactory.value"
                @selectedId="(ids)=>selectedIds=ids"
                theme="accent"/>
                <Pagination
                :rows="tableRows"
                @updatePage="pagination.page = $event"
                v-model:pagination="pagination"
                theme="accent"/>
            </q-card-section>
        </q-card>

        <ClientFactoryDrawer
          v-if="activeClientFactoryItem"
          :key="activeClientFactoryItem.id"
          v-model:selectedItem="activeClientFactoryItem"
          :isDrawer="isClientFactoryDrawer"
          :originalOfficeId="originalOfficeId"
          @hide-drawer="hideClientFactoryDrawer"
        />

        <NewClientDrawer
        @hide-drawer="hideNewClientDrawer"
        theme="accent"
        :is-drawer="isNewClientDrawer"/>

        <NewClientFactoryDrawer
        @hide-drawer="hideNewClientFactoryDrawer"
        theme="accent"
        :is-drawer="isNewClientFactoryDrawer"/>

        <q-dialog v-model="showDeleteDialog">
          <q-card>
            <q-card-section class="justify-center items-center q-pb-none ">
              <div class="text-h6 text-center text-bold">{{ $t('clientFactory.deleteClientFactoriesTitle') }}</div>
              <q-space />
            </q-card-section>
            <q-card-section>
              {{ $t('clientFactory.deleteClientFactoriesText') }}
            </q-card-section>
            <q-card-section class="flex justify-center">
              <q-btn @click="showDeleteDialog=false" rounded class="q-mr-md q-px-xl">{{ $t('common.cancel') }}</q-btn>
              <q-btn color="red" rounded class="q-px-xl" @click="deleteClientFactories()" :disable="deletingProccess">{{ $t('common.delete') }}</q-btn>
            </q-card-section>
            <q-linear-progress query v-if="deletingProccess" color="primary"/>
          </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.title {
    color: $main-black;
}
.pagination {
    padding: 2% 2%;
}
</style>
