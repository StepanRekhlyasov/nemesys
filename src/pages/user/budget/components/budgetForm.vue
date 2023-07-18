<template>
  <div>
    <div class="text-h6 text-primary q-pl-md q-pt-md" v-if="!edit">{{ $t('budget.reg') }}</div>
    <q-linear-progress indeterminate v-if="loading" size="xs" />
    <q-form ref="budgetForm" @submit="onSubmit" @reset="onReset" class="q-pl-md q-pb-md">
      <div class="row" v-for="item in budgetItem" :key="item.key">
        <div class="col-2 q-pt-md q-pl-sm" v-if="item.type">
          {{ item.label }}
          <span class="text-red" v-if="item.required">*</span>
        </div>
        <div class="col-4 q-pl-sm q-pt-sm">
          <q-input outlined dense v-model="budgetData[item.key]" v-if="item.type == 'text'"
            :rules="[(val) => !!val || '' || !item['required']]" hide-bottom-space />
          <q-input outlined dense v-model="budgetData[item.key]" v-if="item.type == 'number'"
            :rules="[(val) => !!val || '' || !item['required']]" hide-bottom-space type="number" min="0">
            <template v-slot:prepend v-if="item.icon">
              <q-icon name="currency_yen" />
            </template>
          </q-input>
          <q-select outlined dense :options="options[item.key]" v-model="budgetData[item.key]"
            :rules="[(val) => !!val || '']" hide-bottom-space bg-color="white" :label="$t('common.pleaseSelect')"
            emit-value map-options v-else-if="item.type == 'select'" />
          <q-input v-model="budgetData[item.key]" outlined dense mask="####/##"
            v-else-if="item.type == 'date' && item.format == 'month'" :rules="[(val) => !!val || '' || !item['required']]"
            hide-bottom-space>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="monthPicker">
                  <q-date v-model="budgetData[item.key]" minimal mask="YYYY/MM" emit-immediately default-view="Years"
                    @update:model-value="checkValue">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="budgetData[item.key]" outlined dense mask="date"
            v-else-if="item.type == 'date' && item.key == 'postingEndDate'" :rules="['date']" hide-bottom-space>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="budgetData[item.key]" minimal :options="optionsEnd">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="budgetData[item.key]" outlined dense mask="date" v-else-if="item.type == 'date'"
            :rules="['date']" hide-bottom-space>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="budgetData[item.key]" minimal :options="optionsStart">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>


      <div class="q-pt-sm">
        <q-btn :label="$t('common.save')" type="submit" color="primary" />
        <q-btn :label="$t('common.cancel')" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { budgetAddItem } from '../consts/Budget.const';
import { useBudget } from 'src/stores/budgetData';
import { OptionData, BudgetData } from '../type/budget'
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
import { useOrganization } from 'src/stores/organization';
import { myDateFormat } from 'src/shared/utils/utils';

const props = defineProps<{ budgetData: object, edit: boolean }>()
const emit = defineEmits<{ (e: 'close') }>()

const budgetForm = ref();
const options = ref<OptionData>({ occupation: [] });
const budgetItem = ref(budgetAddItem);
const budgetStore = useBudget();
const loading = ref(true);
const edit = ref(props.edit);
const monthPicker = ref();
const organization = useOrganization()
const budgetDataSample = {
    accountingMonth: props.budgetData['accountingMonth'] || '',
    amount: props.budgetData['amount'] || '',
    branch: props.budgetData['branch'] || '',
    id: props.budgetData['id'] || '',
    media: props.budgetData['media'] || '',
    numberOfSlots: props.budgetData['numberOfSlots'] || '',
    occupation: props.budgetData['occupation'] || '',
    postingEndDate: myDateFormat(props.budgetData['postingEndDate'] || '', 'YYYY/MM/DD'),
    postingStartDate: myDateFormat(props.budgetData['postingStartDate'] || '', 'YYYY/MM/DD'),
    unitPrice: props.budgetData['unitPrice'] || '',
    remark: props.budgetData['remark'] || '',
    agency: props.budgetData['agency'] || '',

}
const budgetData = ref<BudgetData>(JSON.parse(JSON.stringify(budgetDataSample)));

onMounted(async () => {
    options.value = await budgetStore.getOptionData(organization.currentOrganizationId);
    onReset(true);
    loading.value = false;
});

watchCurrentOrganization(async (v) => {
    loading.value = true
    options.value = await budgetStore.getOptionData(v);
    onReset(true);
    loading.value = false;
})

const optionsEnd = (date: string) => {
  return date >= budgetData.value['postingStartDate'];
}
const optionsStart = (date: string) => {
  if (budgetData.value['postingEndDate']) {
    return date <= budgetData.value['postingEndDate'];
  }
  return true;
}


const onSubmit = async () => {
    if (!edit.value) {
        budgetData.value['organizationId'] = organization.currentOrganizationId
    }

    const save = await budgetStore.saveBudget(budgetData.value);
    if (save) {
        if (!budgetData.value['id']) {
            onReset();
            budgetForm.value.reset();
        } else {
            emit('close')
        }
    }
  }



const onReset = (mount = false) => {
  if (props.edit) {
    if (!mount) {
      emit('close')
    }
  }
  budgetData.value = JSON.parse(JSON.stringify(budgetDataSample));
  budgetForm.value.resetValidation();
};

const checkValue = (val: string, reason: string) => {
    if (reason === 'month') {
        monthPicker.value[0].hide();
    }
}
</script>
