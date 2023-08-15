<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, withDefaults, computed, ref, watch } from 'vue';
import FacilityType from '../form/clientFactoryForms/FacilityType.vue';
import ContractUnit from '../form/ContractUnit.vue';
import ClientType from '../form/clientForms/ClientType.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { getMunicipalities } from 'src/shared/constants/Municipalities.const';
import { deepCopy } from 'src/shared/utils';
import { InputType } from './types';
import { commaSeparatedNumber } from 'src/shared/utils/utils';
import { validateTime } from 'src/shared/constants/Form.const';
const { t } = useI18n({ useScope: 'global' });


export interface Data {
    label: string;
    value: string | number | boolean | string[];
    editType: string
    key: string
}

export type DataWithIndustry = Data[] | {
    commonItems: Data[];
    uniqueItems: Data[];
};

const props = withDefaults(defineProps<{
    data: Data[],
    theme?: string,
    selectedIndustry?: { value: string, isSelected: boolean }
}>(), {
    theme: 'primary'
})

const newData = ref(deepCopy(props.data))

const municipalities = ref<string[]>([])
const fetchMunicipalities = ref(false)

const emit = defineEmits<{
    (e: 'data-changed', newData: Data[] )
}>()

watch(newData, () => {
    emit('data-changed', newData.value)
}, {deep: true})

watch(() => newData.value.find(item => item.editType === 'prefecture'), async (newVal, oldVal) => {
    if (newVal !== oldVal && newVal) {
        fetchMunicipalities.value = false
        municipalities.value = await getMunicipalities(newVal.value as string)
        fetchMunicipalities.value = true
    } else {
        fetchMunicipalities.value = false
    }
}, { immediate: true })

const leftColumn = computed(() => newData.value.filter((_, index) => index % 2 === 0))
const rightColumn = computed(() => newData.value.filter((_, index) => index % 2 !== 0))
</script>

<template>
    <q-form class="row justify-between">
        <div class="column">
            <div v-for="row in leftColumn" :key="row.label" class="line">
                <label :class="`text-${theme} line__label`">
                    {{ row.label }}
                </label>
                <q-input v-if="row.editType === InputType.NUMBER && (typeof row.value === 'number' || row.value === '')" v-model.number="row.value" class="line__value q-pl-sm" type="number" dense hide-bottom-space :color="theme" @input="val => (row.value = val || 0)"/>
                <q-input v-else-if="row.editType === InputType.TEXT && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme"/>
                <q-input v-else-if="row.editType === InputType.COMMA_SEPARATED && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme" @update:model-value="(value)=>{ row.value = commaSeparatedNumber(value) }"/>
                <q-select v-else-if="row.editType === InputType.PREFECTURE" outlined dense :options="prefectureList" v-model="row.value"
                    bg-color="white" :label = "t('common.pleaseSelect')" emit-value map-options :color="theme" />
                <q-select v-else-if="row.editType === InputType.MUNICIPALITY" outlined dense :disable="!fetchMunicipalities" emit-value
                    bg-color="white"
                    :color="theme"
                    :options="municipalities"
                    v-model="row.value"  
                    :placeholder="t('client.add.municipalitieLabel')"/>
                <q-checkbox v-else-if="row.editType === InputType.DISPATCH_CONTRACT && typeof row.value === 'boolean'"
                    size="xs"
                    v-model="row.value"
                    :label="t('client.add.conclusionDispatchContract')" :color="theme" />
                <q-checkbox v-else-if="row.editType === InputType.REFERRAL_CONTRACT && typeof row.value === 'boolean'"
                    size="xs"
                    v-model="row.value"
                    :label="t('client.add.conclusionReferralContract')" :color="theme"/>
                <div v-else-if="row.editType === InputType.CLIENT && typeof row.value === 'string'">{{ row.value }}</div>
                <ContractUnit v-else-if="row.editType === InputType.CONTRACT_UNIT && typeof row.value === 'string'" v-model="row.value" :theme="theme"/>
                <ClientType v-else-if="row.editType === InputType.INDUSTRY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false"/>
                <FacilityType v-else-if="row.editType === InputType.FACILITY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false" :industryName="selectedIndustry?.value"/>
                <template v-else-if="row.editType === InputType.RADIO && typeof row.value === 'string'">
                  <q-radio
                      v-for="item in row.radioVals"
                      v-model="row.value"
                      :val="item.value"
                      :key="item.value"
                      :label="item.label"
                    />
                </template>
                <div v-else-if="row.editType === InputType.HOURS" class="row q-ml-md">
                  <q-input dense outlined bg-color="white" v-model="row.value.from"
                      :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space class="col">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="row.value.from" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="theme" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span class="q-ma-sm flex-center col-1 text-center">{{ '~' }}</span>
                    <q-input dense outlined bg-color="white" class="col" v-model="row.value.to"
                      :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="row.value.to" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="theme" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <!-- Add more conditions for other data types as needed -->
            </div>
        </div>

        <div class="column">
            <div v-for="row in rightColumn" :key="row.label" class="line">
                <label :class="`text-${theme} line__label`">
                    {{ row.label }}
                </label>
                <q-input v-if="row.editType === InputType.NUMBER && (typeof row.value === 'number' || row.value === '')" v-model.number="row.value" class="line__value q-pl-sm" step="any" type="number" dense hide-bottom-space :color="theme"/>
                <q-input v-else-if="row.editType === InputType.TEXT && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme"/>
                <q-input v-else-if="row.editType === InputType.COMMA_SEPARATED && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme" @update:model-value="(value)=>{ row.value = commaSeparatedNumber(value) }"/>
                <q-select v-else-if="row.editType === InputType.PREFECTURE" outlined dense :options="prefectureList" v-model="row.value"
                    bg-color="white" :label = "t('common.pleaseSelect')" emit-value map-options :color="theme" />
                <q-select v-else-if="row.editType === InputType.MUNICIPALITY" outlined dense :disable="!fetchMunicipalities" emit-value
                    bg-color="white"
                    :color="theme"
                    :options="municipalities"
                    v-model="row.value"  
                    :placeholder="t('client.add.municipalitieLabel')"/>
                <q-checkbox v-else-if="row.editType === InputType.DISPATCH_CONTRACT && typeof row.value === 'boolean'"
                    size="xs"
                    v-model="row.value"
                    :label="t('client.add.conclusionDispatchContract')" :color="theme" />
                <q-checkbox v-else-if="row.editType === InputType.REFERRAL_CONTRACT && typeof row.value === 'boolean'"
                    size="xs"
                    v-model="row.value"
                    :label="t('client.add.conclusionReferralContract')" :color="theme"/>
                <div v-else-if="row.editType === InputType.CLIENT && typeof row.value === 'string'">{{ row.value }}</div>
                <ContractUnit v-else-if="row.editType === InputType.CONTRACT_UNIT && typeof row.value === 'string'" v-model="row.value" :theme="theme"/>
                <ClientType v-else-if="row.editType === InputType.INDUSTRY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false"/>
                <FacilityType v-else-if="row.editType === InputType.FACILITY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false"/>
                <template v-else-if="row.editType === InputType.RADIO && typeof row.value === 'string'">
                  <q-radio
                      v-for="item in row.radioVals"
                      v-model="row.value"
                      :val="item.value"
                      :key="item.value"
                      :label="item.label"
                    />
                </template>
                <div v-else-if="row.editType === InputType.HOURS" class="row q-ml-md">
                  <q-input dense outlined bg-color="white" v-model="row.value.from"
                      :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space class="col">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="row.value.from" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="theme" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <span class="q-ma-sm flex-center col-1 text-center">{{ '~' }}</span>
                    <q-input dense outlined bg-color="white" class="col" v-model="row.value.to"
                      :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="row.value.to" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="theme" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                    <!-- Add more conditions for other data types as needed -->
            </div>
        </div>
    </q-form>
</template>

<style lang="scss" scoped>
.column {
    width: 50%;
}
.line {
    display: flex;
    align-items: center;
    width: 100%;

    &__label {
        display: inline-flex;
        width: 50%;
        font-size: 1rem;
        text-align: right;
        justify-content: flex-end;
    }
}

</style>