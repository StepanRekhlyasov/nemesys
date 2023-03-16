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
      <q-tab name="contactInfo" :label="$t('applicant.list.contactInfo')" />
      <q-tab name="applicationInfo" :label="$t('applicant.list.applicationInfo')" />
      <q-tab name="attendanceInfo" :label="$t('applicant.list.attendanceInfo')" />
      <q-tab name="fixEmployInfo" :label="$t('applicant.list.fixEmployInfo')" />
      <q-tab name="operationInfo" :label="$t('applicant.list.operationInfo')" />
      <q-tab name="memo" :label="$t('client.list.memo')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="contactInfo">
        <contactInfo :applicant="applicant" :key="applicant.id"/>
      </q-tab-panel>

      <q-tab-panel name="applicationInfo">
        <applicationInfo :applicant="applicant" :key="applicant.id" :updateApplicant="updateApplicant" />
      </q-tab-panel>

      <q-tab-panel name="attendanceInfo">
        <attendanceInfo :applicant="applicant" :updateApplicant="updateApplicant" />
      </q-tab-panel>

      <q-tab-panel name="fixEmployInfo">
        <fixEmployInfo :applicant="applicant" :key="applicant.id"/>
      </q-tab-panel>

      <q-tab-panel name="operationInfo">
        <operationInfoComponent :applicant="applicant"/>
      </q-tab-panel>
      
      <q-tab-panel name="memo">
        <applicantMemo :applicant="applicant" :updateApplicant="updateApplicant"/>
      </q-tab-panel>
  </q-tab-panels>
</template>



<script>
//import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import fixEmployInfo from './fix/fixEmployInfoTab.vue';
import contactInfo from './contactInfoTab.vue';
import applicationInfo from './applicant/applicationInfoTab.vue';
import attendanceInfo from './attendance/attendanceTab.vue';
import operationInfoComponent from './operationInfoTab.vue';
import applicantMemo from './memoTab.vue';

export default {
  name: 'clientDetails',
  components: {
    contactInfo,
    fixEmployInfo,
    applicationInfo,
    attendanceInfo,
    operationInfoComponent,
    applicantMemo
  },

  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  },

  setup() {
    //const { t } = useI18n({ useScope: 'global' });

    const tab = ref('contactInfo');


    return {
      tab,
    };
  },
};
</script>
