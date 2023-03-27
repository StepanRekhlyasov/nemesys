<template>
  <q-card class="no-shadow full-width">

    <q-card-section class="q-pa-none q-mb-none">
      <applicationInfoComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section >

    <q-card-section class="q-pa-none q-mb-none">
      <attractionInfoComponent :applicant="applicant" :updateApplicant="updateApplicant" />
    </q-card-section>
  </q-card>

</template>

<script lang="ts">
import applicationInfoComponent from './applicationInfoSection.vue';
import attractionInfoComponent from './attractionInfoSection.vue';

export default {
  name: 'ApplicationInfo',
  components: {
    applicationInfoComponent,
    attractionInfoComponent
  },
  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss">
.q-drawer-off-top{
  .q-drawer{
    top: 0 !important;
  }
}
</style>
