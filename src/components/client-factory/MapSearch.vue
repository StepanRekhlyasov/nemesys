<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
import { api } from 'src/boot/axios';
import { getAuth } from '@firebase/auth';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Client } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{theme: string}>()
const emit = defineEmits<{(e: 'getClients', clients: Client[])}>()

const center = ref<{lat: number, lng: number}>({ lat: 36.0835255, lng: 140.0 });
const officeData = ref<Client[]>([]);
const isLoadingProgress = ref(false)

const radiusKm = ref<number>(10);
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
    emit('getClients', response.data)
  } catch(error) {
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

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated :color="props.theme" class="no-shadow text-weight-bold" icon="add" />
      <q-btn :label="$t('client.list.searchByCondition')" outline :color="props.theme" class="text-weight-bold" @click="searchClients" />
    </q-card-actions>
    <div style="height: 5px;">
        <q-separator v-if="!isLoadingProgress"/>
        <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>
    <div class='row flex q-pl-md'>
      <q-input type='text' v-model="searchInput" style="width:30vw" outlined dense>
        <template v-slot:prepend>
          <q-btn color='primary' flat icon='place'></q-btn>
        </template>
      </q-input>
      <q-btn color='primary' @click='setLocation' :label="$t('common.search')" class="q-ml-sm" />
      <q-btn @click="() => { searchInput = '' }" style="margin-left:10px" :label="$t('common.clear')" />
    </div>

    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center" :zoom="10">
        <Markers :options="{ position: center, draggable: true, clickable: true }" @dragend="markerDrag" />
        <CustomMarker 
          :key="office.geohash"
          :options="{
            position: {
              lat: office.lat,
              lng: office.lon,
              anchorPoint: 'BOTTOM_CENTER'
            },
          }"
          v-for="office in officeData">
            <q-icon :color="theme" size="lg" name="place"/>
        </CustomMarker>
        <Circles :options="circleOption" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      <div class="row">
        <div class="col-1 flex justify-end q-pa-sm">
          {{ $t('client.list.distanceFromOrigin') }}
        </div>
        <div class="col-2">
          <q-input outlined dense type="number" v-model.number="radiusKm">
            <template v-slot:after>
              Km
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

