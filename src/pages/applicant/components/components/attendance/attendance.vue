<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <attendanceInfoComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>

    <q-card-section class="q-pa-xs q-mb-none">
      <desiredConditionsComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import attendanceInfoComponent from './components/attendanceInfo.component.vue';
import desiredConditionsComponent from './components/desired.components.vue'
export default {
  name: 'attendanceInfo',
  components: {
    attendanceInfoComponent,
    desiredConditionsComponent
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
  },
  setup() {
    return {
    }
  }
}
</script>

<style>

</style>
