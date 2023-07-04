<template>
    <PageHader>
        {{ t('menu.admin.aggregateDataDisplayTable.dataoutput') }}
    </PageHader>
    <div class="q-pt-lg q-pl-sm" v-for="(item, idx) in Listitem" :key="idx" style="color:purple;">
        <div style="font-weight:bold">
            <span><span v-if="!item.required">{{ t('menu.admin.aggregateDataDisplayTable.companywide') }}</span> {{ item.label }} {{ t('menu.admin.aggregateDataDisplayTable.dataoutput') }}</span>
        </div>
        <div style="margin-left:10vw">
            <div class="q-pt-sm q-pl-sm" style="display:flex" v-if="item.required">
                <div class="q-pt-sm q-pl-sm" style="width:104px">
                    <span>{{ t('menu.admin.aggregateDataDisplayTable.outputmonth') }}</span>
                </div>
                <div style="margin-left:5px">
                    <q-input v-model="timeperiod[idx].date" outlined dense mask="####/##" hide-bottom-space>
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="monthPicker">
                                    <q-date v-model="timeperiod[idx].date" minimal mask="YYYY/MM" emit-immediately
                                        default-view="Years" @update:model-value="checkValue">
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
            <div class="q-pt-sm q-pl-sm" style="display: flex;">
                <div class="q-pt-sm q-pl-sm" style="width:89px">
                    <span> CSV {{ t('menu.admin.aggregateDataDisplayTable.output') }}</span>
                </div>
                <div style="margin-left:20px">
                    <q-btn color="purple" text-color="white" @click="downloadCSV(item.collectionName,timeperiod[idx].date)">{{
                        t('menu.admin.aggregateDataDisplayTable.output') }}</q-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Alert} from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import PageHader from 'src/components/PageHeader.vue';
import Listitem from './const/AggregateData.const'
import {useAggregatedData} from 'src/stores/aggregateData'
const { t } = useI18n({ useScope: 'global' });
const triggerURL = process.env.downloadCSVUrl;
const monthPicker = ref();
const timeperiod = ref([{date:''},{date:''},{date:''}])
const aggregateData = useAggregatedData();
const checkValue = (val: string, reason: string) => {
if (reason === 'month') {
      monthPicker.value[0].hide();
      monthPicker.value[1].hide();
  }
}
const downloadCSV = async(collectionName:string,date:string) => {
    let fetchURL = `${triggerURL}?collection=${collectionName}`
    if (collectionName != 'BO') {
        if (date.length == 0) {
            Alert.warning('Please enter input field', { color: 'negative' })
            return
        }
        const [year, month] = date.split('/');
        fetchURL = `${fetchURL}&year=${year}&month=${month}`
    }
    let name = aggregateData.getFileName(collectionName)
    await aggregateData.downloadCSV(fetchURL,name)
    onReset();
}
const onReset = () =>{
    timeperiod.value = timeperiod.value.map(item => {
        return { date: '' };
    });
}
</script>
