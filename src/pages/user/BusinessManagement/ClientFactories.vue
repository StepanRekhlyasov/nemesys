<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n';
import { useClientFactory } from 'src/stores/clientFactory';
import CFPageActions from 'src/components/client-factory/CFPageActions.vue';
import ClientFactoryDrawer from './ClientFactoryDrawer.vue';
import NewClientDrawer from 'src/components/client-factory/NewClientDrawer.vue';
import NewClientFactoryDrawer from 'src/components/client-factory/NewClientFactoryDrawer.vue';
import FaxDrawer from 'src/components/client-factory/FaxDrawer.vue';
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

const selectedCFsId = ref<string[]>(clientFactoryStore.selectedCFsId);
const condition = ref<boolean>(clientFactoryStore.condition);
// drawers
const isClientFactoryDrawer = ref(false)
const isNewClientDrawer = ref(false)
const isNewClientFactoryDrawer = ref(false)
const isNewFaxDrawer = ref(false)
const pagination = ref({
    sortBy: 'desc',
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

const resetSelectedCFsId = () =>{
    condition.value = false
    clientFactoryStore.condition = false
    selectedCFsId.value = []
    clientFactoryStore.selectedCFsId = []
}

const clientFactoryDrawerHandler = (item: ClientFactoryTableRow) => {
    isClientFactoryDrawer.value = false

    setTimeout(() => {
        activeClientFactoryItem.value = clientFactories.value.find((factory) => factory.id === item.id) as ClientFactory

        if (activeClientFactoryItem.value) {
            isClientFactoryDrawer.value = true
        }
    }, 200);
}
const selected = ref<number[]>([])
const selectedCFHandler = (item:number[]) =>{
    selected.value = item
}
watch([clients], () => {
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
    clientFactoryStore.getClientFactories(clients.value).then(() => {
        tableRows.value.length ? fetchData.value = false : fetchData.value = true
    })

}, { deep: true, immediate: true });

watch([clientFactories,condition], () => {
    tableRows.value.length ? fetchData.value = false : fetchData.value = true
    if(condition.value){
        tableRows.value = clientFactoriesToTableRows(clientFactories.value).filter((item)=>selectedCFsId.value.includes(item.id))
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

// new Fax drawer
const selectedCF = ref<string[]>([])
const hideNewFaxDrawer = () => {
    isNewFaxDrawer.value = false
}

const openNewFaxDrawer = () => {
    selectedCF.value = []
    Object.keys(selected.value).forEach((key)=>{
        selectedCF.value.push(selected.value[key].id)
    });
    if(selectedCF.value.length === 0 || selectedCF.value.length === tableRows.value.length){
        selectedCF.value = ['all']
    }
    isNewFaxDrawer.value = true
}
const openFaxDrawer = (id:string) =>{
    selectedCF.value = []
    selectedCF.value.push(id)
    isNewFaxDrawer.value = true
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
                :isReset="condition"
                @open-client-drawer="openNewClientDrawer"
                @open-client-factory-drawer="openNewClientFactoryDrawer"
                @open-fax-drawer="openNewFaxDrawer"
                @reset-selected-id="resetSelectedCFsId"/>
            <q-card-section class="table no-padding"> 
                <ClientFactoryTable
                    @select-item="clientFactoryDrawerHandler"
                    @selected-id="selectedCFHandler"
                    :isFetching="fetchData && !(condition && selectedCFsId.length==0)"
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
            @open-fax-drawer="openFaxDrawer"
            @hide-drawer="hideClientFactoryDrawer"/>

        <NewClientDrawer
            @hide-drawer="hideNewClientDrawer"
            theme="primary"
            :is-drawer="isNewClientDrawer" />

        <NewClientFactoryDrawer
            @hide-drawer="hideNewClientFactoryDrawer"
            theme="primary"
            :is-drawer="isNewClientFactoryDrawer"/>

        <FaxDrawer
        @hide-drawer="hideNewFaxDrawer"
        theme="primaery"
        :selectedCF="selectedCF"
        :is-drawer="isNewFaxDrawer"
        />
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
