<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, watchEffect } from 'vue';
import EditableColumnsCF, { Data, DataWithIndustry } from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import { useOfficeDetails } from 'src/components/client-factory/handlers';
import { RenderOfficeDetailsWithIndustryType, RenderOfficeDetailsWithoutIndustryType } from 'src/components/client-factory/types';
import { ChangedData } from 'src/components/client-factory/types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    clientFactory: ClientFactory
    draft: Partial<ClientFactory>
    isLoading: boolean
    industryType?: string
}>();
const emit = defineEmits<{
    (e: 'editDraft', changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>)
}>()

const isEditForm = ref({
    registeredInfo: false,
    commonItems: false,
    uniqueItems: false
})

const officeDetails = ref<RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType>({} as RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType)
const dataForUpdating = ref<Record<string, Data | DataWithIndustry>>(props.industryType ? {
    registeredInfo: officeDetails.value.registeredInfo,
    [props.industryType]: {
        commonItems: officeDetails.value[`${props.industryType}.commonItems`],
        uniqueItems: officeDetails.value[`${props.industryType}.uniqueItems`]
    }
} : {
    registeredInfo: officeDetails.value.registeredInfo,
    commonItems: officeDetails.value.commonItems,
    uniqueItems: officeDetails.value.uniqueItems
})

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

const editDraft = (changedData: ChangedData) => {

    emit('editDraft', changedData)
}

watchEffect(() => {
    officeDetails.value = useOfficeDetails(props.clientFactory, props.draft, props.industryType)
});
</script>

<template>
    <HighlightTwoColumn
        :is-drop-down="true"
        :data="officeDetails.registeredInfo"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.registeredInfo"
        :label="t('clientFactory.drawer.registeredInformation')"
        theme="primary"
        @open-edit="isEditForm.registeredInfo = true"
        @close-edit="isEditForm.registeredInfo = false"
        @on-save="isEditForm.registeredInfo = false; editDraft(dataForUpdating.registeredInfo as Data[])"/>

    <EditableColumnsCF
        v-if="isEditForm.registeredInfo" @data-changed="e => getNewDataToUpdate(e, 'registeredInfo')"
        :data="officeDetails.registeredInfo" theme="primary"/>


    <HighlightTwoColumn 
        :is-drop-down="true"
        :data="officeDetails[`${industryType ? `${industryType}.commonItems` : 'commonItems'}`]"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.commonItems"
        :label="t('clientFactory.drawer.commonItems')"
        theme="primary"
        @open-edit="isEditForm.commonItems = true"
        @close-edit="isEditForm.commonItems = false"
        @on-save="isEditForm.commonItems = false; editDraft(dataForUpdating[`${industryType ? `${industryType}.commonItems` : 'commonItems'}`] as Data[])"/>

    <EditableColumnsCF
        v-if="isEditForm.commonItems"
        @data-changed="e => getNewDataToUpdate(e, `${industryType ? `${industryType}.commonItems` : 'commonItems'}`)"
        :data="officeDetails[`${industryType ? `${industryType}.commonItems` : 'commonItems'}`]" theme="primary"/>
    

    <HighlightTwoColumn
        v-if="industryType"
        :is-drop-down="true"
        :data="officeDetails[`${industryType}.uniqueItems`]"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.uniqueItems"
        :label="t('clientFactory.drawer.uniqueItems')"
        theme="primary"
        @open-edit="isEditForm.uniqueItems = true"
        @close-edit="isEditForm.uniqueItems = false"
        @on-save="isEditForm.uniqueItems = false; editDraft(dataForUpdating[`${industryType}.uniqueItems`] as Data[])"/>

    <EditableColumnsCF
        v-if="isEditForm.uniqueItems && industryType"
        @data-changed="e => getNewDataToUpdate(e, `${industryType}.uniqueItems`)"
        :data="officeDetails[`${industryType}.uniqueItems`]" theme="primary"/>
</template>

<style lang="scss" scoped>

</style>