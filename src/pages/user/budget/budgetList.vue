<template>
  <div>
    <div class="row q-pl-md q-pt-md">
      <span class="text-h6 text-primary ">{{ $t('budget.search') }}</span>
      <span class="q-pl-md q-pt-sm">{{ $t('client.variousAchievement.displayPeriod') }}</span>
      <q-select v-model="selectedYear" :options="yearOptions" class="q-ml-sm" outlined
        style="max-width: 250px;min-width: 100px;" color="black" dense bg-color="white" emit-value map-options />
      <span class="q-ml-sm q-pt-sm">{{ $t('common.year') }}</span>
      <q-select v-model="selectedMonth" :options="monthOptions" class="q-ml-sm" outlined
        style="max-width: 150px;min-width: 100px;" color="black" dense bg-color="white" emit-value map-options />

      <span class="q-ml-sm q-pt-sm">{{ $t('common.month') }}</span>
    </div>

    <div class="row q-pt-md q-pl-lg q-mt-xs q-pb-sm q-mb-xs">
      <div>{{ $t('common.searchKeyword') }} / indeed</div>
    </div>
    <div class="row q-pl-lg">
      <q-input outlined :placeholder="$t('form.searchPlaceholder')" style="width: 350px" color="black" dense
        bg-color="white" v-model="searchText" />
      <q-btn dense @click="filterBudget" style="color: white" :label="$t('common.search')"
        class="q-ml-sm q-px-lg buttonbg" />
      <q-btn dense :label="$t('common.clear')" outline class="q-ml-sm q-px-md text-bold buttonbg" @click="clear" />
    </div>
    <div class="row q-pt-md q-mt-xs q-pb-sm q-mb-xs">
      <q-checkbox val="xs" class="q-ml-md q-pt-xs" color="blue" v-model="selected" />
      <div class="q-ml-sm q-pt-md">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
      <q-btn :label="$t('common.delete')" dense class="q-ml-lg q-px-md"
        :class="selectedCount() == 0 ? 'bg-secondary' : 'bg-red'" :text-color="selectedCount() > 0 ? 'white' : 'black'"
        :disable="selectedCount() == 0" @click="deleteSelected()" />
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
      :loading="loading">
      <template v-slot:header-cell-branch="props">
        <q-th :props="props" class="q-pa-none">
          <div> {{ $t('settings.branch.name') }} </div>
          <div> {{ $t('applicant.add.occupation') }} </div>
        </q-th>
      </template>
      <template v-slot:header-cell-posting="props">
        <q-th :props="props" class="q-pa-none">
          <div> {{ $t('budget.postingStartDate') }} </div>
          <div> {{ $t('budget.postingEndDate') }} </div>
        </q-th>
      </template>
      <template v-slot:header-cell-numberOfSlots="props">
        <q-th :props="props" class="q-pa-none">
          <div> {{ $t('budget.numberOfSlots') }} </div>
          <div> {{ $t('billing.feeAggregates.unitPrice') }} </div>
        </q-th>
      </template>

      <template v-slot:body-cell-select="props">
        <q-td :props="props">
          <q-checkbox v-model="props.row.selected" />
          <q-btn size="sm" icon="edit" flat color="blue" @click="edit(props.row.id)" />
        </q-td>
      </template>
      <template v-slot:body-cell-branch="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.branch }}
          <br />
          {{ props.row.occupation }}
        </q-td>
      </template>
      <template v-slot:body-cell-posting="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ timestampToDateFormat(props.row.postingStartDate, 'YYYY/MM/DD') }}
          <br />
          {{ timestampToDateFormat(props.row.postingEndDate, 'YYYY/MM/DD') }}
        </q-td>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <q-icon name="currency_yen" v-if="props.row.unitPrice != '' && props.row.unitPrice != null"></q-icon>{{
            props.row.amount }}
        </q-td>
      </template>
      <template v-slot:body-cell-numberOfSlots="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          {{ props.row.numberOfSlots }}
          <br>
          <q-icon name="currency_yen" v-if="props.row.unitPrice != '' && props.row.unitPrice != null"></q-icon>{{
            props.row.unitPrice }}
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
      <TablePagination :pagination="pagination" :isAdmin="false" v-model="pagination.page" :key="loadPagination" />
    </div>


    <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
      bordered>
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
import { BudgetData, DateOption } from './type/budget'
import { Alert } from 'src/shared/utils/Alert.utils';
import { timestampToDateFormat } from 'src/shared/utils/utils';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { orderBy, where, Timestamp } from 'firebase/firestore';

const yearOptions = ref<[DateOption]>([]);
const monthOptions = ref<[DateOption]>([]);
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });

const columns = ref(budgetColumns);
const selected = ref(false);


const budgetStore = useBudget();
const loading = ref(true);


const searchText = ref('')
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const drawerRight = ref(false)
const budgetData = ref<BudgetData>({ id: '' });

const nextMonth = selectedMonth.value == 12 ? 1 : selectedMonth.value + 1;
const nextYear = selectedMonth.value == 12 ? selectedYear.value + 1 : selectedYear.value;
const start = Timestamp.fromDate(new Date(`${selectedYear.value}-${('0' + selectedMonth.value).slice(-2)}-01`))
const end = Timestamp.fromDate(new Date(`${nextYear}-${('0' + nextMonth).slice(-2)}-01`))
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  path: 'budgets',
  order: orderBy('created_at', 'asc'),
  constraints: [
    where('deleted', '==', false),
    where('created_at', '>=', start),
    where('created_at', '<', end),
  ]
});
const loadPagination = ref(0);
const budgetList = computed(() => {
  if (!searchText.value) {
    return budgetStore.budgetList
  }
  const needle = searchText.value.toLowerCase()
  return budgetStore.budgetList.filter(function (el) {
    return el['media'].toLowerCase().includes(needle) || el['branch'].toLowerCase().includes(needle)
  });
});

const filterBudget = () => {
  //
}

const selectedCount = () => {
  return budgetList.value.filter(row => row['selected']).length;
}
const clear = () => {
  searchText.value = ''
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
    if (done) {
      Alert.success($q, t)
      loadPagination.value = loadPagination.value == 0 ? 1 : 0
    }

  })
}

const importCsv = async () => {
    const csvFileInput = document.createElement('input');
    csvFileInput.type = 'file';
    csvFileInput.accept = '.csv';
    csvFileInput.addEventListener('change', (event) => {
      const file = event.target?.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target?.result;
          budgetStore.processData(contents,selectedYear.value,selectedMonth.value);
        };
        reader.readAsText(file);
      }
    });
    csvFileInput.click();

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
  await budgetStore.exportTable(budgetItem);
}

watch(() => selectedYear.value, async (newValue) => {
  loading.value = true;
  await budgetStore.getBudgetList(newValue, selectedMonth.value);
  loading.value = false;

})
watch(() => selectedMonth.value, async (newValue) => {
  loading.value = true;
  await budgetStore.getBudgetList(selectedYear.value, newValue);
  loading.value = false;
});
watch(() => selected.value, (newValue) => {
  for (let i = 0; i < budgetList.value.length; i++) {
    budgetList.value[i]['selected'] = newValue
  }
});

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


  await budgetStore.getBudgetList(selectedYear.value, selectedMonth.value);
  loading.value = false;

})
</script>
<style lang="scss">
thead tr:first-child th {
  background-color: #f3f0f0;
}

.buttonbg {
  background-color: #154c79;
}</style>
