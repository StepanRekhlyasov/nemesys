<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, watchEffect, ref } from 'vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import TwoColumnLayout from 'src/components/TwoColumnLayout.vue';
import EditableColumnsCF, { Data } from 'src/components/EditableColumnsCF.vue';
import { useOfficeDetails, updateClientFactoryHangler } from '../../handlers/ClientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderOfficeDetails } from '../../types';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory
}>()

const officeDetails = ref<RenderOfficeDetails>(useOfficeDetails(props.clientFactory))

const isOpedEditDropDown = ref({
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

watchEffect(() => {
    officeDetails.value = useOfficeDetails(props.clientFactory)
});

</script>

<template>
    <DropDownEditGroup
    :label="t('clientFactory.drawer.registeredInformation')"
    theme="accent"
    :isEdit="isOpedEditDropDown.registeredInfo"
    :isLabelSquare="true"
    @openEdit="isOpedEditDropDown.registeredInfo = true"
    @closeEdit="isOpedEditDropDown.registeredInfo = false"
    @onSave="isOpedEditDropDown.registeredInfo = false; updateClientFactoryHangler(dataForUpdating.registeredInfo, clientFactory)">
        <TwoColumnLayout
            v-if="!isOpedEditDropDown.registeredInfo" :data="officeDetails.registeredInfo" theme="accent"/>

        <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'registeredInfo')" :data="officeDetails.registeredInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.commonItems')"
    theme="accent"
    :isEdit="isOpedEditDropDown.commonItems"
    :isLabelSquare="true"
    @openEdit="isOpedEditDropDown.commonItems = true"
    @closeEdit="isOpedEditDropDown.commonItems = false"
    @onSave="isOpedEditDropDown.commonItems = false; updateClientFactoryHangler(dataForUpdating.commonItems, clientFactory)">
        <TwoColumnLayout v-if="!isOpedEditDropDown.commonItems" :data="officeDetails.commonItems" theme="accent"/>

        <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'commonItems')" :data="officeDetails.commonItems" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.uniqueItems')"
    theme="accent"
    :isEdit="isOpedEditDropDown.uniqueItems"
    :isLabelSquare="true"
    @openEdit="isOpedEditDropDown.uniqueItems = true"
    @closeEdit="isOpedEditDropDown.uniqueItems = false"
    @onSave="isOpedEditDropDown.uniqueItems = false; updateClientFactoryHangler(dataForUpdating.uniqueItems, clientFactory)">
        <TwoColumnLayout v-if="!isOpedEditDropDown.uniqueItems" :data="officeDetails.uniqueItems" theme="accent"/>

        <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'uniqueItems')" :data="officeDetails.uniqueItems" theme="accent"/>
    </DropDownEditGroup>
</template>

<style lang="scss" scoped>
</style>