<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import CFDrawerBodyFooter from './CFDrawerBodyFooter.vue';
import { useHighlightMainInfo } from 'src/components/client-factory/handlers';

import { ReflectLog } from 'src/shared/model/ReflectLog';
import { RenderMainInfo } from 'src/components/client-factory/types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ChangedData } from 'src/components/client-factory/types';
import { ImportLog } from 'src/shared/model/ImportLog';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory,
    draft: Partial<ClientFactory>,
    isLoading: boolean,
    isReflecting: boolean,
    isImporting: boolean,
    newReflectLog: ReflectLog | undefined,
    newImportLog: ImportLog | undefined,
    selectedIndustry?: { value: string, isSelected: boolean }
}>();
const emit = defineEmits<{
    (e: 'handleImport'),
    (e: 'handleReflect'),
    (e: 'editDraft', changedData: ChangedData)
}>()

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
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

const handleReflect = () => {
    emit('handleReflect')
}

const handleEditDraft = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory, props.draft)
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
            @on-save="isEditForm.officeInfo = false; handleEditDraft(dataForUpdating.officeInfo as RenderMainInfo['officeInfo'])">
        
                <template #tag v-if="clientFactory.isHead">
                    <div class="bg-accent text-white q-ml-sm rounded-borders">
                        <span class="q-pa-sm">
                            {{ t('clientFactory.headOffice') }}
                        </span>
                    </div>
                </template>
        </HighlightTwoColumn>
        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="accent"
            :selectedIndustry="selectedIndustry"
          />

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :is-disable-edit="isLoading"
            :label="t('client.add.contactInfo')"
            theme="accent"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; handleEditDraft(dataForUpdating.contactInfo as RenderMainInfo['contactInfo'])"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="accent"
            :selectedIndustry="selectedIndustry"
        />

    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

   <CFDrawerBodyFooter
    @handle-reflect="handleReflect"
    @handle-import="handleImport"
    :client-factory="clientFactory"
    :draft="draft"
    :is-reflect-loading="isReflecting"
    :is-import-loading="isImporting"
    :new-reflect-log="newReflectLog"
    :new-import-log="newImportLog"/>
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 1% 5%;
}
</style>