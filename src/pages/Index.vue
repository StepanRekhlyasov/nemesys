<template>
  <q-page class="flex flex-center">
    <div v-if="isDevMode"
      style="max-width: 550px; ">
        <p class="text-h6 text-weight-bolder text-center">nemesys{{$t('devMode.title')}}</p>
        <p class="text-h6 text-weight-bolder header q-mb-none text-center" >
          {{$t('devMode.phone')}}
        </p>
        <p class="text-h6 text-weight-bolder header text-center" >
          {{$t('devMode.email')}}
        </p>


    </div>
    <img
      v-else
      :alt="$t('systemName') + ' Logo'"
      src="~assets/CLI_dot.png"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',

  setup() {
    // TODO: add dev mode state on firebase

    const isDevMode = false;

    return {
      isDevMode
    }
  }
});
</script>
