<template>
  <div v-for="(message, index) in inquiryMessages" :key="index" :class="message.type === INQUIRY_MESSAGE_TYPE.response ? 'bg-grey-3': ''">
    <q-card-section>
      <div class="row items-start q-gutter-md q-mb-xs myRow">
        <div class="text-right col-3">
          {{ message.type === INQUIRY_MESSAGE_TYPE.issue ? $t('inquiry.message.issueDate') : $t('inquiry.message.responseDate') }}
        </div>
        <div class="col-8 text-left">
          {{ myDateFormat(message.date, 'YYYY-MM-DD HH:SS') }}
        </div>
      </div>
      <div class="row items-start q-gutter-md q-mb-xs myRow">
        <div class="text-right col-3">
          {{ $t('inquiry.detail.replyContent') }}
        </div>
        <div class="wordBreak col-8 text-left">
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
import { myDateFormat } from 'src/shared/utils/utils';

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