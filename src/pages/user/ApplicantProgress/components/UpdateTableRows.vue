<template>
  <tbody>
    <tr>
      <th>{{ $t('applicant.progress.table.staffName') }}</th>
      <th>{{ $t('applicant.progress.table.jobType') }}</th>
      <th>{{ $t('applicant.progress.table.employmentLocation') }}</th>
      <th>{{ $t('applicant.progress.table.chargeOfFix') }}</th>
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
        <td v-if="fix.applicant.occupation">{{ $t('applicant.add.'+fix.applicant.occupation) }}</td>
        <td v-else>-</td>
        <td>-</td>
        <td>{{ fix.user?.name }}</td>
        <td>{{ fix.admissionDate }}</td>
        <td>{{ fix.endDate }}</td>
        <td>{{ remainingDays(new Date(), new Date(fix.endDate)) }}</td>
        <td>-</td>
        <td>-</td>
        <td>{{ chooseMemo(fix) }}</td>
      </tr>
    </template>
  </tbody>
</template>
<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';
import { Applicant, ApplicantFix, User } from 'src/shared/model';
import { dateToTimestampFormat, remainingDays } from 'src/shared/utils/utils';
import { useFix } from 'src/stores/fix';
import { useUserStore } from 'src/stores/user';
import { ref, watch } from 'vue';

interface ApplicantFixWithRelativeData extends ApplicantFix {
  applicant?: Applicant,
  user?: User
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
const fixes = ref<ApplicantFixWithRelativeData[]>([])
const userStore = useUserStore()

function chooseMemo(fix : ApplicantFix){
  return fix.offerMemo || fix.inspectionMemo || fix.admissionMemo || fix.fixMemo || '-'
}
function getApplicant(applicant_id : string){
  return props.applicants.find((row)=>row.id===applicant_id)
}
watch(()=>props.applicants, async (newValue)=>{
  applicantIDs.value = []
  if(newValue.length){
    emit('onLoadingStart')
    newValue.forEach((row)=>{
      applicantIDs.value.push(row.id)
    })
    const rawFixes = await fixStore.getFixByApplicantIDs(applicantIDs.value)
    
    const fortyFiveDaysMS = 3888000000;
    const fortyFiveDaysFromNow = Timestamp.fromMillis(Date.now() + fortyFiveDaysMS) 
    const terminationFixes : ApplicantFix[] = rawFixes.filter((row : ApplicantFix)=>{
      const fixEnd = dateToTimestampFormat(new Date(row.endDate))
      return row.admissionStatus && fixEnd && (fixEnd.seconds < fortyFiveDaysFromNow.seconds)
    })

    fixes.value = terminationFixes
    await Promise.all(fixes.value.map(async (row)=>{
      row.applicant = getApplicant(row.applicant_id)
      if(row.chargeOfFix){
        emit('onLoadingStart')
        row.user = await userStore.getUserById(row.chargeOfFix)
      }
    }))
    emit('onLoadingEnd')
  } else {
    fixes.value = []
  }
})

</script>