<template>
  <q-drawer v-model="showDrawer" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated bordered v-if="selectedBo" :class="'my-drawer-aside'">
    <q-scroll-area class="fit text-left">
    <q-card class="no-shadow bg-grey-3">
      <q-card-section class="text-white bg-primary no-border-radius">
        <div class="row">
          <div class="flex items-end ">
            <q-btn dense flat icon="close" class="q-mr-md" @click="emit('close')"/>
          </div>
          <div>
            <div class="row text-subtitle2" v-if="client">
              {{ `${client['client_name']} / ${client['companyProfile']}` }}
            </div>
            <div class="row text-h6 text-weight-bold q-pr-xs">
              バックオーダー詳細／{{ selectedBo.type? $t(`backOrder.type.${selectedBo.type}`):'' }}
            </div>
          </div>
        </div>
      </q-card-section>
      <MapSearchs theme="primary" :bo="selectedBo"/>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="candidateStaff">
          <CandidateStaffBoSection :bo="selectedBo" :hideMapButton="true"/>
      </q-tab-panel>
  </q-tab-panels>
    </q-card>
  </q-scroll-area>
  </q-drawer>
</template>
<script setup lang="ts">
import { BackOrderModel, Client } from 'src/shared/model';
import { ref, watch } from 'vue';
import MapSearchs from 'src/pages/user/BackOrder/components/MapSearch.vue';
import CandidateStaffBoSection from './candidateStaffBoSection.vue';
import { mapDrawerValue } from '../../consts/BackOrder.const';

const props = defineProps<{
  modelValue: boolean,
  selectedBo: BackOrderModel | undefined
  client: Client | undefined
}>()

const tab = ref('candidateStaff');
const showDrawer = ref(props.modelValue)
const emit = defineEmits(['close'])

watch(()=>props.modelValue, (newVal)=>{
  showDrawer.value = newVal
})

watch(showDrawer,()=>{
  mapDrawerValue.value = showDrawer.value
})
</script>
<style>
aside{
  top:0
}
</style>
