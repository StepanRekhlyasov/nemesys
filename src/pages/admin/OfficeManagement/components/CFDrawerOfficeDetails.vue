<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, watchEffect, ref } from 'vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import EditableColumnsCF, { Data } from 'src/components/client-factory/EditableColumnsCF.vue';
import { useOfficeDetails } from 'src/components/client-factory/handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderOfficeDetails } from 'src/components/client-factory/types';
import { ChangedData } from 'src/components/client-factory/types';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory,
    draft: Partial<ClientFactory>,
    isLoading: boolean
}>()
const emit = defineEmits<{
    (e: 'editDraft', changedData: ChangedData)
}>()

const officeDetails = ref<RenderOfficeDetails>({} as RenderOfficeDetails)

const isEditForm = ref({
    registeredInfo: false,
    commonItems: false,
    uniqueItems: false
})

const dataForUpdating = ref<Record<string, Data[]>>({
    registeredInfo: officeDetails.value.registeredInfo,
    commonItems: officeDetails.value.commonItems,
    uniqueItems: officeDetails.value.uniqueItems
})

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

const handleEditDraft = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}

watchEffect(() => {
    officeDetails.value = useOfficeDetails(props.clientFactory, props.draft)
});

</script>

<template>
    <div style="height: 5px;" class="q-my-none q-pa-none">
        <q-linear-progress v-if="isLoading" indeterminate rounded color="accent" />
    </div>

    <HighlightTwoColumn
        :is-drop-down="true"
        :data="officeDetails.registeredInfo"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.registeredInfo"
        :label="t('clientFactory.drawer.registeredInformation')"
        theme="accent"
        @open-edit="isEditForm.registeredInfo = true"
        @close-edit="isEditForm.registeredInfo = false"
        @on-save="isEditForm.registeredInfo = false; handleEditDraft(dataForUpdating.registeredInfo)"/>

    <EditableColumnsCF
        v-if="isEditForm.registeredInfo" @data-changed="e => getNewDataToUpdate(e, 'registeredInfo')"
        :data="officeDetails.registeredInfo" theme="accent"/>


    <HighlightTwoColumn 
        :is-drop-down="true"
        :data="officeDetails.commonItems"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.commonItems"
        :label="t('clientFactory.drawer.commonItems')"
        theme="accent"
        @open-edit="isEditForm.commonItems = true"
        @close-edit="isEditForm.commonItems = false"
        @on-save="isEditForm.commonItems = false; handleEditDraft(dataForUpdating.commonItems)"/>

    <EditableColumnsCF
        v-if="isEditForm.commonItems"
        @data-changed="e => getNewDataToUpdate(e, 'commonItems')"
        :data="officeDetails.commonItems" theme="accent"/>
    

    <HighlightTwoColumn
        :is-drop-down="true"
        :data="officeDetails.uniqueItems"
        :is-disable-edit="isLoading"
        :is-edit="isEditForm.uniqueItems"
        :label="t('clientFactory.drawer.uniqueItems')"
        theme="accent"
        @open-edit="isEditForm.uniqueItems = true"
        @close-edit="isEditForm.uniqueItems = false"
        @on-save="isEditForm.uniqueItems = false; handleEditDraft(dataForUpdating.uniqueItems)"/>

    <EditableColumnsCF
        v-if="isEditForm.uniqueItems"
        @data-changed="e => getNewDataToUpdate(e, 'uniqueItems')"
        :data="officeDetails.uniqueItems" theme="accent"/>
</template>

<style lang="scss" scoped>
</style>