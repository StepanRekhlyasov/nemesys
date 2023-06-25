<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t(`backOrder.type.${type}`) }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-input dense outlined bg-color="white" v-model="data['dateOfRegistration']"
        :rules="[(val) => val ? validateDate(val) : true]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dateOfRegistration']" default-view="Years" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </labelField>
      <labelField :label="$t('backOrder.create.registrant')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-select v-model="data['registrant']" outlined dense  :options="usersListOption" :disable="loading || !usersListOption"/> 
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('client.backOrder.caseType')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-10">
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

    <div class="row" v-if="type == 'referral'" >
      <labelField :label="$t('backOrder.employmentType')" :edit="true" labelClass="q-pl-md col-2 self-center "  valueClass="col-10">
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
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-10">
        <q-toggle v-model="data['requiredQualifications']" :label="$t('backOrder.create.existence')" :disable="loading" />
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('backOrder.create.nameQualification')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-10">
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
      <labelField :label="$t('backOrder.create.experienceRemarks')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-input v-model="data['experienceRemarks']"  outlined dense :disable="loading" />
      </labelField>
      <labelField :label="$t('client.backOrder.upperAgeLimit')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-input v-model="data['upperAgeLimit']"  outlined dense :disable="loading" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('applicant.progress.table.invoice')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-input v-model="data['invoice']"  outlined dense :disable="loading" />
      </labelField>
      <labelField :label="$t('backOrder.payment')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-4">
        <q-input v-model="data['payment']"  outlined dense :disable="loading" />
      </labelField>
    </div>   

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="true" labelClass="q-pl-md col-2 self-center"  valueClass="col-10">
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesRegular')" 
        val="yesRegular" v-model="data['travelingExpenses']" />
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesDaily')" 
        val="yesDaily" v-model="data['travelingExpenses']" />
        <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.none')" 
        val="none" v-model="data['travelingExpenses']" />
      </labelField>
    </div>   
  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { validateDate } from 'src/shared/constants/Form.const';
import { BackOrderModel, TypeOfCase, BackOrderStatus, TypeQualifications, selectOptions } from 'src/shared/model';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  type: 'dispatch' | 'referral',
  usersListOption: selectOptions[]
}>()
const data = ref(props.backOrder)
</script>

<style>

</style>