<template>
    <q-card-section class="bg-grey-3 flex items-center">
      <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('dashboard.applicantProgress') }}</p>
    </q-card-section>
    <div class="DashboardStatusBlock__wrapper bg-grey-3">
      <DashboardStatusBlock v-for="status in statuses" :status="status" :key="status" :updateOnMounted="updateOnMounted"/>
    </div>
</template>
<script setup lang="ts">
import DashboardStatusBlock from './DashboardStatusBlock.vue';
import { COLUMN_STATUSES } from '../../ApplicantProgress/const/applicantColumns';
import { ApplicantStatus } from 'src/shared/model';

const statuses = COLUMN_STATUSES.slice(0, 6).concat([ApplicantStatus.WORKING].concat(COLUMN_STATUSES.slice(6, 7)))

defineProps<{
  updateOnMounted: boolean
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