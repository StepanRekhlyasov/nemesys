<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1 main-layout">
    <q-toolbar class="bg-primary text-white">
      <q-space />
      <ToolbarLanguage />
    </q-toolbar>
    <q-page-container class="page-container full-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToolbarLanguage from 'components/toolbar/ToolbarLanguage.vue';

export default defineComponent({
  name: 'AuthLayout',
  components: { ToolbarLanguage },
  setup() {
    return {};
  },
});
</script>
