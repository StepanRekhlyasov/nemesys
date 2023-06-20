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
import { ClientFactoryTableRow } from 'src/components/client-factory/types';
import { clientFactoriesToTableRows } from './handlers';
import { useClient } from 'src/stores/client';
import {tableColumnsClientFactory} from './consts';

const { t } = useI18n({ useScope: 'global' });
const clientFactoryStore = useClientFactory()
const { clientFactories } = storeToRefs(clientFactoryStore)
const clientStore = useClient()
const { clients } = storeToRefs(clientStore)

const activeClientFactoryItem = ref<ClientFactory | null>(null)
const tableRows = ref<ClientFactoryTableRow[]>([])
const fetchData = ref(false)

// drawers
const isClientFactoryDrawer = ref(false)
const isNewClientDrawer = ref(false)
const isNewClientFactoryDrawer = ref(false)

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 100,
    rowsNumber: clientFactories.value.length
});

const paginatedTableRows = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
    const end = start + pagination.value.rowsPerPage;
    return tableRows.value.slice(start, end);
});

const clientFactoryDrawerHandler = (item: ClientFactoryTableRow) => {
    isClientFactoryDrawer.value = false

    activeClientFactoryItem.value = clientFactories.value.find((factory) => factory.id === item.id) as ClientFactory

    if (activeClientFactoryItem.value) {
        isClientFactoryDrawer.value = true
    }
}

watch([clients], () => {
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
    clientFactoryStore.getClientFactories(clients.value).then(() => {
        tableRows.value.length ? fetchData.value = false : fetchData.value = true
    })

}, { deep: true, immediate: true });

watch([clientFactories], () => {
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
    tableRows.value = clientFactoriesToTableRows(clientFactories.value)
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
                @open-client-drawer="openNewClientDrawer"
                @open-client-factory-drawer="openNewClientFactoryDrawer"/>
            <q-card-section class="table no-padding">
                <ClientFactoryTable
                    @select-item="clientFactoryDrawerHandler"
                    :isFetching="fetchData"
                    :rows="paginatedTableRows"
                    :pagination="pagination"
                    :table-columns="tableColumnsClientFactory"/>
                <Pagination
                    :rows="tableRows"
                    @updatePage="pagination.page = $event"
                    v-model:pagination="pagination" />
            </q-card-section>
        </q-card>

        <ClientFactoryDrawer
            v-if="activeClientFactoryItem"
            v-model:selectedItem="activeClientFactoryItem"
            :isDrawer="isClientFactoryDrawer"
            @hide-drawer="hideClientFactoryDrawer"/>

        <NewClientDrawer
            @hide-drawer="hideNewClientDrawer"
            theme="primary"
            :is-drawer="isNewClientDrawer" />

        <NewClientFactoryDrawer 
            @hide-drawer="hideNewClientFactoryDrawer"
            theme="primary"
            :is-drawer="isNewClientFactoryDrawer"/>
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