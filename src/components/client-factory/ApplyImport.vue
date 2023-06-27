<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import { safeGet } from 'src/shared/utils';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ChangedData } from './types';

const { t } = useI18n({ useScope: 'global' });

type LocalImportData = { label: string; value: string | number | boolean | string[]; key: string, isHighlight: boolean, isChecked: boolean }[]

const props = defineProps<{
    isOpen: boolean,
    importData: ChangedData,
    clientFactory: ClientFactory,
    isLoading: boolean
}>()

const localLoading = ref(false)
const locadImportData = ref<LocalImportData>()
const checkedRows = computed(() => {
    return locadImportData.value?.filter(row => row.isChecked)
})

const emit = defineEmits<{
    (e: 'update:isOpen', payload: boolean): void,
    (e: 'importHandle', payload: ChangedData)
}>()

const importHandle = () => {
    emit('importHandle', checkedRows.value as ChangedData)
    emit('update:isOpen', false)
}

onMounted(() => {
    localLoading.value = true

    locadImportData.value = props.importData.map((el) => ({ ...el, isChecked: false, isHighlight: el.isHighlight ?? false }))

    localLoading.value = false
})
</script>

<template>
    <q-dialog :model-value="isOpen" @hide="() => emit('update:isOpen', false)">
        <q-card class="content q-pa-md">
            <q-card-section class="text-bold text-h5 text-accent">
                {{ t('clientFactory.drawer.importTitle') }}
            </q-card-section>

            <q-card-section style="max-height: 25vh" class="scroll relative-position">
                <div class="spinner-container" v-if="isLoading || localLoading">
                    <q-spinner-hourglass
                        color="accent"
                        size="4em"
                        class="spinner"/>

                        <div class="blur-overlay"></div>
                </div>

                <div class="flex-container">
                    <div class="flex-column"></div>
                    <div class="flex-column q-ml-xs">
                        {{ t('import.beforeImport') }}
                    </div>
                    <div class="flex-column q-ml-xs">
                        {{ t('import.afterImport') }}
                    </div>
                </div>

                <div v-for="row in locadImportData" class="q-mt-sm" :key="row.key">

                    <div v-if="row.isHighlight" class="flex-container items-center">
                        <div class="flex-column row items-center text-accent">
                            <q-checkbox v-model="row.isChecked" color="accent" :disable="isLoading || localLoading"/>
                            {{ row.label }}
                        </div>

                        <div class="flex-column q-ml-xs bg-grey-2 q-pa-xs">
                        
                            <span v-if="Array.isArray(safeGet(clientFactory, row.key))">
                                {{ safeGet(clientFactory, row.key).join(', ') }}
                            </span>

                            <q-icon v-else-if="(typeof safeGet(clientFactory, row.key) === 'boolean')" color="black" :name="safeGet(clientFactory, row.key) ? 'circle' : 'mdi-close'"/>

                            <span v-else>
                                {{ safeGet(clientFactory, row.key) }}
                            </span>
                        </div>

                        <div class="flex-column q-ml-xs bg-grey-2 text-bold text-accent q-pa-xs">

                            <span v-if="Array.isArray(row.value)">
                                {{ row.value.join(', ') }}
                            </span>

                            <q-icon v-else-if="(typeof row.value === 'boolean')" color="black" :name="row.value ? 'circle' : 'mdi-close'"/>

                            <span v-else>
                                {{ row.value }}
                            </span>
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="text-right">
                <q-btn color="accent" size="sm" class="no-shadow" @click="importHandle">
                    {{ t('menu.admin.licenseManagement.execution') }}
                </q-btn>
                <q-btn color="accent" outline size="sm" class="no-shadow q-ml-md" @click="emit('update:isOpen', false)">
                    {{ t('common.cancel') }}
                </q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
.content {
    width: 700px;
    max-width: 80vw;
}
.flex-container {
    display: flex;
    flex-wrap: wrap;
}
.flex-column {
    flex: 1;
}

.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
