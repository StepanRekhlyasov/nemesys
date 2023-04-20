<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CFDrawerOfficeDetails from './CFDrawerOfficeDetails.vue';
import CFDrawerHeadDetailsVue from './CFDrawerHeadDetails.vue';
import CFDrawerImportDetails from './CFDrawerImportDetails.vue';
import CFDrawerReflectDetail from './CFDrawerReflectDetail.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryDetailTabs } from '../../types'

defineProps<{
    clientFactory: ClientFactory
}>()
const { t } = useI18n({ useScope: 'global' });

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
            :name="clientFactory.isHead ? ClientFactoryDetailTabs.HeadOffice : ClientFactoryDetailTabs.Client"
            :label="t(`${clientFactory.isHead ? 'clientFactory.headOffice' : 'clientFactory.drawer.client'}`)"/>
        <q-tab
            :name="ClientFactoryDetailTabs.ReflectionHistory"
            :label="t('clientFactory.reflectionHistory')"/>
        <q-tab
            :name="ClientFactoryDetailTabs.ImportHistory"
            :label="t('clientFactory.importHistory')"/>
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel :name="ClientFactoryDetailTabs.OfficeDetails">
            <CFDrawerOfficeDetails :clientFactory="clientFactory"/>
        </q-tab-panel>
        <q-tab-panel :name="ClientFactoryDetailTabs.CompanyWideBOHistory">
       
        </q-tab-panel>
        <q-tab-panel :name="clientFactory.isHead ? ClientFactoryDetailTabs.HeadOffice : ClientFactoryDetailTabs.Client">
            <CFDrawerHeadDetailsVue v-if="clientFactory.isHead" :clientFactory="clientFactory"/>
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