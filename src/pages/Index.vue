<template>
  <q-page class="flex flex-center">
    <img
      :alt="$t('systemName') + ' Logo'"
      src="~assets/CLI_dot.png"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex'
})
</script>
