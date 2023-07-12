<template>
  <q-tabs
    v-model="tab"
    dense
    class="bg-grey-3 text-primary new tabs"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    inline-label
    switch-indicator
    active-bg-color="white">
      <q-tab v-if="!bo" name="contactInfo" :label="$t('applicant.list.contactInfo')" />
      <q-tab name="applicationInfo" :label="$t('applicant.list.applicationInfo')" />
      <q-tab name="attendanceInfo" :label="$t('applicant.list.attendanceInfo')" />
      <q-tab v-if="!bo" name="fixEmployInfo" :label="$t('applicant.list.fixEmployInfo')" />
      <q-tab v-if="!bo" name="operationInfo" :label="$t('applicant.list.operationInfo')" />
      <q-tab name="memo" :label="$t('client.list.memo')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
      <q-tab-panel v-if="!bo" name="contactInfo">
        <contactInfo :applicant="applicant" :key="applicant.id"/>
      </q-tab-panel>

      <q-tab-panel name="applicationInfo">
        <applicationInfo :bo="bo" :applicant="applicant" :key="applicant.id"/>
      </q-tab-panel>

      <q-tab-panel name="attendanceInfo">
        <attendanceInfo :bo="bo" :applicant="applicant" />
      </q-tab-panel>

      <q-tab-panel v-if="!bo" name="fixEmployInfo">
        <fixEmployInfo :applicant="applicant" :key="applicant.id" />
      </q-tab-panel>

      <q-tab-panel v-if="!bo" name="operationInfo">
        <operationInfoComponent :applicant="applicant"/>
      </q-tab-panel>

      <q-tab-panel name="memo">
        <applicantMemo :bo="bo" :applicant="applicant"/>
      </q-tab-panel>
  </q-tab-panels>
</template>



<script lang="ts" setup>
import { ref } from 'vue';
import fixEmployInfo from './fixEmployInfoTab.vue';
import contactInfo from './contactInfoTab.vue';
import applicationInfo from './applicantTab/applicationInfoTab.vue';
import attendanceInfo from './attendanceTab/attendanceTab.vue';
import operationInfoComponent from './operationInfoTab.vue';
import applicantMemo from './memoTab.vue';
import { Applicant, BackOrderModel } from 'src/shared/model';

const tab = ref('contactInfo');
withDefaults(defineProps<{
  applicant: Applicant,
  bo:BackOrderModel | null
}>(), {
  bo: null
})

</script>
