<template>
  <q-card class="no-shadow bg-grey-3">
    <q-form ref="boForm" @submit="addBackOrder" @reset="closeDialog" greedy>
      <q-card-section class="text-white bg-primary no-border-radius">
        <div class="row">
          <div class="flex items-end ">
            <q-btn dense flat icon="close" class="q-mr-md" type="reset" @click="closeDialog" />
          </div>
          <div>
            <div v-if="!clientFactory" class="row text-h6 text-weight-bold q-pr-xs">
              {{ `${$t('backOrder.clientName')} / ${$t('backOrder.officeName')} / ${$t(`backOrder.type.${type}`)}` }}
            </div>
            <div v-else class="row text-h6 text-weight-bold q-pr-xs">
              {{ `${data['client_id'] ? applicantStore.state.clientList.find(client => client.id === data['client_id'])?.name : undefined} / ${clientFactory.name} / ${$t(`backOrder.type.${type}`)}` }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="bg-white">
        <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold q-mr-md" size="sm"
          type="submit" />
        <q-btn :label="$t('common.cancel')" outline color="primary" class="text-weight-bold" type="reset" size="sm"
          @click="closeDialog" />
      </q-card-section>

      <q-separator color="grey-3" size="2px" />
      <q-card-section class="bg-white">
        <!-- Main Information -->
        <q-card-section>
          <q-select v-model="data.client_id" @update:model-value="data['office_id'] = undefined" :loading="loading"
            :options="applicantStore.state.clientList" option-value="id" option-label="name" :rules="[creationRule]"
            hide-bottom-space emit-value map-options :label="$t('applicant.list.fixEmployment.client')" />
          <q-select v-model="data['office_id']" :loading="loading" emit-value map-options option-value="id"
            option-label="name" :rules="[creationRule]" hide-bottom-space :options="clientFactoryList"
            :disable="!data['client_id']" :label="$t('applicant.list.fixEmployment.office')" />
          <q-select v-model="data.industry" :loading="loading" option-value="id"
            option-label="name" :rules="[creationRule]" hide-bottom-space :options="industryList"
            :disable="!data['office_id']" :label="$t('clientFactory.drawer.details.industry')" />
        </q-card-section>

        <!-- Basic Info Section -->
        <basic-info-section :backOrder="data" :loading="loading"
          :client="data['client_id'] ? applicantStore.state.clientList.find(client => client.id === data['client_id']) : undefined"
          :officeID="data['office_id']" :offices="clientFactoryList" />

        <!-- Working Type Section -->
        <q-card-section>
          <div class="row text-primary text-h6">
            {{ '■ ' + $t('backOrder.create.workingType') }}
          </div>
          <div class="row">
            <labelField :label="$t('backOrder.create.typeOfEmployment')" :edit="false" required
              labelClass="q-pl-md col-2 self-center text-right text-no-wrap	" valueClass="col-4 q-pl-md "
              :value="$t(`backOrder.type.${type}`)"/>
          </div>
          <div class="row">
            <labelField :label="$t('backOrder.status')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"
              valueClass="self-center col-4 q-pl-md" :value="data['status'] ? $t(`backOrder.${data['status']}`) : ''">
              <q-radio v-for="key in BackOrderStatus" v-model="data['status']" :label="$t('backOrder.' + key)"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :val="key" :key="key"
                :disable="loading" class="q-pr-md" />
            </labelField>
          </div>
          <div class="row q-pt-sm items-center">
            <labelField :label="$t('backOrder.create.customerRepresentative')" :edit="true"
              labelClass="q-pl-md col-2 text-right" :value="data['customerRepresentative']" valueClass="col-4 q-pl-md ">
              <q-input v-model="data['customerRepresentative']" type="textarea" autogrow dense outlined/>
            </labelField>
          </div>
          <div class="row">
            <labelField :label="$t('client.backOrder.transactionType')" :edit="true" labelClass="q-pl-md col-2 text-right self-center"
              valueClass="self-center col-4 q-pl-md">
              <q-radio v-for="item in transactionTypeOptions" v-model="data.transactionType" :label="item.label"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :val="item.value" :key="item.value"
                :disable="loading" class="q-pr-md" />
            </labelField>
          </div>
        </q-card-section>

        <!-- BO Generation Route Section -->
        <q-card-section>
          <div class="row text-primary text-h6 items-center">
            {{ '■ ' + $t('backOrder.create.BOGenerationRoute') }}
          </div>
          <div class="row ">
            <labelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="true" required
              labelClass="q-pl-md col-2 self-center text-right" valueClass="col-4 q-pl-md">
              <q-field v-model="data['BOGenerationRoute']" :rules="[creationRule]" hide-bottom-space borderless>
                <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall"
                  :disable="loading" />
                <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax"
                  :disable="loading" />
              </q-field>
            </labelField>
          </div>
        </q-card-section>

        <!-- Introduction Section -->
        <introduction-section :backOrder="data" :loading="loading" :type="type" :usersListOption="usersListOption" />

        <!-- Employment Conditions Section -->
        <employment-conditions-section :backOrder="data" :loading="loading" :type="type" />

        <!-- Paycheck Section -->
        <template v-if="type == 'referral'">
          <paycheck-section :backOrder="data" :loading="loading" />
        </template>

        <!-- Tasks Section -->
        <tasks-section :backOrder="data" :loading="loading" :type="type" />

        <!-- In House Information Section -->
        <template v-if="type == 'referral'">
          <in-house-info-section :backOrder="data" :loading="loading" />
        </template>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { BackOrderModel, BackOrderStatus, selectOptions, TypeQualifications, UserPermissionNames } from 'src/shared/model';
import { computed, onMounted, Ref, ref, watch } from 'vue';
import employmentConditionsSection from './employmentConditionsSection.vue';
import PaycheckSection from './PaycheckSection.vue';
import TasksSection from './TasksSection.vue';
import InHouseInfoSection from './InHouseInfoSection.vue';
import IntroductionSection from './IntroductionSection.vue';
import BasicInfoSection from './BasicInfoSection.vue';
import labelField from 'src/components/form/LabelField.vue';
import { useBackOrder } from 'src/stores/backOrder';
import { creationRule } from 'src/components/handlers/rules';
import { useApplicant } from 'src/stores/applicant';
import { useOrganization } from 'src/stores/organization';
import { useUserStore } from 'src/stores/user';
import { QForm } from 'quasar';
import { useClientFactory } from 'src/stores/clientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { date } from 'quasar'
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const emits = defineEmits(['closeDialog']);
const props = defineProps<{
  type: 'dispatch' | 'referral',
  clientId?: string,
  officeId?: string,
  originalOfficeId?: string,
}>()
const backOrderStore = useBackOrder();
const applicantStore = useApplicant();
const organization = useOrganization();
const clientFactoryStore = useClientFactory();
const userStore = useUserStore();
const clientFactory = ref<ClientFactory>();
const industryList = ref()

const usersListOption = ref<selectOptions[]>([]);
const clientFactoryList = ref<ClientFactory[]>([])
const boForm: Ref<QForm | null> = ref(null);
const loading = ref(false);
const data = ref<Partial<BackOrderModel>>({});

const transactionTypeOptions = computed(()=>{
  if(props.type === 'dispatch') {
    return [
      {label: 'TTP', value: 'TTP'},
      {label: t('client.backOrder.dispatchEm'), value: 'generalDispatch'},
    ]
  }
  return [
    {label: 'TTP', value: 'TTP'},
    {label: t('client.backOrder.introduction'), value: 'introduction'},
  ]
})

async function addBackOrder() {
  loading.value = true
  data.value['clientName'] = applicantStore.state.clientList.find(client => client.id === data.value['client_id'])?.name
  data.value['officeName'] = clientFactoryList.value.find(office => office.id === data.value['office_id'])?.name
  if (data.value.client_id && boForm.value?.validate) {
    await backOrderStore.addBackOrder({ ...data.value, type: props.type });
    loading.value = false;
    await backOrderStore.loadBackOrder({});
    closeDialog();
  }
}

function closeDialog() {
  emits('closeDialog');
  boForm.value?.resetValidation()
  resetData();
}

const getClientFactoryData = async(client_id: string | undefined) => {
  clientFactoryList.value = await clientFactoryStore.getClientFactoryList(client_id as string)
  const targetIndex = clientFactoryList.value.findIndex((item) => item.id === props.originalOfficeId);
  clientFactory.value = clientFactoryList.value[targetIndex]
    if(props.officeId != props.originalOfficeId){
    if (targetIndex !== -1) {
      const updatedDocument = await clientFactoryStore.getModifiedCF( organization.currentOrganizationId, clientFactoryList.value[targetIndex])
      clientFactory.value = updatedDocument
      if(updatedDocument){
        clientFactoryList.value[targetIndex] = updatedDocument
      }
    }
    }
}

const updateOfficeName = async ()=>{
  const targetIndex = clientFactoryList.value.findIndex((item) => item.id === data.value.office_id);
  if(targetIndex!=-1){
    clientFactory.value = clientFactoryList.value[targetIndex]
    const updatedDocument = await clientFactoryStore.getModifiedCF( organization.currentOrganizationId, clientFactoryList.value[targetIndex])
    if(updatedDocument){
      clientFactory.value = updatedDocument
    }
    if(clientFactory.value.clientID && !clientFactory.value.client){
      clientFactory.value.client = applicantStore.state.clientList.find(client => client.id === data.value.client_id)
    }
  }

}

async function resetData() {
  data.value = {
    workingDays: [] as string[],
    employmentType: [] as string[],
    qualifications: [] as TypeQualifications[],
    dateOfRegistration: date.formatDate(Date.now(), 'YYYY/MM/DD'),
    lon: 0,
    lat: 0,
    type: props.type
  } as Partial<BackOrderModel>
  if(props.clientId){
    data.value['client_id'] = props.clientId
  }
  if(props.officeId){
  data.value['office_id'] = props.officeId
  }
}
resetData();

onMounted(async () => {
  if(props.clientId){
    data.value['client_id'] = props.clientId
  }
  if(props.officeId){
  data.value['office_id'] = props.officeId
  }
  await applicantStore.getClients()
})

watch(() => data.value.client_id, async () => {
  if (data.value.client_id) {
    loading.value = true
    await getClientFactoryData(data.value.client_id)
    loading.value = false
  }
}, { deep: true, immediate: true })

watch(() => data.value.office_id, async () => {
  data.value.industry = undefined
  if (data.value.office_id) {
    loading.value = true
    await updateOfficeName()
    loading.value = false
  }
  const office = clientFactoryList.value.find(office => office.id === data.value['office_id'])
  industryList.value = office?.industry
  if(!office?.isHead){
    data.value.industry = office?.industry?.[0]
  }
}, { deep: true, immediate: true })

watch(() => [data.value.client_id, data.value.office_id], async () => {
  const users = await userStore.getUsersByPermission(UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);
  if (!users) {
    return
  }

  usersListOption.value = users.map((user) => {
    return {
      label: user.displayName,
      value: user.id
    }
  });
}, { deep: true, immediate: true })

</script>

