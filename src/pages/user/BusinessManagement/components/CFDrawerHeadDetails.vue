<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect, watch, defineEmits } from 'vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import EditableColumnsCF, { Data } from 'src/components/client-factory/EditableColumnsCF.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useHeadDetails } from 'src/components/client-factory//handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from 'src/components/client-factory/types'
import { ChangedData } from 'src/components/client-factory/types';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory
    clientId: string
}>()
const emit = defineEmits<{
    (e: 'editDraft', changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>)
}>()
const { getHeadClientFactory, getRelatedOfficeInfo } = useClientFactory()

const headDetails = ref<RenderHeadDetails>({} as RenderHeadDetails)
const headClientFactory = ref<ClientFactory>({} as ClientFactory)
const localClientId = ref(props.clientId)
const isLoading = ref(false)
const relatedOfficeInfo = ref({})
const isOpenEditDropDown = ref({
    headOfficeInfo: false,
    clientInfo: false,
    contractInfo: false,
    relatedOfficeInfo:false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

const fetchHeadClientFactory = async () => {
    isLoading.value = true

    headClientFactory.value = await getHeadClientFactory(props.clientId, ) as ClientFactory
    relatedOfficeInfo.value = await getRelatedOfficeInfo(props.clientId)
    isLoading.value = false
}

watchEffect(async () => {
    headDetails.value = useHeadDetails(headClientFactory.value as ClientFactory,relatedOfficeInfo.value)
})
watch(localClientId, fetchHeadClientFactory, { immediate: true })

const editDraft = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}
</script>

<template>
    <div style="height: 5px;" class="q-my-none q-pa-none">
        <q-linear-progress v-if="isLoading" indeterminate rounded color="primary" />
    </div>

    <div v-if="!isLoading">
        <HighlightTwoColumn :data="headDetails.headOfficeInfo" :label="t('clientFactory.drawer.headOfficeInfo')"
            :is-drop-down="true" 
            :show-actions="clientFactory.isHead"
            :is-disable-edit="isLoading"
            :is-edit="isOpenEditDropDown.headOfficeInfo"
            @open-edit="isOpenEditDropDown.headOfficeInfo = true"
            @close-edit="isOpenEditDropDown.headOfficeInfo = false"
            @on-save="isOpenEditDropDown.headOfficeInfo = false; editDraft(dataForUpdating.headOfficeInfo as Data[])"
            v-if="!clientFactory.isHead"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.headOfficeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="headDetails.headOfficeInfo" />

        <HighlightTwoColumn :data="headDetails.clientInfo" :label="t('clientFactory.drawer.clientInfo')" 
        :show-actions="clientFactory.isHead"
        :is-drop-down="true" 
        :is-disable-edit="isLoading"
        :is-edit="isOpenEditDropDown.clientInfo"
        @open-edit="isOpenEditDropDown.clientInfo = true"
        @close-edit="isOpenEditDropDown.clientInfo = false"
        @on-save="isOpenEditDropDown.clientInfo = false; editDraft(dataForUpdating.clientInfo as Data[])"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.clientInfo" @data-changed="e => getNewDataToUpdate(e, 'clientInfo')"
            :data="headDetails.clientInfo"/>

        <HighlightTwoColumn :data="headDetails.contractInfo" :label="t('clientFactory.drawer.contractInfo')"
            :show-actions="clientFactory.isHead"
            :is-drop-down="true" 
            :is-disable-edit="isLoading"
            :is-edit="isOpenEditDropDown.contractInfo"
            @open-edit="isOpenEditDropDown.contractInfo = true"
            @close-edit="isOpenEditDropDown.contractInfo = false"
            @on-save="isOpenEditDropDown.contractInfo = false; editDraft(dataForUpdating.contractInfo as Data[])"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.contractInfo" @data-changed="e => getNewDataToUpdate(e, 'contractInfo')"
            :data="headDetails.contractInfo"/>

        <HighlightTwoColumn :data="headDetails.relatedOfficeInfo" :label="t('clientFactory.drawer.relatedOfficeInfo')"
            :is-edit="false" :show-actions="false" :is-drop-down="true" />
    </div>
</template>

<style lang="scss" scoped></style>
