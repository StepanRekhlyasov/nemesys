<template>
  <q-card-section class="bg-grey-1">
    <div class="q-mx-xl flex justify-between items-center q-mb-lg">
      <div class="text-primary text-bold">■{{ $t('inquiry.detail.inquiryTitle') }}</div>
    </div>
    <div class="row q-mb-sm q-gutter-sm ">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.category') }}
      </div>
      <div class="col-8">
        <q-input v-model="inquirySaveData.category" dense outlined />
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.subject') }}
      </div>
      <div class="col-8">
        <q-input v-model="inquirySaveData.subject" dense outlined />
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.content') }}
      </div>
      <div class="col-8">
        <q-input v-model="inquirySaveData.inquiryContent" type="textarea" dense outlined />
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm q-mt-lg">
      <div class="col-3 text-right">
        <q-btn :label="$t('common.submit')" color="primary" size="sm" @click="submitInquiry" :disable="disable"/>
      </div>
      <div class="col-8 text-left">
        <q-btn :label="$t('common.cancel')" color="primary" outline class="no-shadow q-ml-lg" size="sm" @click="() => emit('closeDrawer')"/>
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import { serverTimestamp } from 'firebase/firestore';
import { InquiryData } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useInquiry } from 'src/stores/inquiry';
import { useOrganization } from 'src/stores/organization';
import { ref, computed } from 'vue';

const loading = ref(false)
const inquiryStore = useInquiry()
const organization = useOrganization()
const emit = defineEmits(['closeDrawer', 'inquiryAdded'])
const inquirySaveData = ref<Partial<InquiryData>>({})
const disable = computed(()=> loading.value || !inquirySaveData.value.category || !inquirySaveData.value.subject || !inquirySaveData.value.inquiryContent)
async function submitInquiry(){
  loading.value = true
  const submitData = JSON.parse(JSON.stringify(inquirySaveData.value))
  submitData.status = 'unanswered'
  submitData.messages = []
  submitData.organization = organization.currentOrganizationId
  submitData.recievedDate = serverTimestamp()
  try{
    await inquiryStore.addInquiry(submitData)
    inquirySaveData.value = {}
    Alert.success();
    emit('inquiryAdded')
  } catch (e) {
    Alert.warning(e);
    console.log(e)
  }
  loading.value = false
}
</script>
<style scoped>
.wordBreak{
  word-break: break-all;
}
</style>
