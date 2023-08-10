<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.inHouseInformation') }}
    </div>

    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.referralFee')" :edit="true" required
        labelClass="q-pl-md col-2 text-right self-center self-center"  valueClass="q-pl-md col-10 flex">
        <q-input v-model="data['referralFee']" outlined dense type="number"
          :disable="loading" :rules="[creationRule]" hide-bottom-space/>
        <span class="col-2 q-ma-sm flex-center">%</span>
      </labelField>
    </div>

    <div class="row q-mt-sm">
      <labelField :label="$t('backOrder.create.referralFeeAmount')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex">
        <q-input v-model="data['stipulatedAmount']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.yen') }}</span>
      </labelField>
    </div>

    <div class="row q-mt-sm">
      <labelField :label="$t('client.list.memo')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10">
        <q-input v-model="data['memo_house']" outlined dense :disable="loading" type="textarea" autogrow/>
      </labelField>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { creationRule } from 'src/components/handlers/rules';
import { BackOrderModel } from 'src/shared/model';
import { ref, watch} from 'vue';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean
}>()

const data = ref(props.backOrder)

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })
</script>

<style>

</style>
