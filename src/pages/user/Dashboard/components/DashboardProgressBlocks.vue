<template>
    <q-card-section class="bg-grey-3 flex items-center">
      <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('dashboard.applicantProgress') }}</p>
    </q-card-section>
    <div class="DashboardStatusBlock__wrapper bg-grey-3">
      <DashboardStatusBlock v-for="status in COLUMN_STATUSES" :status="status" :key="status" :forceUpdate="forceUpdate"/>
    </div>
</template>
<script setup lang="ts">
import DashboardStatusBlock from './DashboardStatusBlock.vue';
import { COLUMN_STATUSES } from '../../ApplicantProgress/const/applicantColumns';

defineProps<{
  forceUpdate: boolean
}>()
</script>
<style scoped lang="scss">
.DashboardStatusBlock__wrapper{
  display: flex;
  gap: 10px;
  padding: 0 20px 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>