<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
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
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{ theme: string, bo: BackOrderModel | undefined }>()
const emit = defineEmits<{ (e: 'updateMap', mapData) }>()
const center = ref<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
const searchRadius = ref<number>(0);
const inputRadius = ref<number>(0);
const isLoadingProgress = ref(false)
const getClient = useClient();
const searchInput = ref('')
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
      staff['marker'] = 'white';
    });
  }
})

onMounted(async () => {
  isLoadingProgress.value = true
  await getClientLocation();
  isLoadingProgress.value = false;

})

const getClientLocation = async () => {
  const client = await getClient.fetchClientsById(props.bo?.client_id);
  searchInput.value = `${client.building} ${client.street} ${client.municipality} ${client.prefecture}`;
  if (client.lat && client.lng) {
    center.value = {
      lat: Number(client.lat),
      lng: Number(client.lng)
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

const isInsideCircle = (staffLocation) => {
  const clientLocation = { lat: center.value.lat, lon: center.value.lng }
  const distance = backOrderStore.getDistance(clientLocation, staffLocation);
  return distance <= searchRadius.value;
}

const getStaffMarkerOptions = (staff) => {
  const position = { lat: staff.lat, lng: staff.lon, anchorPoint: 'BOTTOM_CENTER' };
  return {
    position,
    draggable: false,
    clickable: true,
  };
}

const getMarkerColor = () => {
  staffList.value.forEach((staff) => {
    if (isInsideCircle(staff)) {
      staff.marker = 'primary';
    }
    else {
      staff.marker = 'white';
    }
  });
}

watch(searchRadius, (newVal) => {
  isLoadingProgress.value = true
  getMarkerColor();
  radius.value = searchRadius.value
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

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
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
      getMarkerColor();
    } else {
      Alert.warning()
    }
  });
  isLoadingProgress.value = false
}



const clear = () => {
  searchInput.value = '';
  getClientLocation();
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
        <CustomMarker v-for="staff in staffList" :key="staff.id" :options="getStaffMarkerOptions(staff)">
          <q-icon :color="staff.marker" size="lg" name="place" @click="openDrawer(staff)" />
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
    </q-card-section>
    <ApplicantDetails :bo="bo" ref="detailsDrawer" />
  </q-card>
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
