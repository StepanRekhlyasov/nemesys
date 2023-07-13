
<template>
  <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
          <span class="text-h6" v-if="areaFlag">{{ $t('job.regionSalarySettings') }} </span>
          <span class="text-h6" v-else>{{ $t('job.areaSalarySettings') }} </span>
          <span class="q-ml-md">{{ $t('common.area') }}</span>
          <q-toggle class="q-ml-xs q-mr-xs" v-model="areaFlag" dense />
          <span>{{ $t('applicant.add.municipalities') }}</span>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="bg-grey-3">
          <div class="row">
              <div class="col-6">
                  検索条件 / 案件種別：看護</div>
          </div>
          <div class="row">
              <div class="col-6">
                  <q-btn outline color="primary" :label="$t('job.changeSearchCondition')" />
              </div>
          </div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none" v-if="areaFlag">
          <q-table :columns="columns" :rows="areaList" row-key="id" selection="multiple" class="no-shadow"
              v-model:selected="selected" v-model:pagination="pagination" hide-pagination :loading="loading">
              <template v-slot:top>
                  <div class="row full-width">
                      <div class="col-4">

                      </div>
                      <div class="col-8">
                          <q-btn color="primary" dense :label="$t('regionSalary.list.issueNewArea')" icon="add"
                              @click="openAddDrawer" />
                          <span class="text-primary q-ml-sm text-caption">{{
                              $t('regionSalary.list.issueNewAreaHint')
                          }}</span>
                      </div>
                  </div>
              </template>
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

              <template v-slot:body-cell-name="props">
                  <q-td :props="props" class="q-pa-none">
                      <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary" :label="props.value"
                          class="q-pa-none text-body1" />
                      <div>
                          {{ props.row.occupation }} <span v-if="props.row.category">| {{ props.row.category }}</span>
                      </div>
                  </q-td>
              </template>

              <template v-slot:body-cell-transactionType="props">
                  <q-td :props="props">
                      <span v-if="props.value">
                          {{ getTransactionText(props.row.transactionType) }}
                      </span>
                  </q-td>
              </template>
              <template v-slot:body-cell-projectType="props">
                  <q-td :props="props">
                      <span v-if="props.value">
                          {{ getProjectText(props.row.projectType) }}
                      </span>
                  </q-td>
              </template>
              <template v-slot:body-cell-facilityType="props">
                  <q-td :props="props">
                      <span v-if="props.value">
                          {{ getFacilityText(props.row.facilityType) }}
                      </span>
                  </q-td>
              </template>
              <template v-slot:body-cell-office="props">
                  <q-td :props="props">
                      <div v-if="props.row.client">
                          {{ props.row.client.label }}
                      </div>
                      <div v-if="props.row.office">
                          {{ props.row.office.label }}
                      </div>
                  </q-td>
              </template>

              <template v-slot:body-cell-author="props">
                  <q-td :props="props">
                      <span v-if="props.row.created_by">{{ userData[props.row.created_by] }} <br></span>
                      {{ toDate(props.row.created_at ) }}
                  </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                      <q-btn flat round icon="delete_outline" @click="deleteJob(props.row.id)" />
                  </q-td>
              </template>
          </q-table>
          <div class="row justify-start q-mt-md pagination">
              <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
                  :max="(areaList.length / pagination.rowsPerPage) >= 1 ? areaList.length / pagination.rowsPerPage : 1"
                  direction-links outline />
          </div>
      </q-card-section>
      <q-card-section class=" q-pa-none" v-else>
          <q-table :columns="columnsWard" :rows="wardList" row-key="id" selection="multiple" class="no-shadow"
              v-model:selected="selectedWard" v-model:pagination="pagination" hide-pagination :loading="loading">
              <template v-slot:top>
                  <div class="row full-width">
                      <div class="col-4">

                      </div>
                      <div class="col-8">
                          <q-btn color="primary" dense :label="$t('regionSalary.list.issueNewArea')" icon="add"
                              @click="openAddDrawer" />
                          <span class="text-primary q-ml-sm text-caption">{{
                              $t('regionSalary.list.issueNewAreaHint')
                          }}</span>
                      </div>
                  </div>
              </template>
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
      <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
          elevated bordered>
          <q-scroll-area class="fit text-left">
              <addRegionComponent :selectedArea="selectedArea" :isDrawer="drawerRight" @hideDrawer="hideDrawer"
                  :key="selectedArea?.key" />
          </q-scroll-area>
      </q-drawer>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import addRegionComponent from './components/addRegion.vue';
import { regionSalaryColumns, regionSalaryAddColumns } from 'src/shared/constants/JobAd.const';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { toDate } from 'src/shared/utils/utils';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useRegionalSalarySetting } from 'src/stores/regionalSalarySetting'
import { DocumentData } from 'firebase/firestore';
import { QTableProps } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
defineProps<{
  columns: QTableProps['columns'];
  areaList:QTableProps['rows'];
  columnsWard: QTableProps['columns'];
  wardList:QTableProps['rows']
}>();
const areaList:DocumentData = ref([]);
const regionalSalarySettingStore = useRegionalSalarySetting()
const selected = ref([]);
const selectedWard = ref([]);
const drawerRight = ref(false);
const selectedArea = ref({ key: 'null' });
const userData = ref({});
const columns = ref(regionSalaryColumns);
const columnsWard = ref(regionSalaryAddColumns);
const loading = ref(true);
const areaFlag = ref(true);
const wardList:DocumentData = ref([]);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 30
});

const fetchRegionalSalaryData = async () => {
  loading.value = true;
  areaList.value = await regionalSalarySettingStore.loadJobAreaData();
  wardList.value = await regionalSalarySettingStore.loadAreaCityData()
  loading.value = false;
};

const openDrawer = async (data) => {
  if (!data.id) {
      drawerRight.value = false;
  }
  data['key'] = data.id;
  selectedArea.value = data;
  setTimeout(() => drawerRight.value = true, 300);
};

const openAddDrawer = async () => {
  selectedArea.value = { key: `${Math.floor(Math.random() * 1000)}` };
  setTimeout(() => drawerRight.value = true, 300);
};
const hideDrawer = () => {
  selectedArea.value = { key: `${Math.floor(Math.random() * 1000)}` };
  drawerRight.value = false
};

const getTransactionText = (transactionType: string) => {
  let transactionText = '';
  let obj = applicantClassification.value.find(o => o.value === transactionType);
  if (obj) {
      transactionText = obj.label;
  }
  return transactionText;
};
const getProjectText = (projectType: string) => {
  let projectText = '';
  let obj = occupationList.value.find(o => o.value === projectType);
  if (obj) {
      projectText = obj.label;
  }
  return projectText;
};
const getFacilityText = (facilityType: string) => {
  let facilityText = '';
  let obj = facilityList.value.find(o => o.value === facilityType);
  if (obj) {
      facilityText = obj.name;
  }
  return facilityText;
};
const showDeleteDialog = async (ids: string) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel')
  }).onOk(async () => {
    loading.value=true
    await regionalSalarySettingStore.deleteJobAreaData(ids);
    loading.value=false
    fetchRegionalSalaryData()
     Alert.success()
  });
};
 const deleteJob = (id) => {
  showDeleteDialog(id);
};
onMounted(() => {
  fetchRegionalSalaryData();
});

</script>
