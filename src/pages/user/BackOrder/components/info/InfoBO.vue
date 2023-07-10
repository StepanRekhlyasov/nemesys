<template>
  <q-drawer v-if="backOrderStore.state.selectedBo" v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
    bordered>
    <q-scroll-area class="fit text-left" v-if="selectedBo">
      <q-card class="no-shadow bg-grey-3">
        <q-card-section class="text-white bg-primary no-border-radius">
          <div class="row">
            <div class="flex items-end ">
              <q-btn dense flat icon="close" class="q-mr-md " @click="drawerRight=!drawerRight"/>
            </div>
            <div>
              <div class="row text-subtitle2" v-if="selectedBo">
                {{ nameBo }}
              </div>
              <div class="row text-h6 text-weight-bold q-pr-xs">
                {{ `${$t('backOrder.backOrderDetails')} ${selectedBo.type? $t(`backOrder.type.${selectedBo.type}`):''}` }}
              </div>
            </div>
          </div>
        </q-card-section>
        <detailInfoBO @openSearchByMap="emit('openSearchByMap')"/>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { getFirestore } from 'firebase/firestore';
import { BackOrderModel, Client } from 'src/shared/model';
import { getClient } from 'src/shared/utils/Client.utils';
import { useApplicant } from 'src/stores/applicant';
import { useBackOrder } from 'src/stores/backOrder';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import detailInfoBO from './detailInfoBO.vue';
import { drawerValue } from '../../consts/BackOrder.const';

const backOrderStore = useBackOrder();
const db = getFirestore();
const applicantStore = useApplicant();
const { t } = useI18n({ useScope: 'global' });
const emit = defineEmits(['closeDialog', 'openSearchByMap', 'passClientToMapSearch'])

const client = ref<Client | undefined>(undefined);
const selectedBo = computed(()=>backOrderStore.state.selectedBo);
const drawerRight = ref(false);

const nameBo = computed(() => {
  let clientName = t('backOrder.clientName');
  let officeName = t('backOrder.officeName');
  if (selectedBo.value?.client_id) {
    clientName = applicantStore.state.clientList.find(client => client.id === selectedBo.value?.client_id)?.name || '';
    const offices = applicantStore.state.clientList.find(client => client.id === selectedBo.value?.client_id)?.office
    if (selectedBo.value?.office_id){
      officeName = offices?.find(office => office.id === selectedBo.value?.office_id)?.name || ''
    }
  }
  return `${clientName} / ${officeName} / ${selectedBo.value?.boId}`
})

watch(drawerRight,()=>{
  drawerValue.value = drawerRight.value;
})

const openDrawer = async (data : BackOrderModel) => {
  if (selectedBo.value?.id && selectedBo.value.id !== data.id) {
    drawerRight.value = false;
  }
  backOrderStore.state.selectedBo = data;
  drawerRight.value = true
}

onMounted(async () => {
  if (selectedBo.value && selectedBo.value['client_id']){
    client.value = await getClient(db, selectedBo.value['client_id'])
    emit('passClientToMapSearch', client.value)
  }
})

defineExpose({ openDrawer })

</script>
