<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from './consts'

const { t } = useI18n({ useScope: 'global' });

const selected = ref([])
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
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

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
</style>