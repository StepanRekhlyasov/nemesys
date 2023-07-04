<template>
    <PageHader>
        {{ t('menu.admin.aggregateDataDisplayTable.dataoutput') }}
    </PageHader>
    <div class="q-pt-lg q-pl-sm" v-for="(item, idx) in Listitem" :key="idx" style="color:purple;">
        <div style="font-weight:bold">
            <span class=""> {{ item.label }} {{ t('menu.admin.aggregateDataDisplayTable.dataoutput') }}</span>
        </div>
        <div style="margin-left:10vw">
            <div class="q-pt-sm q-pl-sm" style="display:flex" v-if="item.required">
                <div class="q-pt-sm q-pl-sm">
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
                <div class="q-pt-sm q-pl-sm">
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
import PageHader from 'src/components/PageHeader.vue'
import axios from 'axios';
const monthPicker = ref();
const timeperiod = ref([{date:''},{date:''},{date:''}])
const checkValue = (val: string, reason: string) => {
  if (reason === 'month') {
      monthPicker.value[0].hide();
      monthPicker.value[1].hide();
  }
}
const downloadCSV = (collectionName:string,date:string) => {
    let triggerURL = `https://asia-northeast1-dev-nemesys-firebase.cloudfunctions.net/download_csv?collection=${collectionName}`
    if(collectionName!='BO'){
        if(date.length==0){
            alert('please fill input field')
            return
        }
        const [year, month] = date.split('/');
        triggerURL = `${triggerURL}&year=${year}&month=${month}`
        console.log(triggerURL);
    }
    try {
        axios.get(triggerURL)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'downloaded_data.csv');
                document.body.appendChild(link);
                link.click();
                console.log('CSV file downloaded successfully.');
            })
            .catch((error) => {
                console.log(error)
            })
    }
    catch (error) {
        console.error('An error occurred:', error);
    }

}
const Listitem = [
    { label: 'SMS ', required: true,collectionName: 'sms' },
    { label: 'FAX ', required: true,collectionName: 'fax' },
    { label: 'Company-wide BO output', required: false, date:'',collectionName: 'BO' }
]

</script>
