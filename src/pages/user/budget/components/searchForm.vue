<template>
  <div>
    <div class="row q-pl-xs">
      <q-input outlined :placeholder="$t('form.searchPlaceholder')" style="width: 350px" color="black" dense
        bg-color="white" v-model="searchData['text']" clearable />
      <q-btn dense style="color: white" :label="$t('common.search')" class="q-ml-sm q-px-lg buttonbg" @click="search" />
      <q-btn dense :label="$t('common.clear')" outline class="q-ml-sm q-px-md text-bold buttonbg" @click="clear" />
      <q-expansion-item v-model="expanded" dense dense-toggle :label="$t('common.detailedConditions')"
        header-class="q-pa-none" switch-toggle-side style="max-width: 200px;" class="q-ml-lg" />
    </div>
    <q-expansion-item hide-expand-icon :header-style="{ display: 'none' }" v-model="expanded">
      <q-form ref="sForm">
        <div v-for=" (items, index) in budgetItem" :key="index">
          <div class="row q-mt-sm">
            <div class="col q-pl-xs q-pr-xs" v-for="item in items" :key="item.key"
              :class="item.key == 'postingPeriod' ? 'col-4' : ''">
              {{ item.label }}
              <q-input outlined dense v-model="searchData[item.key]" v-if="item.type == 'text'" hide-bottom-space
                bg-color="white" clearable />
              <div v-else-if="item.type == 'number' && item.range" style="display: flex;" class="items-center">
                <q-input outlined dense v-model="searchData[item.key + 'Min']" hide-bottom-space min="0" bg-color="white"
                  @update:model-value="v => { searchData[item.key + 'Min'] = formatNumber(v) }" class="q-mr-xs" clearable>
                  <template v-slot:prepend v-if="item.icon">
                    <q-icon name="currency_yen" />
                  </template>
                </q-input>
                ~
                <q-input outlined dense v-model="searchData[item.key + 'Max']" hide-bottom-space min="0" bg-color="white"
                  @update:model-value="v => { searchData[item.key + 'Max'] = formatNumber(v) }" class="q-ml-xs" clearable>
                  <template v-slot:prepend v-if="item.icon">
                    <q-icon name="currency_yen" />
                  </template>
                </q-input>
              </div>
              <q-input outlined dense v-model="searchData[item.key]" v-else-if="item.type == 'number'" hide-bottom-space
                min="0" bg-color="white"
                @update:model-value="v => { searchData[item.key] = v?.toString().replace(/[^0-9]/g, '') }" clearable />

              <q-select outlined dense :options="options[item.key]" v-model="searchData[item.key + 'Id']"
                hide-bottom-space bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options
                v-else-if="item.type == 'select'" clearable />
              <q-input v-model="searchData[item.key]" outlined dense mask="####/##"
                v-else-if="item.type == 'date' && item.format == 'month'" hide-bottom-space bg-color="white" clearable>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="monthPicker">
                      <q-date v-model="searchData[item.key]" minimal mask="YYYY/MM" emit-immediately default-view="Years"
                        @update:model-value="checkValue">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-model="searchData['postingStartDate']" outlined dense mask="date" hide-bottom-space
                bg-color="white" clearable lazy-rules v-else-if="item.type == 'date' && item.key == 'postingStartDate'">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="searchData['postingStartDate']" minimal :options="optionsStart">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <div v-else-if="item.type == 'date' && item.key == 'postingEndDate'" style="display: flex;"
                class="items-center">
                ~
                <q-input v-model="searchData['postingEndDate']" outlined dense mask="date" hide-bottom-space
                  bg-color="white" clearable class="q-ml-sm">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="searchData['postingEndDate']" minimal :options="optionsEnd">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-input v-model="searchData[item.key]" outlined dense mask="date"
                v-else-if="item.type == 'date' || '' || null" :rules="['date']" hide-bottom-space bg-color="white"
                clearable>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="searchData[item.key]" minimal :options="optionsStart">
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
        </div>
      </q-form>
    </q-expansion-item>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { budgetSearchItem } from '../consts/Budget.const';
import { OptionData, BudgetData } from '../type/budget'
import { useBudget } from 'src/stores/budgetData';
import { useOrganization } from 'src/stores/organization';
import { formatNumber } from 'src/shared/utils/utils';

const emit = defineEmits<{ (e: 'searchBudget', data: BudgetData) }>()

const budgetStore = useBudget();
const organization = useOrganization()
const searchDataSample = {
  recordNumber: '',
  accountingMonth: '',
  branchId: '',
  id: '',
  mediaId: '',
  numberOfSlots: '',
  occupation: '',
  postingEndDate: '',
  postingStartDate: '',
  unitPrice: '',
  remark: '',
  agency: '',

}
const searchData = ref<BudgetData>(JSON.parse(JSON.stringify(searchDataSample)));

const expanded = ref(false)
const budgetItem = ref(budgetSearchItem);
const options = ref<OptionData>({ occupation: [] });
const monthPicker = ref();
const sForm = ref();

onMounted(async () => {
  options.value = await budgetStore.getOptionData(organization.currentOrganizationId);
});

const optionsEnd = (date: string) => {
  return date >= searchData.value['postingStartDate'];
}
const optionsStart = (date: string) => {
  if (searchData.value['postingEndDate'] && searchData.value['postingEndDate'] != '-') {
    return date <= searchData.value['postingEndDate'];
  }
  return true;
}
const search = () => {
  emit('searchBudget', JSON.parse(JSON.stringify(searchData.value)))
}
const clear = () => {
  searchData.value = JSON.parse(JSON.stringify(searchDataSample))
  search()
  sForm.value.reset()
  sForm.value.resetValidation()
}
const checkValue = (val: string, reason: string) => {
  if (reason === 'month') {
    monthPicker.value[0].hide();
  }
}
</script>
