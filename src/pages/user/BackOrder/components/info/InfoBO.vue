<template>
  <q-drawer v-if="backOrderStore.state.selectedBo" v-model="drawerRight" show class="bg-grey-3" :width="1000"
    :breakpoint="500" side="right" overlay elevated bordered>
    <q-scroll-area class="fit text-left" v-if="selectedBo">
      <q-card class="no-shadow bg-grey-3">
        <q-card-section class="text-white bg-primary no-border-radius">
          <div class="wrapper row items-end justify-start">
            <div class="flex">
              <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
            </div>
            <div class="row q-mr-md">
                <div class="column">
                  <div v-if="selectedBo" class="text-subtitle2 q-mr-md">
                    {{ nameBo }}
                  </div>

                    <span class="text-h6 text-weight-bold">
                        <q-icon color="white" name="home"/>
                        {{ `${$t('backOrder.backOrderDetails')} / ${selectedBo.type ? $t(`backOrder.type.${selectedBo.type}`) : ''}` }}
                    </span>
                </div>
              </div>

              <div class="q-mr-md">
                  <div>
                      {{ t('client.list.phone') }} :
                      <span v-if="clientFactory"> {{ clientFactory.tel? clientFactory.tel:'' }}</span>
                  </div>
                  <div>
                      {{ t('client.list.fax') }} :
                      <span v-if="clientFactory">{{ clientFactory.fax? clientFactory.fax:'' }}</span>
                  </div>
              </div>

              <div>
                  <div v-if="clientFactory" class="q-ml-md text-bold">
                    {{ clientFactory.prefecture? clientFactory.prefecture:'' }} {{ clientFactory.municipality? clientFactory.municipality:'' }}
                  </div>
                  <div v-if="clientFactory" class="q-ml-md text-bold">
                    {{ clientFactory.street? clientFactory.street:'' }} {{ clientFactory.building? clientFactory.building:'' }}
                  </div>
              </div>
          </div>
        </q-card-section>
        <detailInfoBO_dispatch v-if="selectedBo.type === 'dispatch'" :isHiddenDetails="isHiddenDetails" @openSearchByMap="emit('openSearchByMap')"/>
        <detailInfoBO_referral v-if="selectedBo.type === 'referral'" :isHiddenDetails="isHiddenDetails" @openSearchByMap="emit('openSearchByMap')"/>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { getFirestore } from 'firebase/firestore';
import { BackOrderModel, Client, ClientFactory } from 'src/shared/model';
import { getClient } from 'src/shared/utils/Client.utils';
import { useApplicant } from 'src/stores/applicant';
import { useBackOrder } from 'src/stores/backOrder';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import detailInfoBO_dispatch from './detailInfoBO_dispatch.vue';
import detailInfoBO_referral from './detailInfoBO_referral.vue';
import { drawerValue } from '../../consts/BackOrder.const';
import { useClientFactory } from 'src/stores/clientFactory';

defineProps<{
  isHiddenDetails?: boolean,
}>()

const backOrderStore = useBackOrder();
const clientFactoryStore = useClientFactory();
const db = getFirestore();
const applicantStore = useApplicant();
const { t } = useI18n({ useScope: 'global' });
const emit = defineEmits(['closeDialog', 'openSearchByMap', 'passClientToMapSearch'])

const client = ref<Client | undefined>(undefined);
const clientFactoryList = ref<ClientFactory[]>([])
const clientFactory = ref<ClientFactory>()
const selectedBo = computed(() => backOrderStore.state.selectedBo);
const drawerRight = ref(false);

const nameBo = computed(() => {
  let clientName = t('backOrder.clientName');
  let officeName = t('backOrder.officeName');
  if (selectedBo.value?.client_id) {
    clientName = applicantStore.state.clientList.find(client => client.id === selectedBo.value?.client_id)?.name || '';
    if (selectedBo.value?.office_id) {
      officeName = clientFactoryList.value?.find(office => office.id === selectedBo.value?.office_id)?.name || ''
    }
  }
  return `${clientName} / ${officeName} / ${selectedBo.value?.boId}`
})

watch(drawerRight, async() => {
  drawerValue.value = drawerRight.value;
  if(drawerRight.value){
    clientFactoryList.value = await clientFactoryStore.getClientFactoryList(selectedBo.value.client_id)
    clientFactory.value = clientFactoryList.value.find(office=>office.id === selectedBo.value?.office_id) as ClientFactory;
    if(!clientFactory.value){
      clientFactory.value =  await clientFactoryStore.getModifiedCfWithId(selectedBo.value?.office_id)
    }
  }
})

const openDrawer = async (data: BackOrderModel) => {
  if (selectedBo.value?.id && selectedBo.value.id !== data.id) {
    drawerRight.value = false;
  }
  if (selectedBo.value && selectedBo.value['client_id']) {
    client.value = await getClient(db, selectedBo.value['client_id'])
    emit('passClientToMapSearch', client.value)
  }
  backOrderStore.state.selectedBo = data;
  drawerRight.value = true
}

watch(() => selectedBo, async () => {
  if (selectedBo.value && selectedBo.value.client_id) {
    clientFactoryList.value = await clientFactoryStore.getClientFactoryList(selectedBo.value.client_id)
  }
}, { deep: true, immediate: true })

defineExpose({ openDrawer })

</script>

<style scoped>

.right{
  position:absolute;
  right:0px
}

</style>
