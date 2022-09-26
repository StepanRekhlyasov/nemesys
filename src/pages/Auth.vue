<template>
  <q-page class="flex q-pa-none justify-center items-center">
    <q-card style="width: 100%; max-width: 500px">
      <AuthComponent />
    </q-card>
  </q-page>
</template>

<script>
import AuthComponent from 'components/AuthComponent';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthPage',
  components: { AuthComponent },
});
</script>
