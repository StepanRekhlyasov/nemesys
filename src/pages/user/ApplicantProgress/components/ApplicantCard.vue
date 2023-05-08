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
      <span class='col'>{{ item.name }}</span>
    </div>
    <div class='row q-gutter-md items-center'>
      <div class='col'>{{ item.occupation }}</div>
      <div class='col' v-if="item.prefecture">{{ $t('prefectures.'+item.prefecture) }}</div>
    </div>
    <div class='row q-gutter-sm items-center'>
      <div class='col-1'>応</div>
      <div class='col' v-if="item.applicationDate">{{ applicationDateFormat(item.applicationDate) }}</div>
    </div>
  </q-card>
</template>
<script lang="ts" setup>
import { Applicant } from 'src/shared/model'
import { applicationDateFormat } from 'src/shared/utils/utils'
import { computed } from 'vue'

const props = defineProps<{
  item: Applicant,
}>()
const daysUntilAlert = 20
const redAlert = computed(()=>{
  if(!props.item.currentStatusTimestamp){
    return false
  }
  return props.item.currentStatusTimestamp < Math.round(Date.now()/1000 - 86400*daysUntilAlert)
})
  
</script>
<style scoped>
.applicant-card{
  border: 1px solid #333; 
  padding: 8px
}
.applicant-card.redAlert{
  border: 1px solid #FF5252; 
}
</style>