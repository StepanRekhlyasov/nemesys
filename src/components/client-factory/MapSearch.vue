<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
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

const props = defineProps<{ theme: string }>()
const emit = defineEmits<{ (e: 'getClients', clients: Client[]), (e: 'openCFDrawer', ClientFactoryData: ClientFactory) }>()

const center = ref<{ lat: number, lng: number }>({ lat: 36.0835255, lng: 140.0 });
const officeData = ref<Client[]>([]);
const isLoadingProgress = ref(false)

const clientFactoryStore = useClientFactory()
const { clientFactories } = storeToRefs(clientFactoryStore)
const clientStore = useClient()
const { clients } = storeToRefs(clientStore)

const clientFactoriesList = ref<ClientFactory[]>([]);
const radiusKm = ref<number>(10);
const inputRadius = ref<number>(10);
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
  radiusKm.value = inputRadius.value
}

const clearRadius = () => {
  radiusKm.value = 0
  inputRadius.value = 0
}

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated :color="props.theme"
        class="no-shadow text-weight-bold" icon="add" />
      <q-btn :label="$t('client.list.searchByCondition')" outline :color="props.theme" class="text-weight-bold"
        @click="searchClients" />
    </q-card-actions>
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>
    <div class='row flex q-pl-md'>
      <q-input type='text' v-model="searchInput" style="width:30vw" outlined dense :color="props.theme">
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
          <q-input outlined dense type="number" v-model.number="inputRadius">
            <template v-slot:after>
              Km
            </template>
          </q-input>
          <q-btn :disable="inputRadius<=0" @click="getRadius" class="bg-primary text-white q-ma-sm" :label="$t('common.search')"/>
          <q-btn class="q-ma-sm" @click="clearRadius" :label="$t('common.clear')"/>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

