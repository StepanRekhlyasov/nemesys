<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.basicInfo') }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.list.client')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        {{ client['client_name'] }}
      </labelField>
      <labelField :label="$t('backOrder.officeName')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        {{ $t('client.backOrder.introduction') }}
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.customerRepresentative')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>田中　太郎</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.approvalOrNot')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>有</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.filingRemarks')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>最短で1週間はかかる</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.availabilityOfGarage')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>有</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
      <labelField :label="$t('backOrder.create.commutingByCar')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>可能</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.parkingRemarks')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>夜勤の場合のみ使用可能</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.uniformAvailability')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>有</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
      <labelField :label="$t('backOrder.create.availabilityOfLunch')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>なし</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.smoking')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>可能</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.smokingRemarks')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>電子のみ可能</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.vaccination')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>必須</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
      <labelField :label="`${$t('backOrder.create.priorEmployment')}\r   ${$t('backOrder.create.medicalCheckup')}`" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>必須</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.numberUsers')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>120名</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
      <labelField :label="$t('backOrder.create.employees')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>30名</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.levelOfCare')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <span>自立の利用者が大半</span>
        <q-btn round unelevated icon="mdi-pencil" size="xs" color="grey-4" class="q-ml-sm" text-color="primary" />
      </labelField>
      <labelField :label="$t('backOrder.create.memo')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
      </labelField>
    </div>
    
  </q-card-section>  
</template>

<script lang="ts" setup>
import LabelField from 'src/components/form/LabelField.vue';
import { BackOrderModel, Client } from 'src/shared/model';

defineProps<{
  backOrder: BackOrderModel,
  loading: boolean,
  client: Client
}>()

</script>