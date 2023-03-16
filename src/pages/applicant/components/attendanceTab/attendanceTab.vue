<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-none q-mb-none">
      <attendanceInfoComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <desiredConditionsComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <workExperienceComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <personalStatusComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <assignedEvaluationComponent :applicant="applicant" :updateApplicant="updateApplicant"/>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import attendanceInfoComponent from './AttendanceInfoSection.vue';
import desiredConditionsComponent from './DesiredSection.vue';
import workExperienceComponent from './WorkExperienceSection.vue';
import assignedEvaluationComponent from './AssignedEvaluationSection.vue';
import personalStatusComponent from './PersonalSection.vue';
export default {
  name: 'attendanceInfo',
  components: {
    attendanceInfoComponent,
    desiredConditionsComponent,
    workExperienceComponent,
    assignedEvaluationComponent,
    personalStatusComponent,
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
