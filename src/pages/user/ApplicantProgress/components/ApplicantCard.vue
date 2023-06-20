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
      <div class='col' v-if="item.prefecture">{{ $t('prefectures.'+(prefectureLocaleKey[item.prefecture]?prefectureLocaleKey[item.prefecture]:item.prefecture)) }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1' v-if="item.status" v-html="statusDateName[item.status]"></div>
      <div class='col'>{{ item[statusDateField(item.status)] ? timestampToDateFormat(item[statusDateField(item.status)], 'YYYY.MM.DD') : '—' }}</div>
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore'
import { Applicant } from 'src/shared/model'
import { timestampToDateFormat } from 'src/shared/utils/utils'
import { computed } from 'vue'
import { prefectureLocaleKey } from 'src/shared/constants/Prefecture.const'
import { RankCount } from 'src/shared/utils/RankCount.utils'
import { getApplicantCurrentStatusTimestampField as statusDateField } from 'src/shared/utils/Applicant.utils'
import { i18n } from 'boot/i18n'

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

const emit = defineEmits<{
    (e: 'selectApplicant', applicant : Applicant)
}>()

const redAlert = computed(()=>{
  if(!(props.item.currentStatusTimestamp instanceof Timestamp)){
    return false
  }
  const daysUntilAlert = 3 * 86400000 /* days x miliseconds */
  const compareWithMe = new Date().setTime(new Date().getTime() - daysUntilAlert);
  return props.item.currentStatusTimestamp.toDate() < new Date(compareWithMe)
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