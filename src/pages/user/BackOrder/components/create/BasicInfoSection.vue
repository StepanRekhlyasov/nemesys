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
      <labelField :label="$t('backOrder.create.customerRepresentative')" :edit="true"
        labelClass="q-pl-md col-2 text-right" :value="backOrder['customerRepresentative']">
        <q-input v-model="data['customerRepresentative']" outlined dense :disable="loading"/>
        </labelField>
    </div>

    <div class="row q-pt-sm q-pr-xl">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.approvalOrNot')" :edit="true"
      :value="backOrder['approvalOrNot'] ? $t('common.yes') : $t('common.no')">
      <q-toggle v-model="data['approvalOrNot']"  :disable="loading"/>
      <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ backOrder['approvalOrNot']?$t('common.yes'):$t('common.no') }}</span>
    </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.filingRemarks')" :edit="true"
      :value="backOrder['filingRemarks'] ">
      <q-input v-model="data['filingRemarks']" outlined dense :disable="loading"/>
    </labelField>
    <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.ageLimit')" :edit="true"
    :value="backOrder['upperAgeLimit'] ? `${backOrder['upperAgeLimit']} ${$t('common.ageShort')}` : ''" >
    <q-input v-model="data['upperAgeLimit']" outlined dense :disable="loading" type="number"/>
    </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.availabilityOfGarage')" :edit="true"
      :value="backOrder['availabilityOfGarage'] ? $t('common.yes') : $t('common.no')">
      <q-toggle v-model="data['availabilityOfGarage']"  :disable="loading"/>
      <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ backOrder['availabilityOfGarage'] ? $t('common.yes') : $t('common.no') }}</span>
    </labelField>
    <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.commutingByCar')" :edit="true"
      :value="backOrder['commutingByCar']">
      <q-input v-model="data['commutingByCar']" outlined dense :disable="loading"/>
    </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.parkingRemarks')" :edit="true"
      :value="backOrder['parkingRemarks']">
      <q-input v-model="data['parkingRemarks']" outlined dense :disable="loading"/>
    </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.uniformAvailability')" :edit="true"
      :value="backOrder['uniformAvailability']" >
      <q-input v-model="data['uniformAvailability']" outlined dense :disable="loading"/>
  </labelField>
  <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.availabilityOfLunch')" :edit="true"
  :value="backOrder['availabilityOfLunch'] ? `${backOrder['availabilityOfLunch']}` : ''" >
  <q-input v-model="data['availabilityOfLunch']" outlined dense :disable="loading"/>
  </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.smoking')" :edit="true" :value="backOrder['smoking'] ? $t(`smoking.${backOrder['smoking']}`) : ''  " >
        <q-select v-if="true" outlined dense :options="smokingStatusOptions"
          emit-value map-options v-model="data['smoking']" :disable="loading"/>
      </labelField>
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.smokingRemarks')" :edit="true" :value="backOrder['smokingRemarks']" >
        <q-input v-model="data['smokingRemarks']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.vaccination')" :edit="true" :value="backOrder['vaccination']" >
        <q-input v-model="data['vaccination']" outlined dense :disable="loading"/>
      </labelField>
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.medicalExamination')" :edit="true"
      :value="backOrder['medicalExamination']">
      <q-input v-model="data['medicalExamination']" outlined dense :disable="loading"/>
    </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.numberUsers')" :edit="true"
      :value="backOrder['numberUsers'] ? `${backOrder['numberUsers']}${$t('common.reputation')}` : ''">
      <q-input v-model="data['numberUsers']" outlined dense :disable="loading" type="number"/>
    </labelField>
    <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.numberEmployees')" :edit="true"
    :value="backOrder['numberEmployees'] ? `${backOrder['numberEmployees']}${$t('common.reputation')}` : ''" >
    <q-input v-model="data['numberEmployees']" outlined dense :disable="loading" type="number"/>
  </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.levelOfCare')" :edit="true"
      :value="backOrder['levelOfCare']">
      <q-input v-model="data['levelOfCare']" outlined dense :disable="loading"/>
    </labelField>
    <labelField labelClass="q-pl-md col-2 text-right" :label="$t('backOrder.create.memo')" :edit="true" :value="backOrder['memo']" >
      <q-input v-model="data['memo']" outlined dense :disable="loading"/>
    </labelField>
    </div>

  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { BackOrderModel, Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ref, watch} from 'vue';
import { smokingStatusList } from 'src/shared/constants/Applicant.const';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  client?: Client,
  officeID?: string,
  offices: ClientFactory[]
}>()

const data = ref(props.backOrder)
const smokingStatusOptions = ref(smokingStatusList);

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })

</script>
