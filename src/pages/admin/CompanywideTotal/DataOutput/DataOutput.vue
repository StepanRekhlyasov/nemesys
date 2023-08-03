<template>
  <PageHader>
      {{ t('menu.admin.dataOutputDisplay') }}
  </PageHader>
  <div class="q-pt-lg q-pl-sm custom-color" v-for="(item, idx) in Listitem" :key="idx">
      <div class="bold-text">
          <q-avatar square size="10px" color="purple" class="q-mr-sm" />
          <span v-if="!item.required">{{ t('menu.admin.dataOutputDisplayTable.companyWide') }}</span> {{ item.label }} {{
              t('menu.admin.dataOutputDisplay') }}
      </div>
      <div class="box1">
          <div class="row q-pt-sm" v-if="item.required">
              <div class="col-1 q-pt-sm q-pl-sm ">
                  {{ t('KPI.targetPeriod') }}
              </div>
              <div class="col-1 q-pl-sm">
                  <DateRange v-model="dateRange" :width="'250px'" :height="'40px'" />
              </div>
          </div>
          <div class="row q-pt-sm q-pl-xs q-ml-sm">
              <div class="col-3 q-pl-lg q-ml-xl">
                  <q-btn color="purple" text-color="white" @click="downloadCSV(item.collectionName, dateRange)">{{
                      t('common.csvOutput') }}</q-btn>
              </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import DateRange from 'src/components/inputs/DateRange.vue';
import PageHader from 'src/components/PageHeader.vue';
import Listitem from './const/DataOutput.const'
import { useDataOutput } from 'src/stores/dataOutput'
const { t } = useI18n({ useScope: 'global' });
const triggerURL = process.env.downloadCSVUrl;
const timeperiod = ref([{ date: '' }, { date: '' }, { date: '' }])
const dataOutput = useDataOutput();
const dateRange = ref<
  {
      from: string;
      to: string;
  } | null>(null)

const downloadCSV = async (collectionName: string, date: { from: string; to: string; } | null) => {
  let fetchURL = `${triggerURL}?collection=${collectionName}`
  if (typeof date === 'object' && (!date?.from || !date.to)) {
      Alert.warning();
      return;
  }
  fetchURL = `${fetchURL}&from=${date.from}&to=${date.to}`
  await dataOutput.downloadCSV(fetchURL, collectionName)
  onReset();
}
const onReset = () => {
  timeperiod.value.filter(item => {
      item.date = ''
  });
}
</script>
<style lang="scss">
.bold-text {
  font-weight: bold;
}

.box1 {
  margin-left: 10vw;
}

.custom-color {
  color: purple
}
</style>
