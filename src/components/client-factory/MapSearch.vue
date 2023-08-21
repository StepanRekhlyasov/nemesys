<script lang="ts" setup>
import { ref, computed, watch, defineProps, withDefaults, onMounted } from 'vue';
import {ActionsType} from './types'
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
import { api } from 'src/boot/axios';
import { getAuth } from '@firebase/auth';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Client } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { storeToRefs } from 'pinia'
import { useClient } from 'src/stores/client';
import { useClientFactory } from 'src/stores/clientFactory';
import { useRouter} from 'vue-router';
import { useAdvanceSearch } from 'src/stores/advanceSearch';
import { useAdvanceSearchAdmin } from 'src/stores/advanceSearchAdmin';
import { useBackOrder } from 'src/stores/backOrder';

const router = useRouter()
const props = withDefaults(defineProps<{
  actionsType?: ActionsType,
  theme: string,
  from:string
}>(), {
  actionsType:ActionsType.CLIENT,
  theme:'primary'
})
const emit = defineEmits<{
  (e: 'openCFDrawer', ClientFactoryData: ClientFactory),
  (e: 'hideDrawer'),
  (e: 'openCSDrawer'),
  (e: 'resetKey'),
}>()
const advanceSearch = props.actionsType === ActionsType.CLIENT?useAdvanceSearch():useAdvanceSearchAdmin();
const center = ref<{ lat: number, lng: number }>({ lat: 36.0835255, lng: 140.0 });
const officeData = ref<Client[]>([]);
const isLoadingProgress = ref(false)
const backOrderStore = useBackOrder()
const clientFactoryStore = useClientFactory()
const { clientFactories } = storeToRefs(clientFactoryStore)
const clientStore = useClient()
const { clients } = storeToRefs(clientStore)

const locationLoading = ref<boolean>(false)
const clientFactoriesList = ref<ClientFactory[]>([]);
const radiusKm = ref<number>(10);
const inputRadiusKm = ref<number>(10);
const radiusInM = computed(() => radiusKm.value * 1000);
const searchInput = ref('');
const circleOption = computed(() => {
  return {
    center: center.value,
    radius: radiusInM.value,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  };
});

onMounted(async()=>{
  locationLoading.value = true;
  searchInput.value = await backOrderStore.getAddresses(center.value.lat,center.value.lng)
  locationLoading.value = false;
})

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
}

const searchClients = async () => {
  isLoadingProgress.value = true

  const auth = getAuth();
  const user = auth.currentUser;
  if (user == null) {
    return false
  }
  const token = await user.getIdToken();

  let data = { ...center.value, 'radiusInM': radiusInM.value }

  try {
    const response = await api.post(
      searchConfig.getOfficeDataURL,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000,
      }
    )

    officeData.value = response.data
    isLoadingProgress.value = false
  } catch (error) {
    isLoadingProgress.value = false

    console.error('Failed to create user', error);
    Alert.warning(error)
  }
};

const setLocation = () => {
  if (!searchInput.value) {
    return
  }
  isLoadingProgress.value = true
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: searchInput.value }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const place = results[0];
      center.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      // mapCenter.value = location.value;
    } else {
      Alert.warning()
    }
  });
  isLoadingProgress.value = false
}

const openDrawer = (office: ClientFactory) => {
  emit('openCFDrawer', office)
}
const getColor = (clientFactoryId: string) => {
  const found = officeData.value.find(x => x.id === clientFactoryId);
  if (found) {
    return props.theme
  }
  return 'white'
}
const searchClientsByCondition = async() =>{
  if(props.from=='advance'){
    advanceSearch.advanceMapSelected=true;
    advanceSearch.advanceMapCFs=officeData.value;
    emit('hideDrawer')
    return;
  }
  let office:string[] = []
  officeData.value.forEach((data)=>{
    const id = data.id || '';
    office.push(id)
  })
  if(advanceSearch.mapCSelected){
    await advanceSearch.searchClients(office,'map');
  }
  else if(props.actionsType === ActionsType.ADMIN){
    clientFactoryStore.adminCondition = true
    clientFactoryStore.adminSelectedCFsId = office
    router.push('/admin/client-factories')
  }
  else{
    clientFactoryStore.condition = true
    clientFactoryStore.selectedCFsId = office
    router.push('/client-factories')
  }
}
watch([clientFactories], () => {
  clientFactoriesList.value = []
  clientFactories.value.forEach((clientFactory) => {
    if (clientFactory.geohash) {
      clientFactoriesList.value.push(clientFactory)
    }
  })
}, { deep: true, immediate: true })

watch([clients], () => {
  isLoadingProgress.value = true
  clientFactoryStore.getClientFactories(clients.value).then(() => {
    isLoadingProgress.value = false
  })
}, { deep: true, immediate: true });


watch([center], () => {
  searchClients()
}, { deep: true, immediate: true });

watch([radiusKm], () => {
  searchClients()
});

const getRadius = () => {
  radiusKm.value = inputRadiusKm.value
}

const clearRadius = () => {
  radiusKm.value = 0
  inputRadiusKm.value = 0
}

const openCSDrawer = () =>{
  emit('openCSDrawer')
}
const resetConditionData = () => {
  advanceSearch.resetMap()
  emit('resetKey')
}
</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions v-if="props.from == 'advance'">
      <q-btn :label="$t('client.list.addConditions')" unelevated :color="props.theme" class="no-shadow text-weight-bold"
          icon="add" @click="searchClientsByCondition"/>
    </q-card-actions>
    <q-card-actions v-else>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated :color="props.theme"
        class="no-shadow text-weight-bold" icon="add" @click="openCSDrawer"/>
      <q-btn :label="$t('client.list.searchByCondition')" outline :color="props.theme" class="text-weight-bold"
        @click="searchClientsByCondition" />
      <q-btn :label="$t('client.list.resetConditions')" outline color="red" class="text-weight-bold"
        @click="resetConditionData" v-if="advanceSearch.mapCSelected"/>
    </q-card-actions>
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>
    <div class='row flex q-pl-md'>
      <q-input type='text' v-model="searchInput" style="width:30vw" outlined dense :color="props.theme" :loading="locationLoading">
        <template v-slot:prepend>
          <q-btn flat icon='place' :color="props.theme"></q-btn>
        </template>
      </q-input>
      <q-btn :color="props.theme" @click='setLocation' :label="$t('common.search')" class="q-ml-sm" />
      <q-btn @click="() => { searchInput = '' }" style="margin-left:10px" :label="$t('common.clear')" :color="props.theme"
        outline />
    </div>

    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center"
        :zoom="10">
        <Markers :options="{ position: center, draggable: true, clickable: true }" @dragend="markerDrag" />
        <CustomMarker :key="clientFactory.geohash" :options="{
          position: {
            lat: clientFactory.lat,
            lng: clientFactory.lon,
            anchorPoint: 'BOTTOM_CENTER'
          },
        }" v-for="clientFactory in clientFactoriesList">
          <q-icon :color="getColor(clientFactory.id)" size="lg" name="place" @click="openDrawer(clientFactory)" />
        </CustomMarker>
        <Circles :options="circleOption" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      <div class="row">
        <div class="col-1 flex justify-end q-pa-sm">
          {{ $t('client.list.distanceFromOrigin') }}
        </div>
        <div class="col-3 row">
          <q-input outlined dense type="number" v-model.number="inputRadiusKm">
            <template v-slot:after>
              Km
            </template>
          </q-input>
          <q-btn :disable="inputRadiusKm <= 0" @click="getRadius" class="text-white q-ma-sm" :color="props.theme"
            :label="$t('common.search')" />
          <q-btn class="q-ma-sm" @click="clearRadius" :label="$t('common.clear')" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

