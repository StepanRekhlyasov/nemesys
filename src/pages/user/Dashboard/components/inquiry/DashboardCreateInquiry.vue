<template>
  <q-card-section class="bg-grey-1">
    <div class="q-mx-xl flex justify-between items-center q-mb-lg">
      <div class="text-primary text-bold">■{{ $t('inquiry.detail.inquiryTitle') }}</div>
      <div>
        <q-btn v-if="!isEdit" :label="$t('common.edit')" color="primary" outline  icon="edit" class="no-shadow q-ml-lg" size="sm" @click="isEdit=true"/>
        <q-btn v-if="isEdit" :label="$t('common.save')" color="primary" size="sm" @click="saveInquiryData" />
        <q-btn v-if="isEdit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" size="sm" @click="resetChanges"/>
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm ">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.category') }}
      </div>
      <div class="col-8 wordBreak" v-if="!isEdit">
        {{ inquiryData.category }}
      </div>
      <div class="col-8" v-else>
        <q-input v-model="inquirySaveData.category" dense outlined />
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.subject') }}
      </div>
      <div class="col-8 wordBreak" v-if="!isEdit">
        {{ inquiryData.subject }}
      </div>
      <div class="col-8" v-else>
        <q-input v-model="inquirySaveData.subject" dense outlined />
      </div>
    </div>
    <div class="row q-mb-sm q-gutter-sm">
      <div class="col-3 text-right text-accent">
        {{ $t('inquiry.detail.content') }}
      </div>
      <div class="col-8 wordBreak" v-if="!isEdit">
        {{ inquiryData.inquiryContent }}
      </div>
      <div class="col-8" v-else>
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
import { useQuasar } from 'quasar';
import { InquiryData } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useInquiry } from 'src/stores/inquiry';
import { useOrganization } from 'src/stores/organization';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const isEdit = ref(false)
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const inquiryStore = useInquiry()
const organization = useOrganization()
const emit = defineEmits(['closeDrawer', 'inquiryAdded'])
const inquiryData = ref<Partial<InquiryData>>({})
const inquirySaveData = ref(JSON.parse(JSON.stringify(inquiryData.value)))
const disable = computed(()=>!(inquiryData.value.category && inquiryData.value.subject && inquiryData.value.inquiryContent && !isEdit.value))
function resetChanges(){
  inquirySaveData.value = JSON.parse(JSON.stringify(inquiryData.value))
  isEdit.value = false
}
function saveInquiryData(){
  inquiryData.value = JSON.parse(JSON.stringify(inquirySaveData.value))
  isEdit.value = false
}
async function submitInquiry(){
  const submitData = JSON.parse(JSON.stringify(inquiryData.value)) 
  submitData.status = 'unanswered'
  submitData.messages = []
  submitData.organization = organization.currentOrganizationId
  submitData.recievedDate = serverTimestamp()
  try{
    await inquiryStore.addInquiry(submitData)
    Alert.success($q, t);
    inquiryData.value = {
      category: '',
      subject: '',
      inquiryContent: '',
    }
    resetChanges()
    emit('inquiryAdded')
  } catch (e) {
    Alert.warning($q, t);
    console.log(e)
  }
}
</script>
<style scoped>
.wordBreak{
  word-break: break-all;
}
</style>