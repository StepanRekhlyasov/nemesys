<template>
  <q-card class="no-shadow full-height bg-grey-3">
    <q-form class="q-gutter-none" @submit="searchStaff">
      <q-btn
        :label="$t('backOrder.changeSearchCriteria')"
        color="primary"
        @click="expanded = true"
        v-if="!expanded"
      />

      <q-expansion-item
        hide-expand-icon
        :header-style="{ display: 'none' }"
        v-model="expanded"
      >
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-btn
                :label="$t('common.search')"
                color="primary"
                size="sm"
                type="submit"
              />
              <q-btn
                :label="$t('common.cancel')"
                color="primary"
                size="sm"
                outline
                class="q-ml-sm"
                @click="cancel"
              />
              <q-btn
                :label="$t('client.list.saveSearchConditions')"
                color="primary"
                size="sm"
                outline
                class="q-ml-sm"
                @click="saveSearchConditions"
                :disable="isSaving"
              />
            </div>
          </div>

          <div class="row q-mt-sm">
            <div class="col-5">
              <q-input
                dense
                v-model="searchData['keyword']"
                outlined
                autogrow
                class="q-mr-xs"
                :placeholder="$t('common.keyboard')"
                clearable
              />
            </div>
            <div class="col-2">
              <q-input
                dense
                v-model="searchData['boid']"
                outlined
                autogrow
                class="q-mr-xs"
                placeholder="BOID"
                clearable
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                v-model="searchData['customerRepresentative']"
                outlined
                autogrow
                class="q-mr-xs"
                :placeholder="$t('backOrder.create.customerRepresentative')"
                clearable
              />
            </div>
          </div>

          <div class="row q-mt-sm">
            <div class="col-4">{{ $t('backOrder.registrationDate') }}</div>
            <div class="col-6 q-pl-sm">{{ $t('backOrder.dealType') }}</div>
            <div class="col-2">{{ $t('client.backOrder.upperAgeLimit') }}</div>
          </div>
          <div class="row">
            <div class="col-4 flex q-pa-none items-center">
              <q-input
                type="date"
                v-model="searchData['registrationDateMin']"
                outlined
                dense
                mask="YYYY/MM/DD"
                class="q-ma-none q-pa-none"
              />
              ~
              <q-input
                type="date"
                v-model="searchData['registrationDateMax']"
                outlined
                dense
                mask="YYYY/MM/DD"
                class="q-ma-none q-pa-none"
              />
            </div>
            <div class="col-6">
              <q-option-group
                v-model="searchData['typecase']"
                :options="occupationList"
                type="checkbox"
                inline
              />
            </div>
            <div class="col-2">
              <DoubleNumberInput
                :min-model-value="searchData['ageMin']"
                :max-model-value="searchData['ageMax']"
                unit-key="common.year"
                @on-min-value-update="(v) => (searchData['ageMin'] = v)"
                @on-max-value-update="(v) => (searchData['ageMax'] = v)"
              />
            </div>
          </div>
          <div class="row q-pt-sm">
            <div class="col-5">{{ $t('backOrder.employmentType') }}</div>
            <div class="col-6 q-pl-sm">
              {{ $t('client.backOrder.reqQualification') }}
            </div>
          </div>
          <div class="row">
            <div class="col-5">
              <q-option-group
                v-model="searchData['employmenttype']"
                :options="employmentTypeOption"
                type="checkbox"
                inline
              />
            </div>
            <div class="col-6">
              <q-option-group
                v-model="searchData['qualifications']"
                :options="qualificationOption"
                type="checkbox"
                inline
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3">{{ $t('backOrder.transactionType') }}</div>
          </div>
          <div class="row">
            <div class="col-3">
              <q-option-group
                v-model="searchData['transactiontype']"
                :options="applicantClassification"
                type="checkbox"
                inline
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <MapSearch theme="primary" @update-map="updateMap" />
        </q-card-section>
      </q-expansion-item>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MapSearch from './MapSearch.vue';
import { geohashForLocation } from 'geofire-common';
import DoubleNumberInput from '../../../Applicant/components/search/components/DoubleNumberInput.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBackOrder } from 'src/stores/backOrder'
import { checkValidity, sharedData, resetSharedVariable } from 'src/pages/user/BackOrder/consts/index';
import {
  employmentTypeOption,
  qualificationOption,
} from '../../consts/BackOrder.const';
import {
  applicantClassification,
  occupationList,
} from 'src/shared/constants/Applicant.const';


const isSaving = ref<boolean>(false);
const searchDataSample = {
  employmenttype: [],
  qualifications: [],
  transactiontype: [],
  typecase: [],
};
const BackOrderStore = useBackOrder()
const searchData = ref(JSON.parse(JSON.stringify(searchDataSample)));
const expanded = ref(false);
const drawerRight = ref(false);

const emit = defineEmits<{
  (e: 'loadSearchStaff', staffList);
  (e: 'isLoading', flag);
}>();

const updateMap = (mapData) => {
  try {
    mapData['geohash'] = geohashForLocation([
      parseFloat(mapData['lat']),
      parseFloat(mapData['lng']),
    ]);
  } catch (err) {
    Alert.warning(err);
    return;
  }
  searchData.value['mapData'] = mapData;
};

onMounted(()=>{
  if(BackOrderStore.checkData(sharedData.value)){
    expanded.value = true;
    searchData.value = sharedData.value;
  }
})


const searchStaff = () => {
  emit('isLoading', true);
  drawerRight.value = false;
  expanded.value = false;
  emit('loadSearchStaff', searchData.value);
  emit('isLoading', false);
};

const cancel = () => {
  expanded.value = false;
  searchData.value = JSON.parse(JSON.stringify(searchDataSample));
  resetSharedVariable();
  emit('loadSearchStaff', searchData.value);
};

const saveSearchConditions = async () => {
  isSaving.value = true;
  let valid = true;
  try {
    checkValidity(searchData.value)
  }
  catch (error) {
    valid = false
    Alert.warning(error)
  }
  if (valid) {
    if (!searchData.value['keyword']) searchData.value['keyword'] = null;
    if (!searchData.value['ageMin']) searchData.value['ageMin'] = null;
    if (!searchData.value['ageMax']) searchData.value['ageMax'] = null;
    if (!searchData.value['boid']) searchData.value['boid'] = null;
    if (!searchData.value['customerRepresentative']) searchData.value['customerRepresentative'] = null;
    if (!searchData.value['registrationDateMax']) searchData.value['registrationDateMax'] = null;
    if (!searchData.value['registrationDateMin']) searchData.value['registrationDateMin'] = null;
    await BackOrderStore.saveSearch(searchData.value)
  }
  searchData.value = JSON.parse(JSON.stringify(searchDataSample));
  resetSharedVariable()
  isSaving.value = false;
}

</script>

<style lang="scss">
.q-item__section--avatar {
  min-width: 16px !important;
  padding: 0px !important;
}
</style>
