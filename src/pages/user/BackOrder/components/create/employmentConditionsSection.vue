<template>
  <q-card-section>
    <div class="row text-primary text-h6 q-pt-md" >
      {{ $t('backOrder.create.employmentConditions') }}
    </div>
    <div class="row">
      <labelField :label="$t('backOrder.create.numberWorkingDays')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10" required>
        <q-field v-model="data['daysPerWeekList']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading"
            :label="day.label" :val="day.value" v-model="data['daysPerWeekList']" />
        </q-field>
      </labelField>
    </div>

    <div class="row">
      <labelField :label="$t('backOrder.create.workingDays')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10" required>
        <q-field v-model="data['workingDays']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.shiftSystem')" 
          val="shiftSystem" v-model="data['workingDays']" />
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.fixed')" 
          val="fixed" v-model="data['workingDays']" />
        </q-field>
      </labelField>
    </div>

    <div class="row" v-if="data['workingDays'] == 'fixed'">      
      <labelField :label="$t('backOrder.create.workingDays')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10" required>
        <q-field v-model="data['working_days_week']" borderless hide-bottom-space :rules="[creationRule]">
          <q-checkbox v-model="data['working_days_week']" v-for="day in daysList" 
            :val="day.value" :disable="loading || data['workingDays'] == 'shiftSystem'"
            :label="day.label" :key="day.value" />
        </q-field>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <labelField :label="$t('client.backOrder.workingHoursEarly')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex" required>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursEarly_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursEarly_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </labelField>
    </div>
    <div class="row q-pt-sm">
      <labelField :label="$t('client.backOrder.workingHoursDay')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex" required>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursDay_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursDay_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </labelField>
    </div>
    <div class="row q-pt-sm">
      <labelField :label="$t('client.backOrder.workingHoursLate')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex" required>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </labelField>
    </div>
    <div class="row q-pt-sm">
      
      <labelField :label="$t('client.backOrder.workingHoursNight')" :edit="true" 
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="q-pl-md col-10 flex" required>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </labelField>
    </div>

    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-right text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.shiftRemarks') }}
      </div>
      <div class="col-10 q-pl-md ">
        <q-input  dense outlined bg-color="white"
          v-model="data['shiftRemarks']" :disable="loading" />
      </div>
    </div>
    
    <div class="row q-pt-sm" v-if="type === 'referral'">
      <div class="q-pl-md col-2 text-right text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.overtimeWork') }} <span style="color: red">*</span>
      </div>
      <div class="col-4 q-pl-md ">
        <q-field                
          ref="toggle" borderless dense
          v-model="data['overtimeWork']"
          :rules="[creationRule]" hide-bottom-space> 
          <template v-slot:control>                    
            <q-radio v-model="data['overtimeWork']" val="yes" :label="$t('common.yes')" />
            <q-radio v-model="data['overtimeWork']" val="no" :label="$t('common.without')" />
          </template>
        </q-field>
      </div>
      <div class="q-pl-md col-2 text-right text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.overtimeRemarks') }}
      </div>
      <div class="col-4 flex q-pl-md self-center ">
        <q-input  dense outlined bg-color="white" v-model="data['overtimeRemarks']" :disable="loading || data['overtimeWork'] !== 'yes'" />
      </div>
    </div>

    <div class="row q-pt-sm" v-if="type=='referral'">
      <div class="q-pl-md col-2 text-right text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.annualHolidays') }}
      </div>
      <div class="col-4 flex q-pl-md ">
        <q-input v-model="data['annualHolidays']" outlined dense type="number" :disable="loading" min="0" max="365"/>
        <span class="q-ma-sm flex-center">{{ $t('weekDay.sunday') }}</span>
      </div>
    </div>

  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { DaysPerWeekList } from 'src/shared/constants/BackOrder.const';
import { ref, watch} from 'vue';
import labelField from 'src/components/form/LabelField.vue';
import { daysList } from 'src/shared/constants/Applicant.const';
import { validateTime } from 'src/shared/constants/Form.const';
import { creationRule } from 'src/components/handlers/rules';
const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  type: 'dispatch' | 'referral'
}>()
const data = ref(props.backOrder)

watch([props], () => {
  data.value = props.backOrder
}, { deep: true })
</script>

<style>

</style>