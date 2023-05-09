<script lang="ts" setup>
import { ref, defineProps, defineEmits, withDefaults, defineExpose } from 'vue';
import ClientName from './clientForms/ClientName.vue';
import OfficeHead from './clientForms/OfficeHead.vue';
import AddressSection from './clientForms/AddressSection.vue';
import ClientInformation from './clientForms/ClientInformation.vue';
import ClientType from './clientForms/ClientType.vue'
import FacilityType from './clientForms/FacilityType.vue'
import HeadOfficeInformation from './clientForms/HeadOfficeInformation.vue';
import ContractInfo from './clientForms/ContractInfo.vue';
import { Client } from 'src/shared/model';
import { QForm } from 'quasar';

withDefaults(
    defineProps<{
        theme: string
    }>(), {
        theme: 'primary'
    }
)

const emit = defineEmits<{
    (e: 'submit', newClientData: Client | null)
}>()

const formRef = ref<QForm | null>(null);

const newClient = ref<Client>({} as Client)
const clientName = ref('')
const headName = ref('')
const addressSection = ref<{[key: string]: string | number}>({
    prefecture: '',
    municipality: '',
    street: '',
    building: '',
    lon: 0,
    lat: 0
})
const clientInfo = ref<{ [key: string]: string | number}>({
    representativeName: '',
    established: '',
    capital: '',
    earnings: '',
    companyProfile: ''
})
const headInfoSection = ref<{ [key: string]: string | number | boolean }>({
    tel: '',
    fax: '',
    mailaddress: '',
    flg_faxng: false,
    homePage: '',
    numberEmployees: ''
})
const contractInfo = ref<{ [key: string]: string | number | boolean }>({
    conclusionDispatchContract: false,
    conclusionReferralContract: false,
    contractUnit: '',
    conclusionContract: false,
    personInChargeTel: '',
    personInchargeFax: '',
    personInchargeMail: '',
    personIncharge: ''
})
const clientTypes = ref('nurse')
const facilityTypes = ref<string[]>([])

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateAndSubmit = async () => {
    const isValid = await formRef.value?.validate();

    if (isValid) {
        newClient.value = {
            name: clientName.value,
            headName: headName.value,
            ...addressSection.value,
            ...clientInfo.value,
            ...headInfoSection.value,
            ...contractInfo.value,
            nursing: clientTypes.value,
            facilityType: facilityTypes.value
        } as Client

        emit('submit', newClient.value);
    }

    if (!isValid) {
        emit('submit', null)
    }
};

defineExpose({
    validateAndSubmit
});
</script>

<template>
    <q-card class="no-shadow full-height q-pb-sm">
        <q-form class="q-gutter-none" ref="formRef">
            <q-card-section class="q-pa-none q-pt-sm scroll">
                <q-list>
                    <ClientName v-model="clientName"/>
                    <OfficeHead v-model="headName"/>
                    <AddressSection v-model="addressSection"/>
                    <ClientInformation v-model="clientInfo"/>
                    <ClientType v-model="clientTypes" :theme="theme"/>
                    <FacilityType v-model="facilityTypes" :theme="theme"/>
                    <HeadOfficeInformation v-model="headInfoSection" :theme="theme"/>
                    <ContractInfo v-model="contractInfo" :theme="theme"/>
                </q-list>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<style lang="scss" scoped>

</style>