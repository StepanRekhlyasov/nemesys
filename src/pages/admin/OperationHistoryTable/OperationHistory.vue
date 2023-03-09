<template>
  <PageHader>
    {{ $t('menu.admin.operationHistory') }}
  </PageHader>
  <div class="no-shadow full-width operation-change bg-white">
    <q-card class="bg-grey-2 no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
      <OperationHistoryTable/>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import  OperationHistoryTable from './components/OperationHistoryTable.vue'
  import PageHader from 'src/components/PageHeader.vue'
</script>

<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
.operation-change {
  &__header {
    border-bottom: 2px solid $grey-5;
  }
}
</style>
