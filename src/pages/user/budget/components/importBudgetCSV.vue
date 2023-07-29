<template>
  <div class="no-shadow full-width">
    <q-linear-progress indeterminate v-if="props.importDialogLoading" size="xs" />
    <div class="row text-primary text-bold q-ma-sm"> {{ $t('budget.dataReadSuccessfully') }} </div>
    <div class="row q-ml-sm"> {{ $t('budget.numValidData') }}: {{ props.previewOKData.length }} </div>
    <budgetTable :previewData="props.previewOKData" :importDialogLoading="props.importDialogLoading" :okData="true"
      v-if="props.previewOKData.length > 0" />

    <q-separator color="gray-8" size="2px" />

    <div class="row text-primary text-bold q-ma-sm"> {{ $t('budget.invalidData') }} </div>
    <div class="row q-ml-sm"> {{ $t('budget.numInvalidData') }}: {{ props.previewNGData.length }} </div>

    <budgetTable :previewData="props.previewNGData" :importDialogLoading="props.importDialogLoading" :okData="false"
      v-if="props.previewNGData.length > 0" />

  </div>
</template>
<script  lang="ts" setup>
import { BudgetData } from '../type/budget'
import budgetTable from './budgetTable.vue'

const props = defineProps<{ importDialogLoading: boolean; previewOKData: BudgetData[]; previewNGData: BudgetData[]; }>();

</script>
