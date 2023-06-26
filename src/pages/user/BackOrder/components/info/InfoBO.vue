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
              <div class="row text-subtitle2" v-if="client">
                {{ `${client['client_name']} / ${client['companyProfile']}` }}
              </div>
              <div class="row text-h6 text-weight-bold q-pr-xs">
                バックオーダー詳細／{{ selectedBo.type? $t(`backOrder.type.${selectedBo.type}`):'' }}
              </div>
            </div>
          </div>
        </q-card-section>
        <detailInfoBO :selectedBo="selectedBo" :client="client" @openSearchByMap="emit('openSearchByMap')"/>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { getFirestore } from 'firebase/firestore';
import { BackOrderModel, Client } from 'src/shared/model';
import { getClient } from 'src/shared/utils/Client.utils';
import { useBackOrder } from 'src/stores/backOrder';
import { computed, onMounted, ref } from 'vue';
import detailInfoBO from './detailInfoBO.vue';

const backOrderStore = useBackOrder();
const db = getFirestore();  
const emit = defineEmits(['closeDialog', 'openSearchByMap', 'passClientToMapSearch'])

const client = ref<Client | undefined>(undefined);
const selectedBo = computed(()=>backOrderStore.state.selectedBo);
const drawerRight = ref(false);


const openDrawer = async (data : BackOrderModel) => {
  if (selectedBo.value?.id && selectedBo.value.id !== data.id) {
    drawerRight.value = false;
  }
  backOrderStore.state.selectedBo = data;
  setTimeout(() => drawerRight.value = true, 300);
}
onMounted(async () => {
  if (selectedBo.value && selectedBo.value['clientId']){
    client.value = await getClient(db, selectedBo.value['clientId'])
    emit('passClientToMapSearch', client.value)
  }  
})

defineExpose({ openDrawer })

</script>