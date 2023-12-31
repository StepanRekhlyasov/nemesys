<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { boMapDrawerValue } from '../const/index';
import { Timestamp, where } from 'firebase/firestore';
import { useBackOrder } from 'src/stores/backOrder';
import { Applicant, BackOrderModel, Client } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import InfoBO from 'src/pages/user/BackOrder/components/info/InfoBO.vue';
import SearchByMapDrawer from 'src/pages/user/BackOrder/components/info/searchByMapDrawer.vue';
import { radius } from 'src/pages/user/Applicant/const/index';
import { useOrganization } from 'src/stores/organization';
import { myDateFormat } from 'src/shared/utils/utils';
import boSearchList from './boSearchList.vue';

const tab = ref('boSearchList');
const props = defineProps<{ theme: string, applicant: Applicant }>()
const organization = useOrganization()
const emit = defineEmits<{ (e: 'updateMap', mapData) }>()
const center = ref<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
const searchRadius = ref<number>(0);
const inputRadius = ref<number>(0);
const isLoadingProgress = ref<boolean>(false)
const searchInput = ref<string>('')
const boList = ref<BackOrderModel[]>([])
const backOrderStore = useBackOrder()
const selectedClient = ref<Client | undefined>(undefined);
const showSearchByMap = ref<boolean>(false);
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);

watch(boMapDrawerValue, async () => {
  if (boMapDrawerValue.value) {
    const allBo = await backOrderStore.getBOByConstraints([where('deleted', '==', false), where('organizationId', '==', organization.currentOrganizationId)]);
    allBo.forEach((bo)=>{
        bo['dateOfRegistration'] = myDateFormat(
          bo['dateOfRegistration'] as Timestamp
        );
        bo['marker'] = 'white';
        if(bo['lat']){
        boList.value.push(bo)
      }
    })
    backOrderStore.state.BOList = allBo;
    searchRadius.value = 0;
    inputRadius.value = 0;
    await getApplicantLocation();
  }
})

onMounted(async () => {
  isLoadingProgress.value = true
  await getApplicantLocation();
  isLoadingProgress.value = false;

})

const getApplicantLocation = async () => {
  const applicantLocation = {lat:props.applicant?.lat, lng:props.applicant?.lon}
  searchInput.value = `${props.applicant?.address}`;
  if (applicantLocation) {
    center.value = {
      lat: Number(applicantLocation.lat),
      lng: Number(applicantLocation.lng)
    }
  }
  getMarkerColor()
}

const circleOption = computed(() => {
  return {
    center: center.value,
    radius: searchRadius.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  };
});

const isInsideCircle = (boLocation) => {
  const applicantLocation = { lat: center.value.lat, lon: center.value.lng }
  const distance = backOrderStore.getDistance(applicantLocation, boLocation);
  return distance <= searchRadius.value;
}

const getBoMarkerOptions = (bo) => {
  const position = { lat: bo.lat, lng: bo.lon, anchorPoint: 'BOTTOM_CENTER' };
  return {
    position,
    draggable: false,
    clickable: true,
  };
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

watch(searchRadius, (newVal) => {
  isLoadingProgress.value = true
  radius.value = searchRadius.value
  getMarkerColor();
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  emit('updateMap', { ...center, 'radiusInM': searchRadius.value * 1000 })
  isLoadingProgress.value = false;
});

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  emit('updateMap', { ...center.value, 'radiusInM': searchRadius.value * 1000 })
  getMarkerColor()
}

const getRadius = () => {
  searchRadius.value = inputRadius.value
}

const clearRadius = () => {
  searchRadius.value = 0
  inputRadius.value = 0
}

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
      getMarkerColor();
    } else {
      Alert.warning()
    }
  });
  isLoadingProgress.value = false
}

const clear = () => {
  searchInput.value = '';
  getApplicantLocation();
}

const closeMap = () => {
  showSearchByMap.value = false;
  radius.value = 0;
};

const selectedBo = ref<BackOrderModel>();

function showDialog(bo: BackOrderModel) {
  selectedBo.value = bo;
  backOrderStore.state.selectedBo = bo
  infoDrawer.value?.openDrawer(bo);
}

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm bg-grey-3">
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>
    <q-card-section class="row search">
      <q-input class="q-mr-md searchBox" outlined v-model="searchInput" dense prefix-icon="mdi-map-marker">
        <template v-slot:prepend>
          <q-btn flat icon='place' :color="props.theme"></q-btn>
        </template>
      </q-input>
      <q-btn :disable="searchInput == ''" @click="setLocation" class="bg-primary text-white q-mr-md"
        :label="$t('common.search')" />
      <q-btn @click="clear" :label="$t('common.clear')" />
    </q-card-section>
    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center"
        :zoom="9.6">
        <Markers :options="{ position: center, draggable: true, clickable: true }" @dragend="markerDrag" />
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
        <div class="col-3 row">
          <q-input outlined dense type="number" v-model="inputRadius">
            <template v-slot:after>
              Km
            </template>
          </q-input>
          <q-btn :disable="inputRadius <= 0" @click="getRadius" class="bg-primary text-white q-ma-sm"
            :label="$t('common.search')" />
          <q-btn class="q-ma-sm" @click="clearRadius" :label="$t('common.clear')" />
        </div>
      </div>
      <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="boSearchList">
            <boSearchList :applicant="applicant" :boList="boList" :hideMapButton="true" />
          </q-tab-panel>
        </q-tab-panels>
    </q-card-section>
  </q-card>

  <InfoBO ref="infoDrawer" @openSearchByMap="showSearchByMap = true" @passClientToMapSearch="(clientValue) => {
    selectedClient = clientValue;
  }
    " :isHiddenDetails="true"/>
  <SearchByMapDrawer :modelValue="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="closeMap">
  </SearchByMapDrawer>
</template>

<style scoped>
.search {
  width: 100%;
  padding-bottom: 0%;
}

.searchBox {
  width: 70%;
}

.staff-marker-label {
  position: absolute;
  top: -28px;
  left: -12px;
  font-size: 12px;
  font-weight: bold;
  color: rgb(236, 232, 232);
  background-color: rgb(20, 17, 17);
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
