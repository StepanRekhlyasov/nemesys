<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.create.introduction') }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <q-input v-model="data['dateOfRegistration']" outlined dense :disable="loading"/>
      </labelField>
      <labelField :label="$t('backOrder.create.registrant')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-4">
        <q-input v-model="data['registrant']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('client.backOrder.caseType')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-radio
          v-for="key in TypeOfCase"
          v-model="data['typeCase']"
          :label="$t('applicant.add.'+key)"
          :val="key"
          :key="key"
          :disable="loading"
          class="q-pr-md"/>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('client.backOrder.caseType')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-radio
          v-for="key in BackOrderStatus"
          v-model="data['status']"
          :label="$t('client.backOrder.'+key)"
          :val="key"
          :key="key"
          :disable="loading"
          class="q-pr-md"/>
      </labelField>
    </div>    

    <div class="row ">
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-toggle v-model="data['requiredQualifications']" :label="$t('backOrder.create.existence')" :disable="loading" />
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('client.backOrder.reqQualification')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10">
        <q-radio
          v-for="key in TypeQualifications"
          v-model="data['qualifications']"
          :label="$t('backOrder.qualification.'+key)"
          :val="key"
          :key="key"
          :disable="loading || !data['requiredQualifications']"
          class="q-pr-md"/>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('client.backOrder.reqQualification')" :edit="true" labelClass="q-pl-md col-2"  valueClass="col-10 flex">
        <q-toggle :label="$t('backOrder.create.somethingNotQuestioned')" :modelValue="data['somethingNotQuestioned']" />
        <span class="flex-center q-pa-sm q-pl-md">{{ $t('backOrder.create.experienceRemarks') }}</span>
        <q-input v-model="data['experienceRemarks']"  outlined dense :disable="loading" />
      </labelField>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import LabelField from 'src/components/form/LabelField.vue';
import { BackOrderModel, TypeOfCase, BackOrderStatus, TypeQualifications } from 'src/shared/model';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: BackOrderModel,
  loading: boolean
}>()
const data = ref(props.backOrder)
</script>

<style>

</style>