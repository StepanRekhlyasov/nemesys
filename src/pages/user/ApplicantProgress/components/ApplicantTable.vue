<template>
  <ProgressTableRows :status="status" :loading="loading" :rows="rows" @openDrawer="(applicant : Applicant)=>{emit('openDrawer', applicant)}" @sortQuery="(param : QueryOrderByConstraint[])=>{emit('sortQuery', param)}"></ProgressTableRows>
</template>
<script setup lang="ts">
import { Applicant, ApplicantWithFix } from 'src/shared/model';
import ProgressTableRows from './ProgressTableRows.vue';
import { QueryOrderByConstraint } from 'firebase/firestore';

defineProps<{
  rows: ApplicantWithFix[],
  loading: boolean,
  status: string
}>()
const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant),
  (e: 'sortQuery', param: QueryOrderByConstraint[]),
  (e: 'onLoadingStart'),
  (e: 'onLoadingEnd'),
}>()

</script>