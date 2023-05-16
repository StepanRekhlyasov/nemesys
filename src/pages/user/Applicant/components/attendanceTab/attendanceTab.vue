<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-none q-mb-none">
      <attendanceInfoComponent :applicant="applicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <desiredConditionsComponent :applicant="applicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <workExperienceComponent :applicant="applicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <personalStatusComponent :applicant="applicant"/>
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <assignedEvaluationComponent :applicant="applicant"/>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import attendanceInfoComponent from './AttendanceInfoSection.vue';
import desiredConditionsComponent from './DesiredSection.vue';
import workExperienceComponent from './WorkExperienceSection.vue';
import assignedEvaluationComponent from './AssignedEvaluationSection.vue';
import personalStatusComponent from './PersonalSection.vue';
import { Applicant } from 'src/shared/model';
defineProps<{
  applicant: Applicant
}>()
</script>