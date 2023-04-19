<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.introduction') }}
    </div>      
    <div class="row ">
      <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <q-input v-model="data['memo_house']" outlined dense :disable="loading"/>
      </labelField>
    </div>
    
  </q-card-section>
</template>

<script lang="ts" setup>
import LabelField from 'src/components/form/LabelField.vue';
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: BackOrderModel,
  loading: boolean
}>()

const data = ref(props.backOrder)
</script>

<style>

</style>