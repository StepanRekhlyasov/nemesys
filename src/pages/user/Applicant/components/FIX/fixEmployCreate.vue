<template>
  <q-scroll-area class="fit text-left">
    <q-card class="no-shadow">
      <q-card-section class="text-white bg-primary " >
        <div class="row">
          <div class="col-1 flex flex-end items-end">
            <q-btn dense flat icon="close" @click="$emit('close')" class="q-mr-md"/>
          </div>
          <div class="col-11 ">
            <span class="row">{{ fixData?.id ? applicantStore.state.clientList.find(client => client.id === fixData?.client)?.name || '': $t('client.add.clientName') }}</span>
            <div class="row">
              <span class="text-h6 q-pr-md" v-if="!fixData?.id">{{ $t('backOrder.officeName') }}</span>
              <span class="text-h6 q-pr-md" v-if="!!name && fixData?.id"> {{ name }}</span>
              <q-btn v-if="!fixData?.id" :label="$t('applicant.list.fixEmployment.save')" color="white" text-color="primary" @click="saveDoc" size="sm" :disable="loading"/>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-form @submit="save('main', data)" ref="formRef">
        <!-- Main Information -->
        <q-card-section>       
          <div class="row" v-if="fixData?.id">            
            <div class="col-12 text-right" >
              <q-btn
                :label="$t('common.save')" color="primary" type="submit" size="sm" :disable="loading"/>
            </div>
          </div>
          <q-select
              v-model="data.client"
              @update:model-value="data['office']=undefined"
              :loading="loading"
              :options="applicantStore.state.clientList"
              option-value="id"
              option-label="name"
              :rules="[creationRule]" 
              hide-bottom-space
              emit-value 
              map-options
              :label="$t('applicant.list.fixEmployment.client')"  />
            <q-select
              v-model="data['office']"
              :loading="loading"
              emit-value 
              map-options
              option-value="id"
              option-label="name"
              :rules="[creationRule]" 
              hide-bottom-space
              :options="clientFactoryList"
              :disable="!data['client']"
              :label="$t('applicant.list.fixEmployment.office')" />
            <q-select
              v-model="data['backOrder']"
              :loading="loading"
              emit-value 
              map-options
              :rules="[creationRule]" 
              hide-bottom-space
              :options="backOrderOptions"
              :disable="!data['client']" 
              :label="'BOID'" />
        </q-card-section>

        <template v-if="fixData && fixData.id">
          <!-- Fix Information -->
          <q-card-section>
            <FixInfoSection
              :edit="edit"
              :loading="loading"
              :fix-data="fixData"
              :edit-data="data"
              :users-list-option="usersListOption"
              @save="save"
              @closeEdit="edit=edit.filter(i => i !== 'info')" 
              @openEdit="edit.push('info')"
            />
          </q-card-section>

          <!-- Job-search Information  -->
          <q-card-section>
            <JobSearchInfoSection
              :edit="edit"
              :loading="loading"
              :fix-data="fixData"
              :edit-data="data"
              :users-list-option="usersListOption"
              @save="save"
              @closeEdit="edit=edit.filter(i => i !== 'jobSearchInfo')" 
              @openEdit="edit.push('jobSearchInfo')" 
              :disable-level="disableLevel" 
            />
          </q-card-section>

          <!-- Information on job offers -->
          <q-card-section>
            <JobOffersInfoSection
              :edit="edit"
              :loading="loading"
              :fix-data="fixData"
              :edit-data="data"
              :users-list-option="usersListOption"
              @save="save"
              @closeEdit="edit=edit.filter(i => i !== 'jobOffersInfo')" 
              @openEdit="edit.push('jobOffersInfo')" 
              :disable-level="disableLevel" 
            />
          </q-card-section>

          <!-- Employment Information -->
          <q-card-section>
            <EmploymentInfoSection
              :edit="edit"
              :loading="loading"
              :fix-data="fixData"
              :edit-data="data"
              :users-list-option="usersListOption"
              @save="save"
              @closeEdit="edit=edit.filter(i => i !== 'employmentInfo')" 
              @openEdit="edit.push('employmentInfo')" 
              :disable-level="disableLevel"  
            />
          </q-card-section>
        </template>
      </q-form>
    </q-card>
  </q-scroll-area>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { Applicant, ApplicantFix, BackOrderModel, selectOptions, UserPermissionNames } from 'src/shared/model';
import { getAuth } from 'firebase/auth';
import { pick } from 'src/shared/utils/utils';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import { useBackOrder } from 'src/stores/backOrder';
import FixInfoSection from './FixInfoSection.vue';
import JobSearchInfoSection from './JobSearchInfoSection.vue';
import JobOffersInfoSection from './JobOffersInfoSection.vue';
import EmploymentInfoSection from './EmploymentInfoSection.vue';
import { creationRule } from 'src/components/handlers/rules';
import { useFix } from 'src/stores/fix';
import { QForm } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { useClientFactory } from 'src/stores/clientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const props = defineProps<{
  fixData?: ApplicantFix,
  applicant: Applicant,
  disableLevel: number,
  createdFixes: ApplicantFix[]
}>()
const formRef = ref<QForm | null>(null);
const emits = defineEmits(['updateList', 'close', 'updateDoc'])

const auth = getAuth();
const organization = useOrganization();
const clientFactoryStore = useClientFactory();
const applicantStore = useApplicant();
const fixStore = useFix();
const userStore = useUserStore()
const backOrderStore = useBackOrder()

const data = ref<Partial<ApplicantFix>>({});
const clientFactoryList = ref<ClientFactory[]>([])
const loading = ref(false);
const edit = ref<string[]>([]);
const usersListOption = ref<selectOptions[]>([]);
const name = ref('');

const backOrderOptions = computed(()=>{
  return backOrderList.value.map((row)=>{
    const disable = !!props.createdFixes.find((item)=>{
      return item.backOrder === row.id
    }) && row.id !== props.fixData?.backOrder
    return {
      value: row.id,
      label: row.boId,
      disable: disable
    }
  }) || []
})
const backOrderList = ref<BackOrderModel[]>([])

onMounted(async () => {
  await applicantStore.getClients()
})
watch(() => data.value.client, async () => {
  if (data.value.client) {
    loading.value = true
    clientFactoryList.value = await clientFactoryStore.getClientFactoryList(data.value.client)
    loading.value = false
  }
}, { deep: true, immediate: true })

watch(()=>data.value.office, async (newValue)=>{
  if(newValue){
    backOrderList.value = await backOrderStore.getClientFactoryBackOrder(newValue)
  } else {
    backOrderList.value = []
  }
  if(!backOrderOptions.value.find((row)=>{
    return row.value === data.value.backOrder
  })){
    data.value.backOrder = ''
  }
})

watch(
  () => [props.fixData],
  () => {
    let officeName = ''
    if (props.fixData?.client) {
      const offices = applicantStore.state.clientList.find(client => client.id === props.fixData?.client)?.office
      if (props.fixData?.office) {
        officeName = offices?.find(office => office.id === props.fixData?.office)?.name || ''
      }
    }
    if (officeName ) {
      name.value = officeName
      return ;
    }
    name.value = ''
  },
  { deep: true, immediate: true }
)

async function loadUser() {
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

}
loadUser();

async function save(type: string, dataR) {
  let retData = {};
  switch(type){
    case 'main': {
      retData = pick(dataR, ['office', 'client', 'backOrder'])
      break;
    }
    case 'info': {
      retData = pick(dataR, ['fixStatus', 'fixDate', 'fixReasonNG', 'fixReasonNGDetail', 'chargeOfFix', 'fixMemo'])
      if (retData['fixDate']) {
        retData['fixDate'] = Timestamp.fromDate(new Date(retData['fixDate']))
      }
      break;
    }
    case 'jobSearchInfo': {      
      retData = pick(
        dataR,
        ['inspectionStatus', 'inspectionDate', 'inspectionReasonNG', 'inspectionReasonNGDetail', 'chargeOfFacility', 'chargeOfInspection', 'personalStatus',  'corporationStatus',  'businessStatus', 'jobTitle', 'contact', 'comments', 'inspectionMemo'])
      if (retData['inspectionDate']) {
        retData['inspectionDate'] = Timestamp.fromMillis(Date.parse(retData['inspectionDate']))
      }
      break;
    }
    case 'jobOffersInfo': {
      retData = pick(
        dataR,
        ['offerStatus', 'offerDate', 'offerReasonNG', 'offerReasonNGDetail' , 'chargeOfOffer', 'offerMemo'])
      if (retData['offerDate']) {
        retData['offerDate'] = Timestamp.fromDate(new Date(retData['offerDate']))
      }
      break;
    }
    case 'employmentInfo': {
      retData = pick(
        dataR,
        ['admissionStatus', 'admissionDate', 'admissionReasonNG', 'admissionReasonNGDetail',
        'chargeOfAdmission', 'admissionMemo', 'endDate'])
        if (retData['admissionDate']) {
          retData['admissionDate'] = Timestamp.fromDate(new Date(retData['admissionDate']))
        }
        if (retData['endDate']) {
          retData['endDate'] = Timestamp.fromDate(new Date(retData['endDate']))
        }
      break;
    }
    default: {
      return ;
    }
  }
  emits('updateDoc', retData)
  edit.value=edit.value.filter(i => i !== type)
}
watch(() => props.fixData, () => {
  data.value = {...props.fixData};
}, {immediate: true })

async function saveDoc() {
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    return ;
  }
  try {
    loading.value = true;
    const retData = data.value
    retData['updated_at'] = serverTimestamp();
    delete retData['created_at']
    if (props.fixData?.id) {
      fixStore.updateFix(props.fixData.id, retData)

      emits('updateList')
      emits('close')
      return;
    }
    retData['created_at'] = serverTimestamp();
    retData['deleted'] = false;
    retData['created_by'] = auth.currentUser?.uid;
    await fixStore.saveFix(props.applicant.id, retData)

    emits('updateList')
    emits('close')
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.log(e)
  }
}
</script>
