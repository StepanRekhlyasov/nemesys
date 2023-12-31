<template>
  <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3 text-h6">
          {{ $t('job.jobSearch') }}
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="bg-grey-3">
          <div class="row">
              <div class="col-6">
                  検索条件 / 案件種別：看護</div>
              <div class="col-6 text-right">
                  <q-btn flat size="sm" color="primary" :label="$t('job.addNewJobBO')" />
              </div>
          </div>
          <div class="row">
              <div class="col-6">
                  <q-btn outline color="primary" :label="$t('job.changeSearchCondition')" />
                  <q-btn color="primary" :label="$t('job.batchPublishJobAds')" class="q-ml-md" />
              </div>
              <div class="col-6 text-right">
                  <q-btn color="primary" :label="$t('job.addNewJob')" icon="add" @click="openAddDrawer" />
              </div>
          </div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
          <q-table :columns="columns" :rows="jobList" row-key="id" selection="multiple" class="no-shadow"
              v-model:selected="selected" v-model:pagination="pagination" hide-pagination :loading="loading">
              <template v-slot:header-cell-name="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('job.jobID') }} </div>
                      <div> {{ $t('job.jobName') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-office="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('job.office') }} </div>
                      <div> {{ $t('job.client') }} </div>
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
                      <q-btn size="sm" color="primary" :label="$t('job.publish')" />
                      <q-btn flat round icon="delete_outline" @click="deleteJob(props.row.id)" />
                  </q-td>
              </template>
          </q-table>
          <div class="row justify-start q-mt-md pagination">
              <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
                  :max="(jobList.length / pagination.rowsPerPage) >= 1 ? jobList.length / pagination.rowsPerPage : 1"
                  direction-links outline />
          </div>
      </q-card-section>
      <addJobComponent ref="jobDrawer" />
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useQuasar,QTableProps } from 'quasar';
import { ref, onMounted } from 'vue';
import addJobComponent from './components/addJob.vue';
import { jobSearchColumns } from 'src/shared/constants/JobAd.const'
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { toDate } from 'src/shared/utils/utils';
import { useJobSearch } from 'src/stores/jobSearch'
import { DocumentData } from 'firebase/firestore';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const jobList:DocumentData = ref([]);
const selected = ref([]);
const jobSearchStore = useJobSearch()
const selectedJob = ref({ key: 'null' });
const userData = ref({});
const jobDrawer = ref<InstanceType<typeof addJobComponent> | null>(null);
const columns = ref(jobSearchColumns);
const loading = ref(true);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 30
});

  defineProps<{
  columns: QTableProps['columns'];
  jobList:QTableProps['rows']
}>();
const openDrawer = async (data) => {
  data['key'] = data.id;
  selectedJob.value = data;
  jobDrawer.value?.showDrawerWithData(data);
};
const openAddDrawer = async () => {
  jobDrawer.value?.openDrawer();
};
const fetchJobSearchData = async () => {
  loading.value = true;
  const data = await jobSearchStore.loadJobSearchData();
  jobList.value = data.map((row) => {
    return { ...row };
  });
  loading.value = false;
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
    await jobSearchStore.deleteJobSearch(ids);
    loading.value=false
    fetchJobSearchData()
  });
};
 const deleteJob = (id) => {
  showDeleteDialog(id);
};
watchCurrentOrganization(async () => {
  loading.value = true;
  fetchJobSearchData()
  loading.value = false;
})
onMounted(() => {
  fetchJobSearchData();
});

</script>
