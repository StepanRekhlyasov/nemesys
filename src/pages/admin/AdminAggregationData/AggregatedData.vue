<template>
    <PageHader>
        {{ t('menu.admin.aggregateDataDisplayTable.dataOutput') }}
    </PageHader>
    <div class="q-pt-lg q-pl-sm custom-color" v-for="(item, idx) in Listitem" :key="idx">
        <div class="bold-text" >
            <span v-if="!item.required">{{ t('menu.admin.aggregateDataDisplayTable.companyWide') }}</span> {{ item.label }} {{ t('menu.admin.aggregateDataDisplayTable.dataOutput') }}
        </div>
        <div class="box1">
            <div class="row q-pt-sm"  v-if="item.required">
                <div class="col-1-5 q-pt-sm q-pl-sm" >
                    {{ t('menu.admin.aggregateDataDisplayTable.outputMonth') }}
                </div>
                <div class="col-3 q-pl-sm">
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
            <div class="row q-pt-sm">
                <div class="col-1-5 q-pt-sm q-pl-sm">
                    CSV {{ t('menu.admin.aggregateDataDisplayTable.output') }}
                </div>
                <div class="col-3 q-pl-lg" >
                    <q-btn color="purple" text-color="white" @click="downloadCSV(item.collectionName,timeperiod[idx].date)">{{
                        t('menu.admin.aggregateDataDisplayTable.output') }}</q-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref,Ref} from 'vue';
import {Alert} from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import PageHader from 'src/components/PageHeader.vue';
import Listitem from './const/AggregateData.const'
import {useAggregatedData} from 'src/stores/aggregateData'
const { t } = useI18n({ useScope: 'global' });
const triggerURL = process.env.downloadCSVUrl;
const monthPicker: Ref<{value: string}> = ref({
  value: '',
});
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
        if (date.length === 0) {
            Alert.warning('Please enter input field', { color: 'negative' })
            return
        }
        const [year, month] = date.split('/');
        fetchURL = `${fetchURL}&year=${year}&month=${month}`
    }
    const name = aggregateData.getFileName(collectionName)
    await aggregateData.downloadCSV(fetchURL,name)
    onReset();
}
const onReset = () =>{
    timeperiod.value.filter(item => {
        item.date=''
    });
}
</script>
<style lang="scss">
.bold-text {
    font-weight: bold;
}
.box1{
    margin-left: 10vw;
}
.custom-color{
    color:purple
}
</style>