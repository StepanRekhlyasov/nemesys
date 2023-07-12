<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="q-pa-none q-mb-none">
      <applicationInfoComponent :bo="bo" :applicant="applicant"/>
    </q-card-section >

    <q-card-section class="q-pa-none q-mb-none">
      <attractionInfoComponent :bo="bo" :applicant="applicant" />
    </q-card-section>
  </q-card>

</template>

<script lang="ts" setup>
import { Applicant, BackOrderModel } from 'src/shared/model';
import applicationInfoComponent from './applicationInfoSection.vue';
import attractionInfoComponent from './attractionInfoSection.vue';

withDefaults(defineProps<{
  applicant: Applicant,
  bo:BackOrderModel | null
}>(), {
  bo: null
})
</script>

<style lang="scss">
.q-drawer-off-top{
  .q-drawer{
    top: 0 !important;
  }
}
</style>
