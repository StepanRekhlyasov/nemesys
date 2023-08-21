<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  GoogleMap,
  Marker as Markers,
  Circle as Circles,
  CustomMarker,
} from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBackOrder } from 'src/stores/backOrder';
import { Timestamp, where } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';
import { BackOrderModel, Client } from 'src/shared/model';
import { myDateFormat } from 'src/shared/utils/utils';
import InfoBO from 'src/pages/user/BackOrder/components/info/InfoBO.vue';
import { radius } from 'src/pages/user/BackOrder/consts/BackOrder.const';
import SearchByMapDrawer from 'src/pages/user/BackOrder/components/info/searchByMapDrawer.vue';

const selectedClient = ref<Client | undefined>(undefined);
const showSearchByMap = ref<boolean>(false);
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);
const boList = ref<BackOrderModel[]>([])
const organization = useOrganization()
const backOrderStore = useBackOrder()
const props = defineProps<{ theme: string }>();
const emit = defineEmits<{ (e: 'updateMap', mapData) }>();
const center = ref<{ lat: number; lng: number }>({
  lat: 36.0835255,
  lng: 140.0,
});
const inputRadiusKm = ref<number>(10)
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
const locationLoading = ref<boolean>(false)

onMounted(async ()=>{
  const allBo = await backOrderStore.getBOByConstraints([where('deleted', '==', false), where('organizationId', '==', organization.currentOrganizationId)]);
  allBo.forEach((bo)=>{
        bo['dateOfRegistration'] = myDateFormat(
          bo['dateOfRegistration'] as Timestamp
        );
        bo['marker'] = 'white';
        if(bo['lat']){
          bo['lat'] = bo['lat'] + (Math.random() - 0.5) * 0.001,
          bo['lon'] = bo['lon'] + (Math.random() - 0.5) * 0.001,
          boList.value.push(bo)
      }
    })
    backOrderStore.state.BOList = allBo;
    inputRadiusKm.value = 10;
    radiusKm.value = 10;
    locationLoading.value = true;
    searchInput.value = await backOrderStore.getAddresses(center.value.lat,center.value.lng)
    locationLoading.value = false;
    getMarkerColor()
})

const isInsideCircle = (boLocation) => {
  const applicantLocation = { lat: center.value.lat, lon: center.value.lng }
  const distance = backOrderStore.getDistance(applicantLocation, boLocation);
  return distance <= radiusKm.value;
}

const getMarkerColor = () => {
  boList.value.forEach((bo) => {
    if (isInsideCircle(bo)) {
      bo.marker = 'primary';
    }
    else {
      bo.marker = 'white';
    }
  });
}

watch(radiusKm, (newVal) => {
  isLoadingProgress.value = true
  getMarkerColor();
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  emit('updateMap', { ...center, 'radiusInM': radiusInM })
  isLoadingProgress.value = false;
});

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  emit('updateMap', {
    ...center.value,
    radiusInM: radiusInM.value,
    ...circleOption.value['center'],
  });
  getMarkerColor()
};

const getBoMarkerOptions = (bo) => {
  const position = { lat: bo.lat, lng: bo.lon, anchorPoint: 'BOTTOM_CENTER' };
  return {
    position,
    draggable: false,
    clickable: true,
  };
}

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

const selectedBo = ref<BackOrderModel>();

function showDialog(bo: BackOrderModel) {
  selectedBo.value = bo;
  backOrderStore.state.selectedBo = bo
  infoDrawer.value?.openDrawer(bo);
}

const getRadius = () => {
  radiusKm.value = inputRadiusKm.value
}

const clearRadius = () => {
  inputRadiusKm.value = 0
  radiusKm.value = 0
}

const closeMap = () => {
  showSearchByMap.value = false;
  radius.value = 0;
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
        :loading="locationLoading"
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
        <CustomMarker v-for="bo in boList" :key="bo.boId" :options="getBoMarkerOptions(bo)">
          <q-icon :color="bo.marker" size="lg" name="place"  @click="showDialog(bo)"/>
        </CustomMarker>
        <Circles :options="circleOption" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      <div class="row">
        <div class="col-1 flex justify-end q-pa-sm">
          {{ $t('client.list.distanceFromOrigin') }}
        </div>
        <div class="col-3">
          <q-input outlined dense type="number" v-model.number="inputRadiusKm">
            <template v-slot:after> km </template>
          </q-input>
          <q-btn :disable="inputRadiusKm <= 0" @click="getRadius" class="bg-primary text-white q-ma-sm"
            :label="$t('common.search')" />
          <q-btn class="q-ma-sm" @click="clearRadius" :label="$t('common.clear')" />
        </div>
      </div>
    </q-card-section>
  </q-card>
  <InfoBO ref="infoDrawer" @openSearchByMap="showSearchByMap = true" @passClientToMapSearch="(clientValue) => {
    selectedClient = clientValue;
  }
    " :isHiddenDetails="false"/>
  <SearchByMapDrawer :modelValue="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="closeMap">
  </SearchByMapDrawer>
</template>
