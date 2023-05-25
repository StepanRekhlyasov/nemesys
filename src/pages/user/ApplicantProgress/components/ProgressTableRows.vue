<template>
  <thead>
      <tr>
        <th>▼</th>
        <th>▼</th>
        <th>▼</th>
        <th>{{ $t('applicant.progress.table.fullName') }}</th>
        <th>{{ $t('applicant.progress.table.applicationDate') }}</th>
        <th>{{ $t('applicant.progress.table.nearestStation') }}</th>
        <th>{{ $t('applicant.progress.table.qualificationsExperience') }}</th>
        <th>{{ $t('applicant.progress.table.availableStartDate') }}</th>
        <th>{{ $t('applicant.progress.table.numberOfDays') }}</th>
        <th>{{ $t('applicant.progress.table.earlyShift') }}</th>
        <th>{{ $t('applicant.progress.table.dayShift') }}</th>
        <th>{{ $t('applicant.progress.table.lateShift') }}</th>
        <th>{{ $t('applicant.progress.table.nightShift') }}</th>
        <th>{{ $t('applicant.progress.table.remarks') }}</th>
        <th>{{ $t('applicant.progress.table.mon') }}</th>
        <th>{{ $t('applicant.progress.table.tue') }}</th>
        <th>{{ $t('applicant.progress.table.wed') }}</th>
        <th>{{ $t('applicant.progress.table.thu') }}</th>
        <th>{{ $t('applicant.progress.table.fri') }}</th>
        <th>{{ $t('applicant.progress.table.sat') }}</th>
        <th>{{ $t('applicant.progress.table.sun') }}</th>
        <th>{{ $t('applicant.progress.table.holiday') }}</th>
        <th>{{ $t('applicant.progress.table.memo') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="applicant in applicants" :key="applicant.id">
        <td>S</td>
        <td>介</td>
        <td>派</td>
        <td 
          @click="()=>{
            emit('openDrawer', applicant)
          }" 
          class="applicant-clickable"
        >{{ applicant.name }}</td>
        <td>{{dayMonthFromDate(applicant.currentStatusTimestamp)}}</td>
        <td>{{ applicant.nearestStation }}</td>
        <td><p v-for="q, index in applicant.qualification" :key="index" style="margin:0;">{{ q }}</p></td>
        <td>{{ applicant.timeToWork }}</td>
        <td>{{ applicant.daysToWork }}</td>
        <td>{{ applicant.workingHoursEarly?'●':'-' }}</td>
        <td>{{ applicant.workingHoursDay?'●':'-' }}</td>
        <td>{{ applicant.workingHoursLate?'●':'-' }}</td>
        <td>{{ applicant.workingHoursNight?'●':'-' }}</td>
        <td>{{ applicant.shiftRemarks }}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='monday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='tuesday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='wednesday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='thursday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='friday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='saturday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='sunday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find((row)=>row==='holiday')?'●':'-'}}</td>
        <td>{{ applicant.memo }}</td>
      </tr>
    </tbody>
</template>
<script setup lang="ts">
import { Applicant } from 'src/shared/model';
import { dayMonthFromDate } from 'src/shared/utils/utils';

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant)
}>()
defineProps<{
  applicants: Applicant[],
  status: string
}>()

</script>