<template>
  <div>
    <div class="row no-shadow full-height new">
      <q-card class="no-shadow full-width bg-grey-3">
        <q-card-section class="bg-grey-3">
          <div class="title">{{ $t('menu.faxHistory') }}</div>
        </q-card-section>
        <q-separator color="white" size="2px" />
        <q-card-section>
          <div class="row">
            <div class="col-4">
              {{ $t('clientFactory.fax.list.jobApplicantName') }}
            </div>
            <div class="col-3">
              {{ $t('clientFactory.fax.list.branch') }}
            </div>
            <div class="col-3 q-pl-sm">
              {{ $t('clientFactory.fax.list.responsiblePerson') }}
            </div>
            <div class="col-2">
              {{ $t('clientFactory.fax.list.sendDate') }}
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <q-select
                dense
                outlined
                map-options
                v-model="searchData.selectedApplicant"
                use-input
                use-chips
                input-debounce="0"
                :options="applicantList"
                @filter="filterFn"
                :loading="loading"
                hide-bottom-space
                style="max-width: 350px; min-width: 100px"
                :label="$t('common.pleaseSelect')"
              />
            </div>
            <div class="col-3">
              <select-branch
                :organization-id="organizationStore.currentOrganizationId"
                v-model="searchData.selectedBranch"
                hide-bottom-space
                @on-start-loading="searchData.selectedBranch = ''"
                style="max-width: 250px; min-width: 100px"
              />
            </div>
            <div class="col-3">
              <q-select
                v-model="searchData.selectedInCharge"
                :options="allUsers"
                class="q-ml-sm"
                outlined
                style="max-width: 250px; min-width: 100px"
                color="black"
                dense
                emit-value
                map-options
                option-label="displayName"
                option-value="id"
                :label="$t('common.pleaseSelect')"
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="searchData.selectedDate"
                outlined
                dense
                mask="date"
                :rules="['date']"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="searchData.selectedDate" minimal>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('common.close')"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-table
      :columns="columns"
      :rows="faxList"
      row-key="name"
      v-model:pagination="pagination"
      hide-pagination
      :loading="loading"
    >
      <template v-slot:body-cell-sender="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ getUserName(props.row.senderId) }}
        </q-td>
      </template>
      <template v-slot:body-cell-attachment="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-btn flat color="primary" label="Flat" />
        </q-td>
      </template>
      <template v-slot:body-cell-numDestinations="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.applicants.length }}
        </q-td>
      </template>
      <template v-slot:body-cell-sentDateTime="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ toDate(props.row.created_at) }}
        </q-td>
      </template>
    </q-table>
    <div class="row justify-start q-mt-md pagination q-ml-sm">
      <TablePagination
        :pagination="pagination"
        :isAdmin="false"
        v-model="pagination.page"
        :key="loadPagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { faxColumns } from './consts/Fax.const';
import { useFax } from 'src/stores/fax';
import { useUserStore } from 'src/stores/user';
import { toDate, today, timestampToDateFormat } from 'src/shared/utils/utils';
import { DateOption } from '../budget/type/budget';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { orderBy, where, Timestamp } from 'firebase/firestore';
import { User } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';
import SelectBranch from '../Settings/management/components/SelectBranch.vue';
import { useApplicant } from 'src/stores/applicant';
import { FaxSearchData } from './types';

const organizationStore = useOrganization();
const applicantStore = useApplicant();

const yearOptions = ref<DateOption[]>([]);
const monthOptions = ref<DateOption[]>([]);

const columns = ref(faxColumns);
const selected = ref(false);

const faxStore = useFax();
const useStore = useUserStore();
const allUsers = ref(<User[]>[]);
const loading = ref(true);
const searchText = ref('');
const selectedYear = ref(new Date().getFullYear());
const searchData = ref<FaxSearchData>({
  selectedDate: today().replaceAll('-', '/'),
  selectedBranch: '',
  selectedInCharge: '',
  selectedApplicant: null,
});
const applicantList = ref(<{ value: string; label: string }[]>[]);

const selectedMonth = ref(new Date().getMonth() + 1);
const nextMonth = selectedMonth.value == 12 ? 1 : selectedMonth.value + 1;
const nextYear =
  selectedMonth.value == 12 ? selectedYear.value + 1 : selectedYear.value;
const start = Timestamp.fromDate(
  new Date(`${selectedYear.value}-${('0' + selectedMonth.value).slice(-2)}-01`)
);
const end = Timestamp.fromDate(
  new Date(`${nextYear}-${('0' + nextMonth).slice(-2)}-01`)
);

const pagination = ref({
  page: 1,
  rowsPerPage: 30,
  path: 'fax',
  order: orderBy('created_at', 'asc'),
  constraints: [
    where('deleted', '==', false),
    where('created_at', '>=', start),
    where('created_at', '<', end),
  ],
});
const loadPagination = ref(0);
const faxList = computed(() => {
  if (!searchText.value) {
    return faxStore.faxList;
  }
  const needle = searchText.value.toLowerCase();
  return faxStore.faxList.filter(function (el) {
    return (
      el['media'].toLowerCase().includes(needle) ||
      el['branch'].toLowerCase().includes(needle)
    );
  });
});

watch(
  () => applicantStore.state.applicantList,
  (newVal) => {
    applicantList.value = [];
    for (let i = 0; i < newVal.length; i++) {
      let label = newVal[i]['name'] || '';
      if (newVal[i]['dob']) {
        label += ' (' + timestampToDateFormat(newVal[i]['dob']) + ')';
      }
      applicantList.value.push({ label: label, value: newVal[i]['id'] });
    }
  }
);

watch(
  () => searchData.value,
  async (newValue) => {
    loading.value = true;
    await faxStore.getFaxList(newValue);
    loading.value = false;
  },
  { deep: true, immediate: true }
);

watch(
  () => selected.value,
  (newValue) => {
    for (let i = 0; i < faxList.value.length; i++) {
      faxList.value[i]['selected'] = newValue;
    }
  }
);

onMounted(async () => {
  const ten = 10;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - ten;
  const endYear = currentYear + ten;
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.value.push({ label: String(year), value: year });
  }
  for (let month = 1; month <= 12; month++) {
    monthOptions.value.push({ label: ('0' + month).slice(-2), value: month });
  }

  await faxStore.getFaxList(searchData.value);
  allUsers.value = await useStore.getAllUsers();

  loading.value = false;
});

const getUserName = (userId: string) => {
  return allUsers.value.find((user) => user.id === userId)?.name;
};
const filterFn = (val: string, update) => {
  const pagination = {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 100,
  };
  update(async () => {
    if (val === '') {
      applicantStore.state.applicantList = [];
    } else {
      loading.value = true;
      await applicantStore.loadApplicantData(
        { keyword: val as string },
        pagination
      );
      loading.value = false;
    }
  });
};
</script>
<style lang="scss">
@import 'src/css/imports/colors';
@import 'src/css/animate-left-border.scss';

thead tr:first-child th {
  background-color: #f3f0f0;
}

.buttonbg {
  background-color: #154c79;
}

.title {
  color: $main-black;
  font-weight: bold;
  font-size: 1rem;
}
</style>
