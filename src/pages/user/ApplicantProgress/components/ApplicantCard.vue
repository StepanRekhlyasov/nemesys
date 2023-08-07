<template>
  <q-card
    bordered
    class='cursor-move q-mb-md text-caption full-width applicant-card'
    square
    flat
    :class='{redAlert:redAlert}'
  >
    <div class='row q-gutter-sm items-center'>
      <span class='col-1'>{{ RankCount.getRank(item.staffRank) }}</span>
      <span class='col applicant-clickable' @click="emit('selectApplicant', item)">{{ item.name }}</span>
    </div>
    <div class='row q-gutter-md items-center'>
      <div class='col'>{{ item.occupation && $t('applicant.add.' + item.occupation) }}</div>
      <div class='col' v-if="item.prefecture">{{ $t('prefectures.'+(prefectureLocaleKey[item.prefecture]?prefectureLocaleKey[item.prefecture]:item.prefecture)) }} <br/> {{ item.municipalities }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm' v-if="item.status" v-html="statusDateName[item.status]"></div>
      <div class='col' v-if="item.status">{{ item[applicantStatusDates[item.status]] ? myDateFormat(item[applicantStatusDates[item.status]], 'YYYY.MM.DD') : '—' }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm'>{{$t('applicant.progress.card.contact')}}</div>
      <div class='col'>{{ contactDate ? myDateFormat(contactDate, 'YYYY.MM.DD') : '-'}}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1 q-mr-sm'>FAX</div>
      <div class='col'>{{ faxDate ? myDateFormat(faxDate, 'YYYY.MM.DD') : '-'}}</div>
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { Timestamp, orderBy, where } from 'firebase/firestore'
import { Applicant } from 'src/shared/model'
import { myDateFormat } from 'src/shared/utils/utils'
import { computed, onMounted, ref } from 'vue'
import { prefectureLocaleKey } from 'src/shared/constants/Prefecture.const'
import { RankCount } from 'src/shared/utils/RankCount.utils'
import { i18n } from 'boot/i18n'
import { applicantStatusDates } from 'src/shared/constants/Applicant.const'
import { useApplicant } from 'src/stores/applicant'
import { useFax } from 'src/stores/fax'

const props = defineProps<{
  item: Applicant,
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
const faxStore = useFax()

const emit = defineEmits<{
    (e: 'selectApplicant', applicant : Applicant)
}>()

const redAlert = computed(()=>{
  if(!(props.item.currentStatusTimestamp instanceof Timestamp)){
    return false
  }
  const daysUntilAlert = 3 * 86400000 /* days x miliseconds */
  const compareWithMe = new Date().setTime(new Date().getTime() + daysUntilAlert);
  return props.item.currentStatusTimestamp.toDate() < new Date(compareWithMe)
})

const contactDate = ref<Timestamp>()
const faxDate = ref<Timestamp>()

onMounted(async ()=>{
  const lastContact = await applicantStore.getApplicantContactData(props.item.id, [where('deleted', '==', false), orderBy('created_at', 'desc')], 1)
  contactDate.value = lastContact?.[0]?.created_at
  const faxes = await faxStore.getFaxByConstraints([where('deleted', '==', false), where('applicantId', '==', props.item.id)])
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
</style>