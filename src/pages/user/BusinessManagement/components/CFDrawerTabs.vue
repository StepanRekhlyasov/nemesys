<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CFDrawerOfficeDetails from './CFDrawerOfficeDetails.vue';
import CFDrawerHeadDetails from './CFDrawerHeadDetails.vue';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTabs } from '../types';

const { t } = useI18n({ useScope: 'global' });
defineProps<{
    clientFactory: ClientFactory,
    draft: Partial<ClientFactory>,
    isLoading: boolean
}>()

const emit = defineEmits<{
    (e: 'editDraft', changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>)
}>()

const editDraft = (changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>) => {

    emit('editDraft', changedData)
}

const activeTab = ref(ClientFactoryTabs.TeleAppointmentHistory)
</script>

<template>
    <q-tabs
        dense
        inline-label
        v-model="activeTab"
        class="text-primary bg-primary-1 shadow-2"
        align="justify"
        active-bg-color="white">

        <q-tab 
            :name="ClientFactoryTabs.TeleAppointmentHistory"
            :label="t('client.tele.teleAppointHistory')"/>

        <q-tab 
            :name="ClientFactoryTabs.OfficeDetails"
            :label="t('clientFactory.officeDetails')"/>

        <q-tab 
            :name="ClientFactoryTabs.BOHistory"
            label="BO履歴"/>

        <q-tab 
            :name="ClientFactoryTabs.HeadOffice"
            :label="t('clientFactory.headOffice')"/>

        <q-tab 
            :name="ClientFactoryTabs.VariousAchievements"
            :label="t('client.list.variousAchievements')"/>

        <q-tab 
            :name="ClientFactoryTabs.Memo"
            :label="t('client.list.memo')"/>
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel :name="ClientFactoryTabs.TeleAppointmentHistory">
            <div></div>
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.OfficeDetails">
            <CFDrawerOfficeDetails
                @edit-draft="editDraft"
                :client-factory="clientFactory"
                :draft="draft"
                :is-loading="isLoading"/>
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.BOHistory">
            <div></div>
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.HeadOffice">
            <CFDrawerHeadDetails :client-id="clientFactory.clientID"/>
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.VariousAchievements">
            <div></div>
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.Memo">
            <div></div>
        </q-tab-panel>
    </q-tab-panels>
</template>

<style lang="scss" scoped>

</style>