<template>
    <q-card-section class="bg-grey-3 flex items-center">
      <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('dashboard.notification') }}</p>
      <q-btn class="no-shadow q-ml-md" color="primary">{{ $t('menu.admin.inquiry') }}</q-btn>
    </q-card-section>
    <InquiryDrawer />
    <q-table 
      :columns="columns" 
      :rows="rows" 
      class="dashboardTable"
      :separator="'none'"
      hide-pagination
    >
    </q-table>
    <div class="bg-grey-3 flex items-center q-py-sm">
      <q-btn
        unelevated
        dense
      >
        <q-icon color="primary" :name="'arrow_drop_down'" :size="'25px'" /> {{ $t('dashboard.openList') }} 
      </q-btn>
    </div>
</template>
<script setup lang="ts">
import { dashboardNotificationTableColumns as columns } from '../const/dashboard.const'
import { dashboardNotificationRows } from '../types/dashboard.types'
import InquiryDrawer from 'src/pages/admin/InquiryPage/components/InquiryDrawer.vue';

defineProps<{
  rows?: dashboardNotificationRows[]
}>()
</script>