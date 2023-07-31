<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
      </q-card-section>

      <q-separator color="white" size="2px" />

      <q-card-section class="q-pa-xs">
        <searchForm :searchData="sharedData" @load-search-staff="loadSearchStaff" @openSMSDrawer="openSMSDrawer" />
      </q-card-section>

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
        <q-table :columns="columns" :rows="applicantStore.state.applicantList" row-key="id" selection="multiple"
          class="no-shadow" v-model:pagination="pagination" hide-pagination
          :loading="applicantStore.state.isLoadingProgress">
          <template v-slot:header-cell-name="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.list.name') }} </div>
              <div> {{ $t('applicant.add.applicationDate') }} </div>
            </q-th>
          </template>

          <template v-slot:header-cell-endDate="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.list.lastContact') }} </div>
              <div> {{ $t('applicant.list.contactNote') }} </div>
            </q-th>
          </template>

          <template v-slot:header-cell-station="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.attendant.route') }} / {{ $t('applicant.list.station') }} </div>
            </q-th>
          </template>

          <template v-slot:header-cell-address="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.add.occupation') }} | {{ $t('applicant.list.category') }} </div>
              <div> {{ $t('applicant.list.address') }} </div>
            </q-th>
          </template>

          <template v-slot:header-cell-qualification="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.list.qualification') }} / {{ $t('applicant.list.experience') }} </div>
            </q-th>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="q-pa-none">
              <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary" :label="props.value"
                class="q-pa-none text-body1" />
              <div>
                <span v-if="props.row.applicationDate"> {{ myDateFormat(props.row.applicationDate) }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-address="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                <span v-if="props.row.occupation"> {{ getOccupation(props.row.occupation) }}</span>
                <span v-if="props.row.classification && props.row.classification.length != 0 && props.row.occupation"> |
                </span>
                <span v-if="props.row.classification && props.row.classification.length != 0"> {{
                  props.row.classification.map(c => getClassification(c)).join(', ') }}</span>
              </div>
              <div>
                {{ props.row.address }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-endDate="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{ myDateFormat(props.row.created_at) }}
              </div>
              <div>
                {{ props.row.note }}
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
              <span v-if="props.row.totalYear && props.value.length"> / </span>
              <span v-if="props.row.totalYear"> {{ props.row.totalYear + ' ' + $t('common.year') }}</span>

            </q-td>
          </template>

          <template v-slot:body-cell-station="props">
            <q-td :props="props">
              <span v-if="props.row.route"> {{ props.row.route }}</span>
              <span v-if="props.row.nearestStation && props.row.route"> / </span>
              <span v-if="props.row.nearestStation && props.row.nearestStation.length > 0">{{ props.row.nearestStation
              }}</span>
            </q-td>
          </template>

        </q-table>
        <div class="row justify-start q-mt-md pagination q-ml-sm">
          <TablePaginationSimple :pagination="pagination" :is-admin="false"
            :max="applicantStore.state.metaData.total_pages" @on-data-update="async (page) => {
              pagination.page = page
            }" />
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
import { myDateFormat } from 'src/shared/utils/utils';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';

import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const { t } = useI18n({ useScope: 'global' });
const sendSMSDrawer = ref<boolean>(false);
const applicantStore = useApplicant();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100
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
      name: 'address',
      label: '',
      field: 'address',
      required: true,
      align: 'left',
      sortable: false,
    },
    {
      name: 'staffRank',
      label: t('applicant.list.rank'),
      field: 'staffRank',
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
      label: '',
      field: 'qualification',
      required: true,
      align: 'left',
    },
    {
      name: 'station',
      label: '',
      field: 'station',
      required: true,
      align: 'left',
    },
    {
      name: 'phone',
      label: t('office.contactAddress'),
      field: 'phone',
      required: true,
      align: 'left',
    },
    {
      name: 'endDate',
      label: '',
      field: 'endDate',
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
const openSMSDrawer = () => {
  sendSMSDrawer.value = true
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

watchCurrentOrganization(async () => {
  await applicantStore.loadApplicantData()
})

applicantStore.loadApplicantData(sharedData.value, pagination.value);
</script>
