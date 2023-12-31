<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
      </q-card-section>

      <q-separator color="white" size="2px" />

      <q-card-section class="q-pa-xs">
        <searchForm :searchData="sharedData" @load-search-staff="loadSearchStaff" @openSMSDrawer="openSMSDrawer">
          <template v-slot:button>
            <q-btn class="q-ml-sm" :color="'red'" @click="showDeleteDialog = true" icon="delete" :label="t('common.delete')" :disabled="!selectedIds?.length"></q-btn>
          </template>
        </searchForm>
      </q-card-section>

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
        <q-table :columns="columns" :rows="sortedRows" row-key="id" selection="multiple"
          v-model:selected="selection"
          class="no-shadow" v-model:pagination="pagination" hide-pagination
          :loading="applicantStore.state.isLoadingProgress"
          >

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th align="left">
                <q-checkbox v-model="selectedAll" @click="!selectedAll"  ></q-checkbox>
              </q-th>
              <template v-for="col in props.cols" :key="col.name">
                <q-th :props="props" class="q-pa-none">
                  <div v-if="col.name === 'name'"> {{ $t('applicant.list.name') }} </div>
                  <div v-else-if="col.name === 'endDate'">
                    {{ $t('applicant.list.lastContact') }} <br>
                    {{ $t('applicant.list.contactNote') }}
                  </div>
                  <div v-else-if="col.name === 'station'">
                    {{ $t('applicant.attendant.route') }} / {{ $t('applicant.list.station') }}
                  </div>
                  <div v-else-if="col.name === 'address'">
                    {{ $t('applicant.add.occupation') }} | {{ $t('applicant.list.category') }} <br>
                    {{ $t('applicant.list.address') }}
                  </div>
                  <div v-else-if="col.name === 'qualification'">
                    {{ $t('applicant.list.qualification') }} / {{ $t('applicant.list.experience') }}
                  </div>
                  <div v-else>
                    {{ col.label }}
                  </div>
                </q-th>
              </template>
            </q-tr>
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
                {{ props.row.address}}
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
              <span v-if="props.row.totalMonthes && props.value.length"> / </span>
		          <span>{{ props.row.totalMonthes ? Math.floor(props.row.totalMonthes / 12) + ' ' + $t('common.year') : '' }}</span>

            </q-td>
          </template>

          <template v-slot:body-cell-staffRank="props">
		            <q-td :props="props">
		             {{ RankCount.getRank(props.row.staffRank) }}
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
          <template v-slot:body-cell-phone="props">
            <q-td :props="props">
              <span class="link" cursor @click="feedContact(props.row.id)"> {{ props.row.phone }}</span>
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
        <SmsDrawer :key="applicantId" :id="applicantId" v-bind="applicantId && applicantId.length"/>
      </q-card>
    </q-scroll-area>
  </q-drawer>

  <q-dialog v-model="showDeleteDialog">
    <q-card>
      <q-card-section class="justify-center items-center q-pb-none ">
        <div class="text-h6 text-center text-bold">{{ $t('applicant.deleteTitle') }}</div>
        <q-space />
      </q-card-section>
      <q-card-section>
        {{ $t('applicant.deleteBody') }}
      </q-card-section>
      <q-card-section class="flex justify-center">
        <q-btn @click="showDeleteDialog=false" rounded class="q-mr-md q-px-xl">{{ $t('common.cancel') }}</q-btn>
        <q-btn color="red" rounded class="q-px-xl" @click="deleteApplicants()" :disable="deletingProccess">{{ $t('common.delete') }}</q-btn>
      </q-card-section>
      <q-linear-progress query v-if="deletingProccess" color="primary"/>
    </q-card>
  </q-dialog>
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
import { RankCount } from 'src/shared/utils/RankCount.utils';
import SmsDrawer from './components/SmsDrawer.vue';
import { sharedData } from './components/search/searchData'
import { myDateFormat } from 'src/shared/utils/utils';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';

import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const { t } = useI18n({ useScope: 'global' });
const sendSMSDrawer = ref<boolean>(false);
const applicantStore = useApplicant();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
const sendNumber = ref(false);
const applicantId = ref<string>('');
const selection = ref([])
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100
});
const selectedAll =ref(false)
const showDeleteDialog = ref(false)
const selectedIds = computed(()=>{
  return selection.value.map((row : Applicant)=>{
    return row.id
  })
})
const deletingProccess = ref(false)
const deleteApplicants = async () => {
  deletingProccess.value = true
  await applicantStore.deleteApplicants(selectedIds.value)
  applicantStore.state.applicantList = applicantStore.state.applicantList.filter((row)=>{
    return !selectedIds.value.includes(row.id)
  })
  selection.value = []
  deletingProccess.value = false
  showDeleteDialog.value = false
}


const columns: ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'name',
      label: '',
      field: 'name',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'address',
      label: '',
      field: 'address',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'staffRank',
      label: t('applicant.list.rank'),
      field: 'staffRank',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'status',
      label: t('applicant.list.status'),
      field: 'status',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'qualification',
      label: '',
      field: 'qualification',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'station',
      label: '',
      field: 'station',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'phone',
      label: t('office.contactAddress'),
      field: 'phone',
      required: true,
      align: 'left',
      sortable: true,
    },
    {
      name: 'endDate',
      label: '',
      field: 'endDate',
      required: true,
      align: 'left',
      sortable: true,
    },
  ];
});

const sortedRows = computed(() => {
  const collator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true });
    if (pagination.value.sortBy === 'qualification') {
      const sortedRows = [...applicantStore.state.applicantList];
      sortedRows.sort((a, b) => {
        const first = a.totalYear?parseInt(a.totalYear):10000000;
        const second = b.totalYear?parseInt(b.totalYear):10000000;
        return pagination.value.descending ? first-second : second-first;
      });
      return sortedRows;
    }
    else if (pagination.value.sortBy === 'station') {
      const sortedRows = [...applicantStore.state.applicantList];
      sortedRows.sort((a, b) => {
        const first = a.nearestStation?a.nearestStation:'';
        const second = b.nearestStation?b.nearestStation:'';
        return pagination.value.descending ? collator.compare(second, first) : collator.compare(first, second);
      });
      return sortedRows;
    }
    else if (pagination.value.sortBy === 'endDate') {
      const sortedRows = [...applicantStore.state.applicantList];
      sortedRows.sort((a, b) => {
        const first = myDateFormat(a.created_at);
        const second = myDateFormat(b.created_at);
        if (pagination.value.descending) {
          return second.localeCompare(first);
        } else {
          return first.localeCompare(second)
        }});
      return sortedRows;
    }
    else {
      return applicantStore.state.applicantList;
    }
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
const openSMSDrawer = async () => {
  if(sendNumber.value === false) {
    applicantId.value = '';
  }
  sendSMSDrawer.value = true
};

const feedContact = async (id: string) => {
  sendNumber.value = true;
  applicantId.value = id;
  await openSMSDrawer();
  sendNumber.value = false;
}

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

watch (()=>selectedAll.value,()=>{
  if(selectedAll.value) selection.value = sortedRows.value
  else selection.value = []
})

watchCurrentOrganization(async () => {
  await applicantStore.loadApplicantData(sharedData.value, pagination.value)
  pagination.value.page = 1;
})

applicantStore.loadApplicantData(sharedData.value, pagination.value);
</script>

<style scoped scss>
 .link {
   color: blue;
   text-decoration: underline;
   cursor: pointer;
 }
</style>
