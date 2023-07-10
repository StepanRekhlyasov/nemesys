<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits, onMounted } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles } from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { radius } from '../consts/BackOrder.const'
import { BackOrderModel } from 'src/shared/model';
import { useClient } from 'src/stores/client'
import { mapDrawerValue } from '../consts/BackOrder.const';

const props = defineProps<{ theme: string, bo: BackOrderModel | undefined }>()
const emit = defineEmits<{ (e: 'updateMap', mapData) }>()
const center = ref<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
const radius1 = ref<number>(0);
const isLoadingProgress = ref(false)
const getClient = useClient();

watch(mapDrawerValue, async () => {
  if (mapDrawerValue.value) {
    radius1.value = 0;
    await getClientLocation();
  }
})

onMounted(async () => {
  await getClientLocation();
})

const getClientLocation = async () => {
  const client = await getClient.fetchClientsById(props.bo?.client_id);
  if (client.lat && client.lng) {
    center.value = {
      lat: Number(client.lat),
      lng: Number(client.lng)
    }
  }
}

const circleOption = ref({
  center: center,
  radius: radius1,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.05,
});

watch(radius1, (newVal) => {
  radius.value = radius1.value
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  circleOption.value = {
    center: center,
    radius: radius1.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }

  emit('updateMap', { ...center, 'radiusInM': radius1.value * 1000 })
});

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  circleOption.value = {
    center: center.value,
    radius: radius1.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }

  emit('updateMap', { ...center.value, 'radiusInM': radius1.value * 1000 })
}


</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm bg-grey-3">
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>

    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center"
        :zoom="15">
        <Markers :options="{ position: center, draggable: true, clickable: true }" @dragend="markerDrag" />
        <Circles :options="circleOption" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      <div class="row">
        <div class="col-1 flex justify-end q-pa-sm">
          {{ $t('client.list.distanceFromOrigin') }}
        </div>
        <div class="col-3 row">
          <q-input outlined dense type="number" v-model="radius1">
            <template v-slot:after>
              Km
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

