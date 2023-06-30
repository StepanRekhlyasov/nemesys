<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t(`backOrder.type.${type}`) }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md ">
        <q-input dense outlined bg-color="white" v-model="data['dateOfRegistration']"
          :rules="[(val) => val ? validateDate(val) : true, creationRule]" hide-bottom-space >
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
      <labelField :label="$t('backOrder.create.registrant')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md self-center">
        {{ user.state.currentUser?.displayName }}
      </labelField>
    </div>

    <div class="row">
      <labelField :label="$t('client.backOrder.caseType')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10">
        <q-field v-model="data['typeCase']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio
            v-for="key in TypeOfCase"
            v-model="data['typeCase']"
            :label="$t('applicant.add.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
        </q-field>
      </labelField>
    </div>

    <div class="row" v-if="type == 'referral'" >
      <labelField :label="$t('backOrder.employmentType')" :edit="true" required 
        labelClass="q-pl-md col-2 self-center text-right "  valueClass="col-10">
        <q-field v-model="data['status']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio
            v-for="key in BackOrderStatus"
            v-model="data['status']"
            :label="$t('client.backOrder.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
        </q-field>
      </labelField>
    </div>    

    <div class="row ">
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="true" 
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10" required>
        <q-field v-model="data['requiredQualifications']" borderless hide-bottom-space :rules="[() => 'requiredQualifications' in data || '']" flat >
          <q-toggle v-model="data['requiredQualifications']" 
            :label="$t('backOrder.create.existence')" :disable="loading" />
        </q-field>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('backOrder.create.nameQualification')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10">
        <q-field v-model="data['qualifications']" borderless hide-bottom-space :rules="[(val) => data['requiredQualifications'] ? creationRule(val) : true]">
          <q-radio
            v-for="key in TypeQualifications"
            v-model="data['qualifications']"
            :label="$t('backOrder.qualification.'+key)"
            :val="key"
            :key="key"
            :disable="loading || !data['requiredQualifications']"
            class="q-pr-md"/>
        </q-field>
      </labelField>
    </div>
    <div class="row">
      <labelField :label="$t('client.backOrder.experienceReq')" :edit="true" labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4">
        <q-toggle v-model="data['experienceReq']"  :disable="loading" 
          :label="data['experienceReq']?$t('common.yes'):$t('common.no')"/>
      </labelField>
      <labelField :label="$t('client.backOrder.upperAgeLimit')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md ">
        <q-input v-model="data['upperAgeLimit']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" />
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('applicant.progress.table.invoice')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md ">
        <q-input v-model="data['invoice']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" />
      </labelField>
      <labelField :label="$t('backOrder.payment')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md ">
        <q-input v-model="data['payment']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]"/>
      </labelField>
    </div>   

    <div class="row q-pt-sm">
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10">
        <q-field v-model="data['travelingExpenses']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesRegular')" 
          val="yesRegular" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesDaily')" 
          val="yesDaily" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.none')" 
          val="none" v-model="data['travelingExpenses']" />
        </q-field>
      </labelField>
    </div>   
  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { creationRule } from 'src/components/handlers/rules';
import { validateDate } from 'src/shared/constants/Form.const';
import { BackOrderModel, TypeOfCase, BackOrderStatus, TypeQualifications, selectOptions } from 'src/shared/model';
import { useUserStore } from 'src/stores/user';
import { ref, watch } from 'vue';

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  type: 'dispatch' | 'referral',
  usersListOption: selectOptions[]
}>()
const user = useUserStore();

const data = ref(props.backOrder);
user.getCurrentUser();

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })
</script>

<style>

</style>