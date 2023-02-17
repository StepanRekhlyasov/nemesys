<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from './consts'

const { t } = useI18n({ useScope: 'global' });

const data = ref([
    {
        id: 1,
        name: '検索条件',
        registration: '高橋瞳／東京支店',
        date: '2022/12/22 18:00:00',
        update: '高橋瞳／東京支店',
        modified: '2022/12/22 18:00:00',
    },
    {
        id: 2,
        name: '検索条件',
        registration: '高橋瞳／東京支店',
        date: '2022/12/22 18:00:00',
        update: '高橋瞳／東京支店',
        modified: '2022/12/22 18:00:00',
    },
    {
        id: 3,
        name: '検索条件',
        registration: '高橋瞳／東京支店',
        date: '2022/12/22 18:00:00',
        update: '高橋瞳／東京支店',
        modified: '2022/12/22 18:00:00',
    },
]);

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
});
const column_labels = [
    'office.searchConditionName',
    'office.registeredUser',
    'office.registeredDate',
    'office.updatedUser',
    'office.lastModified'
]

const columns = computed(() => {
    return consts.tableColumnsSavedCriteriaList.map((column, index) => {
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
            <q-separator color="white" size="2px" />
            <q-card-section class="bg-grey-3 q-pa-md">
                <div class="text-subtitle1">
                    {{ t('common.searchKeyword') }} / {{ t('common.searchCondition') }}
                </div>
                <form class="form q-mt-sm">
                    <input class="form__input" type="text" :placeholder="t('form.searchPlaceholder')">
                    <q-btn color="accent">
                        {{ t('common.search') }}
                    </q-btn>
                    <q-btn>
                        {{ t('common.clear') }}
                    </q-btn>
                </form>
            </q-card-section>
            <q-card-section class="no-padding">
                <q-markup-table
                class="table"
                :bordered="false"
                :square="false"
                separator="none"
                flat>
                    <thead>
                        <tr>
                            <th class="table__column text-left"></th>
                            <th class="table__column text-left" :key="item.name" v-for="item in columns">
                                {{ item.label }}
                            </th>
                            <th class="table__column text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table__row wrapper_animate_left_border" :key="item.id" v-for="item in data">
                            <td class="table__btn-wrapper q-ml-xs"><q-icon size="1.5rem" color="accent" class="table__edit-btn" name="edit"/></td>
                            <td class="table__row_name text-left">
                                <a href="">{{ item.name }}</a>
                            </td>
                            <td class="text-left">{{ item.registration }}</td>
                            <td class="text-left"> {{ item.date }}</td>
                            <td class="text-left">{{ item.update }}</td>
                            <td class="text-left">{{ item.modified }}</td>
                            <td class="table__btn-wrapper"><q-icon size="1.5rem" color="accent" class="table__delete-btn" name="delete_outline"/></td>
                        </tr>
                    </tbody>
                </q-markup-table>
                <div class="pagination">
                    <q-pagination
                    v-model="pagination.page"
                    gutter="md"
                    color="white"
                    size="20px"
                    text-color="black"
                    active-text-color="white"
                    active-color="accent"
                    :max="(data.length / pagination.rowsPerPage) >= 1 ? data.length / pagination.rowsPerPage : 1"
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

.table {
    &__column {
        
    }
    &__row {
        position: relative;

        &_name {
            text-decoration: underline;
            color: $main-purple;
            font-size: 1rem;
        }
    }
    &__btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__edit-btn {
        display: block;
        cursor: pointer;
        padding: 5px;
    }
    &__delete-btn {
        display: block;
        cursor: pointer;
        padding: 5px;
    }
}
.wrapper_animate_left_border:before {
    width: 1.5%;
    z-index: 11;
}
.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}
.form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 40%;

    &__input {
        min-height: 35px;
        border: 1px solid $main-black;
        flex: 0 1 60%;
        border-radius: 4px;
        padding: 1%;
    }
    &__input:focus {
        outline: none;
    }
}

.pagination {
    padding: 2% 2%;
}
</style>