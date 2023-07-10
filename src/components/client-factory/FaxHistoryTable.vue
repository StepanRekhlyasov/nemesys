<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, withDefaults } from 'vue';
import { ClientFactoryTableColumn, ClientFactoryTableRow, Pagination } from './types';

const props = withDefaults(defineProps<{
    rows: ClientFactoryTableRow[],
    isFetching: boolean,
    pagination: Pagination,
    tableColumns: ClientFactoryTableColumn[]
    theme?: string
}>(), {
    theme: 'primary'
})

const emit = defineEmits<{
    (e: 'selectItem', item: ClientFactoryTableRow)
}>()

const { t } = useI18n({ useScope: 'global' });

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
    :columns="tableColumns"
    :rows-per-page-options="[pagination.rowsPerPage]"
    row-key="id"
    :color="theme"
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
            <q-tr :props="props" :class="`wrapper_animate_left_border_${theme === 'primary' ? 'client' : ''} relative-position`">
                <q-td>
                    <q-checkbox @click="!props.selected" v-model="props.selected" :color="theme"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <div v-if="col.name === 'name'" class="column">
                        <span :class="`name text-${theme}`" @click="selectItem(props.row)">
                            <q-icon v-if="col.value.isHead" :color="theme" name="home" class="icon"/>
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
        font-size: 1.2rem;
        cursor: pointer;
    }

    .icon {
       font-size: 1.2rem; 
    }
}

.wrapper_animate_left_border_client::after {
    width: 1.2%;
    z-index: 11;
}

.wrapper_animate_left_border::after {
    width: 1.2%;
    z-index: 11;
}
</style>