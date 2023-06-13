<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import CFDrawerBodyFooter from './CFDrawerBodyFooter.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useHighlightMainInfo, updateClientFactoryHangler } from '../handlers';

import { RenderMainInfo } from '../types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import Quasar, { useQuasar } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar()

const { updateClientFactory } = useClientFactory()
const props = defineProps<{
    clientFactory: ClientFactory
}>();
const emit = defineEmits<{
    (e: 'handleImport')
}>()

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
const isLoading = ref(false)
const isEditForm = ref({
    officeInfo: false,
    contactInfo: false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

const handleImport = () => {
    emit('handleImport')
}

const onSaveHandle = async (dataToChange: RenderMainInfo['contactInfo'] | RenderMainInfo['officeInfo']) => {
    isLoading.value = true
    const modifiedCF = updateClientFactoryHangler(dataToChange, props.clientFactory)

    await updateClientFactory(modifiedCF, $q as unknown as typeof Quasar)

    isLoading.value = false
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory)
})
</script>

<template>
    <div class="wrapper">
        <div style="height: 5px;" class="q-my-none q-pa-none">
            <q-linear-progress v-if="isLoading" indeterminate rounded color="accent" />
        </div>

        <HighlightTwoColumn 
            :data="mainInfo.officeInfo"
            :is-disable-edit="isLoading"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            theme="accent"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"
            @on-save="isEditForm.officeInfo = false; onSaveHandle(dataForUpdating.officeInfo as RenderMainInfo['contactInfo'] | RenderMainInfo['officeInfo'])"/>
        
        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="accent"/>

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :is-disable-edit="isLoading"
            :label="t('client.add.contactInfo')"
            theme="accent"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; onSaveHandle(dataForUpdating.contactInfo as RenderMainInfo['contactInfo'] | RenderMainInfo['officeInfo'])"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="accent"/>

    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

   <CFDrawerBodyFooter
    @handle-import="handleImport"
    :client-factory="clientFactory"/>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 1% 5%;
}
</style>