<template>
  <div class="no-shadow full-width">
    <q-table dense :columns="columns" :rows="props.previewData" row-key="name" v-model:pagination="pagination"
      hide-pagination class="budgetTable q-mt-sm no-shadow" :loading="props.importDialogLoading">
      <template v-slot:header-cell-branch="props">
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

      <template v-slot:body-cell-media="props">
        <q-td :props="props" class="no-wrap q-pa-none"
          :class="!okData && (props.row.ngFields.includes('media')) ? 'bg-yellow' : ''">
          <span v-if="okData">{{ budgetStore.getItem(props.row.media, 'media') }}</span>
          <span v-else>{{ props.row.media }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-branch="props">
        <q-td :props="props" class="no-wrap q-pa-none"
          :class="!okData && (props.row.ngFields.some((item) => ['branch', 'occupation'].includes(item))) ? 'bg-yellow' : ''">
          <span v-if="okData">
            {{ budgetStore.getItem(props.row.branch, 'branch') }}
            <br />
            {{ budgetStore.getItem(props.row.occupation, 'occupation') }}
          </span>
          <span v-else>
            {{ props.row.branch }}
            <br />
            {{ props.row.occupation }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-postingStartDate="props">
        <q-td :props="props" class="no-wrap q-pa-none"
          :class="!okData && (props.row.ngFields.some((item) => ['postingStartDate', 'postingEndDate'].includes(item))) ? 'bg-yellow' : ''">
          {{ myDateFormat(props.row.postingStartDate, 'YYYY/MM/DD') }}
          <br />
          {{ myDateFormat(props.row.postingEndDate, 'YYYY/MM/DD') }}
        </q-td>
      </template>
      <template v-slot:body-cell-accountingMonth="props">
        <q-td :props="props" class="no-wrap q-pa-none"
          :class="!okData && (props.row.ngFields.includes('accountingMonth')) ? 'bg-yellow' : ''">
          {{ props.row.accountingMonth }}
        </q-td>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td :props="props" class="no-wrap q-pa-none"
          :class="!okData && (props.row.ngFields.includes('amount')) ? 'bg-yellow' : ''">
          <q-icon name="currency_yen" v-if="props.row.amount != '' && props.row.amount != null"></q-icon>
          {{ props.row.amount }}
        </q-td>
      </template>
      <template v-slot:body-cell-numberOfSlots="props">
        <q-td :props="props" class="no-wrap q-pa-none">
          <span v-if="props.row.numberOfSlots">{{ props.row.numberOfSlots }}</span>
          <span v-else>-</span>
          <br>
          <q-icon name="currency_yen" v-if="props.row.unitPrice != '' && props.row.unitPrice != null"></q-icon>
          {{ props.row.unitPrice }}
        </q-td>
      </template>

    </q-table>
    <div class="row justify-start pagination q-ml-sm">
      <TablePaginationSimple :pagination="pagination" :is-admin="false"
        :max="(props.previewData.length / pagination.rowsPerPage) >= 1 ? props.previewData.length / pagination.rowsPerPage : 1"
        @on-data-update="async (page) => {
          pagination.page = page
        }" />
    </div>


  </div>
</template>
<script  lang="ts" setup>
import { ref } from 'vue';
import { myDateFormat } from 'src/shared/utils/utils';
import { budgetColumns } from '../consts/Budget.const';
import { BudgetData } from '../type/budget'
import { useBudget } from 'src/stores/budgetData';
import TablePaginationSimple from 'src/components/pagination/TablePaginationSimple.vue';

const props = defineProps<{ importDialogLoading: boolean; previewData: BudgetData[]; okData: boolean }>();

const columns = ref(budgetColumns);
const budgetStore = useBudget();
const okData = ref(props.okData);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
});


</script>
