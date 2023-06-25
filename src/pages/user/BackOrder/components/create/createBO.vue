<template>
  <q-card class="no-shadow bg-grey-3">
    <q-form ref="boForm" @submit="addBackOrder" @reset="emits('closeDialog')">    
      <q-card-section class="text-white bg-primary no-border-radius" >
        <div class="row">
          <div class="flex items-end ">
            <q-btn dense flat icon="close" class="q-mr-md" type="reset" />
          </div>
          <div>
            <div class="row text-h6 text-weight-bold q-pr-xs">
              {{`${$t('backOrder.clientName')} / ${$t('backOrder.officeName')} / ${$t(`backOrder.type.${type}`)}`}}
            </div>
          </div>
        </div>
      </q-card-section >

      <q-card-section class="bg-white">        
        <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold q-mr-md" size="sm"  type="submit"/>
        <q-btn :label="$t('common.cancel')" outline  color="primary" class="text-weight-bold"  type="reset" size="sm"/>
      </q-card-section>

      <q-separator color="grey-3" size="2px" />
      <q-card-section class="bg-white">    
        <!-- Main Information -->
        <q-card-section>      
          <q-select
            v-model="data.client_id"
            @update:model-value="data['office_id']=undefined"
            :loading="loading"
            :options="applicantStore.state.clientList"
            option-value="id"
            option-label="name"
            :rules="[creationRule]" hide-bottom-space
            emit-value map-options
            :label="$t('applicant.list.fixEmployment.client')"  />
          <q-select
            v-model="data['office_id']"
            :loading="loading"
            emit-value map-options
            option-value="id"
            option-label="name"
            :rules="[creationRule]" hide-bottom-space
            :options="applicantStore.state.clientList.find(client => client.id === data['client_id'])?.office"
            :disable="!data['client_id']" 
            :label="$t('applicant.list.fixEmployment.office')" />
        </q-card-section>

        <!-- Basic Info Section -->
        <basic-info-section :backOrder="data" :loading="loading" 
          :client="applicantStore.state.clientList.find(client => client.id === data['client_id'])"
          :officeID="data['office_id']"/>

        <!-- Working Type Section -->
        <q-card-section>
          <div class="row text-primary text-h6" >
            {{'■ '+ $t('backOrder.create.workingType') }}
          </div>
          <div class="row">
            <labelField :label="$t('backOrder.create.typeOfEmployment')" :edit="false" 
              labelClass="q-pl-md col-2 self-center"  valueClass="col-4" :value="$t(`backOrder.type.${type}`)" />
          </div>
        </q-card-section>

        <!-- BO Generation Route Section -->
        <q-card-section>
          <div class="row text-primary text-h6 items-center" >
            {{'■ '+ $t('backOrder.create.BOGenerationRoute') }}
          </div>
          <div class="row ">
            <labelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
              <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall" :disable="loading"/>
              <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading"/>
            </labelField>
          </div>
        </q-card-section>

        <!-- Introduction Section -->
        <introduction-section :backOrder="data" :loading="loading" :type="type" :usersListOption="usersListOption"/>

        <!-- Employment Conditions Section -->
        <employment-conditions-section :backOrder="data" :loading="loading"  :type="type"/>

        <!-- Paycheck Section -->
        <paycheck-section :backOrder="data" :loading="loading" />

        <!-- Tasks Section -->
        <template v-if="type=='referral'">
          <tasks-section :backOrder="data" :loading="loading" />
        </template>
        
        <!-- In House Information Section -->
        <template v-if="type=='referral'">
          <in-house-info-section :backOrder="data" :loading="loading"/>
        </template>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { BackOrderModel, selectOptions, UserPermissionNames } from 'src/shared/model';
import { Ref, ref, watch } from 'vue';
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
const emits = defineEmits(['closeDialog']);
const backOrderStore = useBackOrder();
const applicantStore = useApplicant();
const organization = useOrganization();
const userStore = useUserStore();
const usersListOption = ref<selectOptions[]>([]);
const boForm: Ref<QForm|null> = ref(null);

const props = defineProps<{
  type: 'dispatch' | 'referral'
}>()
const loading = ref(false);
const data = ref({
  working_days_week: [] as string[],
  workingDays: 'shiftSystem',
  type: props.type
} as Partial<BackOrderModel>);

async function addBackOrder() {
  try {
    loading.value = true
    if (data.value.client_id && boForm.value?.validate){
      await backOrderStore.addBackOrder(data.value, data.value.client_id);
      loading.value = false;
      backOrderStore.loadBackOrder();
      emits('closeDialog');
    }
  } catch (e) {
    console.log(e)
    loading.value = false;
  }
}

watch([data.value.client_id, data.value.office_id], async () => {  
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
}, { deep: true, immediate: true})

</script>
