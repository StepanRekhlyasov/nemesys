<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import EditableColumnsCF, {Data} from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';
import { useHighlightMainInfo } from 'src/components/client-factory/handlers';

import { ReflectLog } from 'src/shared/model/ReflectLog';
import { RenderMainInfo } from 'src/components/client-factory/types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ChangedData } from 'src/components/client-factory/types';
import { ImportLog } from 'src/shared/model/ImportLog';

import CFDrawerBodyFooterAdmin from './CFDrawerBodyFooterAdmin.vue';
import CFDrawerBodyFooterUser from './CFDrawerBodyFooterUser.vue';
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: 'global' });
const route = useRoute()
const theme = route.meta.isAdmin ? 'accent' : 'primary'

const props = defineProps<{
    clientFactory: ClientFactory,
    draft: Partial<ClientFactory>,
    isLoading: boolean,
    isReflecting?: boolean,
    isImporting?: boolean,
    newReflectLog?: ReflectLog,
    newImportLog?: ImportLog,
    selectedIndustry?: { value: string, isSelected: boolean }
}>();
const emit = defineEmits<{
    (e: 'handleImport'),
    (e: 'handleReflect'),
    (e: 'editDraft', changedData: ChangedData)
    (e: 'openFaxDrawer')
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

const openFaxDrawer = () =>{
    emit('openFaxDrawer')
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory, props.draft)
})
</script>

<template>
    <div class="wrapper">
        <div style="height: 5px;" class="q-my-none q-pa-none">
            <q-linear-progress v-if="isLoading" indeterminate rounded :color="theme" />
        </div>
        <div v-if="!route.meta.isAdmin && Object.keys(draft).length && !isEditForm.contactInfo && !isEditForm.officeInfo" class="q-mb-md">
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
            :is-disable-edit="isLoading"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            :selectedIndustry="selectedIndustry"
            :theme="theme"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"
            @on-save="isEditForm.officeInfo = false; handleEditDraft(dataForUpdating.officeInfo as RenderMainInfo['officeInfo'])">
        
                <template #tag v-if="clientFactory.isHead">
                    <div :class="theme==='accent'?'bg-accent':'bg-primary'" class="bg-accent text-white q-ml-sm rounded-borders">
                        <span class="q-pa-sm">
                            {{ t('clientFactory.headOffice') }}
                        </span>
                    </div>
                </template>
        </HighlightTwoColumn>
        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            :theme="theme"
            :selectedIndustry="selectedIndustry"
          />
        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :is-disable-edit="isLoading"
            :label="t('client.add.contactInfo')"
            :selectedIndustry="selectedIndustry"
            :theme="theme"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; handleEditDraft(dataForUpdating.contactInfo as RenderMainInfo['contactInfo'])"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            :theme="theme"
            :selectedIndustry="selectedIndustry"
        />

    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

  <CFDrawerBodyFooterAdmin
    v-if="route.meta.isAdmin"
    @handle-reflect="handleReflect"
    @handle-import="handleImport"
    :client-factory="clientFactory"
    :draft="draft"
    :is-reflect-loading="isReflecting"
    :is-import-loading="isImporting"
    :new-reflect-log="newReflectLog"
    :new-import-log="newImportLog"
  />
  <CFDrawerBodyFooterUser
    v-else
      @open-fax-drawer="openFaxDrawer"
      :clientFactory="clientFactory"
    />
</template>

<style lang="scss" scoped>
.wrapper {
    padding: 1% 5%;
}
</style>