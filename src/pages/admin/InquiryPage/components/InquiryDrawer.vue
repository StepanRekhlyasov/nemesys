<template>
  <q-drawer
    v-model="drawerRight"
    show
    class="bg-grey-3"
    :width="780"
    :breakpoint="500"
    side="right"
    overlay elevated
    bordered
    >
    <q-scroll-area
      class="fit text-left"
      v-if="true">
      <q-card class="no-shadow bg-grey-3">
        <q-card-section class="text-white bg-accent" >
          <div class="row q-gutter-sm items-end">
              <q-btn dense flat icon="close" @click="() => inquiryStore.openDrawer(false)" />
            <div class="col-4 text-h5">
              {{ organisation?.name }}
              <br/>
              <span class="text-bold">{{ organisation?.code }}</span>
            </div>
            <div class="col-3 q-pl-md">
              <div class="row">
                <div class="col-4 text-right"> TEL </div>
                <div class="col-8 q-pl-md"> {{ organisation?.tel }}  </div>
              </div>
              <div class="row">
                <div class="col-4 text-right"> FAX </div>
                <div class="col-8 q-pl-md"> {{ organisation?.fax }}  </div>
              </div>
            </div>
            <div class="col-3 q-pl-md self-start">
              <div class="row">
                <div class="col-4 text-right"> {{ $t('inquiry.detail.metro') }} </div>
                <div class="col-8 q-pl-md">   </div>
              </div>
              <div class="row">
                <div class="col-4 text-right"> {{ $t('inquiry.detail.adress') }} </div>
                <div class="col-8 q-pl-md">  </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="bg-grey-1">
          <div class="q-mx-xl ">
            <p class="text-accent  text-bold">■{{ $t('inquiry.detail.inquiryTitle') }}</p>
          </div>
          <InquiryDetails />
        </q-card-section>
        <q-separator />
        <InquiryMessages />
        <q-card-section class="bg-grey-3 q-ma-md shadow-2">
          <InquiryForm />
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import InquiryForm from './InquiryForm.vue'
import InquiryDetails from './InquiryDetails.vue'
import { useInquiry } from 'src/stores/inquiry';
import InquiryMessages from './InquiryMessages.vue';

const drawerRight = ref(false);
const organisation = computed(() => inquiryStore.state.currentOrganisationInfo);
const inquiryStore = useInquiry()

watch(() => inquiryStore.state.showDrawer, (newVal)=>{
  drawerRight.value = newVal
})
</script>
