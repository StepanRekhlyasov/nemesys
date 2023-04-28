<template>
  <q-scroll-area class="fit text-left" v-if="selectedBo">
    <q-card class="no-shadow bg-grey-3">
      <q-card-section class="text-white bg-primary no-border-radius">
        <div class="row">
          <div class="flex items-end ">
            <q-btn dense flat icon="close" class="q-mr-md " @click="emits('closeDialog')"/>
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
      <q-card-section class="bg-white">
        <detailInfoBOVue :selectedBo="selectedBo" :client="client" />
      </q-card-section>
    </q-card>
  </q-scroll-area>
  
</template>

<script lang="ts" setup>
import { getFirestore } from 'firebase/firestore';
import { BackOrderModel, Client } from 'src/shared/model';
import { getClient } from 'src/shared/utils/Client.utils';
import { ref } from 'vue';
import detailInfoBOVue from './detailInfoBO.vue';

const props = defineProps<{
  selectedBo: BackOrderModel
}>()
const db = getFirestore();  
const emits = defineEmits(['closeDialog'])
const client = ref<Client>();


if (props.selectedBo['clientId']){
  client.value = await getClient(db, props.selectedBo['clientId'])
}

</script>

<style>

</style>