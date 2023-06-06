<script lang="ts" setup>
import {defineProps, defineEmits } from 'vue';
import { ClientFactoryTableRow, Pagination } from '../types';

const emit = defineEmits<{
    (e: 'updatePage', value: number)
}>()

const updatePage = (value: number) => {
    emit('updatePage', value);
}

defineProps<{
    rows: ClientFactoryTableRow[],
    pagination: Pagination
}>()

</script>

<template>
    <div class="pagination">
        <q-pagination
        :model-value="pagination.page"
        @update:model-value="updatePage"
        gutter="md"
        size="18px"
        color="white"
        text-color="black"
        active-text-color="white"
        active-color="accent"
        :max="Math.ceil(rows.length / pagination.rowsPerPage) || 1"
        direction-links
        outline />
    </div>
</template>

<style lang="scss" scoped>

.pagination {
    padding: 2% 2%;
}
</style>