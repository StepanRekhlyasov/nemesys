<template>
<q-card-section class="bg-grey-3 flex items-center">
  <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('task.task') }} ({{ entity==='applicant'?$t('report.categories.applicant'):$t('applicant.list.fixEmployment.office') }})</p>
</q-card-section>
<q-table :rows="rows">
</q-table>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTask } from 'src/stores/task'

const props = defineProps<{
  entity: 'applicant' | 'office'
}>()

const taskStore = useTask()
const rows = ref()

onMounted(async ()=>{
  rows.value = await taskStore.getTasks(props.entity)
})
</script>