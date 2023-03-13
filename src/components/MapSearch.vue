<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
import { api } from 'src/boot/axios';
import { getAuth } from '@firebase/auth';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Client } from 'src/shared/model';

const props = defineProps<{theme: string}>()
const emit = defineEmits<{(e: 'getClients', clients)}>()

const center = ref<{lat: number, lng: number}>({ lat: 36.0835255, lng: 140.0 });
const radius = ref<number>(500);
const officeData = ref<Client[]>([]);
const isLoadingProgress = ref(false)

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
    radius: radius.value,
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
  isLoadingProgress.value = true

  const auth = getAuth();
  const user = auth.currentUser;
  if (user == null) {
    return false
  }
  const token = await user.getIdToken();

  let data = { ...center.value, 'radiusInM': radius.value }

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
  }
};
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

    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center" :zoom="15">
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
          <q-input outlined dense type="number" v-model.number="radius">
            <template v-slot:after>
              m
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

