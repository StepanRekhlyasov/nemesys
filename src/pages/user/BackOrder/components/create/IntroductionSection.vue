<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{'■ '+ $t(`backOrder.type.${type}`) }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.backOrder.dateOfRegistration')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md ">
        <q-input dense outlined bg-color="white" v-model="formattedDate" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dateOfRegistration']" default-view="Years" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
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
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10 q-pl-md">
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
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10 q-pl-md">
        <q-field v-model="data['employmentType']" borderless hide-bottom-space :rules="[(val) => creationArrayRule(val)]">
          <q-checkbox
            v-for="key in EmploymentBOStatus"
            v-model="data['employmentType']"
            :label="$t('client.backOrder.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"
          />
        </q-field>
      </labelField>
    </div>

    <div class="row ">
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="true"
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10 q-pl-md">
        <q-field v-model="data['qualifications']" borderless hide-bottom-space>
          <q-checkbox
            v-for="key in TypeQualifications"
            v-model="data['qualifications']"
            :label="$t('applicant.qualification.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"
          />
        </q-field>
      </labelField>
    </div>

    <div class="row">
      <labelField :label="$t('client.backOrder.experienceReq')" :edit="true"
        labelClass="q-pl-md col-2 text-right q-mt-sm"  valueClass="col-4 q-pl-md">
        <q-input v-model="data['experienceReq']" type="text" outlined dense :disable="loading" />
      </labelField>
      <labelField :label="$t('backOrder.create.experienceRemarks')" :edit="true"
        labelClass="q-pl-md col-2 text-right q-mt-sm"  valueClass="col-4 q-pl-md self-center ">
        <q-input v-model="data['experienceRemarks']" type="textarea" autogrow outlined dense :disable="loading" />
      </labelField>
    </div>
    <div class="row q-pt-sm">
      <labelField :label="$t('client.backOrder.upperAgeLimit')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md flex">
        <q-input v-model="data['upperAgeLimit']" type="text" outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" />
        <span class="self-center q-pl-md">{{ $t('common.ageShort') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm" v-if="type == 'dispatch'">
      <labelField :label="$t('applicant.progress.table.invoice')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md flex ">
        <q-input v-model="data['invoice']" type="text" outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" @update:model-value="(value)=>{ data['invoice'] = commaSeparatedNumber(value) }"/>
        <span class="self-center q-pl-md">{{ $t('common.yen') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm"  v-if="type == 'dispatch'">
      <labelField :label="$t('backOrder.payment')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-4 q-pl-md flex ">
        <q-input v-model="data['payment']" type="text" outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" @update:model-value="(value)=>{ data['payment'] = commaSeparatedNumber(value) }"/>
        <span class="self-center q-pl-md">{{ $t('common.yen') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm" v-if="type == 'dispatch'">
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="true" required
        labelClass="q-pl-md col-2 self-center text-right"  valueClass="col-10 q-pl-md">
        <q-input v-model="data['travelingExpenses']" type="textarea" outlined dense :disable="loading" autogrow/>
      </labelField>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { creationArrayRule, creationRule } from 'src/components/handlers/rules';
import { BackOrderModel, TypeOfCase, EmploymentBOStatus, TypeQualifications, selectOptions } from 'src/shared/model';
import { commaSeparatedNumber } from 'src/shared/utils/utils';
import { useUserStore } from 'src/stores/user';
import { ref, watch, computed } from 'vue';
import { myDateFormat } from 'src/shared/utils/utils';

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

const formattedDate = computed(()=> {
      return myDateFormat(data.value['dateOfRegistration'])
})

</script>
