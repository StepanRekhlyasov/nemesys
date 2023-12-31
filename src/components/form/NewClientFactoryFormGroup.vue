<script lang="ts" setup>
import { QForm } from 'quasar';
import { withDefaults, defineExpose, ref } from 'vue';
import ClientFactoryName from './clientFactoryForms/ClientFactoryName.vue';
import ParentClient from './clientFactoryForms/ParentClient.vue';
import AddressSection from './clientFactoryForms/AddressSection.vue';
import ClientFactoryInfo from './clientFactoryForms/ClientFactoryInfo.vue';
import ContractInfo from './clientFactoryForms/ContractInfo.vue';
import FacilityType from './clientFactoryForms/FacilityType.vue';
import ContactInfo from './clientFactoryForms/ContactInfo.vue';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { prefectureList } from 'src/shared/constants/Prefecture.const';

withDefaults(
    defineProps<{
        theme: string
    }>(), {
        theme: 'primary'
    }
)

const emit = defineEmits<{
    (e: 'submit', newClientFactoryData: Omit<ClientFactory, 'id'> | null)
}>()

const formRef = ref<QForm | null>(null);

const newClientFactory = ref<Omit<ClientFactory, 'id'>>({} as Omit<ClientFactory, 'id'>)
const clientFactoryName = ref('')
const parentClient = ref({
    parentClient: '',
    selectedIndustry: ''
})
const addressSection = ref({
    prefecture: prefectureList.value[0].value,
    municipality: '',
    street: '',
    building: ''
})
const clientFactoryInfo = ref({
    tel: '',
    fax: '',
    mail: '',
    isFaxNG: false,
    homepageUrl: '',
    numberEmployees: ''
})
const contractInfo = ref({
    isSignedDispatchContract: false,
    isSignedReferralContract: false,
})
const facilityTypes = ref<string[]>([])
const inChargeInfo = ref({
    nameContact: '',
    positionContact: '',
    mailContact: '',
    telContact: '',
})

const validateAndSubmit = async () => {
    const isValid = await formRef.value?.validate();

    if (isValid) {
        newClientFactory.value = {
            name: clientFactoryName.value,
            isHead: false,
            clientID: parentClient.value.parentClient,
            ...addressSection.value,
            ...clientFactoryInfo.value,
            ...inChargeInfo.value,
            ...contractInfo.value,
            facilityType: facilityTypes.value,
            clientFlag: parentClient.value ? true : false,
            basicInfoChangingFlag: false,
            distance: 0,
            industry: [parentClient.value.selectedIndustry],
            address: addressSection.value.prefecture + ' ' +  addressSection.value.municipality + ' ' + addressSection.value.street + ' ' + addressSection.value.building,
            officeDetails: {
                registeredInfo: {
                    tel: clientFactoryInfo.value.tel,
                    fax: clientFactoryInfo.value.fax,
                    street: addressSection.value.street,
                    building: addressSection.value.building,
                    parentClient: parentClient.value.parentClient
                }
            } as ClientFactory['officeDetails'],
            draft: {}
        } as Partial<ClientFactory>

        emit('submit', newClientFactory.value);
    }

    if (!isValid) {
        emit('submit', null)
    }
}

defineExpose({
    validateAndSubmit
});
</script>

<template>
        <q-card class="no-shadow full-height q-pb-sm">
            <q-form class="q-gutter-none" ref="formRef" greedy>
                <q-card-section class="q-pa-none q-pt-sm scroll">
                    <q-list>
                        <ClientFactoryName v-model="clientFactoryName" :theme="theme"/>
                        <ParentClient v-model="parentClient" :theme="theme" :isParentIndustry="true"/>
                        <AddressSection v-model="addressSection" :theme="theme"/>
                        <ClientFactoryInfo v-model="clientFactoryInfo" :theme="theme"/>
                        <ContractInfo v-model="contractInfo" :theme="theme"/>
                        <FacilityType v-model="facilityTypes" :clientName="parentClient.parentClient" :industryName="parentClient.selectedIndustry" :theme="theme"/>
                        <ContactInfo v-model="inChargeInfo" :theme="theme"/>

                    </q-list>
                </q-card-section>
            </q-form>
        </q-card>
</template>

<style lang="scss" scoped>

</style>
