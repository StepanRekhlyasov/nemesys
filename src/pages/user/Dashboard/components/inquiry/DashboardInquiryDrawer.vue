<template>
  <q-drawer
    v-model="drawerRight"
    show
    class="bg-grey-1"
    :width="780"
    :breakpoint="500"
    side="right"
    overlay elevated
    bordered
    >
    <q-scroll-area
      class="fit text-left"
      v-if="true">
      <q-card class="no-shadow bg-grey-3">
        <q-card-section class="text-white bg-primary" >
          <div class="row q-gutter-sm items-end">
              <q-btn dense flat icon="close" @click="() => emit('closeDrawer')" />
            <div class="col-4 text-h5">
              {{ $t('common.contact') }}
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="bg-grey-1">
          <slot></slot>
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const drawerRight = ref(false);
const emit = defineEmits(['closeDrawer'])

</script>
