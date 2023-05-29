<script lang="ts" setup>
import { computed, ref, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from '../../consts';
import { ClientFactoryTableColumn, ClientFactoryTableRow, Pagination } from '../../types';

const props = defineProps<{
    rows: ClientFactoryTableRow[],
    isFetching: boolean,
    pagination: Pagination
}>()
const emit = defineEmits<{
    (e: 'selectItem', item: ClientFactoryTableRow)
}>()

const { t } = useI18n({ useScope: 'global' });
const columns = computed(() => {
    return consts.tableColumnsClientFactory.map((column: ClientFactoryTableColumn, index: number) => {
        column.label = t(consts.columnLabelsClientFactory[index])
        return column
    })
})

const selected = ref<number[]>([])
const getSelectedString = () => {
    return selected.value.length === 0 ? '' : `${t('common.numberOfSelections')}: ${selected.value.length}`
}

const selectItem = (item: ClientFactoryTableRow) => {
    emit('selectItem', item)
}
</script>

<template>
    <q-table
    :rows="props.rows"
    :columns="columns"
    :rows-per-page-options="[pagination.rowsPerPage]"
    row-key="id"
    color="accent"
    dense
    :loading="isFetching"
    :bordered="false"
    :selected-rows-label="getSelectedString"
    selection="multiple"
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
                    <q-checkbox @click="!props.selected" v-model="props.selected" color="accent"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <div v-if="col.name === 'name'" class="column">
                        <span class="name" @click="selectItem(props.row)">
                            <q-icon v-if="col.value.isHead" color="accent" name="home" class="icon"/>
                            {{ col.value.name }}
                        </span>
                        <span>
                            {{ col.value.clientName }}
                        </span>
                    </div>
                    <span v-else>
                        {{ col.value }}
                    </span>
                </q-td>
            </q-tr>
        </template>

    </q-table>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.table {
    display: flex;
    flex-direction: column;
    .name {
        color: $main_purple;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .icon {
       font-size: 1.2rem; 
       color: $main_purple;
    }
}

.wrapper_animate_left_border::after {
    width: 1.2%;
    z-index: 11;
}
</style>