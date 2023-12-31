<template>
  <DropDownEditGroup :isHiddenActions="bo ? true : false" :isEdit="desiredEdit"
    :label="'1.' + $t('applicant.attendant.desiredConditions')" @openEdit="desiredEdit = true"
    @closeEdit="desiredEdit = false; resetData();" @onSave="saveDesired">

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.timeToWork') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!desiredEdit">{{ !data['timeAvailable'] ? myDateFormat(applicant.timeToWork, 'YYYY/MM/DD') :
          $t('applicant.attendant.sameDay') }}</span>
        <template v-if="desiredEdit">
          <q-toggle v-model="data['timeAvailable']"
            :class="!data['timeAvailable']?'lowOpacity':''"
            :label="!data['timeAvailable'] ? $t('applicant.attendant.sameDay') : $t('applicant.attendant.sameDay')" />
          <q-input v-if="!data['timeAvailable']" dense outlined bg-color="white" v-model="data['timeToWork']"
            :disable="loading" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="data['timeToWork']" mask="YYYY/MM/DD"
                  :navigation-min-year-month="nextMonth"
                  :default-year-month="nextMonth"
                  >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
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
        <span v-if="!desiredEdit">{{ applicant.daysToWork ? applicant.daysToWork +
          '' + $t('applicant.attendant.days') : '' }}</span>
        <q-input v-if="desiredEdit" dense outlined bg-color="white" min="1" max="7" v-model="data['daysToWork']"
          :disable="loading" type="number" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.daysPerWeek') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ daysPerWeekComputed }}</span>
        <template v-if="desiredEdit">
          <q-option-group type="checkbox" :disable="loading" :options="days" v-model="data['daysPerWeek']" class="flex" />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.specialDay') }}
      </div>
      <div class="col-9 q-pl-md blue self-center">
        <span v-if="!desiredEdit">{{ specialDayComputed }}</span>
        <template v-if="desiredEdit">
          <q-option-group type="checkbox" :disable="loading" :options="specialDays" v-model="data['specialDay']"
            class="flex" />
        </template>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.availableShift') }}
      </div>
      <div class="col-9 flex">
        <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('office.earlyShift') }}
        </div>
        <div class="col-1 q-pl-md blue self-center">
          <span v-if="!desiredEdit">{{ applicant.workingHoursEarly }}</span>
          <q-select v-if="desiredEdit" v-model="data['workingHoursEarly']" :options="shiftOptions" emit-value dense
            style="width:40px" />
        </div>
        <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('office.dayShift') }}
        </div>
        <div class="col-1 q-pl-md blue self-center">
          <span v-if="!desiredEdit">{{ applicant.workingHoursDay }}</span>
          <q-select v-if="desiredEdit" v-model="data['workingHoursDay']" :options="shiftOptions" emit-value dense
            style="width:40px" />
        </div>
        <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('office.lateShift') }}
        </div>
        <div class="col-1 q-pl-md blue self-center">
          <span v-if="!desiredEdit">{{ applicant.workingHoursLate }}</span>
          <q-select v-if="desiredEdit" v-model="data['workingHoursLate']" :options="shiftOptions" emit-value dense
            style="width:40px;" />
        </div>
        <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('office.nightShift') }}
        </div>
        <div class="col-1 q-pl-md blue self-center">
          <span v-if="!desiredEdit">{{ applicant.workingHoursNight }}</span>
          <q-select v-if="desiredEdit" v-model="data['workingHoursNight']" :options="shiftOptions" emit-value dense
            style="width:40px;" />
        </div>
        <div class="col-1 q-pl-md text-right text-blue text-weight-regular self-center">
          {{ $t('applicant.list.info.shortTime') }}
        </div>
        <div class="col-1 q-pl-md blue self-center">
          <span v-if="!desiredEdit">{{ applicant.shortTime ? '✓' : '×' }}</span>
          <q-checkbox v-if="desiredEdit" v-model="data['shortTime']" />
        </div>
      </div>

    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.shiftRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.shiftRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.meansCommuting') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit && Array.isArray(applicant.meansCommuting)">
          {{ applicant.meansCommuting.map((row) => $t('applicant.attendant.meansCommutingOptions.' + row)).join('・') }}
        </span>
        <template v-if="desiredEdit">
          <q-checkbox dense outlined bg-color="white" v-model="data['meansCommuting']" :disable="loading"
            v-for="option in meansCommutingOptions" :val="option.value" :label="option.label" :key="option.value"
            class="q-mr-sm" />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.route') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.route" />
        <q-select v-if="desiredEdit" outlined v-model="data['route']" dense :options="routeData" :disable="loading"
          use-input input-debounce="0" @filter="filterRoute" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTime') }}
      </div>
      <div class="col-3 q-pl-md blue flex items-center">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTime?.toString()" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white" v-model="data['commutingTime']" :disable="loading"
          type="text" />
        <span class="q-ml-sm" v-if="data['commutingTime'] || desiredEdit">分</span>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.nearestStation') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.nearestStation" />

        <q-select v-if="desiredEdit" outlined v-model="data['nearestStation']" :options="stationData"
          :disable="loading" dense use-input input-debounce="0" @filter="filterStation" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.commutingTimeRemarks') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit" :value="applicant.commutingTimeRemarks" />
        <q-input v-if="desiredEdit" dense outlined bg-color="white" v-model="data['commutingTimeRemarks']"
          :disable="loading" />
      </div>
    </div>

    <div class="row q-pa-md"></div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.facilityDesired') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ joinFacilityDesired }}</span>
        <q-select outlined dense multiple :options="facilityTypeOptions" use-chips emit-value map-options v-if="desiredEdit"
          option-label="name" v-model="data['facilityDesired']" :disable="loading" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.ngFacilityType') }}
      </div>
      <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots">{{ joinFacilityType }}</span>
        <q-select outlined dense multiple :options="facilityTypeOptions" use-chips emit-value map-options
          option-label="name" v-model="data['ngFacilityType']" :disable="loading" v-if="desiredEdit"/>
      </div>
    </div>
    <div class="row q-pb-sm">
       <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
         {{ $t('clientFactory.fax.clientNG') }}
       </div>
       <div class="col-9 q-pl-md blue ">
        <span v-if="!desiredEdit" class="text_dots q-mt-sm">{{ formattedNgClients }}</span>
        <q-select outlined dense multiple use-chips :options="clients"
          option-label="name" v-model="data['ngClient']" :disable="loading" v-if="desiredEdit"
          use-input input-debounce="0"  class="custom-q-select" emit-value map-options @filter="filterClients"/>
       </div>
     </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.hourlyRate') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!desiredEdit">{{ applicant.hourlyRate ? parseInt(applicant.hourlyRate).toLocaleString('en-US')
          + ' ' + $t('common.yen') : '' }}</span>
        <div v-if="desiredEdit" class="flex items-center no-wrap">
          <q-input
            dense
            outlined
            bg-color="white"
            min="0"
            v-model="data['hourlyRate']"
            :disable="loading"
          />
          <span class="q-ml-sm">{{ $t('common.yen') }}</span>
        </div>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.transportationServices') }}
      </div>
      <div class="col-3 q-pl-md blue flex items-center">
        <span v-if="!desiredEdit">{{ applicant.transportationServices ?
          $t('applicant.attendant.' + applicant.transportationServices) : '' }}</span>
        <div v-if="desiredEdit" clas="flex">
          <q-radio v-for="option in transportationServicesOptions" outlined dense v-model="data['transportationServices']"
            :disable="loading" :val="option.value" :label="option.label" :key="option.value" class="q-mr-sm" />
        </div>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.jobSearchPriorities') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <hidden-text v-if="!desiredEdit"
          :value="applicant.jobSearchPriorities1 ? '① ' + applicant.jobSearchPriorities1 : ''" />
        <label v-if="desiredEdit" class="flex items-center no-wrap">
          <span class="q-mr-sm text-body1">①</span>
          <q-input dense outlined bg-color="white" v-model="data['jobSearchPriorities1']" :disable="loading"
            style="width:100%" />
        </label>
      </div>
      <div class="col-3 q-pl-sm blue ">
        <hidden-text v-if="!desiredEdit"
          :value="applicant.jobSearchPriorities2 ? '② ' + applicant.jobSearchPriorities2 : ''" />
        <label v-if="desiredEdit" class="flex items-center no-wrap">
          <span class="q-mr-sm text-body1">②</span>
          <q-input dense outlined bg-color="white" v-model="data['jobSearchPriorities2']" :disable="loading"
            style="width:100%" />
        </label>
      </div>
      <div class="col-3 q-pl-sm blue ">
        <hidden-text v-if="!desiredEdit"
          :value="applicant.jobSearchPriorities3 ? '③ ' + applicant.jobSearchPriorities3 : ''" />
        <label v-if="desiredEdit" class="flex items-center no-wrap">
          <span class="q-mr-sm text-body1">③</span>
          <q-input v-if="desiredEdit" dense outlined bg-color="white" v-model="data['jobSearchPriorities3']"
            :disable="loading" style="width:100%" />
        </label>
      </div>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import { daysList, PossibleTransportationServicesList, specialDaysList } from 'src/shared/constants/Applicant.const';
import { computed, onMounted, ref, watch , Ref} from 'vue';
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { Applicant, ApplicantInputs, BackOrderModel } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { myDateFormat } from 'src/shared/utils/utils';
import { i18n } from 'boot/i18n';
import { useMetadata } from 'src/stores/metadata';
import { where } from 'firebase/firestore'
import { Alert } from 'src/shared/utils/Alert.utils';
import {useClient} from 'src/stores/client'
import { useOrganization } from 'src/stores/organization';
import { Client } from 'src/shared/model';
import { DocumentData } from 'firebase/firestore';

const props = defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()
const clients:Ref<Client[]> = ref([]);
const organization = useOrganization()
const clientStore =useClient()
const facilityTypeOptions: { name: string }[] = [];
const applicantStore = useApplicant();
const { t } = i18n.global;
const shiftOptions = [
  { label: '○', value: '○' },
  { label: '△', value: '△' },
  { label: '×', value: '×' },
]
const desiredEdit = ref(false);
const days = ref(daysList);
const specialDays = ref(specialDaysList);
const loading = ref(false);
const transportationServicesOptions = ref(PossibleTransportationServicesList);
const defaultData = ref<Partial<ApplicantInputs>>({});
  const data = ref<Partial<ApplicantInputs>>({});
const routeData:Ref<string[]> = ref([]);
const firstSelect = ref<string>('');
const routeName:Ref<string[]> = ref([])
const stationData:DocumentData = ref([]);
const meansCommutingOptions = computed(() => [
  { value: 'walk', label: t('applicant.attendant.meansCommutingOptions.walk') },
  { value: 'bicycle', label: t('applicant.attendant.meansCommutingOptions.bicycle') },
  { value: 'car', label: t('applicant.attendant.meansCommutingOptions.car') },
  { value: 'bike', label: t('applicant.attendant.meansCommutingOptions.bike') },
  { value: 'train', label: t('applicant.attendant.meansCommutingOptions.train') },
  { value: 'bus', label: t('applicant.attendant.meansCommutingOptions.bus') },
])

const nextMonth = computed(()=>{
  let result = new Date().getFullYear()+'/'
  if(new Date().getMonth() === 11){
    result += 1
    return result
  }
  result += (new Date().getMonth()+2)
  return result
})

const daysPerWeekComputed = computed(() => {
  if (Array.isArray(props.applicant.daysPerWeek)) {
    return props.applicant.daysPerWeek.map(day => t('weekDay.' + day)).join('・')
  }
  return ''
})

const specialDayComputed = computed(() => {
  if (Array.isArray(props.applicant.specialDay)) {
    return props.applicant.specialDay.map(day => t('applicant.attendant.specialDays.' + day)).join('・')
  }
  return ''
})

const metadataStore = useMetadata()
onMounted(async () => {
  routeData.value = await metadataStore.getStationRoutes()
  clients.value =  await clientStore.getClientsByConstraints([where('organizationId', '==', organization.currentOrganizationId)])
  getFacilityTypeOptions()
  stationData.value = await metadataStore.createStationOptions()
});

watch(() => data.value['route'], async (newVal) => {
  if(!data.value['nearestStation'] && newVal){
    firstSelect.value = 'route';
  }
  else if(!data.value['nearestStation'] && !newVal){
    firstSelect.value = '';
  }
  else if(firstSelect.value==='route'){
    data.value['nearestStation'] = '';
    stationData.value = await metadataStore.getStationByID(newVal as string)
  }
}
)
watch(
  () => data.value['nearestStation'],
  async (newVal) => {
    if(!data.value['route'] && newVal){
    firstSelect.value = 'station';
  }
  else if(!data.value['route'] && !newVal){
    firstSelect.value = '';
  }
  else if(firstSelect.value==='station'){
    data.value['route'] = '';
     routeName.value = await metadataStore.getRouteByStation(data.value['nearestStation']);
      const formattedRoutes = routeName.value.map(routeName => `${data.value['nearestStation']}(${routeName})`);
      routeData.value = formattedRoutes;
  }
  }
  ,
  { deep: true , immediate:true}
);
watch(firstSelect,async (newVal)=>{
  if(newVal==='route'){
    stationData.value = await metadataStore.getStationByID(data.value['route'] as string)
  }
  else if(newVal==='station'){
    const routeName = await metadataStore.getRouteByStation(data.value['nearestStation']);
      const formattedRoutes = routeName.map(routeName => `${data.value['nearestStation']}(${routeName})`);
      routeData.value = formattedRoutes;
  }
  else{
    routeData.value = await metadataStore.getStationRoutes()
    stationData.value = await metadataStore.createStationOptions()
  }
})
watch(() => desiredEdit.value, (newVal) => {
  if (newVal) {
    data.value['nearestStation'] = props.applicant['nearestStation'];
  }
}
)
function resetData() {
  defaultData.value = {
    timeToWork: myDateFormat(props.applicant['timeToWork']),
    daysToWork: props.applicant['daysToWork'],
    daysPerWeek: Array.isArray(props.applicant['daysPerWeek']) ? props.applicant['daysPerWeek'] : [],
    timeAvailable: props.applicant['timeAvailable'] || false,
    specialDay: Array.isArray(props.applicant['specialDay']) ? props.applicant['specialDay'] : [],
    shiftRemarks: props.applicant['shiftRemarks'],
    meansCommuting: Array.isArray(props.applicant['meansCommuting']) ? props.applicant['meansCommuting'] : [],
    nearestStation: props.applicant['nearestStation'],
    commutingTime: props.applicant['commutingTime'] || 0,
    commutingTimeRemarks: props.applicant['commutingTimeRemarks'],
    facilityDesired: props.applicant['facilityDesired'] || [],
    ngFacilityType: props.applicant['ngFacilityType'] || [],
    ngClient: props.applicant['ngClient'] || [],
    hourlyRate: props.applicant['hourlyRate'],
    transportationServices: props.applicant['transportationServices'],
    jobSearchPriorities1: props.applicant['jobSearchPriorities1'],
    jobSearchPriorities2: props.applicant['jobSearchPriorities2'],
    jobSearchPriorities3: props.applicant['jobSearchPriorities3'],
    workingHoursEarly: props.applicant['workingHoursEarly'] || '×',
    workingHoursDay: props.applicant['workingHoursDay'] || '×',
    workingHoursLate: props.applicant['workingHoursLate'] || '×',
    workingHoursNight: props.applicant['workingHoursNight'] || '×',
    shortTime: props.applicant['shortTime'] || false,
    route: props.applicant['route'],
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData();

const joinFacilityType = computed(() =>
  props.applicant.ngFacilityType?.map(option => `${option.name}`).join(', ')
);
const joinFacilityDesired = computed(() =>
  props.applicant.facilityDesired?.map(option => `${option.name}`).join(', ')
);
const formattedNgClients = computed(() => props.applicant.ngClient?.map(val => (`${val.name}`)).join(', '))
async function saveDesired() {
  loading.value = true;
  try {
    data.value['commutingTime'] = Number(data.value['commutingTime']);
    await applicantStore.updateApplicant(data.value);
    desiredEdit.value = false;

  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}

const getFacilityTypeOptions = () => {
  if (props.applicant.industry && props.applicant.industry.uniqueItems && props.applicant.industry.uniqueItems.facilityForms) {
    const industryArray = Object.values(props.applicant.industry.uniqueItems.facilityForms).map(formData => ({
      name: formData.title,
    }));

    facilityTypeOptions.push(...industryArray);
  }
};

const filterStation = async (val: string, update) => {
  if(val === '' && data.value['route']?.includes('(') && data.value['route'].includes(')') && !data.value.nearestStation){
    stationData.value = await metadataStore.createStationOptions()
    data.value['route'] = ''
    routeData.value = []
  }
  else if(val === '' && data.value['route']?.includes('(') && data.value['route'].includes(')')){
    const routeSubstring = data.value['route'].match(/\(([^)]+)\)/)?.[1];

if (routeSubstring) {
  stationData.value = await metadataStore.getStationByID(routeSubstring)
}
  }
  else if (val === '' && data.value.route ) {
    update(async () => {
      if(data.value['route']?.includes('(') && data.value['route'].includes(')')){
        stationData.value = await metadataStore.createStationOptions()
      }
      stationData.value = await metadataStore.getStationByID(data.value['route'] as string)
    })
    return
  }
  else{
    stationData.value = await metadataStore.createStationOptions()
  }
  update(async() => {
    const needle = val.toLowerCase()
    stationData.value = stationData.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};

const filterRoute = async (val: string, update) => {
  if (val === '' && !routeData.value.some(route => route.includes('('))) {
    update(async () => {
      routeData.value = await metadataStore.getStationRoutes();
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    routeData.value = routeData.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};
const filterClients = (val:string, update) => {
  if (val === '') {
    update(async() => {
    clients.value =  await clientStore.getClientsByConstraints([where('organizationId', '==', organization.currentOrganizationId)])
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase()
    clients.value = clients.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
  });
};
</script>
<style lang="scss">
.text_dots {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.lowOpacity{
  .q-toggle__label{
    opacity: 0.5;
  }
}
</style>
