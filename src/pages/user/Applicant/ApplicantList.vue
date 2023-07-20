<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
      </q-card-section>

      <q-separator color="white" size="2px" />

      <q-card-section class="q-pa-xs">
        <searchForm :searchData="sharedData" @load-search-staff="loadSearchStaff" />
      </q-card-section>

      <q-btn class="q-ml-sm q-mb-sm" :label="$t('backOrder.sms.sendSMS')" color="primary" @click="sendSMSDrawer = true" />

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
        <q-table :columns="columns" :rows="applicantStore.state.applicantList" row-key="id" selection="multiple"
          class="no-shadow" v-model:pagination="paginationTable" hide-pagination
          :loading="applicantStore.state.isLoadingProgress">
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
                {{ props.value.map(item => $t('applicant.qualification.' + item)).join(', ') }}
              </span>
            </q-td>
          </template>

        </q-table>
        <div class="row justify-start q-mt-md pagination">
          <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
            :max="applicantStore.state.metaData.total_pages" direction-links outline />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <ApplicantDetails ref="detailsDrawer" />

  <q-drawer v-model="sendSMSDrawer" show class="bg-white" :width="1000" :breakpoint="500" side="right" overlay elevated
    bordered>
    <q-scroll-area class="fit text-left">
      <q-card class="no-shadow">
        <q-card-section class="text-white bg-primary rounded-borders">
          <div class="row">
            <q-btn dense flat icon="close" @click="sendSMSDrawer = false" class="q-mr-md" />
            <span class="text-h6 q-pr-xs">
              <div class="test-white">
                {{ $t('backOrder.sms.sendSMS') }}
              </div>
            </span>
          </div>
        </q-card-section>
        <SmsDrawer />
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed, watch, ComputedRef } from 'vue';
import searchForm from './components/search/searchForm.vue';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { statusList, occupationList, applicantClassification } from 'src/shared/constants/Applicant.const';
import { QTableProps } from 'quasar';
import { ApplicantElasticSearchData } from 'src/pages/user/Applicant/types/applicant.types';
import { Applicant, ApplicantOccupation } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import SmsDrawer from './components/SmsDrawer.vue';
import { sharedData } from './components/search/searchData'
const { t } = useI18n({ useScope: 'global' });
const sendSMSDrawer = ref<boolean>(false);
const applicantStore = useApplicant();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
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

const columns: ComputedRef<QTableProps['columns']> = computed(() => {
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

const getStatus = (status: string) => {
  const item = statusList.value.find(x => x.value === status);
  if (item) {
    return item.label;
  }
};
const getOccupation = (occupation: ApplicantOccupation) => {
  if (!occupation) {
    return ''
  }
  let occupationIndex = occupationList.value.findIndex((p) => p.value == occupation);
  if (occupationIndex > -1) {
    return occupationList.value[occupationIndex].label
  }
};
const getClassification = (classification: string) => {
  if (!classification) {
    return ''
  }
  const classificationndex = applicantClassification.value.findIndex((p) => p.value == classification);
  if (classificationndex > -1) {
    return applicantClassification.value[classificationndex].label
  }
};

const openDrawer = (data: Applicant) => {
  detailsDrawer.value?.openDrawer(data)
};

const preventWatch = ref(false)
const loadSearchStaff = async (data: ApplicantElasticSearchData) => {
  preventWatch.value = true
  pagination.value.page = 1
  await applicantStore.loadApplicantData(data, pagination.value)
  preventWatch.value = false
};

watch(
  () => (pagination.value.page),
  () => {
    if (!preventWatch.value) {
      applicantStore.loadApplicantData(sharedData.value, pagination.value);
    }
  },
)
applicantStore.loadApplicantData(sharedData.value, pagination.value);
</script>
