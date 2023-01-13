<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated color="primary" class="no-shadow text-weight-bold" />
      <q-btn :label="$t('client.list.searchByCondition')" outline color="primary" class="text-weight-bold" />
    </q-card-actions>

    <q-card-section>
      <GoogleMap :api-key="apiKey" style="width: 100%; height: 450px" :center="center" :zoom="15">
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

<script lang="ts">
import { watch, ref } from 'vue'; //ref,
//import { useI18n } from 'vue-i18n';
import { GoogleMap, Marker as Markers, Circle as Circles } from 'vue3-google-map';

export default {
  name: 'mapSearch',
  components: {
    GoogleMap,
    Markers,
    Circles
  },

  setup() {
    //const { t } = useI18n({ useScope: 'global' });
    //const $q = useQuasar();

    const center = ref({ lat: 36.0835255, lng: 140.0 });
    const radius = ref(500);
    const apiKey = 'AIzaSyCPcZ-aJupMuSWMV7_PBWL_3AVSyGW80FE';

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
    },
    );


    return {

      //map
      center,
      apiKey,
      circleOption,
      radius,

      // loadData() {
      //   const headers = { 'Content-Type': 'application/json' };
      //   let idToken = '';
      //   let userId = '';
      //   const user = $q.localStorage.getItem('user') as { uid: '' };
      //   if (user) {
      //     idToken = user['stsTokenManager']['accessToken'];
      //     userId = user['uid'];
      //   }
      //   const addr = address.value;
      //   if (!addr) {
      //     return false;
      //   }
      //   console.log();

      //   api.post('https://get-geoinfo-planwvepxa-an.a.run.app', {
      //     userId: userId,
      //     address: addr,
      //     idToken: idToken,
      //   },
      //     {
      //       headers: headers,
      //       timeout: 5000,
      //     })
      //     .then((response) => {
      //       if (response.status == 200) {
      //         center.value = response.data;
      //       }
      //     })
      //     .catch(() => {
      //       $q.notify({
      //         color: 'negative',
      //         position: 'top',
      //         message: 'Loading failed',
      //         icon: 'report_problem'
      //       })
      //     })
      // },
      markerDrag(event) {
        circleOption.value = {
          center: { lat: event.latLng.lat(), lng: event.latLng.lng() },
          radius: radius.value,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.05,
        }
      }


    }
  }
}
</script>
