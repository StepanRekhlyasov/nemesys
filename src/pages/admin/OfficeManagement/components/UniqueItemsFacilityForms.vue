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
    (e: 'newFacilityForm', data: string)
}>()

const newFacilityForm = ref('')
const inputVal = ref<QInput>()

const newFacilityFormHandle = () => {
    if(inputVal.value && inputVal.value.validate()) {
        emit('newFacilityForm', newFacilityForm.value)
        newFacilityForm.value = ''
    }
}
</script>

<template>
    <div v-if="activeIndustry">
        <div v-if="Object.keys(activeIndustry.uniqueItems.facilityForms).length">
            <div v-for="(line, key, idx) in activeIndustry.uniqueItems.facilityForms" :key="key" class="row items-center q-mt-md">
                <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

                <div class="q-mr-md">{{ t('clientFactory.facilityType') + ` ${idx + 1}` }}</div>

                <q-input class="q-mr-md" outlined readonly dense v-model="line.title"/>
            </div>
        </div>

        <div class="row items-center q-mt-md">
            <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

            <div class="q-mr-md">{{ t('clientFactory.facilityType') + ` ${Object.keys(activeIndustry.uniqueItems.facilityForms).length + 1}` }}</div>

            <q-input
                class="q-mr-md" outlined dense
                v-model="newFacilityForm"
                ref="inputVal"
                :rules="[
                     (val) => (val && val.length > 0) || '',
                     (val) => (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(val)) || 'Invalid input. Keys should start with a letter, $ or _, and should not contain spaces or special characters.'
                ]"
                color="accent" hide-bottom-space/>

            <div class="q-mr-md">
                <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm" @click="newFacilityFormHandle"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>