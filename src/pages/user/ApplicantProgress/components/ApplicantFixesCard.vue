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
      <span class='col-1 q-mr-sm'>{{ RankCount.getRank(applicant.staffRank) }}</span>
      <span class='col applicant-clickable' @click="emit('selectApplicant', applicant)">{{ applicant.name }}</span>
    </div>
    <div class='row q-gutter-md items-center'>
      <div class='col'><q-icon :name="'business'" style="font-size: 14px;"/></div>
      <div class='col'>{{ applicantStore.state.clientList.find(client => client.id === fix.client)?.name }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm' v-html="statusDateName[status]"></div>
      <div class='col' v-if="(fix[applicantStatusDates[status]] instanceof Timestamp)">{{ myDateFormat(fix[applicantStatusDates[status]], 'YYYY.MM.DD') }}</div>
      <div class='col' v-else>{{ fix[applicantStatusDates[status]]?fix[applicantStatusDates[status]]:'-' }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm'>{{$t('applicant.progress.card.contact')}}</div>
      <div class='col'>{{ contactDate ? myDateFormat(contactDate, 'YYYY.MM.DD') : '-'}}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm'>FAX</div>
      <div class='col'>{{ faxDate ? myDateFormat(faxDate, 'YYYY.MM.DD') : '-'}}</div>
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
import { Timestamp, orderBy, where } from 'firebase/firestore'
import { Applicant, ApplicantFix, ApplicantStatus } from 'src/shared/model'
import { computed, onMounted, ref } from 'vue'
import { RankCount } from 'src/shared/utils/RankCount.utils'
import { i18n } from 'boot/i18n'
import { useApplicant } from 'src/stores/applicant'
import { applicantStatusDates } from 'src/shared/constants/Applicant.const'
import { myDateFormat } from 'src/shared/utils/utils'
import { useFax } from 'src/stores/fax'

const props = defineProps<{
  fix: ApplicantFix,
  status: ApplicantStatus
}>()
const { t } = i18n.global
const statusDateName = computed(()=>{
  return {
    [ApplicantStatus.WAIT_CONTACT] : t('applicant.progress.card.applicationDate'),
    [ApplicantStatus.WAIT_ATTEND] : t('applicant.progress.card.invitationDate'),
    [ApplicantStatus.WAIT_FIX] : t('applicant.progress.card.attendingDate'),
    [ApplicantStatus.WAIT_VISIT] : t('applicant.progress.card.FIXDate'),
    [ApplicantStatus.WAIT_OFFER] : t('applicant.progress.card.jobDate'),
    [ApplicantStatus.WAIT_ENTRY] : t('applicant.progress.card.appointmentDate'),
    [ApplicantStatus.WAIT_TERMINATION] : '&#128337;',
  }
})

const contactDate = ref<Timestamp>()
const faxDate = ref<Timestamp>()
const applicantStore = useApplicant()
const faxStore = useFax()

const applicant = computed(()=>{
  return applicantStore.state.applicants[props.fix.applicant_id]?applicantStore.state.applicants[props.fix.applicant_id]:undefined
})
const countFixes = computed(()=>{
  if(applicantStore.state.applicantFixes[props.fix.applicant_id]){
    const notWorkingFix = applicantStore.state.applicantFixes[props.fix.applicant_id].filter((row)=>{
      if(row.status){
        return [ApplicantStatus.WAIT_VISIT, ApplicantStatus.WAIT_OFFER, ApplicantStatus.WAIT_ENTRY, ApplicantStatus.WAIT_TERMINATION].includes(row.status)
      }
    })
    return notWorkingFix.length
  }
  return 1
})

const emit = defineEmits<{
    (e: 'selectApplicant', applicant : Applicant)
}>()

const redAlert = computed(()=>{
  if(!props.fix){
    return false
  }
  if(!(props.fix.currentStatusTimestamp instanceof Timestamp)){
    return false
  }
  const daysUntilAlert = 3 * 86400000 /* days x miliseconds */
  const compareWithMe = new Date().setTime(new Date().getTime() - daysUntilAlert);
  return props.fix.currentStatusTimestamp.toDate() < new Date(compareWithMe)
})

onMounted(async ()=>{
  const lastContact = await applicantStore.getApplicantContactData(props.fix.applicant_id, [where('deleted', '==', false), orderBy('created_at', 'desc')], 1)
  contactDate.value = lastContact?.[0]?.created_at
  const faxes = await faxStore.getFaxByConstraints([where('deleted', '==', false), where('applicantId', '==', props.fix.applicant_id)])
  const faxesSended = faxes.filter((row)=>{
    return row['send_at']
  })
  faxesSended.sort((a, b) => {
    try {
      if(a['send_at'].toDate() > b['send_at'].toDate()){
        return 1
      }
    } catch (e) {
      console.log(e)
      return -1
    }
    return 0
  })
  faxDate.value = faxes?.[0]?.['transmissionDateTime'] || faxes?.[0]?.['send_at'] 
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
  background-color: #A9F5FC;
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