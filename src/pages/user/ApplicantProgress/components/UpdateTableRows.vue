<template>
  <thead>
      <tr>
        <th>{{ $t('applicant.progress.table.staffName') }}</th>
        <th>{{ $t('applicant.progress.table.jobType') }}</th>
        <th>{{ $t('applicant.progress.table.employmentLocation') }}</th>
        <th>{{ $t('applicant.progress.table.contactPerson') }}</th>
        <th>{{ $t('applicant.progress.table.startDate') }}</th>
        <th>{{ $t('applicant.progress.table.endDate') }}</th>
        <th>{{ $t('applicant.progress.table.remainingDays') }}</th>
        <th>{{ $t('applicant.progress.table.invoice') }}</th>
        <th>{{ $t('applicant.progress.table.payment') }}</th>
        <th>{{ $t('applicant.progress.table.memo') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="applicant in applicants" :key="applicant.id">
        <td 
          @click="()=>{
            emit('openDrawer', applicant)
          }"
          class="applicant-clickable"
        >{{ applicant.name }}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <!-- <td>-</td> -->
      </tr>
    </tbody>
</template>
<script setup lang="ts">
import { Applicant } from 'src/shared/model';

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant)
}>()
defineProps<{
  applicants: Applicant[],
}>()

</script>