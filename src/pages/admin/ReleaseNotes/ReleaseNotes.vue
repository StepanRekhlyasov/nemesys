<template>
  <div class="bg-white">
  <PageHader>
    {{ $t('menu.admin.releaseNotes') }}
  </PageHader>

    <div class="operation-change__content  q-ma-md  bg-grey-2"  style="width: 720px; max-width: 80vw">
      <q-expansion-item
          dense
          dense-toggle
          default-opened
          expand-icon="arrow_drop_down"
          expand-icon-class="text-accent"
          header-class="q-pa-none"
          switch-toggle-side
        >
        <template v-slot:header="{ expanded }">
          <div class="flex items-center">{{expanded? $t('releaseNotes.form.close') : $t('releaseNotes.form.open')}}</div>
        </template>
        <NotificationForm @change-key="changeKey"/>
      </q-expansion-item>
    </div>

    <div class="no-shadow full-width operation-change bg-white">
    <q-card class="bg-grey-2 no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
      <NotificationTable :flag="key"/>
    </q-card>
  </div>
  </div>
</template>

<script lang="ts" setup>
  import PageHader from 'src/components/PageHeader.vue'
  import { ref } from 'vue'
  import NotificationForm from './components/NotificationForm.vue'
  import NotificationTable from './components/NotificationTable.vue';
  const key = ref(0);
  const changeKey = ()=>{
    key.value = key.value==0?1:0;
  }
</script>
