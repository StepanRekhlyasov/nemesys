<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminClientFactory } from 'src/stores/admin/clientFactory';
import ClientFactoryDrawer from './ClientFactoryDrawer.vue';
import ClientFactoryTable from './components/ClientFactory/ClientFactoryTable.vue';
import Pagination from './components/PaginationView.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTableRow } from './types';
import { clientFactoriesToTableRows } from './handlers/ClientFactory';

const { t } = useI18n({ useScope: 'global' });
const adminClientFactory = useAdminClientFactory()

const activeClientFactoryItem = ref<ClientFactory | null>(null)
const tableRows = ref<ClientFactoryTableRow[]>([])
const fetchData = ref(false)
const isClientFactoryDrawer = ref(false)
const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
});

const clientFactoryDrawerHandler = (item: ClientFactoryTableRow) => {
    isClientFactoryDrawer.value = false

    activeClientFactoryItem.value = adminClientFactory.clientFactories.find((factory) => factory.id === item.id) as ClientFactory

    if(activeClientFactoryItem.value) {
        isClientFactoryDrawer.value = true
    }
}

const hideDrawer = () => {
    isClientFactoryDrawer.value = false
}

onMounted(() => {
    fetchData.value = true
    adminClientFactory.getClientFactories()
        .then((factoriesData) => {
            const rows = clientFactoriesToTableRows(factoriesData)
            tableRows.value = rows
            fetchData.value = false
        })
})
</script>

<template>
    <div class="wrapper row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-2">
            <q-card-section class="bg-grey-3">
                <div class="title text-h6 text-weight-bold">{{ t('menu.admin.masterSearch') }}</div>
            </q-card-section>
            <q-separator color="grey-4" size="2px" />
            <q-card-section class="bg-white">
                <div class="flexRowBetween">
                    <div class="text-subtitle1">
                        {{ t('common.searchCondition') }} / 
                        {{ t('common.area') }} : 
                        {{ t('common.aroundTokio') }}, 
                        {{ t('common.detailedConditions') }}
                    </div>
                    <div>
                        <a class="action_link">
                            {{ t('actions.clickToAddNewClient') }}
                        </a>
                    </div>
                </div>
                <div class="flexRowBetween q-mt-sm">
                    <q-btn class="action_btn">
                        {{ t('actions.searchConditionChange') }}
                    </q-btn>
                    <q-btn icon="add" class="action_btn">
                        {{ t('menu.addOffice') }}
                    </q-btn>
                </div>
            </q-card-section>
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
        @hide-drawer="hideDrawer"/>
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
.flexRowBetween {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.action_btn {
    background-color: $main_purple;
    color: white;
    font-weight: bold;
}
.action_link {
    text-decoration: underline;
    line-height: 14px;
    color: $main_purple;
}
</style>