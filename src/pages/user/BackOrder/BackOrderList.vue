<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.backOrderSearch') }}</div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="bg-grey-3">
        <div class="text-subtitle2 row justify-between">
          検索条件 / エリア：東京都全域,　詳細条件：…
          <q-btn :label="$t('backOrder.addBO')" color="primary" icon="mdi-plus" @click="addNewBo" />
        </div>
        <searchForm @load-search-staff="loadSearchStaff" />
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="q-pa-none">
        <q-table :columns="columns" :rows="state.BOList" row-key="id" selection="multiple" class="no-shadow"
          v-model:selected="selected" table-class="text-grey-8" table-header-class="text-grey-9"
          :loading="state.isLoadingProgress" :pagination="pagination" hide-pagination :sort-method="customSortMethod">
          <template v-slot:header-cell-caseType="props">
            <q-th :props="props" class="q-pa-none">
              <div>{{ $t('backOrder.create.caseType') }}</div>
              <div>{{ $t('backOrder.transactionType') }}</div>
            </q-th>
          </template>

          <template v-slot:header-cell-name="props">
            <q-th :props="props" class="q-pa-none">
              <div>{{ $t('backOrder.officeName') }}</div>
              <div>{{ $t('backOrder.clientName') }}</div>
            </q-th>
          </template>

          <template v-slot:body-cell-caseType="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  props.row.typeCase
                  ? $t(`applicant.add.${props.row.typeCase}`)
                  : '-'
                }}
              </div>
              <div>
                {{
                  props.row.transactionType
                  ? $t(`client.backOrder.${props.row.transactionType.toLowerCase()}`)
                  : '-'
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-employmentType="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  props.row.employmentType ? $t(`client.backOrder.${props.row.employmentType}`) : '-'
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-info="props">
            <q-td :props="props" class="q-pa-none">
              <q-btn icon="mdi-information-outline" round style="color: #175680" flat @click="showDialog(props.row)" />
            </q-td>
          </template>

          <template v-slot:body-cell-personnel="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  getUserDisplayName(props.row.registrant)
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-distance="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  props.row.distance != null ? props.row.distance + ' Km' : ''
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-wage="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  props.row.wage
                  ? $t(`backOrder.create.${props.row.wage}`)
                  : '-'
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="q-pa-none">
              <div>
                {{
                  props.row.officeName
                }}
              </div>
              <div>
                {{
                  props.row.clientName
                }}
              </div>
            </q-td>
          </template>
        </q-table>
        <div class="row justify-start q-mt-md q-mb-md pagination">
          <TablePaginationSimple :pagination="pagination" :is-admin="false" :max="state.metaData.total_pages"
            @on-data-update="async (page) => {
              pagination.page = page
            }" />
        </div>
      </q-card-section>
    </q-card>
  </div>

  <InfoBO ref="infoDrawer" @openSearchByMap="showSearchByMap = true" @passClientToMapSearch="(clientValue) => {
    selectedClient = clientValue;
  }
    " />
  <q-drawer v-model="cteateBoDrawer" :width="1000" :breakpoint="500" side="right" overlay elevated bordered>
    <createBO :type="typeBoCreate" @close-dialog="cteateBoDrawer = false" v-if="cteateBoDrawer" />
  </q-drawer>
  <SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="closeMap">
  </SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { BackOrderModel, Client } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { Ref, ref, computed, ComputedRef, watch, onMounted } from 'vue';
import { BackOrderColumns } from 'src/pages/user/BackOrder/consts/BackOrder.const';
import InfoBO from './components/info/InfoBO.vue';
import SearchByMapDrawer from './components/info/searchByMapDrawer.vue';
import createBO from './components/create/createBO.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useApplicant } from 'src/stores/applicant';
import { radius } from './consts/BackOrder.const';
import { QTableProps } from 'quasar';
import searchForm from './components/search/searchForm.vue';
import { BOElasticSearchData } from 'src/pages/user/BackOrder/types/backOrder.types';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue'
import { useUserStore } from 'src/stores/user'
import { myDateFormat } from 'src/shared/utils/utils';

const userStore = useUserStore();
const backOrderStore = useBackOrder();
const applicantStore = useApplicant();
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const state = backOrderStore.state;
const columns = ref<QTableProps | Ref>(BackOrderColumns);
const showSearchByMap = ref(false);
const selected = ref<BackOrderModel[]>([]);
const cteateBoDrawer = ref(false);
const typeBoCreate: Ref<'referral' | 'dispatch'> = ref('referral');
const selectedBo = ref<BackOrderModel | ComputedRef>(
  computed(() => backOrderStore.state.selectedBo)
);
const selectedClient = ref<Client | undefined>(undefined);
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

const customSortMethod = (rows, sortBy, descending) => {
  const collator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true });
  if (sortBy === 'personnel') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = getUserDisplayName(a.registrant)
      const second = getUserDisplayName(b.registrant)
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'BOID') {
    const sortedRows = [...state.BOList];
    sortedRows.sort((a, b) => {
      return descending ? parseInt(a.boId) - parseInt(b.boId) : parseInt(b.boId) - parseInt(a.boId);
    });
    return sortedRows;
  }
  else if (sortBy === 'dateOfRegistration') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = myDateFormat(a.dateOfRegistration);
      const second = myDateFormat(b.dateOfRegistration);
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    });
    return sortedRows;
  }
  else if (sortBy === 'caseType') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.typeCase ? a.typeCase : '';
      const second = b.typeCase ? b.typeCase : '';
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    });
    return sortedRows;
  }
  else if (sortBy === 'distance') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.distance ? a.distance : 0;
      const second = b.distance ? b.distance : 0;
      return descending ? first - second : second - first;
    });
    return sortedRows;
  }
  else if (sortBy === 'name') {
    const sortedRows = [...rows];

    sortedRows.sort((a, b) => {
      const first = a.officeName;
      const second = b.officeName;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'employmentType') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.employmentType;
      const second = b.employmentType;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'wage') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.wage;
      const second = b.wage;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'salary') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = parseInt(a.salary);
      const second = parseInt(b.salary);
      return descending ? first - second : second - first
    });
    return sortedRows;
  }
  else if (sortBy === 'state') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.state;
      const second = b.state;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else {
    return state.BOList;
  }
};

const userNames = ref<{ [key: string]: string }>({});
const getUserDisplayName = (registrant: string | undefined) => {
  const userDisplayName = ref('');

  if (registrant && !userNames.value[registrant]) {
    userStore
      .getUserById(registrant)
      .then((user) => {
        userNames.value[registrant] = user?.displayName || '';
        userDisplayName.value = userNames.value[registrant];
      })
      .catch((error) => {
        console.error(error);
        userDisplayName.value = '';
      });
  } else {
    userDisplayName.value = userNames.value[registrant];
  }

  return userDisplayName.value;
};
watchCurrentOrganization(async () => {
  await backOrderStore.loadBackOrder({}, pagination.value);
})

const closeMap = () => {
  showSearchByMap.value = false;
  radius.value = 0;
};

function addNewBo() {
  $q.dialog({
    title: t('backOrder.selectBOType'),
    cancel: t('backOrder.type.dispatch'),
    ok: t('backOrder.type.referral'),
  })
    .onOk(() => {
      typeBoCreate.value = 'referral';
      cteateBoDrawer.value = true;
    })
    .onCancel(() => {
      typeBoCreate.value = 'dispatch';
      cteateBoDrawer.value = true;
    });
}

function showDialog(bo: BackOrderModel) {
  infoDrawer.value?.openDrawer(bo);
}

const loadSearchStaff = async (staffList: BOElasticSearchData) => {
  pagination.value.page = 1;
  await backOrderStore.loadBackOrder(staffList, pagination.value);
};

backOrderStore.loadBackOrder({}, pagination.value);

watch(() => pagination.value.page, async () => {
  await backOrderStore.loadBackOrder({}, pagination.value);
})

onMounted(async () => {
  await applicantStore.getClients()
})

</script>
