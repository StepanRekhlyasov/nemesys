<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
      </q-card-section>

      <q-separator color="white" size="2px" />

      <q-card-section class="q-pa-xs">
        <searchForm @load-search-staff="loadSearchStaff" />
      </q-card-section>

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
        <q-table :columns="columns" :rows="applicantData" row-key="id" selection="multiple" class="no-shadow" v-model:pagination="paginationTable" hide-pagination :loading="isLoadingProgress">
          <template v-slot:header-cell-name="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.list.name') }} </div>
              <div> {{ $t('applicant.add.occupation') }} | {{ $t('applicant.list.category') }} </div>
              <div> {{ $t('applicant.list.address') }} </div>
            </q-th>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="q-pa-none">
              <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary" :label="props.value"
                class="q-pa-none text-body1" />
              <div>
                <span v-if="props.row.occupation"> {{ getOccupation(props.row.occupation) }}</span>
                <span v-if="props.row.classification && props.row.occupation"> | </span>
                <span v-if="props.row.classification"> {{ getClassification(props.row.classification) }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span v-if="props.value">{{ getStatus(props.value) }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-qualification="props">
            <q-td :props="props">
              <span v-if="props.value && props.value.length > 0">
                {{ props.value.map(item => $t('applicant.add.' + item)).join(', ') }}
              </span>
            </q-td>
          </template>

        </q-table>
        <div class="row justify-start q-mt-md pagination">
          <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
            :max="metaData.total_pages" direction-links outline />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <ApplicantDetails ref="detailsDrawer" />
</template>
 
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed, watch, ComputedRef } from 'vue';
import { where } from 'firebase/firestore';
import searchForm from './components/search/searchForm.vue';
import { api } from 'src/boot/axios';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { statusList, occupationList, applicantClassification} from 'src/shared/constants/Applicant.const';
import { QTableProps } from 'quasar';
import { ApplicantElasticFilter, ApplicantElasticSearchData } from 'src/pages/user/Applicant/types/applicant.types';
import { Applicant, ApplicantOccupation } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';

const { t } = useI18n({ useScope: 'global' });

const applicantStore = useApplicant()
const applicantData = ref<Applicant[]>([]);
const isLoadingProgress = ref(true)
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const metaData = ref<{
  current: number,
  size: number,
  total_pages: number,
  total_results: number
}>({
  current: 0,
  size: 0,
  total_pages: 0,
  total_results: 0
})

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

const paginationTable = ref({
  sortBy: 'desc',
  descending: false,
  rowsPerPage: 10
});
const columns : ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      label: '',
      field: 'name',
      required: true,
      align: 'left',
      sortable: false,
    },
    {
      name: 'rank',
      label: t('applicant.list.rank'),
      field: 'rank',
      required: true,
      align: 'left',
    },
    {
      name: 'status',
      label: t('applicant.list.status'),
      field: 'status',
      required: true,
      align: 'left',
    },
    {
      name: 'qualification',
      label: t('applicant.list.qualification'),
      field: 'qualification',
      required: true,
      align: 'left',
    },
  ];
});


const currentIds = ref<number[]>([]);

const getDate = (ageInYears : number) => {
  const calDate = new Date();
  calDate.setFullYear(calDate.getFullYear() - ageInYears);
  const year = calDate.toLocaleString('en-US', { year: 'numeric' });
  const month = calDate.toLocaleString('en-US', { month: '2-digit' });
  const day = calDate.toLocaleString('en-US', { day: '2-digit' });
 
  return year + '-' + month + '-' + day + 'T00:00:00+00:00';
}
 
const formatDate = (dt : Date, midNight = false) => {
  const year = dt.toLocaleString('en-US', { year: 'numeric' });
  const month = dt.toLocaleString('en-US', { month: '2-digit' });
  const day = dt.toLocaleString('en-US', { day: '2-digit' });
  if (midNight) {
    return year + '-' + month + '-' + day + 'T00:00:00+00:00';
 
  }
  return year + '-' + month + '-' + day + 'T23:59:59+00:00';
}

const loadApplicantData = async (searchData : ApplicantElasticSearchData = {}) => {
  isLoadingProgress.value = true
  applicantData.value = []

  const filters : ApplicantElasticFilter = ref({ 'all': [{ 'deleted': 'false' }] }).value;
  const queryString = searchData['keyword'] ? searchData['keyword'] : ''

  if (searchData['status']) {
    filters['all'].push({
      'status': searchData['status']
    });
  }
  if (searchData.applicationDateMin && searchData.applicationDateMax) {
    filters['all'].push({
      'applicationdate': { 'from': formatDate(new Date(searchData.applicationDateMin), true), 'to': formatDate(new Date(searchData.applicationDateMax)) }
    });
  }
  else if (searchData.applicationDateMin) {
    filters['all'].push({
      'applicationdate': { 'from': formatDate(new Date(searchData.applicationDateMin), true) }
    });
  }
  else if (searchData.applicationDateMax) {
    filters['all'].push({
      'applicationdate': { 'to': formatDate(new Date(searchData.applicationDateMax)) }
    });
  }
  if (searchData.ageMin) {
    filters['all'].push({
      'dob': { 'to': getDate(parseInt(searchData.ageMin)) }
    });
  }
  if (searchData.ageMax) {
    filters['all'].push({
      'dob': { 'from': getDate(parseInt(searchData.ageMax)) }
    });
  }
 
  const items = ['sex', 'classification', 'occupation', 'qualification', 'daysperweek', 'prefecture', 'route', 'neareststation', 'municipalities', 'staffrank']
  for (var i = 0; i < items.length; i++) {
    if (searchData[items[i]] && searchData[items[i]].length > 0) {
      let obj = {}
      obj[items[i]] = searchData[items[i]]
      filters['all'].push(obj);
    }
  }
  if (searchData.availableShift && searchData.availableShift.length > 0) {
    for (var i = 0; i < searchData.availableShift.length; i++) {
      let obj = {}
      obj[searchData.availableShift[i]] = 'true'
      filters['all'].push(obj);
    }
  }
  if (searchData.workPerWeekMin && searchData.workPerWeekMax) {
    filters['all'].push({
      'daystowork': { 'from': parseInt(searchData.workPerWeekMin), 'to': parseInt(searchData.workPerWeekMax) }
    });
  } else if (searchData.workPerWeekMin) {
    filters['all'].push({
      'daystowork': { 'from': parseInt(searchData.workPerWeekMin) }
    });
  } else if (searchData.workPerWeekMax) {
    filters['all'].push({
      'daystowork': { 'to': parseInt(searchData.workPerWeekMax) }
    });
  }
 
  if (searchData.mapData) {
    filters['all'].push({
      'geohash': {
        'center': `${searchData.mapData.lat}, ${searchData.mapData.lng}`,
        'distance': searchData.mapData.radiusInM,
        'unit': 'm'
      }
    });
  }
 
  if (!queryString && filters.all.length == 1) {
    const d = new Date();
    const m = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    /** If still in same month, set date to last day of previous month */
    if (d.getMonth() == m) d.setDate(0);
    filters['all'].push({
      'created_at': { 'from': formatDate(d, true), 'to': formatDate(new Date()) }
    });
  }
  await api.post(
    (process.env.elasticSearchStaffURL as string),
    {
      'query': queryString,
      'page': { 'size': pagination.value.rowsPerPage, 'current': pagination.value.page },
      'filters': filters,
    },
    {
      headers: { 'Authorization': process.env.elasticSearchKey, 'Content-Type': 'application/json' },
    }
  ).then(async (response) => {
    if (response.status == 200) {
      const responseData = ref(response.data.results).value;
      metaData.value = response.data.meta.page;
      for (var i = 0; i < responseData.length; i++) {
        currentIds.value.push(responseData[i]['id']['raw'])
      }
      loadFirestoreApplicantData()
    }
  }).catch((error) => {
    console.log(error)
  });

};
loadApplicantData();

const loadFirestoreApplicantData = async () => {
  isLoadingProgress.value = true
  applicantData.value = [];
  while (currentIds.value.length) {
    const batch = currentIds.value.splice(0, 10);
    applicantData.value = await applicantStore.getApplicantsByConstraints([where('deleted', '==', false), where('id', 'in', batch)])
  }
  isLoadingProgress.value = false
}

const getStatus = (status : string) => {
  const item = statusList.value.find(x => x.value === status);
  if (item) {
    return item.label;
  }
};
const getOccupation = (occupation : ApplicantOccupation) => {
  if (!occupation) {
    return ''
  }
  let occupationIndex = occupationList.value.findIndex((p) => p.value == occupation);
  if (occupationIndex > -1) {
    return occupationList.value[occupationIndex].label
  }
};
const getClassification = (classification : string) => {
  if (!classification) {
    return ''
  }
  const classificationndex = applicantClassification.value.findIndex((p) => p.value == classification);
  if (classificationndex > -1) {
    return applicantClassification.value[classificationndex].label
  }
};

const openDrawer = (data : Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};
 
const preventWatch = ref(false)
const loadSearchStaff = async (data : ApplicantElasticSearchData) => {
  preventWatch.value = true
  pagination.value.page = 1
  await loadApplicantData(data)
  preventWatch.value = false
};

watch(
  () => (pagination.value.page),
  () => {
    if(!preventWatch.value) {
      loadApplicantData();
    }
  },
)
</script>
