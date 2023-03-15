<template>
  <div class="bg-white">
  <PageHader>
    {{ $t('menu.admin.inquiry') }}
  </PageHader>

    <div class="no-shadow full-width operation-change bg-white">
      <q-card class="bg-grey-2 no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <InquiryTable />
      </q-card>
    </div>

    <InquiryDrawer />

  </div>
</template>

<script lang="ts" setup>
  import PageHader from 'src/components/PageHeader.vue'
  import InquiryDrawer from './components/InquiryDrawer.vue';
  import InquiryTable from './components/InquiryTable.vue';



</script>
