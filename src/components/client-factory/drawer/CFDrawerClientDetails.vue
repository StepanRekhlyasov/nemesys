<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import EditableColumnsCF, { Data } from 'src/components/client-factory/EditableColumnsCF.vue';

import { useClientDetails } from 'src/components/client-factory/handlers';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from 'src/components/client-factory/types'
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory
}>()

const clientDetails = ref<RenderHeadDetails['clientInfo']>({} as RenderHeadDetails['clientInfo'])

const isOpenEditDropDown = ref({
    clientInfo: false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

watchEffect(() => {
    clientDetails.value = useClientDetails(props.clientFactory)
})
</script>

<template>
    <HighlightTwoColumn 
        :data="clientDetails"
        :label="t('clientFactory.drawer.clientInfo')"
        :is-edit="false"
        :show-actions="false"
        :is-drop-down="true"
        theme="accent"/>

    <EditableColumnsCF v-if="isOpenEditDropDown.clientInfo"
            @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="clientDetails"
            theme="accent" />

</template>

<style lang="scss" scoped>

</style>