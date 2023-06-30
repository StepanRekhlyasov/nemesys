<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CFDrawerOfficeDetails from './CFDrawerOfficeDetails.vue';
import CFDrawerHeadDetailsVue from './CFDrawerHeadDetails.vue';
import CFDrawerClientDetails from './CFDrawerClientDetails.vue';
import CFDrawerImportDetails from './CFDrawerImportDetails.vue';
import CFDrawerReflectDetail from './CFDrawerReflectDetail.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryDetailTabs } from '../types'
import { ChangedData } from 'src/components/client-factory/types';

defineProps<{
    clientFactory: ClientFactory
    draft: Partial<ClientFactory>
    isLoading: boolean
    industryType: string
}>()

const emit = defineEmits<{
    (e: 'editDraft', changedData: ChangedData)
}>()
const { t } = useI18n({ useScope: 'global' });

const editDraftHandle = (changedData: ChangedData) => {
    emit('editDraft', changedData)
}

const activeTab = ref(ClientFactoryDetailTabs.OfficeDetails)

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
            :name="ClientFactoryDetailTabs.OfficeDetails"
            :label="t('clientFactory.officeDetails')"/>
        <q-tab
            :name="ClientFactoryDetailTabs.CompanyWideBOHistory"
            :label="t('clientFactory.companyWideBOHistory')"/>
        <q-tab
            :name="clientFactory.isHead ? ClientFactoryDetailTabs.Client : ClientFactoryDetailTabs.HeadOffice"
            :label="t(`${clientFactory.isHead ? 'clientFactory.drawer.client' : 'clientFactory.headOffice'}`)"/>
        <q-tab
            :name="ClientFactoryDetailTabs.ReflectionHistory"
            :label="t('clientFactory.reflectionHistory')"/>
        <q-tab
            :name="ClientFactoryDetailTabs.ImportHistory"
            :label="t('clientFactory.importHistory')"/>
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel :name="ClientFactoryDetailTabs.OfficeDetails">
            <CFDrawerOfficeDetails
                :clientFactory="clientFactory"
                :draft="draft"
                :is-loading="isLoading"
                :industryType="industryType"
                @edit-draft="editDraftHandle"/>
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryDetailTabs.CompanyWideBOHistory">
       
        </q-tab-panel>
        <q-tab-panel :name="clientFactory.isHead ? ClientFactoryDetailTabs.Client : ClientFactoryDetailTabs.HeadOffice">
            <CFDrawerClientDetails v-if="clientFactory.isHead" :clientFactory="clientFactory"/>
            <CFDrawerHeadDetailsVue v-else :clientId="clientFactory.clientID"/>
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryDetailTabs.ReflectionHistory">
            <CFDrawerReflectDetail :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id" />
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryDetailTabs.ImportHistory" class="q-pa-xs">
            <CFDrawerImportDetails :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id"  />
        </q-tab-panel>
    </q-tab-panels>
</template>

<style lang="scss" scoped>

</style>