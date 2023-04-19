<template>
  <q-card-section>
    <div class="row text-primary text-h6" >
      {{ $t('backOrder.create.employmentConditions') }}
    </div>
    <div class="row">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.numberWorkingDays') }}
      </div>
      <div class="col-10">
        <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading"
          :label="day.label" :val="day.value" v-model="data['daysPerWeekList']" />
      </div>
    </div>

    <div class="row">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.workingDays') }}
      </div>
      <div class="col-10">
        <q-radio :disable="loading" :label="$t('backOrder.workingDays.shiftSystem')" 
        val="shiftSystem" v-model="data['workingDays']" />
        <q-radio :disable="loading" :label="$t('backOrder.workingDays.fixed')" 
        val="fixed" v-model="data['workingDays']" />
      </div>
    </div>

    <div class="row">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.workingDays') }}
      </div>
      <div class="col-10">
        <q-checkbox v-model="data['working_days_week']" val="sunday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.sunday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="monday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.monday')" />
        <q-checkbox  class="q-ml-sm" v-model="data['working_days_week']" val="tuesday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.tuesday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="wednesday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.wednesday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="thursday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.thursday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="friday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.friday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="saturday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.saturday')" />
        <q-checkbox class="q-ml-sm" v-model="data['working_days_week']" val="holiday" :disable="loading || data['workingDays'] == 'shiftSystem'"
          :label="$t('weekDay.holiday')" />
      </div>
    </div>

    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('client.backOrder.workingHoursEarly') }}
      </div>
      <div class="col-10 flex">
        <q-input v-model="data['workingHoursEarly_min']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input v-model="data['workingHoursEarly_max']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </div>
    </div>
    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('client.backOrder.workingHoursDay') }}
      </div>
      <div class="col-10 flex">
        <q-input v-model="data['workingHoursDay_min']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input v-model="data['workingHoursDay_max']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </div>
    </div>
    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('client.backOrder.workingHoursLate') }}
      </div>
      <div class="col-10 flex">
        <q-input v-model="data['workingHoursLate_min']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input v-model="data['workingHoursLate_max']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </div>
    </div>
    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('client.backOrder.workingHoursNight') }}
      </div>
      <div class="col-10 flex">
        <q-input v-model="data['workingHoursNight_min']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input v-model="data['workingHoursNight_max']" outlined dense type="number" :disable="loading" />
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </div>
    </div>

    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.shiftRemarks') }}
      </div>
      <div class="col-10">
        <q-input  dense outlined bg-color="white"
          v-model="data['shiftRemarks']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.existence') }}
      </div>
      <div class="col-10 flex ">
        <q-toggle v-model="data['existence']" :label="$t('backOrder.create.existence')" />
        <span class="flex-center q-pa-sm q-pl-md">{{ $t('backOrder.create.overtimeRemarks') }}</span>
        <q-input  dense outlined bg-color="white"
          v-model="data['overtimeRemarks']" :disable="loading || !data['existence']" />
      </div>
    </div>

    <div class="row q-pt-sm">
      <div class="q-pl-md col-2 text-blue text-weight-regular self-center">
        {{ $t('backOrder.create.annualHolidays') }}
      </div>
      <div class="col-10 flex">
        <q-input v-model="data['annualHolidays']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </div>
    </div>

  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { DaysPerWeekList } from 'src/shared/constants/BackOrder.const';
import { ref } from 'vue';

const props = defineProps<{
  backOrder: BackOrderModel,
  loading: boolean
}>()
const data = ref(props.backOrder)
</script>

<style>

</style>