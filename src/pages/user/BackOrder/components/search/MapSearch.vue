<script lang="ts" setup>
import { ref, computed } from 'vue';
import {
  GoogleMap,
  Marker as Markers,
  Circle as Circles,
} from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{ theme: string }>();
const emit = defineEmits<{ (e: 'updateMap', mapData) }>();
const center = ref<{ lat: number; lng: number }>({
  lat: 36.0835255,
  lng: 140.0,
});
const radiusKm = ref<number>(10);
const radiusInM = computed(() => radiusKm.value * 1000);
const isLoadingProgress = ref(false);
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
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  emit('updateMap', {
    ...center.value,
    radiusInM: radiusInM.value,
    ...circleOption.value['center'],
  });
};

const setLocation = () => {
  if (!searchInput.value) {
    return false;
  }
  isLoadingProgress.value = true;
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: searchInput.value }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const place = results[0];
      center.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    } else {
      Alert.warning();
    }
  });
  isLoadingProgress.value = false;
};
</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm bg-grey-3">
    <div style="height: 5px">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress
        v-if="isLoadingProgress"
        indeterminate
        rounded
        :color="props.theme"
      />
    </div>
    <div class="row flex q-pl-md">
      <q-input
        type="text"
        v-model="searchInput"
        style="width: 30vw"
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-btn color="primary" flat icon="place"></q-btn>
        </template>
      </q-input>
      <q-btn
        color="primary"
        @click="setLocation"
        :label="$t('common.search')"
        class="q-ml-sm"
      />
      <q-btn
        @click="
          () => {
            searchInput = '';
          }
        "
        style="margin-left: 10px"
        :label="$t('common.clear')"
      />
    </div>

    <q-card-section>
      <GoogleMap
        :api-key="searchConfig.apiKey"
        style="width: 100%; height: 50vh; width: 100%"
        :center="center"
        :zoom="10"
      >
        <Markers
          :options="{ position: center, draggable: true, clickable: true }"
          @dragend="markerDrag"
        />
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
            <template v-slot:after> km </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
