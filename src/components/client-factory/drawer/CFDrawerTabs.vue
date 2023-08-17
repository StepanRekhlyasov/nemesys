<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTabs } from 'src/components/client-factory/types';


import CFDrawerOfficeDetails from './CFDrawerOfficeDetails.vue';
import CFDrawerHeadDetails from './CFDrawerHeadDetails.vue';
import CFDrawerVariousAchievement from './CFDrawerVariousAchievement.vue';
import CFDrawerMemo from './CFDrawerMemo.vue'
import CFDrawerTeleAppointment from './CFDrawerTeleAppointment.vue';
import CFDrawerBackOrder from './CFDrawerBackOrder.vue';


import CFDrawerImportDetails from './CFDrawerImportDetails.vue';
import CFDrawerReflectDetail from './CFDrawerReflectDetail.vue';
import { useRoute } from 'vue-router';


const { t } = useI18n({ useScope: 'global' });
const route = useRoute()
const theme = route.meta.isAdmin ? 'accent' : 'primary'
defineProps<{
  clientFactory: ClientFactory
  draft: Partial<ClientFactory>
  isLoading: boolean
  industryType?: string
  originalOfficeId: string
}>()

const emit = defineEmits<{
  (e: 'editDraft', changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>)
}>()

const editDraftHandle = (changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>) => {
  emit('editDraft', changedData)
}

const activeTab = ref(route.meta.isAdmin ? ClientFactoryTabs.OfficeDetails : ClientFactoryTabs.TeleAppointmentHistory)
</script>

<template>
  <q-tabs 
    dense 
    inline-label 
    v-model="activeTab" 
    class="shadow-2" 
    :class="theme==='accent'?'text-accent bg-purple-1':'text-primary bg-primary-1'"
    align="justify"
    active-bg-color="white"
  >

    <q-tab
      v-if="!route.meta.isAdmin"
      :name="ClientFactoryTabs.TeleAppointmentHistory" 
      :label="t('client.tele.teleAppointHistory')" 
    />

    <q-tab 
    :name="ClientFactoryTabs.OfficeDetails" 
    :label="t('clientFactory.officeDetails')" 
    />

    <q-tab 
      v-if="!route.meta.isAdmin"
      :name="ClientFactoryTabs.BOHistory" 
      label="BO履歴" 
    />

    <q-tab
      v-if="route.meta.isAdmin"
      :name="ClientFactoryTabs.CompanyWideBOHistory"
      :label="t('clientFactory.companyWideBOHistory')"/>

    <q-tab 
    :name="ClientFactoryTabs.HeadOffice" 
    :label="t('clientFactory.headOffice')" 
    />

    <q-tab
      v-if="route.meta.isAdmin"
      :name="ClientFactoryTabs.ReflectionHistory"
      :label="t('clientFactory.reflectionHistory')"
    />
    <q-tab 
      v-if="!route.meta.isAdmin"
      :name="ClientFactoryTabs.VariousAchievements" 
      :label="t('client.list.variousAchievements')" 
    />

    <q-tab 
      v-if="!route.meta.isAdmin"
      :name="ClientFactoryTabs.Memo" 
      :label="t('client.list.memo')" 
    />
    <q-tab
      v-if="route.meta.isAdmin"
      :name="ClientFactoryTabs.ImportHistory"
      :label="t('clientFactory.importHistory')"
    />
  </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel 
          :name="ClientFactoryTabs.TeleAppointmentHistory" 
          v-if="!route.meta.isAdmin"
        >
          <CFDrawerTeleAppointment
              :client-id="clientFactory.clientID" :client-factory-id="clientFactory.id"
          />
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.OfficeDetails">
          <CFDrawerOfficeDetails 
            @edit-draft="editDraftHandle" 
            :client-factory="clientFactory" 
            :industryType="industryType"
            :draft="draft" 
            :is-loading="isLoading" 
          />
        </q-tab-panel>

        <q-tab-panel 
          v-if="!route.meta.isAdmin"
          :name="ClientFactoryTabs.CompanyWideBOHistory"
        >
        </q-tab-panel>
        <q-tab-panel 
          :name="ClientFactoryTabs.BOHistory"
          v-if="!route.meta.isAdmin"
        >
          <CFDrawerBackOrder 
            :officeId="clientFactory.id" 
            :clientId="clientFactory.clientID" 
            :originalOfficeId="originalOfficeId"
          />
        </q-tab-panel>

        <q-tab-panel :name="ClientFactoryTabs.HeadOffice">
          <CFDrawerHeadDetails 
            :client-id="clientFactory.clientID" 
            :client-factory="clientFactory" 
            :originalOfficeId="originalOfficeId"
            @edit-draft="editDraftHandle"
          />
        </q-tab-panel>

        <q-tab-panel 
          :name="ClientFactoryTabs.VariousAchievements"
          v-if="!route.meta.isAdmin"
        >
          <CFDrawerVariousAchievement />
        </q-tab-panel>

        <q-tab-panel 
          :name="ClientFactoryTabs.Memo"
          v-if="!route.meta.isAdmin"
        >
          <CFDrawerMemo :is-loading="isLoading" :client-id="clientFactory.clientID" :client-factory-id="clientFactory.id" />
        </q-tab-panel>

        <q-tab-panel 
          :name="ClientFactoryTabs.ReflectionHistory"
          v-if="route.meta.isAdmin"
        >
            <CFDrawerReflectDetail :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id" />
        </q-tab-panel>
        <q-tab-panel 
          :name="ClientFactoryTabs.ImportHistory" 
          class="q-pa-xs"
          v-if="route.meta.isAdmin"
        >
            <CFDrawerImportDetails 
              :clientId="clientFactory.clientID" :clientFactoryId="clientFactory.id"  
            />
        </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped></style>
