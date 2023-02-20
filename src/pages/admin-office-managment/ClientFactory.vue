<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from './consts'

const { t } = useI18n({ useScope: 'global' });

const rows = ref([
    {
        id: 1,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）',
        classes: 'relative-position wrapper_animate_left_border'
    },
    {
        id: 2,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）'
    },
    {
        id: 3,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）'
    }
]);
const selected = ref([])
const getSelectedString = () => {
    return selected.value.length === 0 ? '' : `${t('common.numberOfSelections')}: ${selected.value.length}`
}

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
    'client.list.clientMaster',
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
                <q-table
                :rows="rows"
                :columns="columns"
                row-key="id"
                color="accent"
                dense
                :bordered="false"
                :selected-rows-label="getSelectedString"
                selection="multiple"
                v-model:pagination="pagination"
                v-model:selected="selected"
                hide-pagination>
                
                    <template v-slot:header-cell="props">
                        <q-th :props="props">
                            <div :key="item" v-for="item in props.col.label.split(' / ')">
                                {{ item }}
                            </div>
                        </q-th>
                    </template>

                    <template v-slot:body="props">
                        <q-tr :props="props" class="wrapper_animate_left_border relative-position">
                            <q-td>
                                <q-checkbox @click="props.selected ? false : true" v-model="props.selected" color="accent"/>
                            </q-td>
                            <q-td v-for="col in props.cols" :key="col.name" :props="props">
                                <span v-if="typeof col.value === 'string' || col.value instanceof String">
                                    {{ col.value }}
                                </span>
                                <div v-else :key="field" v-for="field in Object.keys(col.value)">
                                    <span :class="field">
                                        {{ col.value[field] }} 
                                    </span> 
                                </div>
                            </q-td>
                        </q-tr>
                    </template>

                </q-table>
                <div class="pagination">
                    <q-pagination
                    v-model="pagination.page"
                    gutter="md"
                    size="18px"
                    color="white"
                    text-color="black"
                    active-text-color="white"
                    active-color="accent"
                    :max="(rows.length/pagination.rowsPerPage) >= 1 ?  rows.length/pagination.rowsPerPage : 1"
                    direction-links
                    outline />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.title {
    color: $main-black;
}
.table {
    display: flex;
    flex-direction: column;
    .name {
        text-decoration: underline;
        color: $main_purple;
        font-size: 1rem;
        cursor: pointer;
    }
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

.wrapper_animate_left_border::after {
    width: 1.2%;
    z-index: 11;
}
</style>