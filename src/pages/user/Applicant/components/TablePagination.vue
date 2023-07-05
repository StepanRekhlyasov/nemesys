<script lang="ts" setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { usePagination } from 'src/stores/pagination';
import { ConstraintsType } from 'src/shared/utils/utils';
import { Pagination } from 'src/components/pagination/types';
import { QPaginationProps } from 'quasar';
import { QueryOrderByConstraint } from 'firebase/firestore';

interface TablePaginationProps extends Omit<QPaginationProps, 'modelValue' | 'max'> {
  pagination: Pagination
  isAdmin: boolean | undefined
}

const emit = defineEmits<{
  (e: 'onDataUpdate', newData: unknown[])
  (e: 'onLoadingStateChange', loading: boolean)
}>()
const props = defineProps<TablePaginationProps>()

const pagination = usePagination()

const maxPages = ref(0)
const currentPage = ref(1)

const query = pagination.queryData(props.pagination.rowsPerPage, props.pagination.path, props.pagination.order, props.pagination.constraints)

const color = props.isAdmin ? 'accent' : 'primary'

defineExpose({ refreshPage, setConstraints, queryFirstPage, setOrder })

onMounted(async () => {
  await queryFirstPage()
})

async function onPageUpdate(newPage: number) {
  emit('onLoadingStateChange', true)

  if (newPage === currentPage.value + 1) {
    const data = await query.nextPage()
    emit('onDataUpdate', data)
    emit('onLoadingStateChange', false)
    return
  }

  if (newPage === currentPage.value - 1) {
    const data = await query.prevPage()
    emit('onDataUpdate', data)
    emit('onLoadingStateChange', false)
    return
  }


  if (newPage == 1) {
    const data = await query.firstPage()
    emit('onDataUpdate', data)
    emit('onLoadingStateChange', false)
    return
  }

  if (newPage == maxPages.value) {
    const data = await query.lastPage()
    emit('onDataUpdate', data)
    emit('onLoadingStateChange', false)
    return
  }

}

async function refreshPage() {
  emit('onLoadingStateChange', true)
  const data = await query.refreshPage()
  emit('onDataUpdate', data)
  emit('onLoadingStateChange', false)
}

function setConstraints(c: ConstraintsType) {
  query.setConstraints(c)
}
function setOrder(c: QueryOrderByConstraint[]) {
  query.setOrder(c)
}

async function queryFirstPage() {
  currentPage.value = 1
  emit('onLoadingStateChange', true)
  const data = await query.firstPage()
  emit('onDataUpdate', data)
  const docsNumber = await query.count()
  maxPages.value = Math.ceil(docsNumber / props.pagination.rowsPerPage)
  emit('onLoadingStateChange', false)
}

</script>

<template>
  <div class="pagination">
    <q-pagination :model-value="currentPage"
      @update:model-value="async (newPage) => { await onPageUpdate(newPage); currentPage = newPage }" gutter="md"
      size="18px" color="white" text-color="black" active-text-color="white" :active-color="color" :max="maxPages"
      :max-pages="currentPage==1 || currentPage==maxPages?3:5" outline direction-links :ellipses="false" :boundary-numbers="true" v-bind="$attrs" />
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  padding: 2% 2%;
}
</style>
