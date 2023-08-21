<script lang="ts" setup>
import { onMounted, ref } from 'vue';
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
import { tableColumnsClientFactory } from './consts';
import { useOrganization } from 'src/stores/organization';
import { where } from 'firebase/firestore';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';

const { t } = useI18n({ useScope: 'global' });
const clientFactoryStore = useClientFactory()
const clientFactories = ref<ClientFactory[]>([])
const organization = useOrganization()
const activeClientFactoryItem = ref<ClientFactory | null>(null)
const tableRows = ref<ClientFactoryTableRow[]>([])
const fetchData = ref(false)

const selectedCFsId = ref<string[]>(clientFactoryStore.selectedCFsId);
const condition = ref<boolean>(clientFactoryStore.condition);
const originalOfficeId = ref('');

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


const resetSelectedCFsId = () =>{
    condition.value = false
    clientFactoryStore.condition = false
    selectedCFsId.value = []
    clientFactoryStore.selectedCFsId = []
    getData()
}

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
const selected = ref<number[]>([])
const selectedCFHandler = (item: number[]) => {
    selected.value = item
}

onMounted(async () => {
    await getData()
})

watchCurrentOrganization(async () => {
    await getData()
})

async function getData() {
    fetchData.value = true
    const [CFByOrganization, CFByAdmin] = await Promise.all([clientFactoryStore.getClientFactoryByConstraints([where('organizationId', '==', organization.currentOrganizationId), where('deleted', '==', false)]), clientFactoryStore.getClientFactoryByConstraints([where('organizationId', '==', null), where('deleted', '==', false)])])
    const cf = [...CFByOrganization, ...CFByAdmin]
    clientFactories.value = cf
    if(condition.value){
        tableRows.value = clientFactoriesToTableRows(cf).filter((item)=>selectedCFsId.value.includes(item.id))
    }
    else{
        tableRows.value = clientFactoriesToTableRows(cf)
    }
    fetchData.value = false
}

// client-factory drawer

const hideClientFactoryDrawer = () => {
    isClientFactoryDrawer.value = false
}

// new client drawer

const hideNewClientDrawer = () => {
    isNewClientDrawer.value = false
    setTimeout(() => {
        isNewClientDrawerRender.value = false
    }, 200)
    getData()
}

const openNewClientDrawer = () => {
    isNewClientDrawerRender.value = true
    isNewClientDrawer.value = true
}

// new client-factory drawer

const hideNewClientFactoryDrawer = () => {
    isNewClientFactoryDrawer.value = false
    setTimeout(() => {
        isNewClientFactoryDrawerRender.value = false
    }, 200)
    getData()
}

const openNewClientFactoryDrawer = () => {
    isNewClientFactoryDrawerRender.value = true
    isNewClientFactoryDrawer.value = true
}

// new Fax drawer
const selectedCF = ref<string[]>([])
const hideNewFaxDrawer = () => {
    isNewFaxDrawer.value = false
}

const isNewClientDrawerRender = ref(true)
const isNewClientFactoryDrawerRender = ref(true)

const openNewFaxDrawer = () => {
    selectedCF.value = []
    Object.keys(selected.value).forEach((key) => {
        selectedCF.value.push(selected.value[key].id)
    });
    if (selectedCF.value.length === 0 || selectedCF.value.length === tableRows.value.length) {
        selectedCF.value = ['all']
    }
    isNewFaxDrawer.value = true
}
const openFaxDrawer = (id: string) => {
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
                    :isFetching="fetchData && !condition "
                    :rows="tableRows"
                    :pagination="pagination"
                    :table-columns="tableColumnsClientFactory"
                    key="0"/>
                <Pagination
                    :rows="tableRows"
                    @updatePage="pagination.page = $event"
                    v-model:pagination="pagination" />
            </q-card-section>
        </q-card>

        <ClientFactoryDrawer v-if="activeClientFactoryItem" v-model:selectedItem="activeClientFactoryItem"
            :originalOfficeId="originalOfficeId" :isDrawer="isClientFactoryDrawer" @open-fax-drawer="openFaxDrawer"
            @hide-drawer="hideClientFactoryDrawer" />

        <NewClientDrawer v-if="isNewClientDrawerRender" @hide-drawer="hideNewClientDrawer" theme="primary"
            :is-drawer="isNewClientDrawer" />

        <NewClientFactoryDrawer v-if="isNewClientFactoryDrawerRender" @hide-drawer="hideNewClientFactoryDrawer"
            theme="primary" :is-drawer="isNewClientFactoryDrawer" />

        <FaxDrawer @hide-drawer="hideNewFaxDrawer" theme="primary" :selectedCF="selectedCF" :is-drawer="isNewFaxDrawer"/>
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
