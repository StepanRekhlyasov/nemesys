<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminClientFactory } from 'src/stores/admin/clientFactory';
import CFPageActions from './components/ClientFactory/CFPageActions.vue';
import ClientFactoryDrawer from './ClientFactoryDrawer.vue';
import NewClientDrawer from './NewClientDrawer.vue';
import ClientFactoryTable from './components/ClientFactory/ClientFactoryTable.vue';
import Pagination from './components/PaginationView.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTableRow } from './types';
import { clientFactoriesToTableRows } from './handlers/ClientFactory';
import { useAdminClient } from 'src/stores/admin/client';

const { t } = useI18n({ useScope: 'global' });
const { clientFactories,  getClientFactories } = useAdminClientFactory()
const { clients } = useAdminClient()

const activeClientFactoryItem = ref<ClientFactory | null>(null)
const tableRows = ref<ClientFactoryTableRow[]>([])
const fetchData = ref(false)
const isClientFactoryDrawer = ref(false)
const isNewClientDrawer = ref(false)

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
});

const clientFactoryDrawerHandler = (item: ClientFactoryTableRow) => {
    isClientFactoryDrawer.value = false

    activeClientFactoryItem.value = clientFactories.find((factory) => factory.id === item.id) as ClientFactory

    if(activeClientFactoryItem.value) {
        isClientFactoryDrawer.value = true
    }
}

const hideClientFactoryDrawer = () => {
    isClientFactoryDrawer.value = false
}

const hideNewClientDrawer = () => {
    isNewClientDrawer.value = false
}
const openNewClientDrawer = () => {
    isNewClientDrawer.value = true
}

const updateTableRows = (factories: ClientFactory[]) => {
    tableRows.value = []
    tableRows.value = clientFactoriesToTableRows(factories)
    fetchData.value = false
}

watch(clients, async () => {
    fetchData.value = true;
    const fetchedClientFactories = await getClientFactories(clients.value);
    updateTableRows(fetchedClientFactories);
}, {immediate: true});
</script>

<template>
    <div class="wrapper row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-2">
            <q-card-section class="bg-grey-3">
                <div class="title text-h6 text-weight-bold">{{ t('menu.admin.masterSearch') }}</div>
            </q-card-section>
            <q-separator color="grey-4" size="2px" />
            <CFPageActions @open-drawer="openNewClientDrawer"/>
            <q-card-section class="table no-padding">
                <ClientFactoryTable
                @select-item="clientFactoryDrawerHandler"
                :isFetching="fetchData"
                :rows="tableRows"
                v-model:pagination="pagination"
                />
                <Pagination
                :rows="tableRows"
                v-model:pagination="pagination"/>
            </q-card-section>
        </q-card>

        <ClientFactoryDrawer
        v-if="activeClientFactoryItem"
        v-model:selectedItem="activeClientFactoryItem"
        :isDrawer="isClientFactoryDrawer"
        @hide-drawer="hideClientFactoryDrawer"/>

        <NewClientDrawer
        @hide-drawer="hideNewClientDrawer"
        theme="accent"
        :isDrawer="isNewClientDrawer" />
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