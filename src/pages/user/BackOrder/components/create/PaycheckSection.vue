<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{ '■ '+ $t('backOrder.create.paycheck') }}
    </div>
    <div class="row">
      <labelField :label="$t('backOrder.create.hourlyMonthly')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md ">
        <q-field v-model="data['wage']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.create.monthlySalary')"
          val="monthlySalary" v-model="data['wage']" />
          <q-radio :disable="loading" :label="$t('backOrder.create.hourlyWage')"
          val="hourlyWage" v-model="data['wage']" />
        </q-field>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('backOrder.create.salary')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md flex">
        <q-input v-model="data['salary']" outlined dense type="number" :disable="loading" :rules="[creationRule]" hide-bottom-space/>
        <span v-if="data['wage'] == 'monthlySalary'" class="q-ma-sm flex-center">{{ $t('backOrder.create.yenMonth') }}</span>
        <span v-if="data['wage'] == 'hourlyWage'" class="q-ma-sm flex-center">{{ $t('backOrder.create.yenHour') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.benefit')" :edit="true" labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md ">
        <q-input v-model="data['benefit']" outlined dense :disable="loading" type="textarea" autogrow/>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.bonus')" :edit="true" labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md ">
        <q-input v-model="data['bonus']" outlined dense :disable="loading" type="textarea" autogrow/>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="true" labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md ">
        <q-input v-model="data['travelingExpenses']" outlined dense type="textarea" autogrow :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.payday')" :edit="true" labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md flex">
        <q-input v-model="data['payday']" outlined dense type="textarea" autogrow :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('client.backOrder.remarks')" :edit="true" labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10 q-pl-md ">
        <q-input v-model="data['remarks']" outlined dense :disable="loading" type="textarea" autogrow/>
      </labelField>
    </div>

  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref, watch } from 'vue';
import labelField from 'src/components/form/LabelField.vue';
import { creationRule } from 'src/components/handlers/rules';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean
}>()

const data = ref(props.backOrder)

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })
</script>
