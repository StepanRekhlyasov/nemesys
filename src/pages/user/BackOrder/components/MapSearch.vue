<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits, onMounted } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, InfoWindow } from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { radius } from '../consts/BackOrder.const'
import { BackOrderModel, ApplicantForCandidateSearch } from 'src/shared/model';
import { useClient } from 'src/stores/client'
import { mapDrawerValue } from '../consts/BackOrder.const';
import { where } from 'firebase/firestore';
import { useApplicant } from 'src/stores/applicant'
import { useBackOrder } from 'src/stores/backOrder';
import { Applicant } from 'src/shared/model';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';

const props = defineProps<{ theme: string, bo: BackOrderModel | undefined }>()
const emit = defineEmits<{ (e: 'updateMap', mapData) }>()
const center = ref<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
const searchRadius = ref<number>(0);
const inputRadius = ref<number>(0);
const isLoadingProgress = ref(false)
const getClient = useClient();
const searchArea = ref('')
const staffList = ref<ApplicantForCandidateSearch[]>([])
const getApplicant = useApplicant();
const backOrderStore = useBackOrder()
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);

watch(mapDrawerValue, async () => {
  if (mapDrawerValue.value) {
    searchRadius.value = 0;
    await getClientLocation();
    staffList.value = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]) as ApplicantForCandidateSearch[];
      staffList.value.forEach((staff) => {
        staff['marker'] = 'yellow';
      });
  }
})

onMounted(async () => {
  await getClientLocation();

})

const getClientLocation = async () => {
  const client = await getClient.fetchClientsById(props.bo?.client_id);
  searchArea.value = `${client.building} ${client.street} ${client.municipality} ${client.prefecture}`;
  if (client.lat && client.lng) {
    center.value = {
      lat: Number(client.lat),
      lng: Number(client.lng)
    }
  }
}

const circleOption = ref({
  center: center,
  radius: searchRadius,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.05,
});

const isInsideCircle = (staffLocation) => {
  const clientLocation = {lat:center.value.lat, lon:center.value.lng}
  const distance = backOrderStore.getDistance(clientLocation, staffLocation);
  return distance<=searchRadius.value;
}

const getStaffMarkerOptions = (staff) => {
  const position = { lat: staff.lat, lng: staff.lon };
  const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${staff.marker}-dot.png`;
  // console.log(staffList.value[0])
  return {
    position,
    draggable: false,
    clickable: true,
    icon: {
      url: iconUrl,
    },
  };
}

watch(searchRadius, (newVal) => {

  staffList.value.forEach((staff) => {
    if(isInsideCircle(staff)){
      staff.marker = 'blue';
    }
    else{
      staff.marker = 'yellow';
    }
  });

  radius.value = searchRadius.value
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  circleOption.value = {
    center: center,
    radius: searchRadius.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }

  emit('updateMap', { ...center, 'radiusInM': searchRadius.value * 1000 })
});

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  circleOption.value = {
    center: center.value,
    radius: searchRadius.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  }

  emit('updateMap', { ...center.value, 'radiusInM': searchRadius.value * 1000 })
}

const getRadius = () => {
  searchRadius.value = inputRadius.value
}

const clearRadius = () => {
  searchRadius.value = 0
  inputRadius.value = 0
}

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};

const searchOnMap = async () => {
    // if (searchArea.value) {
    //   const response = await fetch(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //       searchArea.value
    //     )}&key=${searchConfig.apiKey}`
    //   );
    //   const data = await response.json();
    //   if (data.status === "OK" && data.results.length > 0) {
    //     const result = data.results[0];
    //     center.value = {
    //       lat: result.geometry.location.lat,
    //       lng: result.geometry.location.lng,
    //     };
    //     emit("updateMap", { ...center.value, 'radiusInM': searchRadius.value * 1000 });
    //   }
    // }
  };

const clear = () => {
  searchArea.value = '';
}

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm bg-grey-3">
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>
    <q-card-section class="row search">
      <q-input class="q-mr-md searchBox" outlined v-model="searchArea" dense prefix-icon="mdi-map-marker"/>
      <q-btn :disable="searchArea==''" @click="searchOnMap" class="bg-primary text-white q-mr-md" :label="$t('common.search')"/>
      <q-btn @click="clear" :label="$t('common.clear')"/>
    </q-card-section>
    <q-card-section>
      <GoogleMap :api-key="searchConfig.apiKey" style="width: 100%; height: 50vh; width: 100%;" :center="center"
        :zoom="9.6">
        <Markers :options="{ position: center, draggable: false, clickable: true }" @dragend="markerDrag" />
        <Markers v-for="staff in staffList" :key="staff.id" :options="getStaffMarkerOptions(staff)">
          <InfoWindow>
            <q-btn @click="openDrawer(staff)" id="staff-marker-label" :label="staff.name"/>
          </InfoWindow>
        </Markers>
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
          <q-btn :disable="inputRadius<=0" @click="getRadius" class="bg-primary text-white q-ma-sm" :label="$t('common.search')"/>
          <q-btn class="q-ma-sm" @click="clearRadius" :label="$t('common.clear')"/>
        </div>
      </div>
    </q-card-section>
    <ApplicantDetails :bo="bo" ref="detailsDrawer" />
  </q-card>
</template>

<style scoped>
.search{
  width: 100%;
  padding-bottom: 0%;
}
.searchBox{
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
