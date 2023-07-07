<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineEmits, defineProps } from 'vue';
import { Industry } from 'src/shared/model/Industry.model';

const { t } = useI18n({ useScope: 'global' });

defineProps<{
    industries: Industry[]
    activeIndustry: Industry | null
}>()

const emit = defineEmits<{ 
    (event: 'update:activeIndustry', value: Industry): void 
}>()
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
            <q-btn color="accent" size="sm">
                {{ t('common.addNew') }}
            </q-btn>
       </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}

.select {
    width: 200px;
}
</style>