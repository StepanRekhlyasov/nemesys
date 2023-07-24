<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.basicInfo') }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.list.client')" :edit="false" 
        labelClass="q-pl-md col-2 text-right"  valueClass="col-4 q-pl-md " :value="backOrder['client_id'] && client ? client['name']  : ''">
      </labelField>
      <labelField :label="$t('backOrder.officeName')" :edit="false" :value="offices.find(office => office.id == backOrder['office_id'])?.name"
        labelClass="q-pl-md col-2 text-right"  valueClass="col-4 q-pl-md " >
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.customerRepresentative')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['customerRepresentative']" valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.approvalOrNot')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value=" 'approvalOrNot' in backOrder ?(backOrder['approvalOrNot'] ? $t('common.yes') : $t('common.no')) : ''" valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.filingRemarks')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['filingRemarks']"  valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.availabilityOfGarage')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['availabilityOfGarage']"  valueClass="col-4 q-pl-md " />
      <labelField :label="$t('backOrder.create.commutingByCar')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['commutingByCar']"  valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.parkingRemarks')" :edit="false"
        labelClass="q-pl-md col-2 text-right" :value="backOrder['parkingRemarks']"  valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.uniformAvailability')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['uniformAvailability']"  valueClass="col-4 q-pl-md " />
      <labelField :label="$t('backOrder.create.availabilityOfLunch')" :edit="false" 
      labelClass="q-pl-md col-2 text-right" :value="backOrder['availabilityOfLunch']" valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.smoking')" :edit="false" 
      labelClass="q-pl-md col-2 text-right" :value="backOrder['smoking'] ? $t(`smoking.${backOrder['smoking']}`) : ''" valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.smokingRemarks')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['smokingRemarks']"  valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.vaccination')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['vaccination']"  valueClass="col-4 q-pl-md " />
      <labelField :label="`${$t('backOrder.create.priorEmployment')}\r   ${$t('backOrder.create.medicalCheckup')}`" 
        :edit="true" labelClass="q-pl-md col-2 text-right" :value="backOrder['medicalExamination']" valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.numberUsers')" :edit="false" labelClass="q-pl-md col-2 text-right" 
        :value="backOrder['numberUsers'] ? `${backOrder['numberUsers']}${$t('common.reputation')}` : '' "  valueClass="col-4 q-pl-md " />
      <labelField :label="$t('backOrder.create.employees')" :edit="false" labelClass="q-pl-md col-2 text-right" 
        :value="backOrder['numberEmployees'] ? `${backOrder['numberEmployees']}${$t('common.reputation')}` : ''"  valueClass="col-4 q-pl-md " />
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.levelOfCare')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['levelOfCare']"  valueClass="col-4 q-pl-md " />
      <labelField :label="$t('backOrder.create.memo')" :edit="false" 
        labelClass="q-pl-md col-2 text-right" :value="backOrder['memo']" valueClass="col-4 q-pl-md " />
    </div>
    
  </q-card-section>  
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { BackOrderModel, Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  client?: Client,
  officeID?: string,
  offices: ClientFactory[]
}>()

</script>