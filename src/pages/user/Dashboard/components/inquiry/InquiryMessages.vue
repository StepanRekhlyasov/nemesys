<template>
  <div v-for="(message, index) in inquiryMessages" :key="index">
    <q-card-section :class="[(index + 1) % 2 == 0 ? 'bg-grey-1' : 'bg-grey-2' + ' q-pa-md', message.type]">
      <div class="row items-start q-gutter-md q-mb-xs myRow" :class="message.type">
        <div class="" :class="message.type === INQUIRY_MESSAGE_TYPE.issue ? 'text-left col-2 limitWidth' : 'text-right col-3'">
          {{ message.type === INQUIRY_MESSAGE_TYPE.issue ? $t('inquiry.message.issueDate') : $t('inquiry.message.responseDate') }}
        </div>
        <div class="col-8" :class="message.type === INQUIRY_MESSAGE_TYPE.issue ? 'text-right' : 'text-left'">
          {{ timestampToDateFormat(message.date) }}
        </div>
      </div>
      <div class="row items-start q-gutter-md q-mb-xs myRow" :class="message.type">
        <div class="" :class="message.type === INQUIRY_MESSAGE_TYPE.issue ? 'text-left col-2 limitWidth' : 'text-right col-3'">
          {{ $t('inquiry.detail.replyContent') }}
        </div>
        <div :class="message.type === INQUIRY_MESSAGE_TYPE.issue ? 'text-right' : 'text-left'" class="wordBreak col-8">
          {{ message.content }}
        </div>
      </div>
    </q-card-section>
    <q-separator v-if="inquiryMessages && index !== inquiryMessages.length - 1"/>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { INQUIRY_MESSAGE_TYPE } from 'src/pages/admin/InquiryPage/types/inquiryTypes';
import { InquiryData } from 'src/shared/model';
import { timestampToDateFormat } from 'src/shared/utils/utils';

const props = defineProps<{
  inquiryData : InquiryData
}>()
const inquiryMessages = computed(() => props.inquiryData?.messages);
</script>

<style scoped lang="scss">
.limitWidth {
  max-width: 145px;
}
.wordBreak{
  word-break: break-all;
  max-width: 380px;
}
.myRow{
  &.issue{
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>