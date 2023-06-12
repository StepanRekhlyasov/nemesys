<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect, watch } from 'vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import CFDrawerBodyFooter from './CFDrawerBodyFooter.vue';
import { useHighlightMainInfo } from '../handlers';
import { finishEditing } from 'src/components/client-factory/hadlers';

import { RenderMainInfo } from '../types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    clientFactory: ClientFactory
}>();

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
const isEditForm = ref({
    officeInfo: false,
    contactInfo: false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory)
})
</script>

<template>
    <div class="wrapper">
        <HighlightTwoColumn 
            :data="mainInfo.officeInfo"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            theme="accent"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"
            @on-save="isEditForm.officeInfo = false; finishEditing(dataForUpdating.officeInfo, props.clientFactory.draft, props.clientFactory)"/>
        
        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="accent"/>

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :label="t('client.add.contactInfo')"
            theme="accent"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; finishEditing(dataForUpdating.contactInfo, props.clientFactory.draft, props.clientFactory)"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="accent"/>

    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

   <CFDrawerBodyFooter :client-factory="clientFactory"/>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 1% 5%;
}
</style>