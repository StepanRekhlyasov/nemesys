<template>
  <q-card-section class="bg-white ">
    <div class="row q-pb-md">
      <div class="col-9"></div>
      <div class="col-3 text-right">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.status')" :edit="edit"
        :value="selectedBo['status']?$t(`client.backOrder.${selectedBo['status']}`) : ''">
        <q-radio
          v-for="key in BackOrderStatus"
          v-model="data['status']"
          :label="$t('client.backOrder.'+key)"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
          :val="key"
          :key="key"
          :disable="loading"
          class="q-pr-md"/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.customerRepresentative')"
        :edit="edit" :value="selectedBo['customerRepresentative']" valueClass="self-center q-pl-md ">
        <q-input v-model="data['customerRepresentative']" outlined dense :disable="loading"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit"
        :value="selectedBo['qualifications']?$t(`backOrder.qualification.${selectedBo['qualifications']}`) : '' ">
        <q-radio
          v-for="key in TypeQualifications"
          v-model="data['qualifications']"
          :label="$t('backOrder.qualification.'+key)"
          :val="key"
          :key="key"
          :disable="loading"
          class="q-pr-md"/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="edit" valueClass="self-center q-pl-md "
        :value="selectedBo['BOGenerationRoute']?$t(`backOrder.create.${selectedBo['BOGenerationRoute']}`) : '' ">
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall" :disable="loading"/>
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('client.backOrder.experienceReq')" :edit="edit" :value="selectedBo['experience_req']">
        <q-input v-model="data['experience_req']" outlined dense :disable="loading"/>
      </LabelField>
      <LabelField :label="$t('backOrder.transactionType')" :edit="edit"
        :value="selectedBo['transactionType']?$t(`client.backOrder.${selectedBo['transactionType']}`) : ''">
        <q-radio
          v-model="data['transactionType']"
          :label="$t('client.backOrder.introduction')"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
          val="introduction"
          key="introduction"
          :disable="loading"
          class="q-pr-md"/>
        <q-radio
          v-model="data['transactionType']"
          label="TTP"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
          val="ttp"
          key="ttp"
          :disable="loading"
          class="q-pr-md"/>
        <q-radio
          v-model="data['transactionType']"
          :label="$t('client.backOrder.dispatch')"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
          val="dispatch"
          key="dispatch"
          :disable="loading"
          class="q-pr-md"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.experienceRemarks')"
        :edit="edit" :value="selectedBo['experienceRemarks']">
          <q-input v-model="data['experienceRemarks']"  outlined dense :disable="loading" />
      </LabelField>
      <LabelField :label="$t('client.backOrder.caseType')" :edit="edit"
        :value="selectedBo['caseType']?$t(`applicant.add.${selectedBo['caseType']}`) : ''">
          <q-radio
            v-for="key in TypeOfCase"
            v-model="data['caseType']"
            :label="$t('applicant.add.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.experienceRemarks')"
        :edit="edit" :value="selectedBo['experienceRemarks']">
          <q-input v-model="data['experienceRemarks']"  outlined dense :disable="loading" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.request')" :edit="edit" :value="selectedBo['request']">
          <q-input v-model="data['request']"  outlined dense :disable="loading" />
      </LabelField>
      <LabelField :label="$t('backOrder.ageLimit')" :edit="edit" :value="selectedBo['ageLimit']?`${selectedBo['ageLimit']} ${$t('common.ageShort')}` : '' ">
          <q-input v-model="data['ageLimit']"  outlined dense :disable="loading" type="number" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.payment')" :edit="edit"
        :value="selectedBo['payment'] ? `${selectedBo['payment']} ${$t('common.reputation')}` : ''">
        <q-input v-model="data['payment']"  outlined dense :disable="loading"  type="number"/>
      </LabelField>
      <LabelField :label="$t('backOrder.transportationExpenses')" :edit="edit"
        :value="selectedBo['transportationExpenses']?`${selectedBo['transportationExpenses']}` : '' ">
        <q-input v-model="data['transportationExpenses']"  outlined dense :disable="loading" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.numberWorkingDays')" :edit="edit"
        :value="selectedBo['numberWorkingDays'] ? $t(`backOrder.daysPerWeek.${selectedBo['numberWorkingDays']}`)  : ''">
        <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading"
          :label="day.label" :val="day.value" v-model="data['numberWorkingDays']" />
      </LabelField>
      <LabelField :label="`${$t('office.workingHours')} : ${$t('office.earlyShift')}`" :edit="edit" :value="selectedBo['earlyShift'] ? selectedBo['earlyShift'] : '-'">

      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.workingDays')" :edit="edit" :value="selectedBo['workingDays'] ? $t(`backOrder.workingDays.${selectedBo['workingDays']}`) : ''">
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.shiftSystem')"
          val="shiftSystem" v-model="data['workingDays']" />
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.fixed')"
          val="fixed" v-model="data['workingDays']" />
      </LabelField>
      <LabelField :label="`${$t('office.workingHours')} : ${$t('office.dayShift')}`" :edit="edit" :value="selectedBo['dayShift'] ? selectedBo['dayShift'] : '-'">

      </LabelField>
    </div>

    <div class="row q-pb-sm">

      <LabelField :label="$t('backOrder.create.shiftRemarks')" :edit="edit" :value="selectedBo['shiftRemarks']">
          <q-input dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading" />
      </LabelField>
      <div class="col-6">
        <div class="row q-pb-sm">
          <LabelField :label="`${$t('office.workingHours')} : ${$t('office.lateShift')}`"
            :edit="edit" :value="selectedBo['lateShift'] ? selectedBo['lateShift'] : '-'"
            label-class="col-6 q-pl-md text-right">

          </LabelField>
        </div>
        <div class="row q-pb-sm">
          <LabelField :label="`${$t('office.workingHours')} : ${$t('office.nightShift')}`"
            :edit="edit" :value="selectedBo['nightShift'] ? selectedBo['nightShift'] : '-'"
            label-class="col-6 q-pl-md text-right">

          </LabelField>
        </div>
      </div>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.tasks')" :edit="edit" :value="selectedBo['tasks']">
        <q-input v-model="data['tasks']" outlined dense :disable="loading"/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.onCallSupport')" :edit="edit" :value="selectedBo['onCallSupport'] ? $t('common.yes') : $t('common.no')">
        <q-toggle v-model="data['onCallSupport']"  :disable="loading"/>
        <span class="q-ma-sm flex-center q-pr-md q-mr-md">{{ data['onCallSupport']?$t('common.yes'):$t('common.no') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.pickDrop')" :edit="edit" :value="selectedBo['pickDrop'] ? $t('common.yes') : $t('common.no')">
        <q-toggle v-model="data['pickDrop']" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ data['pickDrop']?$t('common.yes'):$t('common.no') }}</span>
      </LabelField>
      <LabelField :label="$t('backOrder.create.onCallRemarks')" :edit="edit" :value="selectedBo['onCallRemarks']">
        <q-input v-model="data['onCallRemarks']" outlined dense  :disable="loading"/>
      </LabelField>
    </div>
  </q-card-section>
  <q-card-section>
    <detalInfoTab :bo="selectedBo" @openSearchByMap="emit('openSearchByMap')" />
  </q-card-section>
</template>
<script lang="ts" setup>
import { BackOrderModel, BackOrderStatus, Client, TypeOfCase, TypeQualifications } from 'src/shared/model';
import { ref } from 'vue';
import { DaysPerWeekList } from 'src/shared/constants/BackOrder.const';
import { useBackOrder } from 'src/stores/backOrder';
import LabelField from 'src/components/form/LabelField.vue';
import detalInfoTab from './detalInfoTab.vue';

const props = defineProps<{
  selectedBo: BackOrderModel,
  client?: Client
}>()
const emit = defineEmits(['openSearchByMap']);

const edit = ref(false);
const backOrderStore = useBackOrder();
const loading = ref(false)
const data = ref(props.selectedBo)

async function save() {
  loading.value = true;
  try {
    await backOrderStore.updateBackOrder({id: props.selectedBo.id, ...data.value} as BackOrderModel);
    edit.value = false;

  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>

<style>

</style>
