<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-none q-mb-none">
      <attendanceInfoComponent :bo="bo" :applicant="applicant" />
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <desiredConditionsComponent :bo="bo" :applicant="applicant" />
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <workExperienceComponent :bo="bo" :applicant="applicant" />
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <personalStatusComponent :bo="bo" :applicant="applicant" />
    </q-card-section>

    <q-card-section class="q-pa-none q-mb-none">
      <assignedEvaluationComponent :bo="bo" :applicant="applicant" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import attendanceInfoComponent from './AttendanceInfoSection.vue';
import desiredConditionsComponent from './DesiredSection.vue';
import workExperienceComponent from './WorkExperienceSection.vue';
import assignedEvaluationComponent from './AssignedEvaluationSection.vue';
import personalStatusComponent from './PersonalSection.vue';
import { Applicant, BackOrderModel } from 'src/shared/model';
withDefaults(defineProps<{
  applicant: Applicant,
  bo: BackOrderModel | null
}>(), {
  bo: null
})
</script>
