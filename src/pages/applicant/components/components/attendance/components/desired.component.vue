<template>
  <edit-view-component
    :edit="desiredEdit"
    :label="'1.'+ $t('applicant.attendant.desiredConditions')"
    @openEdit="desiredEdit = true"
    @closeEdit="desiredEdit=false"
    @onSave="saveDesired">

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.timeToWork') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.timeToWork }}</span>
        <template v-if="desiredEdit">
          <q-checkbox v-model="desiredData['timeAvailable']" 
          :label="desiredData['timeAvailable']? $t('applicant.attendant.firstPayment') : $t('applicant.attendant.sameDay')"/>
          <q-input v-if="desiredData['timeAvailable']" dense outlined bg-color="white" v-model="desiredData['timeToWork']"  :disable="loading">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="desiredData['timeToWork']" mask="YYYY/MM/DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.daysToWork') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.daysToWork?applicant.daysToWork+' '+$t('applicant.attendant.days'):''}}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white" min="1" max="7"
          v-model="desiredData['daysToWork']" :disable="loading" type="number" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.daysPerWeek') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.daysPerWeek?applicant.daysPerWeek.map(day => $t('weekDay.'+day)).join('・'): '' }}</span>
        <template v-if="desiredEdit">
          <q-checkbox v-for="day in days" :key="day.value" :disable="loading"
            :label="day.label" :val="day.value" v-model="desiredData['daysPerWeek']" />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.specialDay') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.specialDay? applicant.specialDay.map(day => $t('applicant.attendant.specialDays.'+day)).join('・'): '' }}</span>
        <template v-if="desiredEdit">
          <q-checkbox v-for="day in specialDays" :key="day.value" :disable="loading"
            :label="day.label" :val="day.value" v-model="desiredData['specialDay']" />
        </template>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.earlyShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursEarly?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="desiredData['workingHoursEarly']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.dayShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursDay?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="desiredData['workingHoursDay']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.lateShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursLate?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="desiredData['workingHoursLate']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.nightShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursNight?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="desiredData['workingHoursNight']" />
      </div>

    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.shiftRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.shiftRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['shiftRemarks']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.meansCommuting') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.meansCommuting }}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['meansCommuting']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.nearestStation') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.nearestStation" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['nearestStation']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTime') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTime" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['commutingTime']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.route') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.route" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['route']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTimeRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTimeRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['commutingTimeRemarks']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.facilityDesired') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ applicant.facilityDesired }}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['facilityDesired']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.ngFacilityType') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ applicant.ngFacilityType }}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['ngFacilityType']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.hourlyRate') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.hourlyRate?applicant.hourlyRate+' '+$t('common.yen'):''}}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white" min="0"
          v-model="desiredData['hourlyRate']" :disable="loading" type="number" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.transportationServices') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.transportationServices? $t('applicant.attendant.'+applicant.transportationServices) : '' }}</span>
        <q-select v-if="desiredEdit" outlined dense :options="transportationServicesOptions"
        emit-value map-options v-model="desiredData['transportationServices']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.jobSearchPriorities') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities1 ? '① '+applicant.jobSearchPriorities1 : ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['jobSearchPriorities1']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities2 ? '② ' + applicant.jobSearchPriorities2: ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['jobSearchPriorities2']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities3 ? '③ ' + applicant.jobSearchPriorities3: ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="desiredData['jobSearchPriorities3']" :disable="loading" />
      </div>
    </div>
  </edit-view-component>
</template>

<script lang="ts">
import { daysList, PossibleTransportationServicesList, specialDaysList } from 'src/shared/constants/Applicant.const';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import hiddenText from 'src/components/hiddingText.component.vue';
import editViewComponent from 'src/components/editView.component.vue';

export default {
  name: 'desiredConditions',
  components: {
    hiddenText,
    editViewComponent
  },
  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const desiredEdit = ref(false);
    const days = ref(daysList);
    const specialDays = ref(specialDaysList);
    const loading = ref(false);
    const transportationServicesOptions = ref(PossibleTransportationServicesList)

    const desiredData = ref({
      timeToWork: props.applicant['timeToWork'] || '',
      daysToWork: props.applicant['daysToWork'] || '',
      daysPerWeek: props.applicant['daysPerWeek'] || [],
      timeAvailable: props.applicant['timeAvailable'] || false,
      specialDay: props.applicant['specialDay'] || [],
      shiftRemarks: props.applicant['shiftRemarks'] || '',
      meansCommuting: props.applicant['meansCommuting'] || '',
      nearestStation: props.applicant['nearestStation'] || '',
      commutingTime: props.applicant['commutingTime'] || '',
      commutingTimeRemarks: props.applicant['commutingTimeRemarks'] || '',
      facilityDesired: props.applicant['facilityDesired'] || '',
      ngFacilityType: props.applicant['ngFacilityType'] || '',
      hourlyRate: props.applicant['hourlyRate'] || '',
      transportationServices: props.applicant['transportationServices'] || '',
      jobSearchPriorities: props.applicant['jobSearchPriorities'] || [],
    })

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();

    return {
      desiredEdit,
      loading,
      desiredData,
      specialDays,
      days,
      transportationServicesOptions,

      async saveDesired(){
        loading.value = true
        try {
          await props.updateApplicant(desiredData.value);
          Alert.success($q, t);
          desiredEdit.value = false;
        } catch (error) {
          console.log(error);
          loading.value = false;
          Alert.warning($q, t);
        }
        loading.value = false
      },
    }
  }
}
</script>

<style lang="scss">
.text_dots{
  display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
