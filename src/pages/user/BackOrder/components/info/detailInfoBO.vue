<template>
  <div class="row">
    <LabelField :label="$t('backOrder.status')" :edit="edit" :value="selectedBo['status']?$t(`client.backOrder.${selectedBo['status']}`) : '' ">

    </LabelField>
    <LabelField :label="$t('backOrder.create.customerRepresentative')" :edit="edit" :value="selectedBo['customerRepresentative']">

    </LabelField>
  </div>

  <div class="row">
    <LabelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit" :value="selectedBo['qualifications']?$t(`backOrder.qualification.${selectedBo['qualifications']}`) : '' ">

    </LabelField>
    <LabelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="edit" :value="selectedBo['BOGenerationRoute']?$t(`client.backOrder.${selectedBo['BOGenerationRoute']}`) : '' ">

    </LabelField>
  </div>

  <div class="row">
    <LabelField :label="$t('client.backOrder.experienceReq')" :edit="edit" :value="selectedBo['experience_req']">

    </LabelField>
    <LabelField :label="$t('backOrder.transactionType')" :edit="edit" :value="selectedBo['transactionType']?$t(`backOrder.${selectedBo['transactionType']}`) : ''">

    </LabelField>
  </div>

  <div class="row">
    <LabelField :label="$t('backOrder.create.experienceRemarks')" :edit="edit" :value="selectedBo['experienceRemarks']">

    </LabelField>
    <LabelField :label="$t('client.backOrder.caseType')" :edit="edit" :value="selectedBo['caseType']?$t(`applicant.add.${selectedBo['caseType']}`) : ''">

    </LabelField>
  </div>

  <div class="row">
    <LabelField :label="$t('backOrder.create.experienceRemarks')" :edit="edit" :value="selectedBo['experienceRemarks']">

    </LabelField>
    <LabelField :label="$t('client.backOrder.caseType')" :edit="edit" :value="selectedBo['caseType']?$t(`applicant.add.${selectedBo['caseType']}`) : ''">

    </LabelField>
  </div>
</template>

<script lang="ts" setup>
import { BackOrderModel, Client } from 'src/shared/model';
import LabelField from 'src/components/form/LabelField.vue';
import { ref } from 'vue';

defineProps<{
  selectedBo: BackOrderModel,
  client?: Client
}>()
const edit = ref(false)
</script>

<style>

</style>