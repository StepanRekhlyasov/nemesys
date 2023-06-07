<template>
  <DropDownEditGroup
    :isEdit="desiredEdit"
    :label="'1.'+ $t('applicant.attendant.desiredConditions')"
    @openEdit="desiredEdit = true"
    @closeEdit="desiredEdit=false; resetData();"
    @onSave="saveDesired">

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.timeToWork') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ data['timeAvailable'] ? timestampToDateFormat(applicant.timeToWork) : timestampToDateFormat(applicant.attendingDate) }}</span>
        <template v-if="desiredEdit">
          <q-checkbox v-model="data['timeAvailable']" 
          :label="data['timeAvailable']? $t('applicant.attendant.firstPayment') : $t('applicant.attendant.sameDay')"/>
          <q-input v-if="data['timeAvailable']" dense outlined bg-color="white" v-model="data['timeToWork']"  :disable="loading">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['timeToWork']" mask="YYYY/MM/DD">
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
          v-model="data['daysToWork']" :disable="loading" type="number" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.daysPerWeek') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ daysPerWeekComputed }}</span>
        <template v-if="desiredEdit">
          <q-option-group 
            type="checkbox"
            :disable="loading"
            :options="days"
            v-model="data['daysPerWeek']" 
          />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.specialDay') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ specialDayComputed }}</span>
        <template v-if="desiredEdit">
          <q-option-group 
            type="checkbox"
            :disable="loading"
            :options="specialDays"
            v-model="data['specialDay']" 
          />
        </template>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.earlyShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursEarly?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="data['workingHoursEarly']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.dayShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursDay?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="data['workingHoursDay']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.lateShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursLate?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="data['workingHoursLate']" />
      </div>
      <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('office.nightShift') }}
      </div>
      <div class="col-2 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ applicant.workingHoursNight?'●': '✕' }}</span>
        <q-checkbox v-if="desiredEdit" v-model="data['workingHoursNight']" />
      </div>

    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.shiftRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.shiftRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['shiftRemarks']" :disable="loading" />
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
          v-model="data['meansCommuting']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.route') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.route" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['route']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTime') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTime" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['commutingTime']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.nearestStation') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.nearestStation" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['nearestStation']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTimeRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTimeRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['commutingTimeRemarks']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.facilityDesired') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ joinFacilityDesired }}</span>
        <q-select outlined dense multiple :options="facilityOp" 
          use-chips emit-value map-options v-if="desiredEdit"  option-label="name"
          v-model="data['facilityDesired']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.ngFacilityType') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ joinFacilityType }}</span>
        <q-select outlined dense multiple :options="facilityOp"
          use-chips emit-value map-options v-if="desiredEdit" option-label="name"
          v-model="data['ngFacilityType']" :disable="loading"/>
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
          v-model="data['hourlyRate']" :disable="loading" type="number" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.transportationServices') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.transportationServices? $t('applicant.attendant.'+applicant.transportationServices) : '' }}</span>
        <q-select v-if="desiredEdit" outlined dense :options="transportationServicesOptions"
        emit-value map-options v-model="data['transportationServices']" :disable="loading"/>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.jobSearchPriorities') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities1 ? '① '+applicant.jobSearchPriorities1 : ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['jobSearchPriorities1']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities2 ? '② ' + applicant.jobSearchPriorities2: ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['jobSearchPriorities2']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.jobSearchPriorities3 ? '③ ' + applicant.jobSearchPriorities3: ''" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white"
          v-model="data['jobSearchPriorities3']" :disable="loading" />
      </div>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import { daysList, PossibleTransportationServicesList, specialDaysList } from 'src/shared/constants/Applicant.const';
import { computed, ref } from 'vue';
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { Applicant, ApplicantInputs } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { timestampToDateFormat } from 'src/shared/utils/utils';
import { facilityOp } from 'src/pages/user/Clients/consts/facilityType.const';
import { i18n } from 'boot/i18n';

const props = defineProps<{
  applicant: Applicant
}>()
const applicantStore = useApplicant();
const { t } = i18n.global
const desiredEdit = ref(false);
const days = ref(daysList);
const specialDays = ref(specialDaysList);
const loading = ref(false);
const transportationServicesOptions = ref(PossibleTransportationServicesList);
const defaultData = ref<Partial<ApplicantInputs>>({})
const data = ref<Partial<ApplicantInputs>>({})

const daysPerWeekComputed = computed(()=>{
  if(Array.isArray(props.applicant.daysPerWeek)){
    return props.applicant.daysPerWeek.map(day => t('weekDay.'+day)).join('・')
  }
  return ''
})

const specialDayComputed = computed(()=>{
  if(Array.isArray(props.applicant.specialDay)){
    return props.applicant.specialDay.map(day => t('applicant.attendant.specialDays.'+day)).join('・')
  }
  return ''
})


function resetData() {
  defaultData.value = {
    timeToWork: timestampToDateFormat(props.applicant['timeToWork']),
    daysToWork: props.applicant['daysToWork'],
    daysPerWeek: Array.isArray(props.applicant['daysPerWeek'])?props.applicant['daysPerWeek']:[],
    timeAvailable: props.applicant['timeAvailable'] || false,
    specialDay: Array.isArray(props.applicant['specialDay'])?props.applicant['specialDay']:[],
    shiftRemarks: props.applicant['shiftRemarks'],
    meansCommuting: props.applicant['meansCommuting'],
    nearestStation: props.applicant['nearestStation'],
    commutingTime: props.applicant['commutingTime'],
    commutingTimeRemarks: props.applicant['commutingTimeRemarks'],
    facilityDesired: props.applicant['facilityDesired'] || [],
    ngFacilityType: props.applicant['ngFacilityType'] || [],
    hourlyRate: props.applicant['hourlyRate'],
    transportationServices: props.applicant['transportationServices'],
    jobSearchPriorities1: props.applicant['jobSearchPriorities1'],
    jobSearchPriorities2: props.applicant['jobSearchPriorities2'],
    jobSearchPriorities3: props.applicant['jobSearchPriorities3'],
    workingHoursEarly: props.applicant['workingHoursEarly'] || false,
    workingHoursDay: props.applicant['workingHoursDay'] || false,
    workingHoursLate: props.applicant['workingHoursLate'] || false,
    workingHoursNight: props.applicant['workingHoursNight'] || false,
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData();

const joinFacilityType = computed(() => props.applicant.ngFacilityType?.map(val => t(`client.add.facilityOp.${val}`)).join(', '))
const joinFacilityDesired = computed(() => props.applicant.facilityDesired?.map(val => t(`client.add.facilityOp.${val}`)).join(', '))

async function saveDesired(){
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    desiredEdit.value = false;
  } catch (error) {
    console.log(error);
  }
  loading.value = false
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
