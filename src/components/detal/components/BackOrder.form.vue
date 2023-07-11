<template>
  <q-card style="width: 1000px; max-width: 80vw" class="no-scroll">
    <q-form  @submit="addBackOrder">
      <q-card-section>
        <span>BO</span>{{$t('common.edit')}}
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row">
          <div class="col-2 text-right q-pr-md">
            {{$t('detal.boList.clientCorporationName')}}
          </div>
          <div class="col-10">
            {{client.name}}
          </div>
        </div>
        <div class="row">
          <div class="col-2 text-right q-pr-md">
            {{$t('client.add.officeName')}}
          </div>
          <div class="col-10">
            {{client.office_name}}
          </div>
        </div>
        <div class="row">
          <div class="col-2 text-right q-pr-md">
            {{$t('client.add.manager')}}
          </div>
          <div class="col-10">
            {{client.manager}}
          </div>
        </div>
      </q-card-section>

      <q-scroll-area style="height: 65vh; max-width: 100%;">
        <q-card-section >
          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.caseType') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-radio
                v-for="key in TypeOfCase"
                v-model="boData['typeCase']"
                :label="$t('applicant.add.'+key)"
                :val="key"
                :key="key"
                class="q-pr-md"/>
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.reqQualification') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-radio
                v-for="key in TypeQualifications"
                v-model="boData['qualifications']"
                :label="$t('applicant.add.'+key)"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
                :val="key"
                :key="key"
                class="q-pr-md"/>
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.experienceReq') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['experience']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.moreHalfYearExp') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-toggle
                outlined
                dense
                v-model="boData['moreHalfYearExp']"
                :label="boData['moreHalfYearExp']?$t('client.backOrder.necessary'):$t('client.backOrder.unnecessary')"/>
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.upperAgeLimit') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense type="number" v-model="boData['ageLimit']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.employmentStatus') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-radio
                v-for="key in BackOrderStatus"
                v-model="boData['status']"
                :label="$t('client.backOrder.'+key)"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
                :val="key"
                :key="key"
                class="q-pr-md"/>
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.retirementAge') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['retirementAge']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.hourlywage') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['hourlywage']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.monthlySalary') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['monthlySalary']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.bonuses') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['buissnesDescription']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.dispatchPrice') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['unitPrice']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.payday') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['payday']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.transportationExpenses') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['transportationExpenses']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingDays') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['workingDays']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingDaysWeek') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-radio
                v-for="key in WorkingDaysWeek"
                v-model="boData['workingDaysWeek']"
                :label="$t('weekDay.'+key)"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
                :val="key"
                :key="key"
                class="q-pr-md"/>
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingHoursEarly') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['workingHoursEarly']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingHoursDay') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['workingHoursDay']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingHoursLate') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['workingHoursLate']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.workingHoursNight') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['workingHoursNight']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.businessContent') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['businessContent']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.onCallPickUP') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['onCallPickUP']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.overtimeHours') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['overtimeHours']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.holidaysWeekly') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['holidaysWeekly']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.holidayAnnual') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['holidayAnnual']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.leaveChildcare') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['leaveChildcare']" />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-2 text-right self-center q-pr-sm">
              {{ $t('client.backOrder.otherNotes') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input outlined dense v-model="boData['otherNotes']" />
            </div>
          </div>
        </q-card-section>
      </q-scroll-area>

      <q-card-actions align="right" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn :label="$t('common.save')" color="primary" class="no-shadow" type="submit"/>
        <q-btn :label="$t('common.cancel')" color="grey-8" outline />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import {
  TypeOfCase,
  TypeQualifications,
  BackOrderStatus,
  WorkingDaysWeek
} from 'src/shared/model/BackOrder.model';
import { ref, SetupContext } from 'vue';
import { addDoc, collection, getFirestore, serverTimestamp } from '@firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'BackOrderForm',
  props: {
    client: {
      type: Object,
      required: true,
    },
    BOcontent:{
      type: Object,
      required: false,
    }
  },
  setup(props, context: SetupContext){
    const db = getFirestore();

    const boData = ref({
      requiredService: []
    });

    const addBackOrder= async () => {
      let data = JSON.parse(JSON.stringify(boData.value));
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;

      const clientRef = collection(db, 'clients/' + props.client.clientId + '/backOrder/');
      await addDoc(clientRef, data);

      context.emit('closeDialog')
      Alert.success()
    };
    return {
      boData,
      TypeOfCase,
      TypeQualifications,
      BackOrderStatus,
      WorkingDaysWeek,
      addBackOrder,
    }
  }
}
</script>

<style>

</style>
