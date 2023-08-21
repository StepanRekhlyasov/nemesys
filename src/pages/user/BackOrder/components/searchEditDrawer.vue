<script lang="ts" setup>
import { onMounted, defineProps} from 'vue';
import DoubleNumberInput from 'src/pages/user/Applicant/components/search/components/DoubleNumberInput.vue';
import {searchData} from 'src/pages/user/BackOrder/consts/index'
import { employmentTypeOption, qualificationOption } from '../consts/BackOrder.const';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';


const props = defineProps({
  rowForEdit:{
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  searchData.value = JSON.parse(JSON.stringify(props.rowForEdit));
  console.log(searchData.value)
});

</script>

<template>

          <q-card-section>

            <div class="row q-mt-sm">
              <div class="col-5">
                <q-input
                  dense
                  v-model="searchData['keyword']"
                  outlined
                  autogrow
                  class="q-mr-xs"
                  :placeholder="$t('common.keyboard')"
                  clearable
                />
              </div>
              <div class="col-2">
                <q-input
                  dense
                  v-model="searchData['boid']"
                  outlined
                  autogrow
                  class="q-mr-xs"
                  placeholder="BOID"
                  clearable
                />
              </div>
              <div class="col-3">
                <q-input
                  dense
                  v-model="searchData['customerRepresentative']"
                  outlined
                  autogrow
                  class="q-mr-xs"
                  :placeholder="$t('backOrder.create.customerRepresentative')"
                  clearable
                />
              </div>
            </div>

            <q-separator class="q-my-sm" style="background-color:transparent"/>

              <div class="row q-pl-sm">
            <div class="col-4">{{ $t('backOrder.registrationDate') }}</div>
            <div class="col-2">{{ $t('client.backOrder.upperAgeLimit') }}</div>
          </div>
          <div class="row">
            <div class="col-4 flex q-pa-none items-center">
              <q-input
                type="date"
                v-model="searchData['registrationDateMin']"
                outlined
                dense
                mask="YYYY/MM/DD"
                class="q-ma-none q-pa-none"
              />
              ~
              <q-input
                type="date"
                v-model="searchData['registrationDateMax']"
                outlined
                dense
                mask="YYYY/MM/DD"
                class="q-ma-none q-pa-none"
              />
            </div>
            <div class="col-4">
              <DoubleNumberInput
                :min-model-value="searchData['ageMin']"
                :max-model-value="searchData['ageMax']"
                unit-key="common.age"
                @on-min-value-update="(v) => (searchData['ageMin'] = v)"
                @on-max-value-update="(v) => (searchData['ageMax'] = v)"
              />
            </div>
          </div>

          <q-separator class="q-my-sm" style="background-color:transparent"/>

          <div class="row">
            <div class="col-6 q-pl-sm">
              {{ $t('client.backOrder.reqQualification') }}
            </div>
          </div>
          <div class="row">
            <div class="col-8">
              <q-option-group
                v-model="searchData['qualifications']"
                :options="qualificationOption"
                type="checkbox"
                inline
              />
            </div>
          </div>

          <q-separator class="q-my-sm" style="background-color:transparent"/>

          <div class="row">
            <div class="col-8 q-pl-sm">{{ $t('backOrder.dealType') }}</div>
          </div>
          <div class="row">
            <div class="col-8">
              <q-option-group
                v-model="searchData['typecase']"
                :options="occupationList"
                type="checkbox"
                inline
              />
            </div>
          </div>

          <q-separator class="q-my-sm" style="background-color:transparent"/>

          <div class="row q-pl-sm">
            <div class="col-3">{{ $t('backOrder.transactionType') }}</div>
            <div class="col-5">{{ $t('backOrder.employmentType') }}</div>
          </div>
          <div class="row">
            <div class="col-3">
              <q-option-group
                v-model="searchData['transactiontype']"
                :options="applicantClassification"
                type="checkbox"
                inline
              />
            </div>
            <div class="col-5">
              <q-option-group
                v-model="searchData['employmenttype']"
                :options="employmentTypeOption"
                type="checkbox"
                inline
              />
            </div>
          </div>
        </q-card-section>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";
.date-input-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
</style>
