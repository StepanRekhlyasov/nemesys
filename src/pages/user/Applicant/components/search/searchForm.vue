<template>
    <q-card class="no-shadow full-height">
        <q-form class="q-gutter-none" @submit="searchStaff" @reset="Reset">
            <div class="row">
                <div class="col-5"></div>
                <div class="col-2"> {{ $t('applicant.add.status') }}</div>
                <div class="col-2">{{ $t('applicant.add.applicationDate') }}</div>
            </div>
            <div class="row">
                <div class="col-5">
                    <q-input dense v-model="searchData['keyword']" outlined autogrow class="q-mr-xs"
                        :placeholder="$t('common.keyboard')" clearable />
                </div>
                <div class="col-2">
                    <q-select outlined dense :options="statusOption" emit-value map-options
                        v-model="searchData['status']" clearable>
                        <template v-if="!searchData['status']" v-slot:selected>
                            <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                        </template>
                    </q-select>
                </div>
                <div class="col-2">
                    <q-input type="date" v-model="searchData['applicationDate']" outlined dense mask="YYYY/MM/DD"
                        class="q-mr-xs q-ml-xs" />
                </div>
                <div class="col-2">
                    <q-btn :label="$t('client.list.search')" type="submit" color="primary" />
                    <q-btn :label="$t('common.reset')" type="reset" color="primary" outline class="q-ml-sm" />
                </div>
                <div class="col-1">
                    <q-expansion-item v-model="expanded" dense dense-toggle :label="$t('common.detailedConditions')"
                        header-class="q-pa-none" switch-toggle-side />
                </div>
            </div>
            <q-expansion-item hide-expand-icon :header-style="{ display: 'none' }" v-model="expanded">
                <q-card>
                    <q-card-section>
                        <div class="row">
                            <div class="col-4">{{ $t('common.age') }}</div>
                            <div class="col-4 q-pl-sm"> {{ $t('applicant.add.sex') }}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                              <DoubleNumberInput
                                :min-model-value="searchData['ageMin']"
                                :max-model-value="searchData['ageMax']"
                                unit-key="common.ageShort"
                                @on-min-value-update="(v) => searchData['ageMin'] = v"
                                @on-max-value-update="(v) => searchData['ageMax'] = v"
                              />
                            </div>
                            <div class="col-4">
                                <q-option-group v-model="searchData['sex']" :options="sexOption" type="checkbox"
                                    inline />
                            </div>
                            <div class="col-4 text-right">
                                <q-btn size="sm" :label="$t('menu.mapSearch')" type="reset" color="primary" outline
                                    @click="drawerRight = true; drawerType = 'map'" />
                            </div>
                        </div>
                        <div class="row q-pt-sm">
                            <div class="col-4">{{ $t('applicant.list.info.classiffication') }}</div>
                            <div class="col-4 q-pl-sm"> {{ $t('applicant.add.occupation') }}</div>
                            <div class="col-4 text-right">
                                <q-btn size="sm" :label="$t('menu.areaSearch')" type="reset" color="primary" outline
                                    @click="drawerRight = true; drawerType = 'area'" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <q-option-group v-model="searchData['classification']" :options="classificationOption"
                                    type="checkbox" inline />
                            </div>
                            <div class="col-4">
                                <q-option-group v-model="searchData['occupation']" :options="occupationOption"
                                    type="checkbox" inline />
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-3">{{ $t('applicant.add.prefecture') }}</div>
                            <div class="col-3 q-pl-sm"> {{ $t('applicant.add.municipalities') }}</div>
                            <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.nearestStation') }}</div>
                            <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.route') }}</div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <q-select outlined v-model="searchData['prefecture']" :options="prefectureList" dense
                                    emit-value map-options
                                    @update:model-value="searchData['ward'] = ''; searchData['station'] = ''" />
                            </div>
                            <div class="col-3 q-pl-sm">
                                <q-select outlined v-model="searchData['ward']"
                                    :options="prefectureData[prefJP[searchData['prefecture']]]"
                                    :disable="!searchData['prefecture']" dense />
                            </div>
                            <div class="col-3 q-pl-sm">
                                <q-select outlined v-model="searchData['station']"
                                    :options="stationData[prefJP[searchData['prefecture']]]"
                                    :disable="!searchData['prefecture']" dense />
                            </div>
                            <div class="col-3 q-pl-sm">
                                <q-select outlined v-model="searchData['route']" :disable="!searchData['prefecture']"
                                    dense />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">{{ $t('applicant.list.qualification') }}</div>
                            <div class="col-4"> {{ $t('applicant.list.yearsExperience') }}</div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <q-option-group v-model="searchData['qualification']" :options="qualificationOption"
                                    type="checkbox" inline />
                            </div>
                            <div class="col-4">
                              <DoubleNumberInput
                                :min-model-value="searchData['yearsExperienceMin']"
                                :max-model-value="searchData['yearsExperienceMax']"
                                unit-key="common.year"
                                @on-min-value-update="(v) => searchData['yearsExperienceMin'] = v"
                                @on-max-value-update="(v) => searchData['yearsExperienceMax'] = v"
                              />
                            </div>

                        </div>

                        <div class="row">
                            <div class="col-4">{{ $t('applicant.list.availableShift') }}</div>
                            <div class="col-3 q-pl-sm"> {{ $t('applicant.attendant.daysPerWeek') }}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <q-option-group v-model="searchData['availableShift']" :options="availableShiftOption"
                                    type="checkbox" inline />
                            </div>
                            <div class="col-6">
                                <q-option-group v-model="searchData['daysperweek']" :options="workingDaysOption"
                                    type="checkbox" inline />
                            </div>

                        </div>

                        <div class="row">
                            <div class="col-4">{{ $t('applicant.list.availableDays') }}</div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <div>
                                  <DoubleNumberInput
                                    :min-model-value="searchData['workPerWeekMin']"
                                    :max-model-value="searchData['workPerWeekMax']"
                                    unit-key="common.week"
                                    @on-min-value-update="(v) => searchData['workPerWeekMin'] = v"
                                    @on-max-value-update="(v) => searchData['workPerWeekMax'] = v"
                                  />
                                </div>
                                <div class="q-mt-sm">
                                  <DoubleNumberInput
                                    :min-model-value="searchData['workPerMonthMin']"
                                    :max-model-value="searchData['workPerMonthMax']"
                                    unit-key="common.month"
                                    @on-min-value-update="(v) => searchData['workPerMonthMin'] = v"
                                    @on-max-value-update="(v) => searchData['workPerMonthMax'] = v"
                                  />
                                </div>
                            </div>
                        </div>



                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-form>

        <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
            elevated bordered>
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
                                :label="expandedAdvance ? $t('common.closeArea') : $t('common.openArea')"
                                header-class="q-pa-none" switch-toggle-side />
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
                                    <q-option-group v-model="searchData['qualification']" :options="qualificationOption"
                                        type="checkbox" inline />
                                </div>
                            </div>
                            <!--yearsExperience-->
                            <div class="row">
                                <div class="col-12"> {{ $t('applicant.list.yearsExperience') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                  <DoubleNumberInput
                                    :min-model-value="searchData['yearsExperienceMin']"
                                    :max-model-value="searchData['yearsExperienceMax']"
                                    unit-key="common.year"
                                    @on-min-value-update="(v) => searchData['yearsExperienceMin'] = v"
                                    @on-max-value-update="(v) => searchData['yearsExperienceMax'] = v"
                                  />
                                </div>
                            </div>

                            <!-- classification -->
                            <div class="row q-pt-sm">
                                <div class="col-12">{{ $t('applicant.list.info.classiffication') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-option-group v-model="searchData['classification']"
                                        :options="classificationOption" type="checkbox" inline />
                                </div>
                            </div>

                            <!-- occupation -->
                            <div class="row q-pt-sm">
                                <div class="col-12"> {{ $t('applicant.add.occupation') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-option-group v-model="searchData['occupation']" :options="occupationOption"
                                        type="checkbox" inline />
                                </div>
                            </div>

                            <!--availableShift-->
                            <div class="row">
                                <div class="col-12">{{ $t('applicant.list.availableShift') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-option-group v-model="searchData['availableShift']"
                                        :options="availableShiftOption" type="checkbox" inline />
                                </div>
                            </div>

                            <!--daysPerWeek-->
                            <div class="row">
                                <div class="col-12"> {{ $t('applicant.attendant.daysPerWeek') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-option-group v-model="searchData['daysperweek']" :options="workingDaysOption"
                                        type="checkbox" inline />
                                </div>
                            </div>

                            <!--availableDays-->
                            <div class="row q-pt-sm">
                                <div class="col-12">{{ $t('applicant.list.availableDays') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div>
                                      <DoubleNumberInput
                                        :min-model-value="searchData['workPerWeekMin']"
                                        :max-model-value="searchData['workPerWeekMax']"
                                        unit-key="common.week"
                                        @on-min-value-update="(v) => searchData['workPerWeekMin'] = v"
                                        @on-max-value-update="(v) => searchData['workPerWeekMax'] = v"
                                      />
                                    </div>
                                    <div class="q-mt-sm">
                                      <DoubleNumberInput
                                        :min-model-value="searchData['workPerMonthMin']"
                                        :max-model-value="searchData['workPerMonthMax']"
                                        unit-key="common.month"
                                        @on-min-value-update="(v) => searchData['workPerMonthMin'] = v"
                                        @on-max-value-update="(v) => searchData['workPerMonthMax'] = v"
                                      />
                                    </div>
                                </div>
                            </div>

                            <!--sex-->
                            <div class="row q-pt-sm">
                                <div class="col-12"> {{ $t('applicant.add.sex') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <q-option-group v-model="searchData['sex']" :options="sexOption" type="checkbox"
                                        inline />
                                </div>
                            </div>

                            <!--status-->
                            <div class="row">
                                <div class="col-12"> {{ $t('applicant.add.status') }}</div>
                            </div>
                            <div class="row">
                                <div class="col-4">
                                    <q-select outlined dense :options="statusOption" emit-value map-options
                                        v-model="searchData['status']" clearable>
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
                                :label="expandedArea ? $t('common.closeArea') : $t('common.openArea')"
                                header-class="q-pa-none" switch-toggle-side />
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
import { ref, computed, onMounted, defineEmits } from 'vue'; //ref,
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { statusList } from 'src/shared/constants/Applicant.const';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import AreaSearch from './AreaSearch.vue';
import MapSearch from './MapSearch.vue';
import { getAuth } from '@firebase/auth';
// import { api } from 'src/boot/axios';
// import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { prefectureList as prefList } from 'src/shared/constants/Prefecture.const';
import { geohashForLocation } from 'geofire-common';
import DoubleNumberInput from './components/DoubleNumberInput.vue';


const { t } = useI18n({ useScope: 'global' });
const db = getFirestore();
const $q = useQuasar();

const searchDataSample = { sex: [], qualification: [], classification: [], occupation: [], availableShift: [], daysperweek: [] };

const searchData = ref(JSON.parse(JSON.stringify(searchDataSample)));
const prefectureList = ref(prefList);
const prefectureData = ref({});
const stationData = ref({});
//const selectedPref = ref({lable: ''})

const statusOption = ref(statusList)
const expanded = ref(false)
const expandedAdvance = ref(true)
const expandedArea = ref(true)
const drawerRight = ref(false);
const drawerType = ref('')
const prefJP = ref({})

const emit = defineEmits<{
    (e: 'loadSearchStaff', staffList)
    (e: 'isLoading', flag)
}>()

const sexOption = computed(() => {
    return [
        {
            label: t('applicant.add.male'),
            value: 'male'
        },
        {
            label: t('applicant.add.female'),
            value: 'female'
        },
    ]
});
const classificationOption = computed(() => {
    return [
        {
            label: t('applicant.list.info.classification.dispatch'),
            value: 'dispatch'
        },
        {
            label: t('applicant.list.info.classification.introduction'),
            value: 'introduction'
        },
    ]
});
const occupationOption = computed(() => {
    return [
        {
            label: t('applicant.add.nurse'),
            value: 'nurse'
        },
        {
            label: t('applicant.add.nursingCare'),
            value: 'nursingCare'
        },
    ]
});
const qualificationOption = computed(() => {
    return [
        {
            label: t('client.backOrder.regularReview'),
            value: 'regularReview'
        },
        {
            label: t('client.backOrder.assistant'),
            value: 'assistant'
        },
        {
            label: t('client.backOrder.careWorker'),
            value: 'careWorker'
        },
        {
            label: t('client.backOrder.practitioners'),
            value: 'practitioners'
        },
        {
            label: t('client.backOrder.newcomer'),
            value: 'newcomer'
        },
    ]
});
const availableShiftOption = computed(() => {
    return [
        {
            label: t('office.earlyShift'),
            value: 'workinghoursearly'
        },
        {
            label: t('office.dayShift'),
            value: 'workinghoursday'
        },
        {
            label: t('office.lateShift'),
            value: 'workinghourslate'
        },
        {
            label: t('office.nightShift'),
            value: 'workinghoursnight'
        },
    ]
});

const workingDaysOption = computed(() => {
    return [
        {
            label: t('weekDay.sunday'),
            value: 'sunday'
        },
        {
            label: t('weekDay.monday'),
            value: 'monday'
        },
        {
            label: t('weekDay.tuesday'),
            value: 'tuesday'
        },
        {
            label: t('weekDay.wednesday'),
            value: 'wednesday'
        },
        {
            label: t('weekDay.thursday'),
            value: 'thursday'
        },
        {
            label: t('weekDay.friday'),
            value: 'friday'
        },
        {
            label: t('weekDay.saturday'),
            value: 'saturday'
        },
        {
            label: t('weekDay.holiday'),
            value: 'holiday'
        },
    ]
});


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

    const stationDocRef = doc(db, 'metadata', 'stationList');
    const stationDocSnap = await getDoc(stationDocRef);

    if (stationDocSnap.exists()) {
        stationData.value = stationDocSnap.data();

    }

    const docRefPref = doc(db, 'metadata', 'prefectureJP');
    const docSnapPref = await getDoc(docRefPref);

    if (docSnapPref.exists()) {
        prefJP.value = docSnapPref.data();
    }


});

const updateArea = (selectedPrefectures, selectedWards) => {
    // searchData.value['prefecture'] = selectedPrefectures;
    let prefectures = []
    for (var i = 0; i < selectedPrefectures.length; i++) {
        prefectures.push(Object.keys(prefJP.value).find(key => prefJP.value[key] === selectedPrefectures[i]) as never)
    }
    searchData.value['prefecture'] = prefectures;

    searchData.value['ward'] = selectedWards;

    //
}
const updateMap = (mapData) => {
    try {
        mapData['geohash'] = geohashForLocation([parseFloat(mapData['lat']), parseFloat(mapData['lng'])]);
    }
    catch (err) {
        console.log(err)
        $q.notify({
            textColor: 'white',
            color: 'red-5',
            icon: 'warning',
            message: 'invalid lat or lon',
        });
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
    //const token = await user.getIdToken();
    emit('loadSearchStaff', searchData.value)
    emit('isLoading', false)

    // try {
    //     const response = await api.post(
    //         searchConfig.searchStaff,
    //         searchData.value,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             timeout: 30000,
    //         }
    //     )
    //     console.log(response.data)
    //     emit('loadSearchStaff', response.data)
    //     emit('isLoading', false)
    // } catch (error) {
    //     emit('isLoading', false)
    //     console.error('Failed to search staff', error);
    // }
};

const Reset = () => {
    searchData.value = JSON.parse(JSON.stringify(searchDataSample));
    //searchStaff();
}



</script>

<style lang="scss">
.q-item__section--avatar {
    min-width: 16px !important;
    padding: 0px !important;
}
</style>

