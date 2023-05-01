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
      <q-tab name="boCommonInformation" :label="$t('backOrder.boCommonInformation')" />
      <q-tab name="candidateStaff" :label="$t('backOrder.candidateStaff')" />
      <q-tab name="assignedStaff" :label="$t('backOrder.assignedStaff')" />
  </q-tabs>

  <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="boCommonInformation">
        <boCommonInfoSections :bo="bo" /> 
      </q-tab-panel>

      <q-tab-panel name="candidateStaff">
      </q-tab-panel>

      <q-tab-panel name="assignedStaff">
      </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';
import boCommonInfoSections from './boCommonInfoSections.vue';
defineProps<{
  bo: BackOrderModel
}>();
const tab = ref('boCommonInformation');
</script>

<style>

</style>