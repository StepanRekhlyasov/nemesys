<template>
  <tbody>
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
    <template v-for="fix, index in fixes" :key="index">
      <tr v-if="fix.applicant">
        <td
          @click="()=>{
            if(fix.applicant){
              emit('openDrawer', fix.applicant)
            }
          }"
          class="applicant-clickable"
        >{{ fix.applicant.name }}</td>
        <td>{{ $t('applicant.add.'+fix.applicant.occupation) }}</td>
        <td>-</td>
        <td>{{ fix.contact }}</td>
        <td>{{ fix.admissionDate }}</td>
        <td>{{ fix.endDate }}</td>
        <td>{{ remainingDays(new Date(fix.admissionDate), new Date(fix.endDate)) }}</td>
        <td>-</td>
        <td>-</td>
        <td>{{ fix.memo }}</td>
      </tr>
    </template>
  </tbody>
</template>
<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { Applicant, ApplicantFix } from 'src/shared/model';
import { dateToTimestampFormat, remainingDays } from 'src/shared/utils/utils';
import { useFix } from 'src/stores/fix';
import { ref, watch } from 'vue';

interface ApplicantFixWithApplicant extends ApplicantFix {
  applicant?: Applicant
}

const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant),
  (e: 'onLoadingStart'),
  (e: 'onLoadingEnd'),
}>()
const props = defineProps<{
  applicants: Applicant[]
}>()

const fixStore = useFix()
const applicantIDs = ref<string[]>([])
const fixes = ref<ApplicantFixWithApplicant[]>([])

function getApplicant(applicant_id : string){
  return props.applicants.find((row)=>row.id===applicant_id)
}
watch(()=>props.applicants, async (newValue)=>{
  if(newValue.length){
    emit('onLoadingStart')
    newValue.map((row)=>{
      applicantIDs.value.push(row.id)
    })
    const rawFixes : ApplicantFix[] = await fixStore.getFixByApplicantIDs(applicantIDs.value)
    
    const fortyFiveDaysMS = 3888000000;
    const fortyFiveDaysFromNow = Timestamp.fromMillis(Date.now() + fortyFiveDaysMS) 
    const terminationFixes = rawFixes.filter((row)=>{
      const fixEnd = dateToTimestampFormat(new Date(row.endDate))
      return row.admissionStatus && fixEnd && (fixEnd.seconds < fortyFiveDaysFromNow.seconds)
    })

    fixes.value = terminationFixes
    fixes.value.map((row)=>{
      row.applicant = getApplicant(row.applicant_id)
    })
    emit('onLoadingEnd')
  } else {
    fixes.value = []
  }
})

</script>