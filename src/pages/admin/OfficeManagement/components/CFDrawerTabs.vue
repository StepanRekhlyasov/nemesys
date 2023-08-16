<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CFDrawerOfficeDetails from './CFDrawerOfficeDetails.vue';
import CFDrawerHeadDetails from './CFDrawerHeadDetails.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTabs } from 'src/components/client-factory/types';
import { ChangedData } from 'src/components/client-factory/types';


import CFDrawerClientDetails from './CFDrawerClientDetails.vue';
import CFDrawerImportDetails from './CFDrawerImportDetails.vue';
import CFDrawerReflectDetail from './CFDrawerReflectDetail.vue';


const { t } = useI18n({ useScope: 'global' });
defineProps<{
    clientFactory: ClientFactory
    draft: Partial<ClientFactory>
    isLoading: boolean
    industryType?: string
}>()

const emit = defineEmits<{
    (e: 'editDraft', changedData: ChangedData)
}>()

const editDraftHandle = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}

const activeTab = ref(ClientFactoryTabs.OfficeDetails)
</script>

<template>
    <q-tabs
        dense
        inline-label
        v-model="activeTab"
        class="text-accent bg-purple-1 shadow-2"
        align="justify"
        active-bg-color="white">
        <q-tab
            :name="ClientFactoryTabs.OfficeDetails"
            :label="t('clientFactory.officeDetails')"/>
        <q-tab
            :name="ClientFactoryTabs.CompanyWideBOHistory"
            :label="t('clientFactory.companyWideBOHistory')"/>
        <q-tab
            :name="clientFactory.isHead ? ClientFactoryTabs.Client : ClientFactoryTabs.HeadOffice"
            :label="t(`${clientFactory.isHead ? 'clientFactory.drawer.client' : 'clientFactory.headOffice'}`)"/>
        <q-tab
            :name="ClientFactoryTabs.ReflectionHistory"
            :label="t('clientFactory.reflectionHistory')"/>
        <q-tab
            :name="ClientFactoryTabs.ImportHistory"
            :label="t('clientFactory.importHistory')"/>
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel :name="ClientFactoryTabs.OfficeDetails">
            <CFDrawerOfficeDetails
                :clientFactory="clientFactory"
                :draft="draft"
                :is-loading="isLoading"
                :industryType="industryType"
                @edit-draft="editDraftHandle"/>
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryTabs.CompanyWideBOHistory">
       
        </q-tab-panel>
        <q-tab-panel :name="clientFactory.isHead ? ClientFactoryTabs.Client : ClientFactoryTabs.HeadOffice">
            <CFDrawerClientDetails v-if="clientFactory.isHead" :clientFactory="clientFactory"/>
            <CFDrawerHeadDetails v-else :clientId="clientFactory.clientID" :clientFactory="clientFactory"/>
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryTabs.ReflectionHistory">
            <CFDrawerReflectDetail :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id" />
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryTabs.ImportHistory" class="q-pa-xs">
            <CFDrawerImportDetails :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id"  />
        </q-tab-panel>
    </q-tab-panels>
</template>

<style lang="scss" scoped>

</style>