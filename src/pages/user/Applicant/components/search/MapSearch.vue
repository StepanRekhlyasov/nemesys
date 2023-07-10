<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles } from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';

const props = defineProps<{theme: string}>()
const emit = defineEmits<{(e: 'updateMap', mapData)}>()

const center = ref<{lat: number, lng: number}>({ lat: 36.0835255, lng: 140.0 });
const radius = ref<number>(500);
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

  emit('updateMap', { ...center, 'radiusInM': radius.value })
});

const markerDrag = (event) => {
  console.log('sdsdasdsaddsadds')
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
  console.log(circleOption.value)

  emit('updateMap', { ...center.value, 'radiusInM': radius.value })
}

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm bg-grey-3">
    <div style="height: 5px;">
        <q-separator v-if="!isLoadingProgress"/>
        <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>

    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center" :zoom="15">
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

