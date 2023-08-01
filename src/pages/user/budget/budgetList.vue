<template>
  <div>
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <span class="text-h6 text-primary">{{ $t('budget.search') }}</span>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="q-ma-none q-pa-none">
        <budgetChart />
      </q-card-section>
      <q-card-section>
        <div class="row flex justify-center centers" :style="'width: 95%'">
          <div class=" q-pl-sm q-pr-sm q-pt-xs q-bt-xs bugetTotal bugetTotalRight">
            {{ t('budget.total') }}
          </div>
          <div class="q-pl-sm q-pr-sm q-pt-xs q-bt-xs bugetTotal">
            ¥ {{ budgetSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        {{ $t('common.searchKeyword') }}) indeed
        <searchForm @search-budget="searchBudget" class="q-mt-sm" />
      </q-card-section>

      <q-card-section class="q-ma-none q-pa-none">
        <div class="row">
          <q-checkbox val="xs" class="q-ml-md q-pt-xs" color="blue" v-model="selected" />
          <div class="q-ml-sm q-pt-md">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
          <q-btn :label="$t('common.delete')" dense class="q-ml-lg q-px-md"
            :class="selectedCount() == 0 ? 'bg-secondary' : 'bg-red'"
            :text-color="selectedCount() > 0 ? 'white' : 'black'" :disable="selectedCount() == 0"
            @click="deleteSelected()" />
          <q-btn :label="$t('common.export')" dense class="q-ml-md q-px-md"
            :class="selectedCount() == 0 ? 'bg-secondary' : 'text-bold buttonbg'" :outline="selectedCount() > 0"
            @click="exportCSV" :disable="selectedCount() == 0" />
          <q-btn :label="$t('common.import')" outline dense class="q-ml-md q-px-md text-bold buttonbg" @click="importCsv">
          </q-btn>
          <q-btn :label="$t('budget.tempFile')" flat dense class="q-ml-md q-px-md" style="text-decoration: underline"
            @click="budgetStore.downloadSampleFile">
          </q-btn>
        </div>
        <q-table :columns="columns" :rows="budgetList" row-key="name" v-model:pagination="pagination" hide-pagination
          :loading="loading" class="budgetTable q-mt-sm no-shadow" binary-state-sort :sort-method="customSortMethod">
          <template v-slot:header-cell-branchRomaji="props">
            <q-th :props="props" class="q-pa-none">
              {{ $t('settings.branch.name') }} <br />{{ $t('applicant.add.occupation') }}
            </q-th>
          </template>
          <template v-slot:header-cell-postingStartDate="props">
            <q-th :props="props" class="q-pa-none">
              {{ $t('budget.postingStartDate') }} <br />{{ $t('budget.postingEndDate') }}
            </q-th>
          </template>
          <template v-slot:header-cell-numberOfSlots="props">
            <q-th :props="props" class="q-pa-none">
              {{ $t('budget.numberOfSlots') }} <br /> {{ $t('billing.feeAggregates.unitPrice') }}
            </q-th>
          </template>

          <template v-slot:body-cell-select="props">
            <q-td :props="props">
              <q-checkbox v-model="props.row.selected" />
              <q-btn size="sm" icon="edit" flat color="blue" @click="edit(props.row.id)" />
            </q-td>
          </template>
          <template v-slot:body-cell-branchRomaji="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              {{ props.row.branch }}
              <br />
              {{ props.row.occupation }}
            </q-td>
          </template>
          <template v-slot:body-cell-postingStartDate="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              {{ myDateFormat(props.row.postingStartDate, 'YYYY/MM/DD') }}
              <br />
              {{ myDateFormat(props.row.postingEndDate, 'YYYY/MM/DD') }}
            </q-td>
          </template>
          <template v-slot:body-cell-amount="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              <q-icon name="currency_yen" v-if="props.row.amount != '' && props.row.amount != null"></q-icon>
              {{ formatNumber(props.row.amount) }}
            </q-td>
          </template>
          <template v-slot:body-cell-numberOfSlots="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              <span v-if="props.row.numberOfSlots">{{ formatNumber(props.row.numberOfSlots) }}</span>
              <span v-else>-</span>
              <br>
              <q-icon name="currency_yen" v-if="props.row.unitPrice != '' && props.row.unitPrice != null"></q-icon>
              {{ formatNumber(props.row.unitPrice) }}
            </q-td>
          </template>

          <template v-slot:body-cell-updated_at="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              {{ toDate(props.row.updated_at) }}
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="no-wrap q-pa-none">
              <q-btn size="sm" icon="delete" flat @click="showDeleteDialog([props.row.id])" />
            </q-td>
          </template>
        </q-table>
        <div class="row justify-start q-mt-md pagination q-ml-sm">
          <TablePaginationSimple :pagination="pagination" :is-admin="false"
            :max="(budgetList.length / pagination.rowsPerPage) >= 1 ? Math.ceil(budgetList.length / pagination.rowsPerPage) : 1"
            @on-data-update="async (page) => {
              pagination.page = page
            }" />
        </div>


        <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
          elevated bordered>
          <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
              <q-card-section class="text-white bg-primary">
                <div class="text-h6">
                  <q-btn dense flat icon="close" @click="drawerRight = false" />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="bg-grey-1 q-pa-none">
                <budgetForm :edit="true" :budgetData="budgetData" :key="budgetData['id']" @close="close" />
              </q-card-section>
            </q-card>
          </q-scroll-area>
        </q-drawer>

      </q-card-section>
    </q-card>
    <q-dialog v-model="importDialog" persistent>
      <q-card style="width: 1600px; max-width: 90vw; min-height: 90vh">
        <q-card-section style="max-height: 80vh; min-height: 80vh" class="scroll q-ma-none q-pa-none">
          <importBudgetCSV :importDialogLoading="importDialogLoading" :previewOKData="previewOKData"
            :previewNGData="previewNGData" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat :label="t('common.cancel')" color="red" v-close-popup />
          <q-btn flat :label="t('common.save')" color="primary" @click="saveCsvData"
            :disable="previewNGData.length > 0" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { budgetColumns } from './consts/Budget.const';
import { useBudget } from 'src/stores/budgetData';
import { toDate } from 'src/shared/utils/utils';
import budgetForm from './components/budgetForm.vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { BudgetData } from './type/budget'
import { Alert } from 'src/shared/utils/Alert.utils';
import { myDateFormat, formatNumber } from 'src/shared/utils/utils';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';
import { useOrganization } from 'src/stores/organization';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import searchForm from './components/searchForm.vue';
import importBudgetCSV from './components/importBudgetCSV.vue';
import budgetChart from './components/budgetChart.vue';

const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const organization = useOrganization()

const columns = ref(budgetColumns);
const selected = ref(false);


const budgetStore = useBudget();
const loading = ref(true);

const drawerRight = ref(false)
const budgetData = ref<BudgetData>({
  recordNumber: '',
  accountingMonth: '',
  amount: '',
  branch: '',
  id: '',
  media: '',
  numberOfSlots: '',
  occupation: '',
  postingEndDate: '',
  postingStartDate: '',
  unitPrice: '',
  remark: '',
  agency: '',
  organizationId: organization.currentOrganizationId,
});

const searchData = ref(<BudgetData>{});
const importDialog = ref(false);
const importDialogLoading = ref(false);
const previewOKData = ref<BudgetData[]>([]);
const previewNGData = ref<BudgetData[]>([]);
const csvContent = ref<string>('')

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

const budgetSum = computed(() => {
  let sum = 0
  budgetList.value.forEach(item => {
    if (item.amount) {
      sum += parseInt(item.amount.toString().replace(/,/g, ''), 10);
    }
  })
  return sum
})

const customSortMethod = (rows, sortBy, descending) => {
  const collator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true });
  if (['recordNumber', 'amount', 'numberOfSlots', 'unitPrice'].includes(sortBy)) {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      return descending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    });
    return sortedRows;
  }
  else if (['postingStartDate', 'updated_at'].includes(sortBy)) {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = myDateFormat(a[sortBy], 'YYYYMMDDHHMMSS')
      const second = myDateFormat(b[sortBy], 'YYYYMMDDHHMMSS')
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    });
    return sortedRows;
  }

  else if (['branchRomaji', 'media', 'remark', 'agency', 'accountingMonth'].includes(sortBy)) {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a[sortBy] ? a[sortBy] : '';
      const second = b[sortBy] ? b[sortBy] : '';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }

  else {
    return budgetList;
  }
};


const budgetList = computed(() => {
  let budgetList = [...budgetStore.budgetList];

  const textList = ['text', 'agency', 'remark']
  textList.forEach((key) => {
    if (searchData.value[key]) {
      budgetList = budgetList.filter(function (el) {
        if (key == 'text') {
          return el['media'] && el['media'].includes(searchData.value['text'])
        }
        return el[key] && el[key].includes(searchData.value[key])
      });
    }
  })

  Object.keys(searchData.value).forEach((item) => {
    const keys = ['recordNumber', 'mediaId', 'branchId', 'occupationId', 'postingStartDate', 'postingEndDate', 'accountingMonth']
    if (keys.includes(item)) {
      if (searchData.value[item]) {
        budgetList = budgetList.filter(function (el) {
          if (item == 'postingStartDate') {
            return myDateFormat(el[item], 'YYYY/MM/DD') >= searchData.value[item]
          } else if (item == 'postingEndDate') {
            return myDateFormat(el[item], 'YYYY/MM/DD') <= searchData.value[item]
          }
          return el[item] == searchData.value[item]
        });
      }
    }

    const keysRange = ['amount', 'numberOfSlots', 'unitPrice']
    keysRange.forEach((key) => {
      if (searchData.value[key + 'Max'] && searchData.value[key + 'Min']) {
        budgetList = budgetList.filter(function (el) {
          if (el[key]) {
            return parseInt(el[key].toString().replace(/,/g, ''), 10) >= parseInt(searchData.value[key + 'Min'].replace(/,/g, ''), 10) && parseInt(el[key].toString().replace(/,/g, ''), 10) <= parseInt(searchData.value[key + 'Max'].replace(/,/g, ''), 10)
          }
        })
      }
      else if (searchData.value[key + 'Max']) {
        budgetList = budgetList.filter(function (el) {
          if (el[key]) {
            return parseInt(el[key].toString().replace(/,/g, ''), 10) <= parseInt(searchData.value[key + 'Max'].replace(/,/g, ''), 10)
          }
        })
      }
      else if (searchData.value[key + 'Min']) {
        budgetList = budgetList.filter(function (el) {
          if (el[key]) {
            return parseInt(el[key].toString().replace(/,/g, ''), 10) >= parseInt(searchData.value[key + 'Min'].replace(/,/g, ''), 10)
          }
        })
      }
    });


  });

  return budgetList
});

const searchBudget = (data: BudgetData) => {
  searchData.value = data;
}

const selectedCount = () => {
  return budgetList.value.filter(row => row['selected']).length;
}

const edit = async (budgetId: string) => {
  budgetData.value = await budgetStore.getBudgetData(budgetId);
  drawerRight.value = true;
}
const close = () => {
  drawerRight.value = false;
}
const showDeleteDialog = async (budgetIds) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    const done = await budgetStore.deleteBudget(budgetIds);
    if (!done) {
      Alert.warning()
    }

  })
}

const importCsv = async () => {
  csvContent.value = '';
  previewOKData.value = [];
  previewNGData.value = [];
  importDialogLoading.value = true;
  const csvFileInput = document.createElement('input');
  csvFileInput.type = 'file';
  csvFileInput.accept = '.csv';
  csvFileInput.addEventListener('change', (event) => {
    const file = event.target?.files[0];
    if (file) {
      importDialog.value = true;

      const reader = new FileReader();
      reader.onload = async (e) => {
        csvContent.value = e.target?.result as string;
        const previewData = await budgetStore.processData(csvContent.value, searchData.value['accountingMonth'], true) as { ok: BudgetData[], ng: BudgetData[] };
        if (previewData) {
          previewOKData.value = previewData.ok
          previewNGData.value = previewData.ng
        }
        importDialogLoading.value = false;
      };
      reader.readAsText(file);
    }
  });
  csvFileInput.click();

}
const saveCsvData = async () => {
  if (!csvContent.value) {
    return false
  }
  importDialogLoading.value = true;
  const success = await budgetStore.processData(csvContent.value, searchData.value['accountingMonth']);
  importDialog.value = false;
  importDialogLoading.value = false;
  if (!success) {
    Alert.warning()
  }
}
const deleteSelected = () => {
  const budgetItem = budgetList.value.filter(row => row['selected']);
  let items: string[] = []
  for (const item of budgetItem) {
    items.push(item['id']);
  }
  showDeleteDialog(items)
}
const exportCSV = async () => {
  const budgetItem = budgetList.value.filter(row => row['selected']);
  if (budgetItem.length == 0) {
    return false
  }
  await budgetStore.exportTable(budgetItem as BudgetData[]);
}

watchCurrentOrganization(async (v) => {
  loading.value = true;
  await budgetStore.getBudgetList(searchData.value['accountingMonth'], v);
  loading.value = false;
})
watch(() => selected.value, (newValue) => {
  for (let i = 0; i < budgetList.value.length; i++) {
    budgetList.value[i]['selected'] = newValue
  }
});

onMounted(async () => {
  await budgetStore.getBudgetList(searchData.value['accountingMonth'], organization.currentOrganizationId);
  loading.value = false;

})
</script>
<style lang="scss">
.budgetTable {
  overflow: auto;

  th {
    background-color: #f3f0f0;
    border-color: #f3f0f0;
  }
}

.buttonbg {
  background-color: #154c79;
}
</style>
