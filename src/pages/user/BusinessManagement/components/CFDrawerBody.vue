<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, watchEffect } from 'vue';
import EditableColumnsCF, { Data } from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import CFDrawerBodyFooter from './CFDrawerBodyFooter.vue';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ChangedData, RenderMainInfo } from 'src/components/client-factory/types';
import { useHighlightMainInfo } from 'src/components/client-factory/handlers';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    clientFactory: ClientFactory,
    draft: Partial<ClientFactory>,
    isLoading: boolean
}>();

const emit = defineEmits<{
    (e: 'cancelDraft'),
    (e: 'saveDraft'),
    (e: 'editDraft', changedData: ChangedData)
    (e: 'openFaxDrawer')
}>()

const cancelHandler = () => {
    emit('cancelDraft')
}

const saveHandler = () => {
    emit('saveDraft')
}

const editDraft = (changedData: ChangedData) => {

    emit('editDraft', changedData)
}
const openFaxDrawer = () =>{
    emit('openFaxDrawer')
}
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
    mainInfo.value = useHighlightMainInfo(props.clientFactory, props.draft)
})
</script>

<template>
    <div class="wrapper">
        <div style="height: 5px;" class="q-my-none q-pa-none">
            <q-linear-progress v-if="isLoading" indeterminate rounded color="primary" />
        </div>

        <div v-if="Object.keys(draft).length && !isEditForm.contactInfo && !isEditForm.officeInfo" class="q-mb-md">
            <div class="row">
                <q-btn @click="saveHandler" size="sm" color="primary" class="no-shadow q-mr-md" :disable="isLoading">
                    {{ t('common.save') }}
                </q-btn>
                <q-btn @click="cancelHandler" size="sm" outline :disable="isLoading">
                    {{ t('common.cancel') }}
                </q-btn>
            </div>

            <q-separator color="bg-grey-3 q-mt-md"></q-separator>
        </div>

        <HighlightTwoColumn 
            :data="mainInfo.officeInfo"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            theme="primary"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"
            @on-save="isEditForm.officeInfo = false; editDraft(dataForUpdating.officeInfo)">

            <template #tag v-if="clientFactory.isHead">
                <div class="bg-primary text-white q-ml-sm rounded-borders">
                    <span class="q-pa-sm">
                        {{ t('clientFactory.headOffice') }}
                    </span>
                </div>
            </template>
        </HighlightTwoColumn>

        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="primary"/>

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :label="t('client.add.contactInfo')"
            theme="primary"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; editDraft(dataForUpdating.contactInfo)"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="primary"/>
    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

    <CFDrawerBodyFooter 
      @open-fax-drawer="openFaxDrawer"
    />
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 1% 5%;
}
</style>