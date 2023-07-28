<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { QInput } from 'quasar';
import { defineEmits, defineProps, ref } from 'vue';
import { Industry } from 'src/shared/model/Industry.model';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    industries: Industry[]
    activeIndustry: Industry | null
    isNewIndustryPopup: boolean
}>()

const emit = defineEmits<{ 
    (event: 'update:activeIndustry', value: Industry): void,
    (e: 'update:isNewIndustryPopup', payload: boolean): void,
    (e: 'newIndustry', industryName: string)
}>()

const newIndustry = ref('')
const inputVal = ref<QInput>()

const titleExists = (value: string) => {
    if(props.industries.find((el) => el.industryName === value)) {
        return false
    }

    return true
}

const saveNewIndustry = async () => {
    if (inputVal.value && inputVal.value.validate()) {
        emit('newIndustry', newIndustry.value)
        newIndustry.value = ''
        emit('update:isNewIndustryPopup', false)
    }
}
</script>

<template>
    <div class="row items-center">
        <h4 class="title q-mr-lg">
            {{ t('industry.uniqueItemSetting') }}
        </h4>

        <q-select
            :disable="!industries.length"
            class="select q-mr-lg"
            :model-value="activeIndustry"
            emit-value
            map-options
            dense
            color="accent"
            @update:modelValue="val => emit('update:activeIndustry', val)"
            :options="industries"
            option-label="industryName"
            option-value="."
        />

       <div>
            <q-btn color="accent" size="sm" @click="() => emit('update:isNewIndustryPopup', true)">
                {{ t('common.addNew') }}
            </q-btn>
       </div>
    </div>

    <q-dialog :model-value="isNewIndustryPopup" @hide="() => emit('update:isNewIndustryPopup', false)">
        <q-card class="content-popup q-pa-md">
            <q-card-section class="text-bold text-h6 text-accent">
                {{ t('industry.newIndustry') }}
            </q-card-section>

            <q-card-section class="row items-center">
                <q-input
                    ref="inputVal"
                    v-model="newIndustry"
                    class="q-mr-md"  outlined dense
                    color="accent" hide-bottom-space
                    :rules="[
                        (val) => (val && val.length > 0) || '',
                        (val) => (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(val)) || 'Invalid input. Keys should start with a letter, $ or _, and should not contain spaces or special characters.',
                        (val) => titleExists(val) || 'Title already exists'
                    ]"
                />

                <div>
                    <q-btn color="accent" icon="mdi-plus" :label="t('common.save')" size="sm" @click="saveNewIndustry"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}

.content-popup {
    width: 500px;
    max-width: 50vw;
}

.select {
    width: 200px;
}
</style>