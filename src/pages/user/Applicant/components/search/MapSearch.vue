<script lang="ts" setup>
import { watch, ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import { GoogleMap, Marker as Markers, Circle as Circles, CustomMarker } from 'vue3-google-map';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBackOrder } from 'src/stores/backOrder';
import { where } from 'firebase/firestore';
import { useApplicant } from 'src/stores/applicant'
import { Applicant } from 'src/shared/model';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';

const backOrderStore = useBackOrder()
const props = defineProps<{ theme: string }>()
const emit = defineEmits<{ (e: 'updateMap', mapData) }>()

const center = ref<{ lat: number, lng: number }>({ lat: 36.0835255, lng: 140.0 });
const radius = ref<number>(10);
const inputRadius = ref<number>(10);
const isLoadingProgress = ref(false)
const searchInput = ref('')

const applicantList = ref<Applicant[]>([])
const getApplicant = useApplicant();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};

const isInsideCircle = (applicantLocation) => {
  const clientLocation = { lat: center.value.lat, lon: center.value.lng }
  const distance = backOrderStore.getDistance(clientLocation, applicantLocation);
  return distance <= radius.value;
}

const getApplicantMarkerOptions = (applicant) => {
  const position = { lat: applicant.lat, lng: applicant.lon, anchorPoint: 'BOTTOM_CENTER' };
  return {
    position,
    draggable: false,
    clickable: true,
  };
}

const getMarkerColor = () => {
  applicantList.value.forEach((applicant) => {
    if (isInsideCircle(applicant)) {
      applicant.marker = 'primary';
    }
    else {
      applicant.marker = 'white';
    }
  });
}

onMounted(async () => {
  await fetchData()
})


async function fetchData() {
  applicantList.value = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]);
  applicantList.value.forEach((applicant) => {
    applicant['marker'] = 'white';
  });
  getMarkerColor();
}


watchCurrentOrganization(async()=>{
  await fetchData()
})

const circleOption = computed(() => {
  return {
    center: center.value,
    radius: radius.value * 1000,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.05,
  };
});

watch(radius, (newVal) => {
  let center = circleOption.value.center;
  if (!newVal) {
    newVal = 0
  }
  if (typeof newVal != 'number') {
    newVal = parseInt(newVal);
  }
  getMarkerColor();
  emit('updateMap', { ...center, 'radiusInM': radius.value * 1000 })
});

const getRadius = () => {
  radius.value = inputRadius.value
}

const clearRadius = () => {
  radius.value = 0
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
      getMarkerColor()
    } else {
      Alert.warning()
    }
  });
  isLoadingProgress.value = false
}

const markerDrag = (event) => {
  center.value = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  getMarkerColor();
  emit('updateMap', { ...center.value, 'radiusInM': radius.value * 1000 })
}

const clear = () => {
  searchInput.value = '';
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
        <CustomMarker v-for="applicant in applicantList" :key="applicant.id"
          :options="getApplicantMarkerOptions(applicant)">
          <q-icon :color="applicant.marker" size="lg" name="place" @click="openDrawer(applicant)" />
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
          <q-input outlined dense type="number" v-model.number="inputRadius">
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
    <ApplicantDetails ref="detailsDrawer" />
  </q-card>
</template>

