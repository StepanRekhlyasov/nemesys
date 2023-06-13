<template>
  <q-card-section class="bg-grey-1">
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.category') }}
      </div>
      <div class="col-4">
        {{ inquiryDetail.category }}
      </div>
      <div class="col-1 text-right text-accent">
        {{ $t('inquiry.detail.recievedDate') }}
      </div>
      <div class="col-3">
        {{ inquiryDetail.issueDate }}
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.subject') }}
      </div>
      <div class="col-8">
        {{ inquiryDetail.subject }}
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.content') }}
      </div>
      <div class="col-8 wordBreak">
        {{ inquiryDetail.inquiryContent }}
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { InquiryDataRow } from 'src/shared/model';
  import { useInquiry } from 'src/stores/inquiry';
  import { ref, watch } from 'vue';


  const inquiryDetail = ref<Partial<InquiryDataRow>>({
    category: '',
    subject: '',
    issueDate: '',
  })

  const inquiryStore = useInquiry()

  watch(() => inquiryStore.state.currentRowData, ({category, subject, issueDate, inquiryContent })=>{
    inquiryDetail.value = {category, subject, issueDate, inquiryContent }
  })

</script>
<style>
.wordBreak{
  word-break:break-all;
}
</style>
