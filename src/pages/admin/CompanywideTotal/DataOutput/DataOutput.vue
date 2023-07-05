<template>
    <PageHader>
        {{ t('menu.admin.dataOutputDisplay') }}
    </PageHader>
    <div class="q-pt-lg q-pl-sm custom-color" v-for="(item, idx) in Listitem" :key="idx">
        <div class="bold-text">
            <q-avatar square size="10px" color="purple" class="q-mr-sm"/>
            <span v-if="!item.required">{{ t('menu.admin.dataOutputDisplayTable.companyWide') }}</span> {{ item.label }} {{
                t('menu.admin.dataOutputDisplay') }}
        </div>
        <div class="box1">
            <div class="row q-pt-sm" v-if="item.required">
                <div class="col-2 q-pt-sm q-pl-sm">
                    {{ t('menu.admin.dataOutputDisplayTable.outputMonth') }}
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
                <div class="col-2 q-pt-sm q-pl-sm">
                    CSV {{ t('menu.admin.dataOutputDisplayTable.output') }}
                </div>
                <div class="col-3 q-pl-sm">
                    <q-btn color="purple" text-color="white"
                        @click="downloadCSV(item.collectionName, timeperiod[idx].date)">{{
                            t('menu.admin.dataOutputDisplayTable.output') }}</q-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import PageHader from 'src/components/PageHeader.vue';
import Listitem from './const/DataOutput.const'
import { useDataOutput } from 'src/stores/dataOutput'
const { t } = useI18n({ useScope: 'global' });
const triggerURL = process.env.downloadCSVUrl;
const monthPicker: Ref<{ value: string }> = ref({
    value: '',
});
const timeperiod = ref([{ date: '' }, { date: '' }, { date: '' }])
const dataOutput = useDataOutput();
const checkValue = (val: string, reason: string) => {
    if (reason === 'month') {
        monthPicker.value[0].hide();
        monthPicker.value[1].hide();
    }
}
const downloadCSV = async (collectionName: string, date: string) => {
    let fetchURL = `${triggerURL}?collection=${collectionName}`
    if (collectionName != 'BO') {
        if (date.length === 0) {
            Alert.warning()
            return
        }
        const [year, month] = date.split('/');
        if(year.length!==4 || month.length!==2){
            Alert.warning()
            return
        }
        fetchURL = `${fetchURL}&year=${year}&month=${month}`
    }
    await dataOutput.downloadCSV(fetchURL,collectionName)
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
}</style>