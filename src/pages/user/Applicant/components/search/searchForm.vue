<template>
  <q-card class="no-shadow full-height">
    <q-form class="q-gutter-none" @submit="searchStaff" @reset="reset">
      <div class="row">
        <div class="col-3"></div>
        <div class="col-2"> {{ $t('applicant.add.status') }}</div>
        <div class="col-2">{{ $t('applicant.add.applicationDate') }}</div>
      </div>
      <div class="row">
        <div class="col-3">
          <q-input dense v-model="searchData['keyword']" outlined autogrow class="q-mr-xs"
            :placeholder="$t('common.keyboard')" clearable @keydown.enter.prevent="searchStaff" />
        </div>
        <div class="col-2">
          <q-select outlined dense :options="statusOption" emit-value map-options v-model="searchData['status']"
            clearable>
            <template v-if="!searchData['status']" v-slot:selected>
              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
            </template>
          </q-select>
        </div>
        <div class="col-5 flex items-center">
          <q-input type="date" v-model="searchData['applicationDateMin']" outlined dense mask="YYYY/MM/DD"
            class="q-mr-xs q-ml-xs" />
          ~
          <q-input type="date" v-model="searchData['applicationDateMax']" outlined dense mask="YYYY/MM/DD"
            class="q-mr-xs q-ml-xs" />
        </div>
        <div class="col-2">
          <q-expansion-item v-model="expanded" dense dense-toggle :label="$t('common.detailedConditions')"
            header-class="q-pa-none" switch-toggle-side style="max-width: 100px;" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-my-sm">
          <q-btn :label="$t('client.list.search')" type="submit" color="primary q-ml-sm" />
          <q-btn :label="$t('common.reset')" type="reset" color="primary" outline class="q-ml-sm" />
          <q-btn :disable="isSaving" :label="$t('client.list.saveSearchConditions')" @click="save"
            color="primary q-ml-sm" />
          <q-btn class="q-ml-sm" :label="$t('backOrder.sms.sendSMS')" color="primary" @click="$emit('openSMSDrawer')" />
        </div>
      </div>
      <q-expansion-item hide-expand-icon :header-style="{ display: 'none' }" v-model="expanded">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-4">{{ $t('common.age') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.add.sex') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.list.rank') }}</div>
            </div>
            <div class="row">
              <div class="col-4">
                <DoubleNumberInput :min-model-value="searchData['ageMin']" :max-model-value="searchData['ageMax']"
                  unit-key="common.ageShort" @on-min-value-update="(v) => searchData['ageMin'] = v"
                  @on-max-value-update="(v) => searchData['ageMax'] = v" />
              </div>
              <div class="col-3">
                <q-option-group v-model="searchData['sex']" :options="sexOption" type="checkbox" inline />
              </div>
              <div class="col-3">
                <q-select outlined dense :options="rankOption" emit-value map-options v-model="searchData['staffrank']"
                  clearable>
                  <template v-if="!searchData['staffrank']" v-slot:selected>
                    <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                  </template>
                </q-select>
              </div>

              <div class="col-2 text-right">
                <q-btn size="sm" :label="$t('menu.mapSearch')" color="primary" outline
                  @click="drawerRight = true; drawerType = 'map'" />
              </div>
            </div>
            <div class="row q-pt-sm">
              <div class="col-4">{{ $t('applicant.list.info.classiffication') }}</div>
              <div class="col-4 q-pl-sm"> {{ $t('applicant.add.occupation') }}</div>
              <div class="col-4 text-right">
                <q-btn size="sm" :label="$t('menu.areaSearch')" color="primary" outline
                  @click="drawerRight = true; drawerType = 'area'" />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <q-option-group v-model="searchData['classification']" :options="classificationOption" type="checkbox"
                  inline />
              </div>
              <div class="col-8">
                <q-option-group v-model="searchData['occupation']" :options="occupationOption" type="checkbox" inline />
              </div>

            </div>
            <div class="row">
              <div class="col-3">{{ $t('applicant.add.prefecture') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.add.municipalities') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.route') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.nearestStation') }}</div>
            </div>
            <div class="row">
              <div class="col-3">
                <q-select outlined v-model="searchData['prefecture']" :options="prefectureList" dense emit-value
                  map-options @update:model-value="searchData['municipalities'] = ''" />
              </div>
              <div class="col-3 q-pl-sm">
                <q-select outlined v-model="searchData['municipalities']"
                  :options="prefectureData[searchData['prefecture']]" :disable="!searchData['prefecture']" dense />
              </div>
              <div class="col-3 q-pl-sm">
                <q-select outlined v-model="searchData['route']" dense :options="routeData" />
              </div>
              <div class="col-3 q-pl-sm">
                <q-select outlined v-model="searchData['neareststation']" :options="stationData"
                  :disable="!searchData['route']" dense />
              </div>
            </div>
            <div class="row">
              <div class="col-6">{{ $t('applicant.list.qualification') }}</div>
              <div class="col-4"> {{ $t('applicant.list.yearsExperience') }}</div>
            </div>
            <div class="row">
              <div class="col-6">
                <q-option-group v-model="searchData['qualification']" :options="qualificationOption" type="checkbox"
                  inline />
              </div>
              <div class="col-4">
                <DoubleNumberInput :min-model-value="searchData['yearsExperienceMin']"
                  :max-model-value="searchData['yearsExperienceMax']" unit-key="common.year"
                  @on-min-value-update="(v) => searchData['yearsExperienceMin'] = v"
                  @on-max-value-update="(v) => searchData['yearsExperienceMax'] = v" />
              </div>

            </div>

            <div class="row">
              <div class="col-4">{{ $t('applicant.list.availableShift') }}</div>
              <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.daysPerWeek') }}</div>
            </div>
            <div class="row">
              <div class="col-4">
                <q-option-group v-model="searchData['availableShift']" :options="availableShiftOption" type="checkbox"
                  inline />
              </div>
              <div class="col-6">
                <q-option-group v-model="searchData['daysperweek']" :options="workingDaysOption" type="checkbox" inline />
              </div>

            </div>

            <div class="row">
              <div class="col-4">{{ $t('applicant.list.availableDays') }}</div>
            </div>
            <div class="row">
              <div class="col-4">
                <div>
                  <DoubleNumberInput :min-model-value="searchData['workPerWeekMin']"
                    :max-model-value="searchData['workPerWeekMax']" unit-key="common.week"
                    @on-min-value-update="(v) => searchData['workPerWeekMin'] = v"
                    @on-max-value-update="(v) => searchData['workPerWeekMax'] = v" />
                </div>
                <!-- <div class="q-mt-sm">
                                  <DoubleNumberInput
                                    :min-model-value="searchData['workPerMonthMin']"
                                    :max-model-value="searchData['workPerMonthMax']"
                                    unit-key="common.month"
                                    @on-min-value-update="(v) => searchData['workPerMonthMin'] = v"
                                    @on-max-value-update="(v) => searchData['workPerMonthMax'] = v"
                                  />
                                </div> -->
              </div>
            </div>



          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-form>

    <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
      bordered>
      <q-scroll-area class="fit text-left">
        <q-card class="no-shadow bg-grey-3">
          <q-card-section class="text-white bg-primary rounded-borders">
            <div class="row">
              <q-btn dense flat icon="close" @click="drawerRight = false" class="q-mr-md" />
              <span class="text-h6 text-weight-bold q-pr-xs">
                <template v-if="drawerType == 'area'">
                  {{ $t('menu.areaSearch') }}
                </template>
                <template v-else-if="drawerType == 'map'">
                  {{ $t('menu.mapSearch') }}
                </template>
              </span>
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn :label="$t('client.list.searchByCondition')" type="submit" color="primary" outline
              @click="searchStaff" />
            <q-separator class="q-mt-sm" />
          </q-card-section>
          <div class="row q-pl-sm">
            <div class="col-2 text-h6 text-weight-bold text-primary">
              ■ {{ $t('menu.advancedSearch') }}
            </div>
            <div class="col-2">
              <q-expansion-item v-model="expandedAdvance" dense dense-toggle
                :label="expandedAdvance ? $t('common.closeArea') : $t('common.openArea')" header-class="q-pa-none"
                switch-toggle-side />
            </div>
          </div>
          <q-expansion-item hide-expand-icon :header-style="{ display: 'none' }" v-model="expandedAdvance">
            <q-card-section>
              <!--keyword-->
              <div class="row">
                <div class="col-12">
                  <q-input dense v-model="searchData['keyword']" outlined autogrow class="q-mr-xs"
                    :placeholder="$t('common.keyboard')" />
                </div>
              </div>


              <!--qualification-->
              <div class="row q-pt-sm">
                <div class="col-12">{{ $t('applicant.list.qualification') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['qualification']" :options="qualificationOption" type="checkbox"
                    inline />
                </div>
              </div>
              <!--yearsExperience-->
              <div class="row">
                <div class="col-12"> {{ $t('applicant.list.yearsExperience') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <DoubleNumberInput :min-model-value="searchData['yearsExperienceMin']"
                    :max-model-value="searchData['yearsExperienceMax']" unit-key="common.year"
                    @on-min-value-update="(v) => searchData['yearsExperienceMin'] = v"
                    @on-max-value-update="(v) => searchData['yearsExperienceMax'] = v" />
                </div>
              </div>

              <!-- classification -->
              <div class="row q-pt-sm">
                <div class="col-12">{{ $t('applicant.list.info.classiffication') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['classification']" :options="classificationOption" type="checkbox"
                    inline />
                </div>
              </div>

              <!-- occupation -->
              <div class="row q-pt-sm">
                <div class="col-12"> {{ $t('applicant.add.occupation') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['occupation']" :options="occupationOption" type="checkbox" inline />
                </div>
              </div>

              <!--availableShift-->
              <div class="row">
                <div class="col-12">{{ $t('applicant.list.availableShift') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['availableShift']" :options="availableShiftOption" type="checkbox"
                    inline />
                </div>
              </div>

              <!--daysPerWeek-->
              <div class="row">
                <div class="col-12"> {{ $t('applicant.attendant.daysPerWeek') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['daysperweek']" :options="workingDaysOption" type="checkbox"
                    inline />
                </div>
              </div>

              <!--availableDays-->
              <div class="row q-pt-sm">
                <div class="col-12">{{ $t('applicant.list.availableDays') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div>
                    <DoubleNumberInput :min-model-value="searchData['workPerWeekMin']"
                      :max-model-value="searchData['workPerWeekMax']" unit-key="common.week"
                      @on-min-value-update="(v) => searchData['workPerWeekMin'] = v"
                      @on-max-value-update="(v) => searchData['workPerWeekMax'] = v" />
                  </div>
                  <!-- <div class="q-mt-sm">
                                      <DoubleNumberInput
                                        :min-model-value="searchData['workPerMonthMin']"
                                        :max-model-value="searchData['workPerMonthMax']"
                                        unit-key="common.month"
                                        @on-min-value-update="(v) => searchData['workPerMonthMin'] = v"
                                        @on-max-value-update="(v) => searchData['workPerMonthMax'] = v"
                                      />
                                    </div> -->
                </div>
              </div>

              <!--sex-->
              <div class="row q-pt-sm">
                <div class="col-12"> {{ $t('applicant.add.sex') }}</div>
              </div>
              <div class="row">
                <div class="col-12">
                  <q-option-group v-model="searchData['sex']" :options="sexOption" type="checkbox" inline />
                </div>
              </div>

              <!--status-->
              <div class="row">
                <div class="col-12"> {{ $t('applicant.add.status') }}</div>
              </div>
              <div class="row">
                <div class="col-4">
                  <q-select outlined dense :options="statusOption" emit-value map-options v-model="searchData['status']"
                    clearable>
                    <template v-if="!searchData['status']" v-slot:selected>
                      <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                    </template>
                  </q-select>
                </div>
              </div>


            </q-card-section>
          </q-expansion-item>


          <div class="row q-pl-sm">
            <div class="col-2 text-h6 text-weight-bold text-primary">
              <template v-if="drawerType == 'area'">
                ■ {{ $t('client.list.areaSearch') }}
              </template>
              <template v-if="drawerType == 'map'">
                ■ {{ $t('menu.mapSearch') }}
              </template>
            </div>
            <div class="col-2">
              <q-expansion-item v-model="expandedArea" dense dense-toggle
                :label="expandedArea ? $t('common.closeArea') : $t('common.openArea')" header-class="q-pa-none"
                switch-toggle-side />
            </div>
          </div>
          <q-expansion-item hide-expand-icon :header-style="{ display: 'none' }" v-model="expandedArea">
            <AreaSearch theme="primary" @update-area="updateArea" v-if="drawerType == 'area'" />
            <MapSearch theme="primary" @update-map="updateMap" v-if="drawerType == 'map'" />
          </q-expansion-item>
        </q-card>
      </q-scroll-area>
    </q-drawer>

  </q-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, watch, ComputedRef } from 'vue'; //ref,
import { statusList, StatusOption, applicantClassification, occupationList, qualificationList, availableShiftList, daysList, sexList, rankList } from 'src/shared/constants/Applicant.const';
import { DocumentData, doc, getDoc, getFirestore } from 'firebase/firestore';
import AreaSearch from './AreaSearch.vue';
import MapSearch from './MapSearch.vue';
import { getAuth } from '@firebase/auth';
// import { api } from 'src/boot/axios';
// import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { prefectureList as prefList } from 'src/shared/constants/Prefecture.const';
import { geohashForLocation } from 'geofire-common';
import DoubleNumberInput from './components/DoubleNumberInput.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useApplicantSaveSearch } from 'src/stores/applicantSaveSearch'
import { checkValidity } from 'src/pages/user/Applicant/const/index'
import { searchDataSample, resetSharedVariable } from './searchData'
const props = defineProps<{
  searchData: DocumentData
}>();

const db = getFirestore();
const saveSearch = useApplicantSaveSearch()


const searchData = ref<DocumentData>(props.searchData);
const prefectureList = ref<ComputedRef>(prefList);
const prefectureData = ref<DocumentData>({});
const stationData = ref<DocumentData>([]);


const statusOption = ref<StatusOption | ComputedRef>(statusList)
const expanded = ref<boolean>(false)
const expandedAdvance = ref<boolean>(true)
const expandedArea = ref<boolean>(true)
const drawerRight = ref<boolean>(false);
const drawerType = ref<string>('')
const prefJP = ref<DocumentData>({})
const routeData = ref<DocumentData>([]);

const emit = defineEmits<{
  (e: 'loadSearchStaff', staffList)
  (e: 'isLoading', flag),
  (e: 'openSMSDrawer')
}>()

const isSaving = ref<boolean>(false);

const sexOption = ref<ComputedRef>(sexList);
const classificationOption = ref<ComputedRef>(applicantClassification);

const rankOption = ref<ComputedRef>(rankList);

const occupationOption = ref<ComputedRef>(occupationList);
const qualificationOption = ref<ComputedRef>(qualificationList);
const availableShiftOption = ref<ComputedRef>(availableShiftList);
const workingDaysOption = ref<ComputedRef>(daysList);

watch(
  () => (searchData.value.route),
  async (newVal,) => {
    if (newVal) {
      stationData.value = [];
      searchData.value['neareststation'] = '';
      const docRef = doc(db, 'metadata', 'stationRoutes', 'station', newVal);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        stationData.value = docSnap.data()['stations'];
      }
    }
  }
)

onMounted(async () => {
  const docRef = doc(db, 'metadata', 'regionData');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let region = docSnap.data();
    prefectureData.value = {}
    for (let [, value] of Object.entries(region)) {
      for (let i = 0; i < value.length; i++) {

        for (let [key, pref] of Object.entries(value[i])) {
          //prefectureList.value.push(key as never);
          prefectureData.value[key] = pref;
        }


      }
    }
  }

  const stationDocRef = doc(db, 'metadata', 'stationRoutes');
  const stationDocSnap = await getDoc(stationDocRef);

  if (stationDocSnap.exists()) {
    routeData.value = stationDocSnap.data().routes;

  }

  const docRefPref = doc(db, 'metadata', 'prefectureJP');
  const docSnapPref = await getDoc(docRefPref);

  if (docSnapPref.exists()) {
    prefJP.value = docSnapPref.data();
  }


});

const updateArea = (selectedPrefectures: string, selectedMunicipality: string) => {
  // searchData.value['prefecture'] = selectedPrefectures;
  let prefectures = []
  for (var i = 0; i < selectedPrefectures.length; i++) {
    prefectures.push(Object.keys(prefJP.value).find(key => prefJP.value[key] === selectedPrefectures[i]) as never)
  }
  searchData.value['prefecture'] = [...prefectures, ...selectedPrefectures];

  searchData.value['municipalities'] = selectedMunicipality;

  //
}
const updateMap = (mapData) => {
  try {
    mapData['geohash'] = geohashForLocation([parseFloat(mapData['lat']), parseFloat(mapData['lng'])]);
  }
  catch (err) {
    console.log(err)
    Alert.warning('Invalid lat or lon')
    return
  }
  searchData.value['mapData'] = mapData;
}


const searchStaff = async () => {
  emit('isLoading', true)
  drawerRight.value = false
  expanded.value = false
  const auth = getAuth();
  const user = auth.currentUser;
  if (user == null) {
    return false
  }
  emit('loadSearchStaff', searchData.value)
  emit('isLoading', false)
};


const reset = () => {
  searchData.value = JSON.parse(JSON.stringify(searchDataSample));
  resetSharedVariable();
  searchStaff();
}

const save = async () => {
  isSaving.value = true;
  let data = searchData.value
  data['created_at'] = null;
  data['id'] = null;
  let valid = true;
  try {
    checkValidity(data)
  }
  catch (error) {
    valid = false
    Alert.warning(error)
  }
  if (valid) {
    if (!data['keyword']) data['keyword'] = null;
    if (!data['ageMin']) data['ageMin'] = null;
    if (!data['ageMax']) data['ageMax'] = null;
    if (!data['sex']) data['sex'] = null;
    if (!data['staffrank']) data['staffrank'] = null;
    if (!data['classification']) data['classification'] = null;
    if (!data['occupation']) data['occupation'] = null;
    if (!data['prefecture']) data['prefecture'] = null;
    if (!data['municipalities']) data['municipalities'] = null;
    if (!data['route']) data['route'] = null;
    if (!data['neareststation']) data['neareststation'] = null;
    if (!data['qualification']) data['qualification'] = null;
    if (!data['yearsExperienceMin']) data['yearsExperienceMin'] = null;
    if (!data['yearsExperienceMax']) data['yearsExperienceMax'] = null;
    if (!data['availableShift']) data['availableShift'] = null;
    if (!data['daysperweek']) data['daysperweek'] = null;
    if (!data['workPerWeekMin']) data['workPerWeekMin'] = null;
    if (!data['workPerWeekMax']) data['workPerWeekMax'] = null;
    if (!data['applicationDateMin']) data['applicationDateMin'] = null;
    if (!data['applicationDateMax']) data['applicationDateMax'] = null;
    if (!data['status']) data['status'] = null;
    const save = await saveSearch.saveSearch(data);
    if (save)
      Alert.success()
  }
  isSaving.value = false;
}

</script>

<style lang="scss">
.q-item__section--avatar {
  min-width: 16px !important;
  padding: 0px !important;
}
</style>
