<template>
  <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
  elevated bordered>
  <q-scroll-area class="fit text-left">
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="jobForm" @submit="saveArea">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
                      <div class="q-mr-sm">
                          <div>
                              {{ transactionText }}
                              <span v-if="projectText">/ {{ projectText }}</span>
                          </div>
                          <div class="text-h6">{{ selectedAreaData['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="selectedAreaData['id'] ? $t('regionSalary.add.areaUpdate') : $t('regionSalary.add.areaReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="drawerRight">
              <div class="row">
                  {{ $t('regionSalary.list.areaName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedAreaData['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-pt-sm">
                  {{ $t('regionSalary.add.areaInfo') }}
              </div>

              <div class="row">
                  <div class="col-4">
                      {{ $t('job.add.transactionType') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('job.projectType') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('client.add.facilityType') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="transactionTypeOptions" emit-value map-options
                          v-model="selectedAreaData['transactionType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedAreaData['transactionType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="projectTypeOptions" emit-value map-options
                          v-model="selectedAreaData['projectType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedAreaData['projectType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-select outlined dense :options="facilityTypeOption" emit-value map-options
                          option-label="name" v-model="selectedAreaData['facilityType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedAreaData['facilityType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row">
                  {{ $t('regionSalary.add.areaDesc') }}
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedAreaData['desc']" hide-bottom-space />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('regionSalary.add.citySetting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add"
                      @click="openCitySettingDialog" :disable="!selectedAreaData.id" />
              </div>

              <q-table :columns="columns" :rows="wardList" row-key="id" class="no-shadow q-mt-sm"
                  v-model:pagination="pagination" hide-pagination :loading="loading" dense>
                  <template v-slot:header-cell-name="props">
                      <q-th :props="props" class="q-pa-none">
                          <div> {{ $t('regionSalary.list.areaID') }} </div>
                          <div> {{ $t('regionSalary.list.areaName') }} </div>
                      </q-th>
                  </template>
                  <template v-slot:header-cell-monthlySalary="props">
                      <q-th :props="props" class="q-pa-none">
                          <div> {{ $t('job.add.salaryCap') }} ({{ $t('office.monthlySalary') }}) </div>
                          <div> {{ $t('job.add.minSalary') }} ({{ $t('office.monthlySalary') }})</div>
                      </q-th>
                  </template>
                  <template v-slot:header-cell-hourlySalary="props">
                      <q-th :props="props" class="q-pa-none">
                          <div> {{ $t('job.add.salaryCap') }} ({{ $t('office.hourlyWage') }}) </div>
                          <div> {{ $t('job.add.minSalary') }} ({{ $t('office.hourlyWage') }})</div>
                      </q-th>
                  </template>

                  <template v-slot:header-cell-updatedBy="props">
                      <q-th :props="props" class="q-pa-none">
                          <div> {{ $t('regionSalary.list.updatedBy') }} </div>
                          <div> {{ $t('regionSalary.list.updatedDate') }} </div>
                      </q-th>
                  </template>
                  <template v-slot:header-cell-author="props">
                      <q-th :props="props" class="q-pa-none">
                          <div> {{ $t('job.author') }} </div>
                          <div> {{ $t('job.creationDate') }} </div>
                      </q-th>
                  </template>

                  <template v-slot:body-cell-prefecture="props">
                      <q-td :props="props">
                          <span v-if="props.row.prefecture">{{ $t('prefectures.' + props.row.prefecture) }}</span>
                      </q-td>
                  </template>
                  <template v-slot:body-cell-monthlySalary="props">
                      <q-td :props="props">
                          <div v-if="props.row.monthlySalaryCap"> {{ props.row.monthlySalaryCap }}</div>
                          <div v-if="props.row.monthlySalaryMin"> {{ props.row.monthlySalaryMin }}</div>
                      </q-td>
                  </template>
                  <template v-slot:body-cell-hourlySalary="props">
                      <q-td :props="props">
                          <div v-if="props.row.hourlySalaryCap"> {{ props.row.hourlySalaryCap }}</div>
                          <div v-if="props.row.hourlySalaryMin"> {{ props.row.hourlySalaryMin }}</div>
                      </q-td>
                  </template>

              </q-table>
              <div class="row justify-start q-mt-md pagination">
                  <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
                      :max="(wardList.length / pagination.rowsPerPage) >= 1 ? wardList.length / pagination.rowsPerPage : 1"
                      direction-links outline />
              </div>
          </q-card-section>
      </q-form>

      <q-dialog v-model="prompt" persistent>
          <q-card style="min-width: 650px">
              <q-card-section class="row items-center">
                  <div class="text-h6">{{ $t('regionSalary.add.citySetting') }}</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>

              <q-card-section class="q-pt-none">
                  <div class="q-mb-sm text-body1">{{ $t('applicant.add.prefecture') }}</div>
                  <div class="row" v-for="rowIndex in 8" :key="rowIndex">
                      <div class="col-2" v-for="index in 6" :key="rowIndex * index">
                          <q-checkbox v-model="citySetting['prefecture']" dense
                              :val="prefectureList[(rowIndex * 6) + index].value"
                              :label="prefectureList[(rowIndex * 6) + index].label"
                              v-if="prefectureList[(rowIndex * 6) + index]" />
                      </div>
                  </div>

                  <div class="q-mb-sm q-mt-sm text-body1">{{ $t('applicant.add.municipalities') }}</div>
                  <div v-for="ward in Object.keys(wardData)" :key="ward" class="q-mt-sm">
                      {{ $t('prefectures.' + ward) }}
                      <div class="row" v-for="rowIndex in wardData[ward].length" :key="rowIndex">
                          <div class="col-3" v-for="index in 4" :key="rowIndex * index">
                              <q-checkbox v-model="citySetting['ward'][ward]" dense
                                  :val="wardData[ward][(rowIndex * 4) + index]"
                                  :label="wardData[ward][(rowIndex * 4) + index]"
                                  v-if="wardData[ward][(rowIndex * 4) + index]" />
                          </div>
                      </div>

                  </div>

                  <div class="row text-body1">
                      <div class="col-6">
                          {{ $t('office.monthlySalary') }}
                      </div>
                      <div class="col-6">
                          {{ $t('office.hourlyWage') }}
                      </div>
                  </div>

                  <div class="row">
                      <div class="col-3">
                          {{ $t('job.add.salaryCap') }}
                      </div>
                      <div class="col-3">
                          {{ $t('job.add.minSalary') }}
                      </div>
                      <div class="col-3">
                          {{ $t('job.add.salaryCap') }}
                      </div>
                      <div class="col-3">
                          {{ $t('job.add.minSalary') }}
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-3">
                          <q-input dense outlined type="number" min="0" v-model="citySetting['monthlySalaryCap']"
                              autofocus class="q-mr-sm" />
                      </div>
                      <div class="col-3">
                          <q-input dense outlined type="number" min="0" v-model="citySetting['monthlySalaryMin']"
                              autofocus class="q-mr-sm" />
                      </div>
                      <div class="col-3">
                          <q-input dense outlined type="number" min="0" v-model="citySetting['hourlySalaryCap']"
                              autofocus class="q-mr-sm" />
                      </div>
                      <div class="col-3">
                          <q-input dense outlined type="number" min="0" v-model="citySetting['hourlySalaryMin']"
                              autofocus />
                      </div>
                  </div>

              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                  <q-btn flat :label="$t('common.cancel')" color="danger" v-close-popup />
                  <q-btn flat :label="$t('common.save')" @click="addNewCity" />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-card>
  </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref,Ref, watch, onMounted, onBeforeUnmount,computed,ComputedRef } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { regionSalaryAddColumns } from 'src/shared/constants/JobAd.const';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { useRegionalSalarySetting } from 'src/stores/regionalSalarySetting'
import {AreaCityModel} from 'src/shared/model/Jobs.model'
import { DocumentData } from 'firebase/firestore';
import { AreaDataObject } from 'src/shared/model/Jobs.model';
import { QForm } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';

const regionalSalarySettingStore = useRegionalSalarySetting()
const unsubscribeWard = ref();
const drawerRight = ref(false)
const transactionText = ref('')
const projectText = ref('')
const jobForm:Ref<QForm | null | undefined>  = ref();
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const facilityTypeOption = ref(facilityList);
const columns = ref(regionSalaryAddColumns);
const prompt = ref(false)
const citySetting = ref({ prefecture: [], ward: {} });
const wardJPList:DocumentData = ref([]);
const prefectureJPList:Ref<string[]> = ref([]);
const wardData:DocumentData = ref({});
const wardList:Ref<AreaCityModel[]> = ref([]);
const selectedAreaData = ref<AreaDataObject | ComputedRef>(
  computed(() => regionalSalarySettingStore.state.regionSalary)
);
const loading = ref(false);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

onMounted(async () => {
  selectedAreaData.value.transactionType = selectedAreaData.value['transactionType'] || '';
  selectedAreaData.value.projectType = selectedAreaData.value['projectType'] || '';
  let areaId = selectedAreaData.value['id'] || '';
  if (areaId) {
    loading.value = true;
    wardList.value = await regionalSalarySettingStore.fetchWardListData(areaId)
          loading.value = false;
  }
})

onBeforeUnmount(() => {
  if (unsubscribeWard.value) {
      unsubscribeWard.value();
  }

})

const showDrawerWithData = async (data: AreaDataObject) => {
  if (selectedAreaData.value.id && selectedAreaData.value.id !== data.id) {
    drawerRight.value = false;
  }
  regionalSalarySettingStore.state.regionSalary = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  regionalSalarySettingStore.state.regionSalary={}
  drawerRight.value = true
}
watch(
  () => (citySetting.value.prefecture),
  (newVal, oldVal) => {
      wardData.value = {}
      let removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)

      for (let i = 0; i < newVal.length; i++) {
          let pref = prefectureJPList.value[newVal[i]];
          if (!(newVal[i] in citySetting.value.ward)) {
              citySetting.value.ward[newVal[i]] = [] as never;
          }

          for (const key in wardJPList.value) {
              for (let j = 0; j < wardJPList.value[key]['length']; j++) {
                  if (pref in wardJPList.value[key][j]) {
                      wardData.value[newVal[i]] = wardJPList.value[key][j][pref];
                  }
              }
          }
      }
      for (let i = 0; i < removedItem.length; i++) {
          citySetting.value.ward[removedItem[i]] = [] as never;

      }

  })


watch(
  () => (selectedAreaData.value.transactionType),
  (newVal,) => {
      transactionText.value = '';

      const objTrans = applicantClassification.value.find(o => o.value === newVal);
      if (objTrans) {
          transactionText.value = objTrans.label;
      }
  }
)

watch(
  () => (selectedAreaData.value.projectType),
  (newVal,) => {
      projectText.value = '';

      const objProject = occupationList.value.find(o => o.value === newVal);
      if (objProject) {
          projectText.value = objProject.label;
      }
  }
)

const saveArea = async () => {
  try {
      if (selectedAreaData.value.id) {
          await regionalSalarySettingStore.updateFormData(selectedAreaData.value)
          drawerRight.value=false

      } else {
         await regionalSalarySettingStore.addFormData(selectedAreaData.value)
         drawerRight.value=false
      }
      jobForm.value?.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }

}

const openCitySettingDialog = () => {
  citySetting.value = { prefecture: [], ward: {} };
  prompt.value = true
}

const addNewCity = async () => {
  await regionalSalarySettingStore.addNewCity(citySetting.value,selectedAreaData.value.id)
  prompt.value = false;
}
defineExpose({ showDrawerWithData ,openDrawer})
</script>
