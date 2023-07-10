<template>
  <div  v-for="(message, index) in inquiryMessages" :key="index">
    <q-card-section :class="message.type === INQUIRY_MESSAGE_TYPE.issue ? 'bg-grey-1' : 'bg-grey-2' + ' q-pa-md'">

      <div class="row items-start q-gutter-md q-mb-xs">
        <div class="col-3 text-right ">
          {{ message.type === INQUIRY_MESSAGE_TYPE.issue ? $t('inquiry.message.issueDate') : $t('inquiry.message.responseDate') }}
        </div>
        <div class="col-8">
          {{ message.messageDate }}
        </div>
      </div>
      <div class="row items-start q-gutter-md q-mb-xs">
        <div class="col-3 text-right ">
          {{ $t('inquiry.detail.replyContent') }}
        </div>
        <div class="col-8 wordBreak">
          {{ message.content }}
        </div>
      </div>

    </q-card-section>

    <q-separator v-if="inquiryMessages && index !== inquiryMessages.length - 1"/>

  </div>
</template>

<script lang="ts" setup>
  import { useInquiry } from 'src/stores/inquiry';
  import { computed } from 'vue';
  import { INQUIRY_MESSAGE_TYPE } from '../types/inquiryTypes';


  const inquiryStore = useInquiry()

  const inquiryMessages = computed(() => inquiryStore.state.currentRowData.messages);

</script>
<style scoped>
.wordBreak{
  word-break: break-all;
}
</style>
