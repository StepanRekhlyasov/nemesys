<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect, watch } from 'vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import TwoColumnLayout from 'src/components/TwoColumnLayout.vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useHeadDetails, updateClientHandler } from '../handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from '../types'
import Quasar, { useQuasar } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar()

const props = defineProps<{
    clientId: string
}>()

const {getHeadClientFactory} = useClientFactory()

const headDetails = ref<RenderHeadDetails>({} as RenderHeadDetails)
const headClientFactory = ref<ClientFactory>({} as ClientFactory)
const localClientId = ref(props.clientId)
const isLoading = ref(false)

const isOpedEditDropDown = ref({
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
        <q-separator v-if="!isLoading"/>
        <q-linear-progress v-if="isLoading" indeterminate rounded color="accent" />
    </div>

    <div v-if="!isLoading">
        <DropDownEditGroup
        :label="t('clientFactory.drawer.headOfficeInfo')"
        :isEdit="isOpedEditDropDown.headOfficeInfo"
        :isLabelSquare="true"
        theme="accent"
        @openEdit="isOpedEditDropDown.headOfficeInfo = true"
        @closeEdit="isOpedEditDropDown.headOfficeInfo = false"
        @onSave="isOpedEditDropDown.headOfficeInfo = false">
            <TwoColumnLayout :data="headDetails.headOfficeInfo" theme="accent"
                v-if="!isOpedEditDropDown.headOfficeInfo"/>

            <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="headDetails.headOfficeInfo" theme="accent"/>
        </DropDownEditGroup>

        <DropDownEditGroup
        :label="t('clientFactory.drawer.clientInfo')"
        :isEdit="isOpedEditDropDown.clientInfo"
        :isLabelSquare="true"
        theme="accent"
        @openEdit="isOpedEditDropDown.clientInfo = true"
        @closeEdit="isOpedEditDropDown.clientInfo = false"
        @onSave="isOpedEditDropDown.clientInfo = false; updateClientHandler(dataForUpdating.clientInfo, headClientFactory)">
            <TwoColumnLayout :data="headDetails.clientInfo" theme="accent"
                v-if="!isOpedEditDropDown.clientInfo"/>

            <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'clientInfo')" :data="headDetails.clientInfo" theme="accent"/>
        </DropDownEditGroup>

        <DropDownEditGroup
        :label="t('clientFactory.drawer.contractInfo')"
        :isEdit="isOpedEditDropDown.contractInfo"
        :isLabelSquare="true"
        theme="accent"
        @openEdit="isOpedEditDropDown.contractInfo = true"
        @closeEdit="isOpedEditDropDown.contractInfo = false"
        @onSave="isOpedEditDropDown.contractInfo = false">
            <TwoColumnLayout :data="headDetails.contractInfo" theme="accent"
                v-if="!isOpedEditDropDown.contractInfo"/>

            <EditableColumnsCF v-else @data-changed="e => getNewDataToUpdate(e, 'contractInfo')" :data="headDetails.contractInfo" theme="accent"/>
        </DropDownEditGroup>

    </div>
</template>

<style lang="scss" scoped>

</style>