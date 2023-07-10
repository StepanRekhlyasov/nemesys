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
        <CandidateStaffBoSection :bo="bo" @openSearchByMap="emit('openSearchByMap')"/>
      </q-tab-panel>

      <q-tab-panel name="assignedStaff">
        <AssignedStaffBoSection :bo="bo" />
      </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref, watch } from 'vue';
import boCommonInfoSections from './boCommonInfoSections.vue';
import CandidateStaffBoSection from './candidateStaffBoSection.vue';
import AssignedStaffBoSection from './assignedStaffBoSection.vue';
import { drawerValue } from '../../consts/BackOrder.const';

watch(drawerValue,()=>{
  if(drawerValue.value===false){
    tab.value = 'boCommonInformation'
  }
})

defineProps<{
  bo: BackOrderModel
}>();
const emit = defineEmits(['openSearchByMap']);
const tab = ref('boCommonInformation');

</script>
