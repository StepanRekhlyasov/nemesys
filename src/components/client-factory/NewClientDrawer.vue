<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { withDefaults, ref } from 'vue';
import NewClientFormGroup from 'src/components/form/NewClientFormGroup.vue';
import { useClient } from 'src/stores/client';
import { useClientFactory } from 'src/stores/clientFactory'
import { Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { useRoute } from 'vue-router';
import { useOrganization } from 'src/stores/organization';
const { t } = useI18n({ useScope: 'global' });

const { addNewClient } = useClient()
const { addClientFactory } = useClientFactory()
const organization = useOrganization()

const route = useRoute()
const isAdmin = route.meta.isAdmin
withDefaults(
    defineProps<{
        isDrawer: boolean
        theme?: string
    }>(), {
    theme: 'primary'
}
)

const childFormRef = ref<{
    validateAndSubmit: () => void
} | null>(null);

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

const submitForm = () => {
    if (childFormRef.value) {
        childFormRef.value.validateAndSubmit();
    }

};

const onSubmit = async (newClientData: Client | null) => {
    if (newClientData) {

        if (!isAdmin) {
            newClientData.organizationId = organization.currentOrganizationId
        } else {
            newClientData.organizationId = null
        }

        const clientRef = await addNewClient(newClientData)
        if (!clientRef) {
            return
        }

        await addClientFactory({
            ...newClientData,
            organizationId: isAdmin ? null : organization.currentOrganizationId,
            name: newClientData.headName,
            isHead: true,
            clientID: clientRef.id,
            distance: 0,
            homepageUrl: newClientData.homePage,
            existingOfficeFlag: newClientData.numberOffices ? true : false,
            isSignedDispatchContract: newClientData.conclusionDispatchContract,
            isSignedReferralContract: newClientData.conclusionReferralContract,
            clientFlag: true,
            basicInfoChangingFlag: false,
            address: newClientData.prefecture + ' ' + newClientData.municipality + ' ' + newClientData.street,
            nameContact: newClientData.headName,
            telContact: newClientData.tel,
            mailContact: newClientData.mail,
            numberEmployees: newClientData.numberEmployees,
            positionContact: '',
            contractInfo: {
                contractUnit: newClientData.contractUnit,
                industry: newClientData.industry,
                contractTel: newClientData.personInChargeTel,
                contractFax: newClientData.personInChargeFax,
                contractMail: newClientData.personInChargeMail,
                contractPerson: newClientData.personInCharge,
                conclusionContract: newClientData.conclusionContract,
            },
            officeDetails: {
                registeredInfo: {
                    tel: newClientData.tel,
                    fax: newClientData.fax,
                    latitude: 0,
                    longitude: 0,
                    street: newClientData.street,
                    building: '',
                    parentClient: newClientData.name
                }
            } as ClientFactory['officeDetails'],
            draft: {}
        } as ClientFactory)

        emit('hideDrawer')
    }
}
</script>

<template>
    <q-drawer :model-value="isDrawer" :width="900" :breakpoint="500" overlay elevated bordered side="right" show>
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
                <q-card-section :class="`text-white bg-${theme}`">
                    <div class="text-h6">
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        <q-btn :label="t('menu.clientReg')" :text-color="`${theme}`" color="white"
                            class="q-ml-lg text-weight-bold" @click="submitForm" />
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="bg-grey-1 q-pa-none">
                    <NewClientFormGroup :theme="theme" ref="childFormRef" @submit="onSubmit" />
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped></style>
