<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { PaginationSimple } from './types';
import { QPaginationProps } from 'quasar';

interface TablePaginationProps extends Omit<QPaginationProps, 'modelValue' | 'max'> {
  pagination: PaginationSimple
  isAdmin: boolean | undefined,
  max: number
}

const emit = defineEmits<{
  (e: 'onDataUpdate', page: number)
}>()

const props = defineProps<TablePaginationProps>()

const currentPage = ref(1)
const color = props.isAdmin ? 'accent' : 'primary'

async function onPageUpdate(newPage: number) {
  emit('onDataUpdate', newPage)
}

</script>

<template>
  <div class="pagination">
    <q-pagination v-model="currentPage"
      @update:model-value="async (newPage) => { await onPageUpdate(newPage); currentPage = newPage }" gutter="md"
      size="18px" color="white" text-color="black" active-text-color="white" :active-color="color" :max="props.max"
      outline direction-links boundary-numbers v-bind="$attrs" :max-pages="10" />
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  padding: 1% 1%;
}
</style>
