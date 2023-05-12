<template>
  <q-card
    bordered
    class='cursor-move q-mb-md text-caption full-width applicant-card'
    square
    flat
    :class='{redAlert:redAlert}'
  >
    <div class='row q-gutter-sm items-center'>
      <span class='col-1'>S</span>
      <span class='col applicant-clickable' @click="emit('selectApplicant', item)">{{ item.name }}</span>
    </div>
    <div class='row q-gutter-md items-center'>
      <div class='col'>{{ item.occupation }}</div>
      <div class='col' v-if="item.prefecture">{{ $t('prefectures.'+item.prefecture) }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1'>応</div>
      <div class='col' v-if="(item.currentStatusTimestamp instanceof Timestamp)">{{ firebaseDateFormat(item.currentStatusTimestamp.toDate(), 'YYYY.MM.DD') }}</div>
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore'
import { Applicant } from 'src/shared/model'
import { firebaseDateFormat } from 'src/shared/utils/utils'
import { computed } from 'vue'


const props = defineProps<{
  item: Applicant,
}>()

const emit = defineEmits<{
    (e: 'selectApplicant', applicant : Applicant)
}>()

const redAlert = computed(()=>{
  if(!(props.item.currentStatusTimestamp instanceof Timestamp)){
    return false
  }
  const daysUntilAlert = 3
  const compareWith = new Date().setTime(new Date().getTime() - (daysUntilAlert * 86400000));
  return props.item.currentStatusTimestamp.toDate() < new Date(compareWith)
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