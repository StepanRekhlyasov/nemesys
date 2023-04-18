<template>
  <q-card class="no-shadow bg-grey-3">
    <q-card-section class="text-white bg-primary no-border-radius" >
      <div class="row">
        <div class="flex items-end ">
          <q-btn dense flat icon="close" class="q-mr-md " @click="emits('closeDialog')"/>
        </div>
        <div>
          <div class="row text-subtitle2">
            株式会社キカリ / 特別養護老人ホームキカリ
          </div>
          <div class="row text-h6 text-weight-bold q-pr-xs">
            バックオーダー新規追加／派遣
          </div>
        </div>
      </div>
    </q-card-section >
    <q-card-section class="bg-white">        
      <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold q-mr-md" size="sm"/>
      <q-btn :label="$t('common.cancel')" outline  color="primary" class="text-weight-bold" @click="emits('closeDialog')" size="sm"/>
    </q-card-section>
    <q-separator color="white" size="2px" />
    <q-card-section>
      <q-form >
        
      </q-form>
    </q-card-section>
  </q-card>
      
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';

const emits = defineEmits(['closeDialog']);
const props = defineProps<{
  backOrder: BackOrderModel
}>()
const backOrderData = ref(props.backOrder || {} as BackOrderModel)
</script>
