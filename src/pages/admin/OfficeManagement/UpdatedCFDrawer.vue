<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, watchEffect, ref } from 'vue';
import UpdatedCFDrawerTitle from './components/UpdatedCFDrawerTitle.vue'
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import ApplyImport from 'src/components/client-factory/ApplyImport.vue';
import { useHighlightMainInfo, useOfficeDetails } from 'src/components/client-factory/handlers';

import { ChangedData, RenderMainInfo, RenderOfficeDetailsWithIndustryType, RenderOfficeDetailsWithoutIndustryType } from 'src/components/client-factory/types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { CustomIndustry } from './types';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    isDrawer: boolean,
    clientFactory: ClientFactory,
    modifiedCF: ModifiedCF,
    isLoading: boolean,
}>()

const emit = defineEmits<{
    (e: 'hideDrawer'),
    (e: 'applyImport', payload: ChangedData)
}>()

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
const detailsInfo = ref<RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType>({} as RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType)
const isImportDialog = ref(false)
const dropDownIndustryValue = ref([] as Array<CustomIndustry>)
const selectedIndustry = ref<CustomIndustry>({} as CustomIndustry)

const initializeIndustry = () => {
    dropDownIndustryValue.value = props.clientFactory.industry?.reduce((acc, industry, index) => {
        if (industry) {
            acc.push({
                value: industry,
                isSelected: index === 0,
                ts: t(`client.add.${industry}`)
            })
        }

        return acc
    }, [] as Array<CustomIndustry>)

    if (!selectedIndustry.value.value) {
        selectedIndustry.value = dropDownIndustryValue.value[0] ?? {}
    }
}

const getDetailsInfo = (key: string, industry?: CustomIndustry, industryOfficeDetails?: ChangedData) => {
    let items: ChangedData = [];
    if (!industry) {

        items = detailsInfo.value[key] || [];
        items = items.map(item => ({ ...item, industry: null }));
    } else {

        items = industryOfficeDetails || [];
        items = items.map(item => ({ ...item, industry: industry.ts }));
    }
    return items;
}

const generateIndustryData = () => {
    let data: ChangedData = [];
    if (dropDownIndustryValue.value && dropDownIndustryValue.value.length > 0) {

        dropDownIndustryValue.value.forEach(industry => {
            const industryOfficeDetails = useOfficeDetails(props.clientFactory, props.modifiedCF, industry.value)

            data.push(
                ...getDetailsInfo('commonItems', industry, industryOfficeDetails[`${industry.value}.commonItems`] as ChangedData),
                ...getDetailsInfo('uniqueItems', industry, industryOfficeDetails[`${industry.value}.uniqueItems`] as ChangedData)
            )
        })

    } else {

        data.push(
            ...getDetailsInfo('commonItems'),
            ...getDetailsInfo('uniqueItems')
        )
    }
    return data;
}

const industryHandler = (value: CustomIndustry) => {
    selectedIndustry.value = value
}

const hideDrawer = () => {
    emit('hideDrawer')
}
const importDialogHandle = (value: boolean) => {
    isImportDialog.value = value
}
const importHandle = (data: ChangedData) => {
    emit('applyImport', data)
}

watchEffect(() => {
    if(props.clientFactory.industry.length) {
        initializeIndustry();
    }

    mainInfo.value = useHighlightMainInfo(props.clientFactory, props.modifiedCF)
    detailsInfo.value = useOfficeDetails(props.clientFactory, props.modifiedCF, selectedIndustry.value.value)
})
</script>

<template>
    <q-drawer
        :model-value="props.isDrawer"
        overlay
        elevated
        side="right"
        :breakpoint="400"
        :width="800">
            <q-scroll-area class="fit text-left">
                <q-card class="no-shadow bg-grey-2">
                    <q-card-section class="text-white bg-accent row items-end" >
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        <UpdatedCFDrawerTitle
                            v-if="clientFactory"
                            @import-handle="importDialogHandle(true)"
                            @edit-industry="industryHandler"
                            :industry-value="dropDownIndustryValue"
                            :selected-industry="selectedIndustry"
                            :clientFactory="clientFactory"/>
                    </q-card-section>

                    <q-card-section class="container bg-white">
                        <HighlightTwoColumn
                            :is-edit="false"
                            :show-actions="false"
                            :data="mainInfo.officeInfo"
                            theme="accent"
                            :label="t('client.add.officeInfo')"/>
 
                        <HighlightTwoColumn
                            :is-edit="false"
                            :show-actions="false"
                            :data="mainInfo.contactInfo"
                            theme="accent"
                            :label="t('client.add.contactInfo')"/>
                    </q-card-section>

                    <q-card-section class="bg-grey-2">
                        <div class="q-pa-md bg-white">
                            <HighlightTwoColumn
                                :data="detailsInfo.registeredInfo"
                                :label="t('clientFactory.drawer.registeredInformation')"
                                :is-edit="false"
                                :show-actions="false"
                                theme="accent"/>

                            <HighlightTwoColumn
                                :data="detailsInfo[`${selectedIndustry.value ? `${selectedIndustry.value}.commonItems` : 'commonItems'}`]"
                                :label="t('clientFactory.drawer.commonItems')"
                                :is-edit="false"
                                :show-actions="false"
                                theme="accent"/>

                            <HighlightTwoColumn
                                :data="detailsInfo[`${selectedIndustry.value ? `${selectedIndustry.value}.uniqueItems` : 'uniqueItems'}`]"
                                :label="t('clientFactory.drawer.uniqueItems')"
                                :is-edit="false"
                                :show-actions="false"
                                theme="accent"/>
                        </div>
                    </q-card-section>
                </q-card>
            </q-scroll-area>

    </q-drawer>

    <ApplyImport
        :key="modifiedCF.id"
        @import-handle="importHandle"
        @update:is-open="(e: boolean) => importDialogHandle(e)"
        :importData="[
            ...mainInfo.officeInfo,
            ...mainInfo.contactInfo,
            ...detailsInfo.registeredInfo,
            ...generateIndustryData()
        ]"
        :client-factory="clientFactory"
        :is-open="isImportDialog"
        :is-loading="isLoading"/>
</template>

<style lang="scss" scoped>
.container {
    padding: 4%;
}
</style>