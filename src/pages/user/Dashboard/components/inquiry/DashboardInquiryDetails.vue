<template>
  <q-card-section class="bg-grey-1" >
    <InquiryDetails :inquiryData="inquiryData"/>
  </q-card-section>
  <q-separator />
    <InquiryMessages :inquiryData="inquiryData" />
  <q-card-section class="bg-grey-3 q-ma-md shadow-2">
    <InquiryForm :inquiryData="inquiryData" @inquiryUpdated="updateInquery()" />
  </q-card-section>
  <q-inner-loading :showing="loading" style="height:calc(100vh - 64px)">
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>
<script setup lang="ts">
import { useInquiry } from 'src/stores/inquiry'
import { watch, ref, onMounted } from 'vue'
import InquiryDetails from './InquiryDetails.vue'
import InquiryMessages from './InquiryMessages.vue'
import InquiryForm from './InquiryForm.vue'

const inquiryStore = useInquiry() 
const props = defineProps<{
  id: string,
}>()
const inquiryData = ref()
const loading = ref(false)

async function updateInquery(){
  if(props.id){
    loading.value = true
    inquiryData.value = await inquiryStore.getCurrentInquiry(props.id)
    loading.value = false
  }
}
onMounted(async ()=>{
  updateInquery()
})
watch(()=>props.id, async ()=>{
  updateInquery()
})
</script>