<template>
  <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
          <span class="text-h6">{{ $t('job.jobPostingHistory') }} </span>
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
              <div class="col-6 text-right">
                  <q-btn color="primary" :label="$t('jobAd.addNewJobAd')" icon="add" @click="openAddDrawer" />
              </div>
          </div>

      </q-card-section>

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
          <q-table :columns="columns" :rows="jobAdList" row-key="id" selection="multiple" class="no-shadow"
              v-model:selected="selected" v-model:pagination="pagination" hide-pagination :loading="loading">
              <template v-slot:header-cell-name="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('jobAd.list.jobAdID') }} </div>
                      <div> {{ $t('jobAd.list.jobAdName') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-jobName="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('job.jobID') }} </div>
                      <div> {{ $t('job.jobName') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-projectType="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('job.projectType') }} </div>
                      <div> {{ $t('job.transactionType') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-issuingFormat="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('jobAd.list.issuingFormatID') }} </div>
                      <div> {{ $t('jobAd.list.issuingFormatName') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-area="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('regionSalary.list.areaName') }} </div>
                      <div> {{ $t('regionSalary.list.numMunicipalities') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-author="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('jobAd.list.issuer') }} </div>
                      <div> {{ $t('jobAd.list.issuingDate') }} </div>
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
                      <q-btn size="sm" color="primary" :label="$t('jobAd.list.reissue')" />
                  </q-td>
              </template>
          </q-table>
          <div class="row justify-start q-mt-md pagination">
              <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
                  :max="(jobAdList.length / pagination.rowsPerPage) >= 1 ? jobAdList.length / pagination.rowsPerPage : 1"
                  direction-links outline />
          </div>
      </q-card-section>
      <addJobAdComponent ref="jobPostingDrawer" />
  </q-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import addJobAdComponent from './components/addJobAd.vue';
import { jobAdColumns } from 'src/shared/constants/JobAd.const';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { toDate } from 'src/shared/utils/utils';
import { useJobPostingHistory } from 'src/stores/jobPostingHistory'
import { DocumentData } from 'firebase/firestore';
import { QTableProps } from 'quasar';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const jobPostingDrawer = ref<InstanceType<typeof addJobAdComponent> | null>(null);
const jobAdList:DocumentData = ref([]);
const selected = ref([]);
const selectedJobAd = ref({ key: 'null' });
const jobPostingHistoryStore = useJobPostingHistory()
const userData = ref({});
const columns = ref(jobAdColumns);
const loading = ref(true);

defineProps<{
  columns: QTableProps['columns'];
  jobAdList:QTableProps['rows'];
}>();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 30
});

const fetchJobAdsData = async () => {
  loading.value = true;
  const data = await jobPostingHistoryStore.loadJobAdsData();
  jobAdList.value = data.map((row) => {
    return { ...row };
  });
  loading.value = false;
};

const openDrawer = async (data) => {
  data['key'] = data.id;
  selectedJobAd.value = data;
  jobPostingDrawer.value?.showDrawerWithData(data);
};
const openAddDrawer = async () => {
  jobPostingDrawer.value?.openDrawer();
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
watchCurrentOrganization(async () => {
  loading.value = true;
  fetchJobAdsData()
  loading.value = false;
})
onMounted(() => {
  fetchJobAdsData();
});

</script>
