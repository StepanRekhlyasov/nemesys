<script lang="ts" setup>
import { ref, onMounted, watch,defineProps} from 'vue';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { statusList, applicantClassification, occupationList, qualificationList, availableShiftList, daysList, sexList, rankList } from 'src/shared/constants/Applicant.const';
import { prefectureList as prefList } from 'src/shared/constants/Prefecture.const';
import DoubleNumberInput from 'src/pages/user/Applicant/components/search/components/DoubleNumberInput.vue';
import {searchData} from 'src/pages/user/Applicant/const/index'

const prefectureList = ref(prefList);
const prefectureData = ref({});
const stationData = ref([]);
const statusOption = ref(statusList)
const prefJP = ref({})
const routeData = ref([]);

const sexOption = ref(sexList);
const classificationOption = ref(applicantClassification);

const rankOption = ref(rankList);

const occupationOption = ref(occupationList);
const qualificationOption = ref(qualificationList);
const availableShiftOption = ref(availableShiftList);
const workingDaysOption = ref(daysList);
const props = defineProps({
  rowForEdit:{
    type: Object,
    required: true,
  },
});
watch(
  () => (searchData.value.route),
  async (newVal,) => {
    if (newVal) {
      stationData.value = [];
      const docRef = doc(db, 'metadata', 'stationRoutes', 'station', newVal);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        stationData.value = docSnap.data()['stations'];
      }
    }
  }
)

const db = getFirestore();

onMounted(async () => {
  searchData.value = JSON.parse(JSON.stringify(props.rowForEdit));
  const docRef = doc(db, 'metadata', 'regionData');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let region = docSnap.data();
    prefectureData.value = {}
    for (let [, value] of Object.entries(region)) {
      for (let i = 0; i < value.length; i++) {

        for (let [key, pref] of Object.entries(value[i])){
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

</script>

<template>
          <q-card-section>
              <div class="row flex justify-start">
                <div class="col-3 q-ml-sm q-pl-sm"> {{ $t('applicant.add.status') }}</div>
                <div class="col-3 q-ml-sm q-pl-sm"> {{ $t('applicant.list.rank') }}</div>
                <div class="col-4 q-ml-sm q-pl-sm">{{ $t('applicant.add.applicationDate') }}</div>
              </div>
              <div class="row flex justify-start">
                <div class="col-3 q-mr-sm q-pr-sm">
                  <q-select outlined dense :options="statusOption" emit-value map-options v-model="searchData['status']"
                    clearable>
                    <template v-if="!searchData['status']" v-slot:selected>
                      <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                    </template>
                  </q-select>
                </div>
                <div class="col-3 q-mr-sm q-pr-sm">
                  <q-select outlined dense :options="rankOption" emit-value map-options
                    v-model="searchData['staffrank']" clearable>
                    <template v-if="!searchData['staffrank']" v-slot:selected>
                      <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                    </template>
                  </q-select>
                </div>
                <div class="col-4 flex items-center date-input-wrapper">
                  <q-input type="date" v-model="searchData['applicationDateMin']" outlined dense mask="YYYY/MM/DD"
                    class="q-mr-xs q-ml-xs" />
                  ~
                  <q-input type="date" v-model="searchData['applicationDateMax']" outlined dense mask="YYYY/MM/DD"
                    class="q-mr-xs q-ml-xs" />
                </div>
              </div>

                <q-separator class="q-my-sm" style="background-color:transparent"/>

                  <div class="row flex justify-start">
                    <div class="col-3 q-ml-sm q-pl-sm">{{ $t('common.age') }}</div>
                    <div class="col-3 q-ml-sm q-pl-sm"> {{ $t('applicant.list.yearsExperience') }}</div>
                    <div class="col-3 q-ml-sm q-pl-sm">{{ $t('applicant.list.availableDays') }}</div>
                  </div>
                  <div class="row flex justify-start">
                    <div class="col-3 q-mr-sm q-pr-sm">
                      <DoubleNumberInput :min-model-value="searchData['ageMin']" :max-model-value="searchData['ageMax']"
                        unit-key="common.year" @on-min-value-update="(v) => searchData['ageMin'] = v"
                        @on-max-value-update="(v) => searchData['ageMax'] = v" />
                    </div>
                    <div class="col-3 q-mr-sm q-pr-sm">
                      <DoubleNumberInput :min-model-value="searchData['yearsExperienceMin']"
                        :max-model-value="searchData['yearsExperienceMax']" unit-key="common.year"
                        @on-min-value-update="(v) => searchData['yearsExperienceMin'] = v"
                        @on-max-value-update="(v) => searchData['yearsExperienceMax'] = v" />
                    </div>
                    <div class="col-3 q-mr-sm q-pr-sm">
                        <DoubleNumberInput :min-model-value="searchData['workPerWeekMin']"
                          :max-model-value="searchData['workPerWeekMax']" unit-key="common.week"
                          @on-min-value-update="(v) => searchData['workPerWeekMin'] = v"
                          @on-max-value-update="(v) => searchData['workPerWeekMax'] = v" />
                    </div>
                  </div>

                  <q-separator class="q-my-sm" style="background-color:transparent"/>

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
                      <q-select outlined v-model="searchData['route']" dense :options="routeData"
                      @update:model-value="searchData['neareststation'] = ''"
                      />
                    </div>
                    <div class="col-3 q-pl-sm">
                      <q-select outlined v-model="searchData['neareststation']" :options="stationData"
                        :disable="!searchData['route']" dense />
                    </div>
                  </div>

                  <q-separator class="q-my-sm" style="background-color:transparent"/>

                 <div >
                  <div class="row">
                    <div class="col-3 q-pl-sm"> {{ $t('applicant.add.sex') }}</div>
                    <div class="col-3 q-pl-sm">{{ $t('applicant.list.info.classiffication') }}</div>
                    <div class="col-4 q-pl-sm">{{ $t('applicant.list.availableShift') }}</div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <q-option-group v-model="searchData['sex']" :options="sexOption" type="checkbox" inline />
                    </div>
                    <div class="col-3">
                      <q-option-group v-model="searchData['classification']" :options="classificationOption"
                        type="checkbox" inline />
                    </div>
                    <div class="col-4">
                      <q-option-group v-model="searchData['availableShift']" :options="availableShiftOption"
                        type="checkbox" inline />
                    </div>
                  </div>
                 </div>

                  <q-separator class="q-my-sm" style="background-color:transparent"/>

                  <div >
                    <div class="row">
                      <div class="col-6">{{ $t('applicant.list.qualification') }}</div>
                    </div>
                    <div class="row">
                      <div class="col-8">
                        <q-option-group v-model="searchData['qualification']" :options="qualificationOption" type="checkbox"
                          inline />
                      </div>
                    </div>
                  </div>

                  <q-separator class="q-my-sm" style="background-color:transparent"/>

                  <div >
                    <div class="row">
                      <div class="col-4"> {{ $t('applicant.add.occupation') }}</div>
                    </div>
                    <div class="row">
                       <div class="col-8">
                        <q-option-group v-model="searchData['occupation']" :options="occupationOption" type="checkbox"
                          inline />
                      </div>
                    </div>
                  </div>

                  <q-separator class="q-my-sm" style="background-color:transparent"/>

                  <div >
                    <div class="row">
                      <div class="col-3"> {{ $t('applicant.attendant.daysPerWeek') }}</div>
                    </div>
                    <div class="row">
                      <div class="col-8">
                        <q-option-group v-model="searchData['daysperweek']" :options="workingDaysOption" type="checkbox"
                          inline />
                      </div>
                    </div>
                  </div>

                </q-card-section>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";
.date-input-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
</style>
