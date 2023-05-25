<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, withDefaults, computed, ref, watch } from 'vue';
import ParentClient from './form/clientFactoryForms/ParentClient.vue';
import ContractUnit from './form/ContractUnit.vue';
import ClientType from './form/clientForms/ClientType.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
const { t } = useI18n({ useScope: 'global' });

enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    PREFECTURE = 'prefecture',
    CLIENT = 'client',
    CONTRACT_UNIT = 'contract_unit',
    INDUSTRY = 'industry'
}

export interface Data {
    label: string;
    value: string | number | string[];
    editType: string
    key: string
}

const props = withDefaults(defineProps<{
    data: Data[],
    theme?: string
}>(), {
    theme: 'primary'
})

const newData = ref(props.data)

const emit = defineEmits<{
    (e: 'data-changed', newData: Data[] )
}>()

watch(newData, () => {
    emit('data-changed', newData.value)
}, {deep: true})

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
                <q-input v-if="row.editType === InputType.NUMBER && typeof row.value === 'number'" v-model="row.value" class="line__value q-pl-sm" type="number" dense hide-bottom-space :color="theme"/>
                <q-input v-else-if="row.editType === InputType.TEXT && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme"/>
                <q-select v-else-if="row.editType === InputType.PREFECTURE" outlined dense :options="prefectureList" v-model="row.value"
                    bg-color="white" :label = "t('common.pleaseSelect')" emit-value map-options :color="theme" />
                <ParentClient v-else-if="row.editType === InputType.CLIENT && typeof row.value === 'string'" v-model="row.value" :is-label="false" :theme="theme"/>
                <ContractUnit v-else-if="row.editType === InputType.CONTRACT_UNIT && typeof row.value === 'string'" v-model="row.value" :theme="theme"/>
                <ClientType v-else-if="row.editType === InputType.INDUSTRY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false"/>
                    <!-- Add more conditions for other data types as needed -->
            </div>
        </div>

        <div class="column">
            <div v-for="row in rightColumn" :key="row.label" class="line">
                <label :class="`text-${theme} line__label`">
                    {{ row.label }}
                </label>
                <q-input v-if="row.editType === InputType.NUMBER && typeof row.value === 'number'" v-model="row.value" class="line__value q-pl-sm" type="number" dense hide-bottom-space :color="theme"/>
                <q-input v-else-if="row.editType === InputType.TEXT && typeof row.value === 'string'" v-model="row.value" class="line__value q-pl-sm" type="text" dense hide-bottom-space :color="theme"/>
                <q-select v-else-if="row.editType === InputType.PREFECTURE" outlined dense :options="prefectureList" v-model="row.value"
                    bg-color="white" :label = "t('common.pleaseSelect')" emit-value map-options :color="theme" />
                <ParentClient v-else-if="row.editType === InputType.CLIENT && typeof row.value === 'string'" v-model="row.value" :is-label="false" :theme="theme"/>
                <ContractUnit v-else-if="row.editType === InputType.CONTRACT_UNIT && typeof row.value === 'string'" v-model="row.value" :theme="theme"/>
                <ClientType v-else-if="row.editType === InputType.INDUSTRY && Array.isArray(row.value)" v-model="row.value" :theme="theme" :is-label="false"/>
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
    align-items: baseline;
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