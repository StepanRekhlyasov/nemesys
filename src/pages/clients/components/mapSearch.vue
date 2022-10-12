<template>
  <q-card style="width: 1000px; max-width: 80vw; min-height: 500px">
    <q-card-section class="row q-pb-sm q-pt-sm">
      <div class="text-h6">{{ $t('client.list.detailedConditionSearch') }} </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pb-none q-pt-xs">
      {{ $t('client.list.regionalSearch') }}
      <div class="row">
        <div class="col-6">
          <q-input outlined dense v-model="address" />
        </div>
        <div class="col-4 q-pl-md">
          <q-btn :label="$t('common.close')" color="primary" outline @click="loadData" />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pb-none q-pt-xs">
      {{ $t('client.list.originationStaff') }}
      <div class="row">
        <div class="col-6">
          <q-input outlined dense />
        </div>
        <div class="col-4 q-pl-md">
          <q-btn :label="$t('common.close')" color="primary" outline />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <GoogleMap :api-key="apiKey" style="width: 100%; height: 450px" :center="center" :zoom="15">
        <Markers :options="{ position: center }" :clickable="true" :draggable="true" />
      </GoogleMap>
    </q-card-section>

    <q-card-section class="q-pb-xs q-pt-xs">
      {{ $t('client.list.distanceFromOrigin') }}
      <div class="row">
        <div class="col-2">
          <q-input outlined dense type="number" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
      <q-btn flat :label="$t('client.list.saveSearchConditions')" v-close-popup />
      <q-btn flat :label="$t('client.list.detailedConditionSearch')" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { reactive, computed, watch, ref } from 'vue'; //ref,
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { GoogleMap, Marker as Markers } from 'vue3-google-map';
import { api } from 'boot/axios'
import regions from './config/regions.js';

export default {
  name: 'mapSearch',
  components: {
    GoogleMap,
    Markers
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const backOrderData = reactive({
      nursing: [],
      office_facilityType: [],
      basic_contract_signed: false,
      avail_job_postings: false,
      status: [],
    });
    const confirmSaveDialog = ref(false);
    const $q = useQuasar();
    const regionList = ref(regions.region);
    const prefectures = ref([]);
    const wards = ref([]);

    const center = ref({ lat: 36.0835255, lng: 140.0 });
    const apiKey = 'AIzaSyCPcZ-aJupMuSWMV7_PBWL_3AVSyGW80FE';
    const address = ref('');

    const facilityOp = computed(() => {
      return [
        {
          name: t('client.add.facilityOp.medicalClinic'),
          value: 'medicalClinic',
        },
        {
          name: t('client.add.facilityOp.homeVisitCare'),
          value: 'homeVisitCare',
        },
        { name: t('client.add.facilityOp.dayCare'), value: 'dayCare' },
        {
          name: t('client.add.facilityOp.homeVisitRehabilitation'),
          value: 'homeVisitRehabilitation',
        },
        {
          name: t('client.add.facilityOp.longMedicalFacility'),
          value: 'longMedicalFacility',
        },
        {
          name: t('client.add.facilityOp.homeNursing'),
          value: 'homeNursing',
        },
        { name: t('client.add.facilityOp.shortStay'), value: 'shortStay' },
        { name: t('client.add.facilityOp.dayService'), value: 'dayService' },
        {
          name: t('client.add.facilityOp.nursingCareElderly'),
          value: 'nursingCareElderly',
        },
        {
          name: t('client.add.facilityOp.specialElderlyNursingHome'),
          value: 'specialElderlyNursingHome',
        },
        {
          name: t('client.add.facilityOp.paidNursingHome'),
          value: 'paidNursingHome',
        },
        { name: t('client.add.facilityOp.groupHome'), value: 'groupHome' },
        {
          name: t('client.add.facilityOp.smallMultifunFacility'),
          value: 'smallMultifunFacility',
        },
        {
          name: t('client.add.facilityOp.homeCareNursing'),
          value: 'homeCareNursing',
        },
        {
          name: t('client.add.facilityOp.elderlyHousingServices'),
          value: 'elderlyHousingServices',
        },
        { name: t('client.add.facilityOp.clinic'), value: 'clinic' },
        { name: t('client.add.facilityOp.hospital'), value: 'hospital' },
        { name: t('client.add.facilityOp.careHouse'), value: 'careHouse' },
        {
          name: t('client.add.facilityOp.nursingCareClinic'),
          value: 'nursingCareClinic',
        },
        {
          name: t('client.add.facilityOp.dementiaLivingCare'),
          value: 'dementiaLivingCare',
        },
        {
          name: t('client.add.facilityOp.longCareWelfareFacilityElderly'),
          value: 'longCareWelfareFacilityElderly',
        },
        {
          name: t('client.add.facilityOp.communityNursingElderly'),
          value: 'communityNursingElderly',
        },
        {
          name: t('client.add.facilityOp.communitySpecificFacility'),
          value: 'communitySpecificFacility',
        },
        {
          name: t('client.add.facilityOp.dayCareFacility'),
          value: 'dayCareFacility',
        },
        { name: t('client.add.facilityOp.homeCare'), value: 'homeCare' },
        {
          name: t('client.add.facilityOp.specifiedWelfareSales'),
          value: 'specifiedWelfareSales',
        },
        {
          name: t('client.add.facilityOp.shortResidentialCare'),
          value: 'shortResidentialCare',
        },
        {
          name: t('client.add.facilityOp.lendingWelfareEquipment'),
          value: 'lendingWelfareEquipment',
        },
        {
          name: t('client.add.facilityOp.homeBathingCare'),
          value: 'homeBathingCare',
        },
        {
          name: t('client.add.facilityOp.livelihoodResidentFacility'),
          value: 'livelihoodResidentFacility',
        },
        {
          name: t('client.add.facilityOp.outpatientRehabilitation'),
          value: 'outpatientRehabilitation',
        },
        {
          name: t('client.add.facilityOp.dentalClinic'),
          value: 'dentalClinic',
        },
        { name: t('client.add.facilityOp.pharmacy'), value: 'pharmacy' },
      ];
    });

    const recordOp = computed(() => {
      return [
        { name: t('client.list.numBOs'), value: 'numBOs', label: t('client.list.numBOsAcquired') },
        { name: t('client.list.numFixResults'), value: 'numFixResults', label: t('client.list.numFixResults') },
        { name: t('client.list.jobSearchResults'), value: 'jobSearchResults', label: t('client.list.jobSearchResults') },
        { name: t('client.list.numJobOffers'), value: 'numJobOffers', label: t('client.list.numJobOffers') },
        { name: t('client.list.hiringRecord'), value: 'hiringRecord', label: t('client.list.hiringRecord') },
      ];
    });

    const dispatchOp = computed(() => {
      return [
        { name: t('client.list.dispatchRecord'), value: 'dispatchRecord', class: '' },
        { name: t('client.list.referralResults'), value: 'referralResults', class: '' },
        { name: t('client.list.dispatchedOtherCompanies'), value: 'dispatchedOtherCompanies', class: 'bg-yellow-1' },
        { name: t('client.list.otherCompanyReferralResults'), value: 'otherCompanyReferralResults', class: 'bg-yellow-1' },
      ];
    });

    const numEmployees = computed(() => {
      return [
        { name: t('client.list.numFullTimeEmployees'), value: 'numFullTimeEmployees' },
        { name: t('client.list.numPartTimeEmployees'), value: 'numPartTimeEmployees' },
        { name: t('client.list.numTempEmployees'), value: 'numTempEmployees' },
      ];
    });

    watch(
      () => (backOrderData.nursing),
      (newVal) => {
        if (newVal.length == 0) {
          backOrderData.office_facilityType = [];
        }
      },
    );

    const searchClients = async () => {
      return false;
    };

    return {
      backOrderData,
      facilityOp,
      recordOp,
      dispatchOp,
      numEmployees,
      confirmSaveDialog,
      regionList,
      prefectures,
      wards,

      //map
      center,
      apiKey,
      address,

      searchClients,
      loadData() {
        const headers = { 'Content-Type': 'application/json' };
        let idToken = '';
        let userId = '';
        const user = $q.localStorage.getItem('user') as { uid: '' };
        if (user) {
          idToken = user['stsTokenManager']['accessToken'];
          userId = user['uid'];
        }
        const addr = address.value;
        if (!addr) {
          return false;
        }
        console.log();

        api.post('https://get-geoinfo-planwvepxa-an.a.run.app', {
          userId: userId,
          address: addr,
          idToken: idToken,
        },
          {
            headers: headers,
            timeout: 5000,
          })
          .then((response) => {
            if (response.status == 200) {
              center.value = response.data;
            }
          })
          .catch(() => {
            $q.notify({
              color: 'negative',
              position: 'top',
              message: 'Loading failed',
              icon: 'report_problem'
            })
          })
      }


    }
  }
}
</script>
