<script lang="ts" setup>
import { computed, ref, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import consts from '../consts';
import { TableColumn, TableRow } from '../types';

const props = defineProps(['rows', 'pagination'])
const emit = defineEmits(['selectItem', 'update:pagination'])

const { t } = useI18n({ useScope: 'global' });
const columns = computed(() => {
    return consts.tableColumnsClientFactory.map((column: TableColumn, index: number) => {
        column.label = t(consts.columnLabelsClientFactory[index])
        return column
    })
})

const selected = ref([])
const getSelectedString = () => {
    return selected.value.length === 0 ? '' : `${t('common.numberOfSelections')}: ${selected.value.length}`
}

const selectItem = (item: TableRow) => {
    emit('selectItem', item)
}
</script>

<template>
    <q-table
    :rows="props.rows"
    :columns="columns"
    row-key="id"
    color="accent"
    dense
    :bordered="false"
    :selected-rows-label="getSelectedString"
    selection="multiple"
    :pagination="props.pagination"
    @update:pagination="(value) => emit('update:pagination', value)"
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
                    <span v-if="typeof col.value === 'string' || col.value instanceof String">
                        {{ col.value }}
                    </span>
                        <div v-else :key="field" v-for="field in Object.keys(col.value)">
                            <span
                            v-if="field === 'name'"
                            :class="field"
                            @click="selectItem(props.row)">
                                {{ col.value[field] }}
                            </span>
                            <span :class="field" v-else>
                                {{ col.value[field] }} 
                            </span> 
                        </div>
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
        text-decoration: underline;
        color: $main_purple;
        font-size: 1rem;
        cursor: pointer;
    }
}

.wrapper_animate_left_border::after {
    width: 1.2%;
    z-index: 11;
}
</style>