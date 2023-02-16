<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from './consts'

const { t } = useI18n({ useScope: 'global' });

const officeData = ref([
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
    {

    },
]);
const selected = ref([])
const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
});
const column_labels = [
    'client.list.name',
    'client.list.distanceStartingPoint',
    'client.list.officeLocation',
    'client.list.phone',
    'client.list.fax',
    'client.list.officeMaster',
    'client.list.basicInfo'
]

const columns = computed(() => {
    return consts.tableColumnsSearchedList.map((column, index) => {
        column.label = t(column_labels[index])
        return column
    })
})

</script>

<template>
    <div class="row no-shadow full-height new">
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
            <q-card-section class="no-padding table">
                <q-table
                :rows="officeData"
                :columns="columns"
                row-key="name"
                selection="multiple"
                color=""
                v-model:selected="selected"
                v-model:pagination="pagination"
                hide-pagination>
                
                </q-table>
                <div class="pagination">
                    <q-pagination
                    v-model="pagination.page"
                    gutter="md"
                    color="white"
                    text-color="black"
                    active-text-color="white"
                    active-color="accent"
                    :max="(officeData.length/pagination.rowsPerPage) >= 1 ?  officeData.length/pagination.rowsPerPage : 1"
                    direction-links
                    outline />
                    </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
.title {
    color: $main-black;
}
.table {
    display: flex;
    flex-direction: column;
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