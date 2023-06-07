<template>
  <div class="q-mx-xl flex justify-between items-center q-mb-lg">
    <div class="text-bold" :class="'text-'+theme">■{{ $t('inquiry.detail.inquiryTitle') }}</div>
  </div>
  <q-card-section class="bg-grey-1" v-if="inquiryData">
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right" :class="'text-'+theme">
        {{ $t('inquiry.detail.category') }}
      </div>
      <div class="col-4 wordBreak">
        {{ inquiryData.category }}
      </div>
      <div class="col-1 text-right" :class="'text-'+theme">
        {{ $t('inquiry.detail.recievedDate') }}
      </div>
      <div class="col-3">
        {{ timestampToDateFormat(inquiryData.recievedDate as Timestamp) }}
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right" :class="'text-'+theme">
        {{ $t('inquiry.detail.subject') }}
      </div>
      <div class="col-8 wordBreak">
        {{ inquiryData.subject }}
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right" :class="'text-'+theme">
        {{ $t('inquiry.detail.content') }}
      </div>
      <div class="col-8 wordBreak">
        {{ inquiryData.inquiryContent }}
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore';
import { InquiryData } from 'src/shared/model';
import { timestampToDateFormat } from 'src/shared/utils/utils';

withDefaults(defineProps<{
  inquiryData: InquiryData,
  theme?: string
}>(), {
  theme: 'primary'
})
</script>
<style scoped>
.wordBreak{
  word-break: break-all;
}
</style>
