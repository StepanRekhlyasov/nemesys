<script lang="ts" setup>
import {defineProps, defineEmits} from 'vue';

const emit = defineEmits(['update:pagination'])
const props = defineProps(['rows', 'pagination'])

</script>

<template>
    <div class="pagination">
        <q-pagination
        :model-value="props.pagination.page"
        @update:model-value="(value) => emit('update:pagination', value)"
        gutter="md"
        size="18px"
        color="white"
        text-color="black"
        active-text-color="white"
        active-color="accent"
        :max="(props.rows.length / pagination.rowsPerPage) >= 1 ? props.rows.length / pagination.rowsPerPage : 1"
        direction-links
        outline />
    </div>
</template>

<style lang="scss" scoped>

.pagination {
    padding: 2% 2%;
}
</style>