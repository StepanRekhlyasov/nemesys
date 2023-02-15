<template>
  <div class="no-shadow full-width operation-change ">
    <div class="operation-change__header q-py-sm q-px-md">
      <div class="text-h6 text-accent">{{ $t('menu.admin.operationChange') }}</div>
    </div>
    <div class="operation-change__content q-pa-md">
      <div class="text-h5 text-weight-bold text-accent">{{ $t('operationChange.active') }}</div>
      <div class="row q-mt-md q-gutter-md">
        <q-btn :ripple="false" color="secondary" no-caps class="text-grey-6 q-py-none text-weight-bold text-caption">
          {{ $t('operationChange.resume') }}
        </q-btn>

        <q-btn :ripple="false" color="negative" no-caps   class=" q-py-none text-weight-bold text-caption">
          {{ $t('operationChange.stop') }}
        </q-btn>
      </div>
      <div class="q-px-md q-py-lg row">
        <div class="col-3 grid-style-transition">
        <q-list dense>
              <q-item >
                <q-item-section>
                  <q-item-label class="text-right q-mr-md text-accent">連続稼働時間</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-item-label caption>1000:10:51
                </q-item-label>
                </q-item-section>

              </q-item>
              <q-item >
                <q-item-section>
                  <q-item-label class="text-right q-mr-md text-accent">連続稼働時間</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-item-label caption>1000:10:51
                </q-item-label>
                </q-item-section>

              </q-item>
            </q-list>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'OperationСhangePage',
  }
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
