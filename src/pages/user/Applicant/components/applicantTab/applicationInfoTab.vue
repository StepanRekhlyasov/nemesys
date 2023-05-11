<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="q-pa-none q-mb-none">
      <applicationInfoComponent :applicant="applicant"/>
    </q-card-section >

    <q-card-section class="q-pa-none q-mb-none">
      <attractionInfoComponent :applicant="applicant" />
    </q-card-section>
  </q-card>

</template>

<script lang="ts" setup>
import { Applicant } from 'src/shared/model';
import applicationInfoComponent from './applicationInfoSection.vue';
import attractionInfoComponent from './attractionInfoSection.vue';

defineProps<{
  applicant: Applicant
}>()

</script>

<style lang="scss">
.q-drawer-off-top{
  .q-drawer{
    top: 0 !important;
  }
}
</style>
