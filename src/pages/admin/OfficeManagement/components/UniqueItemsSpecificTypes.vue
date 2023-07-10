<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref } from 'vue';

import { Industry } from 'src/shared/model/Industry.model';
import { QInput } from 'quasar';
const { t } = useI18n({ useScope: 'global' });

defineProps<{
    activeIndustry: Industry | null
}>()

const emit = defineEmits<{
    (e: 'newSpecificType', data: {title: string, dataType: string})
}>()

const newSpecificType = ref({
    title: '',
    dataType: 'string'
})
const inputVal = ref<QInput>()

const newSpecificTypeHandle = () => {
    if(inputVal.value && inputVal.value.validate()) {
        emit('newSpecificType', newSpecificType.value)
        newSpecificType.value.title = ''
    }
}
</script>

<template>
    <div v-if="activeIndustry">
        <div v-if="activeIndustry.uniqueItems.typeSpecificItems.length">
            <div v-for="(line, idx) in activeIndustry.uniqueItems.typeSpecificItems" :key="line.id" class="row items-center q-mt-md">
                <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

                <div class="q-mr-md">{{ t('KPI.item') + ` ${idx + 1}` }}</div>

                <q-input class="q-mr-md" outlined readonly dense v-model="line.title"/>

                <q-input class="q-mr-md" outlined readonly dense v-model="line.dataType"/>
            </div>
        </div>

        <div class="row items-center q-mt-md">
            <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

            <div class="q-mr-md">{{ t('KPI.item') + ` ${activeIndustry.uniqueItems.typeSpecificItems.length + 1}` }}</div>

            <q-input
                class="q-mr-md" outlined dense
                v-model="newSpecificType.title"
                ref="inputVal"
                color="accent"
                lazy-rules
                :rules="[
                     (val) => (val && val.length > 0) || '',
                     (val) => (/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(val)) || 'Invalid input. Keys should start with a letter, $ or _, and should not contain spaces or special characters.'
                ]" hide-bottom-space/>

            <q-select class="q-mr-md" dense outlined v-model="newSpecificType.dataType" :options="['string', 'number']" color="accent">

            </q-select>

            <div>
                <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm" @click="newSpecificTypeHandle"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>