<template>
  <q-card style="width: 1000px; max-width: 80vw">
    <q-card-section class="row q-pb-sm q-pt-sm">
      <div class="text-h6">{{ $t('client.list.detailedConditionSearch') }} </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-list bordered class="rounded-borders">

      <q-expansion-item expand-separator :label="region.name" v-for="region in regionList" :key="region" default-opened>

        <div class="row" v-for="prefecture in region.prefectures" :key="prefecture.name">
          <div class="col-1 text-right">
            <q-checkbox size="sm" v-model="prefectures" :val="prefecture.value"></q-checkbox>
          </div>
          <div class="col-11">
            <q-expansion-item dense dense-toggle expand-separator :label="prefecture.name"
              :style="{ backgroundColor: 'bg-white' }">
              <div class="bg-white q-pt-sm q-pb-sm">
                <q-checkbox dense size="sm" v-model="wards" :val="ward.value" :label="ward.name"
                  v-for="ward in prefecture.ward" :key="ward.value" class="q-pr-sm" />
              </div>
            </q-expansion-item>
          </div>
        </div>
      </q-expansion-item>
    </q-list>

    <q-separator />

    <q-card-actions align="right" class="bg-white text-teal col-auto">
      <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
      <q-btn flat :label="$t('client.list.saveSearchConditions')" v-close-popup />
      <q-btn flat :label="$t('client.list.detailedConditionSearch')" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { computed, watch, ref, reactive } from 'vue'; //ref,
//import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import regions from './config/regions.js';

export default {
  name: 'areaSearch',

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const confirmSaveDialog = ref(false);
    //const $q = useQuasar();
    const regionList = reactive(regions.region);
    const prefectures = ref([]);
    const wards = ref([]);

    const center = ref({ lat: 36.0835255, lng: 140.0 });
    const apiKey = 'AIzaSyCPcZ-aJupMuSWMV7_PBWL_3AVSyGW80FE'; //NEED TO MOVE TO ENV FILE
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
      () => (prefectures.value),
      (newVal, oldVal) => {
        let addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
        let removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
        for (let i = 0; i < regionList.length; i++) {
          for (let j = 0; j < regionList[i]['prefectures'].length; j++) {
            if (addedItem.includes(regionList[i]['prefectures'][j]['value'] as never))
            {
              for (let k = 0; k < regionList[i]['prefectures'][j]['ward'].length; k++) {
                const index = wards.value.indexOf(regionList[i]['prefectures'][j]['ward'][k]['value'] as never);
                if (index == -1) {
                  wards.value.push(regionList[i]['prefectures'][j]['ward'][k]['value'] as never)
                }
              }
            }
            else if (removedItem.includes(regionList[i]['prefectures'][j]['value'] as never)) {
              for (let k = 0; k < regionList[i]['prefectures'][j]['ward'].length; k++) {
                const index = wards.value.indexOf(regionList[i]['prefectures'][j]['ward'][k]['value'] as never);
                if (index > -1) {
                  wards.value.splice(index, 1);
                }
              }
            }
          }
        }


      },
    );

    const searchClients = async () => {
      return false;
    };

    return {
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

    }
  }
}
</script>
