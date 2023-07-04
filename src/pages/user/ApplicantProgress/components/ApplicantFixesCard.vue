<template>
  <q-card
    v-if="applicant"
    bordered
    class='cursor-move q-mb-md text-caption full-width applicant-card'
    square
    flat
    :class='{redAlert:redAlert, highlighted: applicantStore.state.highlightedApplicant === applicant.id}'
  >
    <div class='row q-gutter-sm items-center'>
      <span class='col-1'>{{ RankCount.getRank(applicant.staffRank) }}</span>
      <span class='col applicant-clickable' @click="emit('selectApplicant', applicant)">{{ applicant.name }}</span>
    </div>
    <div class='row q-gutter-md items-center'>
      <div class='col'><q-icon :name="'business'" style="font-size: 14px;"/></div>
      <div class='col'>{{ applicantStore.state.clientList.find(client => client.id === fix.client)?.name }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1' v-html="statusDateName[status]"></div>
      <div class='col' v-if="(fix[applicantStatusDates[status]] instanceof Timestamp)">{{ timestampToDateFormat(fix[applicantStatusDates[status]], 'YYYY.MM.DD') }}</div>
      <div class='col' v-else>{{ fix[applicantStatusDates[status]]?fix[applicantStatusDates[status]]:'-' }}</div>
    </div>
    <q-btn
      v-if="countFixes>1"
      @click="()=>{
        if(applicantStore.state.highlightedApplicant === applicant?.id){
          applicantStore.state.highlightedApplicant = undefined
        } else {
          applicantStore.state.highlightedApplicant = applicant?.id
        }
      }"
      class="countFixesBtn"
    >
      {{ countFixes }}
    </q-btn>
  </q-card>
</template>
<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore'
import { Applicant, ApplicantFix, ApplicantStatus } from 'src/shared/model'
import { computed } from 'vue'
import { RankCount } from 'src/shared/utils/RankCount.utils'
import { i18n } from 'boot/i18n'
import { useApplicant } from 'src/stores/applicant'
import { applicantStatusDates } from 'src/shared/constants/Applicant.const'
import { timestampToDateFormat } from 'src/shared/utils/utils'

const props = defineProps<{
  fix: ApplicantFix,
  status: ApplicantStatus
}>()
const { t } = i18n.global
const statusDateName = computed(()=>{
  return {
    'wait_contact' : t('applicant.progress.card.applicationDate'),
    'wait_attend' : t('applicant.progress.card.invitationDate'),
    'wait_FIX' : t('applicant.progress.card.attendingDate'),
    'wait_visit' : t('applicant.progress.card.FIXDate'),
    'wait_offer' : t('applicant.progress.card.jobDate'),
    'wait_entry' : t('applicant.progress.card.appointmentDate'),
    'wait_termination' : '&#128337;',
  }
})

const applicantStore = useApplicant()
const applicant = computed(()=>{
  return applicantStore.state.applicants[props.fix.applicant_id]?applicantStore.state.applicants[props.fix.applicant_id]:undefined
})
const countFixes = computed(()=>{
  const notWorkingFix = applicantStore.state.applicantFixes[props.fix.applicant_id].filter((row)=>{
    return row['status'] !== 'working'
  })
  return notWorkingFix.length
})

const emit = defineEmits<{
    (e: 'selectApplicant', applicant : Applicant)
}>()

const redAlert = computed(()=>{
  if(!applicant.value){
    return false
  }
  if(!(applicant.value.currentStatusTimestamp instanceof Timestamp)){
    return false
  }
  const daysUntilAlert = 3 * 86400000 /* days x miliseconds */
  const compareWithMe = new Date().setTime(new Date().getTime() - daysUntilAlert);
  return applicant.value.currentStatusTimestamp.toDate() < new Date(compareWithMe)
})
  
</script>
<style scoped lang="scss">
.applicant-card{
  border: 1px solid #333; 
  padding: 8px
}
.applicant-card.redAlert{
  border: 1px solid #FF5252; 
}
.applicant-clickable{
  color: $primary;
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
.highlighted{
  background-color: #A9F5F0;
}
.countFixesBtn{
  width: 36px;
  height: 36px;
  padding: 0;
  background-color: #175680;
  color: #fff;
  border-radius: 50%;
  position: absolute;
  right: -18px;
  top: 18px;
  font-size: 14px;
}
</style>