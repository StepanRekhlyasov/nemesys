<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Quasar, { useQuasar } from 'quasar';
import { defineProps, ref, watchEffect, watch } from 'vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useHeadDetails } from 'src/components/client-factory//handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from 'src/components/client-factory/types'

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar()

const props = defineProps<{
    clientId: string
}>()

const { getHeadClientFactory } = useClientFactory()

const headDetails = ref<RenderHeadDetails>({} as RenderHeadDetails)
const headClientFactory = ref<ClientFactory>({} as ClientFactory)
const localClientId = ref(props.clientId)
const isLoading = ref(false)

const isOpenEditDropDown = ref({
    headOfficeInfo: false,
    clientInfo: false,
    contractInfo: false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

const fetchHeadClientFactory = async () => {
    isLoading.value = true

    headClientFactory.value = await getHeadClientFactory(props.clientId, $q as unknown as typeof Quasar) as ClientFactory

    isLoading.value = false
}

watchEffect(() => {
    headDetails.value = useHeadDetails(headClientFactory.value as ClientFactory)
})

watch(localClientId, fetchHeadClientFactory, {immediate: true})

</script>

<template>
    <div style="height: 5px;" class="q-my-none q-pa-none">
        <q-linear-progress v-if="isLoading" indeterminate rounded color="accent" />
    </div>

    <div v-if="!isLoading">
        <HighlightTwoColumn 
            :data="headDetails.headOfficeInfo"
            :label="t('clientFactory.drawer.headOfficeInfo')"
            :is-edit="false"
            :show-actions="false"
            :is-drop-down="true"
            theme="accent"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.headOfficeInfo" @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="headDetails.headOfficeInfo" theme="accent"/>

        <HighlightTwoColumn 
            :data="headDetails.clientInfo"
            :label="t('clientFactory.drawer.clientInfo')"
            :is-edit="false"
            :show-actions="false"
            :is-drop-down="true"
            theme="accent"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.clientInfo" @data-changed="e => getNewDataToUpdate(e, 'clientInfo')" :data="headDetails.clientInfo" theme="accent"/>

        <HighlightTwoColumn 
            :data="headDetails.contractInfo"
            :label="t('clientFactory.drawer.contractInfo')"
            :is-edit="false"
            :show-actions="false"
            :is-drop-down="true"
            theme="accent"/>

        <EditableColumnsCF v-if="isOpenEditDropDown.contractInfo" @data-changed="e => getNewDataToUpdate(e, 'contractInfo')" :data="headDetails.contractInfo" theme="accent"/>

    </div>
</template>

<style lang="scss" scoped>

</style>