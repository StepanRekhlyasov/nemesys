<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect, watch } from 'vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useHeadDetails } from 'src/components/client-factory//handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ChangedData, RenderHeadDetails } from 'src/components/client-factory/types'
import { useRoute } from 'vue-router';
import { useClient } from 'src/stores/client';

const { t } = useI18n({ useScope: 'global' });
const route = useRoute()
const theme = route.meta.isAdmin ? 'accent' : 'primary'
const props = defineProps<{
    clientId: string,
    clientFactory:ClientFactory
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
    relatedOfficeInfo: false
})

const clientStore = useClient()
const client = ref()

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
  client.value = await clientStore.fetchClientsById(props.clientId)
  headDetails.value = useHeadDetails(headClientFactory.value as ClientFactory, relatedOfficeInfo.value, client.value)
})

watch(localClientId, fetchHeadClientFactory, {immediate: true})

const editDraft = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}
</script>

<template>
    <div style="height: 5px;" class="q-my-none q-pa-none">
        <q-linear-progress v-if="isLoading" indeterminate rounded :color="theme" />
    </div>

    <div v-if="!isLoading">
        <HighlightTwoColumn 
            :data="headDetails.headOfficeInfo"
            :label="t('clientFactory.drawer.headOfficeInfo')"
            :is-edit="isOpenEditDropDown.headOfficeInfo"
            :show-actions="false"
            :is-drop-down="true"
            :is-disable-edit="isLoading"
            @open-edit="isOpenEditDropDown.headOfficeInfo = true"
            @close-edit="isOpenEditDropDown.headOfficeInfo = false"
            @on-save="isOpenEditDropDown.headOfficeInfo = false; editDraft(dataForUpdating.headOfficeInfo as Data[])"
            :theme="theme"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.headOfficeInfo" @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="headDetails.headOfficeInfo" :theme="theme"/>

        <HighlightTwoColumn 
            :data="headDetails.clientInfo"
            :label="t('clientFactory.drawer.clientInfo')"
            :is-edit="isOpenEditDropDown.clientInfo"
            :show-actions="false"
            :is-drop-down="true"
            :is-disable-edit="isLoading"
            @open-edit="isOpenEditDropDown.clientInfo = true"
            @close-edit="isOpenEditDropDown.clientInfo = false"
            :theme="theme"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.clientInfo" @data-changed="e => getNewDataToUpdate(e, 'clientInfo')" :data="headDetails.clientInfo" :theme="theme"/>

        <HighlightTwoColumn 
            :data="headDetails.contractInfo"
            :label="t('clientFactory.drawer.contractInfo')"
            :is-edit="isOpenEditDropDown.contractInfo"
            :show-actions="false"
            :is-drop-down="true"
            :is-disable-edit="isLoading"
            @open-edit="isOpenEditDropDown.contractInfo = true"
            @close-edit="isOpenEditDropDown.contractInfo = false"
            :theme="theme"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.contractInfo" @data-changed="e => getNewDataToUpdate(e, 'contractInfo')" :data="headDetails.contractInfo" :theme="theme"/>
        
        <HighlightTwoColumn 
            :data="headDetails.relatedOfficeInfo" 
            :label="t('clientFactory.drawer.relatedOfficeInfo')"
            :is-edit="isOpenEditDropDown.relatedOfficeInfo" 
            :show-actions="false" 
            :is-drop-down="true"
            :is-disable-edit="isLoading"
            @open-edit="isOpenEditDropDown.relatedOfficeInfo = true"
            @close-edit="isOpenEditDropDown.relatedOfficeInfo = false"
            :theme="theme" />

        <EditableColumnsCF v-if="isOpenEditDropDown.relatedOfficeInfo" @data-changed="e => getNewDataToUpdate(e, 'relatedOfficeInfo')" :data="headDetails.relatedOfficeInfo" :theme="theme"/>
    </div>
</template>
