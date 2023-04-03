<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryDetailTabs } from '../types'

const props = defineProps<{
    selectedItem: ClientFactory | null
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
        <q-tab :name="ClientFactoryDetailTabs.OfficeDetails" :label="t('clientFactory.officeDetails')"/>
        <q-tab :name="ClientFactoryDetailTabs.CompanyWideBOHistory" :label="t('clientFactory.companyWideBOHistory')"/>
        <q-tab :name="ClientFactoryDetailTabs.HeadOffice" :label="t('clientFactory.headOffice')"/>
        <q-tab :name="ClientFactoryDetailTabs.ReflectionHistory" :label="t('clientFactory.reflectionHistory')"/>
        <q-tab :name="ClientFactoryDetailTabs.ImportHistory" :label="t('clientFactory.importHistory')"/>
    </q-tabs>

    <q-tab-panel :name="ClientFactoryDetailTabs.OfficeDetails">

    </q-tab-panel>
    <q-tab-panel :name="ClientFactoryDetailTabs.CompanyWideBOHistory">

    </q-tab-panel>
    <q-tab-panel :name="ClientFactoryDetailTabs.HeadOffice">

    </q-tab-panel>
    <q-tab-panel :name="ClientFactoryDetailTabs.ReflectionHistory">

    </q-tab-panel>
    <q-tab-panel :name="ClientFactoryDetailTabs.ImportHistory">

    </q-tab-panel>
</template>

<style lang="scss" scoped>

</style>