<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles } from 'vue3-google-map';
import { api } from 'src/boot/axios';
import { getAuth } from '@firebase/auth';
import { mapSearchConfig } from 'src/shared/constants/MapSearchAPI';

const props = defineProps(['theme'])
const emit = defineEmits(['getClients'])

const center = ref<{lat: number, lng: number}>({ lat: 36.0835255, lng: 140.0 });
const radius = ref<number>(500);
const officeData = ref([]);
const circleOption = ref({
  center: center,
  radius: radius,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.05,
});

watch(radius, (newVal) => {
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  circleOption.value = {
    center: center,
    radius: newVal,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }
});

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  circleOption.value = {
    center: center.value,
    radius: radius.value,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }
}

const searchClients = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user == null) {
    return false
  }
  let token = await user.getIdToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  let data = { ...center.value, 'radiusInM': radius.value }
  api.post(
    mapSearchConfig.getOfficeDataURL, //getOfficeDataURL,
    data,
    {
      headers: headers,
      timeout: 30000,
    }
  )
    .then((response) => {
      if (response.status === 200) {
        officeData.value = response.data
        emit('getClients', response.data)
      } else {
        console.error(response.statusText)
      }
    })
    .catch((error) => {
      console.error('Failed to create user', error);
    });
  return false;
};
</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated :color="props.theme" class="no-shadow text-weight-bold" icon="add" />
      <q-btn :label="$t('client.list.searchByCondition')" outline :color="props.theme" class="text-weight-bold" @click="searchClients" />
    </q-card-actions>
    <q-separator />

    <q-card-section>
      <GoogleMap :api-key="mapSearchConfig.apiKey" style="width: 100%; height: 450px" :center="center" :zoom="15">
        <Markers :options="{ position: center, draggable: true, clickable: true }" @dragend="markerDrag" />
        <Circles :options="circleOption" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      <div class="row">
        <div class="col-1 flex justify-end q-pa-sm">
          {{ $t('client.list.distanceFromOrigin') }}
        </div>
        <div class="col-2">
          <q-input outlined dense type="number" v-model="radius">
            <template v-slot:after>
              m
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

