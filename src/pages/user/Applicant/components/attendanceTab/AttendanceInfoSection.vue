<template>
  <div class="row q-pb-md">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn v-if="!infoEdit && !bo" :label="$t('common.edit')" color="primary" outline  icon="edit"
        @click="infoEdit = true" class="no-shadow q-ml-lg" size="sm" :disable="!applicant.attractionsStatus"/>
      <q-btn v-if="infoEdit" :label="$t('common.save')" color="primary" @click="saveHandler" size="sm"/>
      <q-btn v-if="infoEdit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="infoEdit=false; resetData();" size="sm" />
    </div>
  </div>

  <div class="row q-pb-sm">
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.attendantStatus') }}
    </div>
    <div class="col-2 q-pl-md blue self-center">
      <span v-if="!infoEdit" class="text-uppercase">{{ applicant?.attendingStatus === true ? 'OK' : applicant?.attendingStatus === false ? 'NG' : '-'}}</span>
      <template v-if="infoEdit">
        <q-checkbox v-model="data['attendingStatus']" label="OK" checked-icon="mdi-checkbox-intermediate"
            unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
        <q-checkbox v-model="data['attendingStatus']" label="NG" unchecked-icon="mdi-checkbox-intermediate"
          checked-icon="mdi-checkbox-blank-outline" color="primary"/>
      </template>
    </div>
    <div class="row q-pb-sm q-pt-sm col-12" v-if="!data['attendingStatus']">
        <NGReasonSelect
          :value="data[reasonKey]?$t('applicant.list.fixEmployment.' + data[reasonKey]) + (data[detailKey]?' (' + $t('applicant.list.fixEmployment.' + data[detailKey])+ ')':''):''"
          :edit="infoEdit"
          :label="$t('applicant.list.fixEmployment.'+reasonKey)"
          :reasonValue="data[reasonKey]"
          @update:reasonValue="(newValue : string) => data[reasonKey] = newValue"
          :detailedValue="data[detailKey]"
          @update:detailedValue="(newValue : string) => data[detailKey] = newValue"
          :disable="loading"
          :hightlightError="hightlightError"
          :labelClass="'col-2 q-pl-md text-right self-center'"
        />
      </div>
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.day') }}
    </div>
    <div class="col-2 q-pl-md  blue self-center">
      <span v-if="!infoEdit">{{ myDateFormat(applicant.attendingDate, 'YYYY/MM/DD HH:mm') }}</span>
      <q-input v-if="infoEdit" dense outlined bg-color="white" v-model="data['attendingDate']"  :disable="loading">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="data['attendingDate']" mask="YYYY/MM/DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="data['attendingDate']" mask="YYYY/MM/DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center" style="white-space: nowrap;">
      {{ $t('applicant.attendant.chargeOfAttending') }}
    </div>
    <div class="col-2 q-pl-md blue ">
      <span v-if="!infoEdit">{{
          usersListOption
            .filter(user => user.value === data['chargeOfAttending'])
            .map(user => user.label).join('')
      }}</span>
      <q-select v-if="infoEdit" outlined dense :options="usersListOption" v-model="data['chargeOfAttending']"
        bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
    </div>
  </div>

  <div class="row q-pb-sm">
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.memo') }}
    </div>
    <div class="col-10 q-pl-md blue ">
      <hidden-text v-if="!infoEdit" :value="applicant.attendanceMemo" />
      <q-input v-if="infoEdit" dense outlined bg-color="white" v-model="data['attendanceMemo']" :disable="loading"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usersInCharge } from 'src/shared/constants/Applicant.const';
import { ref } from 'vue';
import { Applicant, ApplicantInputs, BackOrderModel } from 'src/shared/model';
import hiddenText from 'src/components/hiddingText.component.vue';
import { useApplicant } from 'src/stores/applicant';
import { myDateFormat } from 'src/shared/utils/utils';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant,
  bo?:BackOrderModel
}>()

const applicantStore = useApplicant();
const infoEdit = ref(false);
const loading = ref(false);
const usersListOption = usersInCharge.value
const data = ref<Partial<ApplicantInputs>>({});
const defaultData = ref<Partial<ApplicantInputs>>({})

/** NGReasonSelect handlers */
const reasonKey = 'attendingReasonNG' /** change reason key */
const detailKey = 'attendingReasonNGDetail' /** change reason detail key */
const statusKey = 'attendingStatus' /** change status key */
const hightlightError = ref<string[]>([])
const saveHandler = async () => {
  if(useSaveHandler(data, hightlightError, reasonKey, detailKey, statusKey)){
    await saveInfo()
    resetData();
  }
}
useNGWatchers(data, hightlightError, reasonKey, detailKey, statusKey)
/** NGReasonSelect handlers */


function resetData() {
  defaultData.value = {
    attendingStatus: props?.applicant['attendingStatus'] || false,
    attendingReasonNG: props?.applicant['attendingReasonNG'],
    attendingReasonNGDetail: props?.applicant['attendingReasonNGDetail'],
    attendingDate: myDateFormat(props?.applicant['attendingDate']),
    chargeOfAttending: props?.applicant['chargeOfAttending'],
    attendanceMemo: props?.applicant['attendanceMemo'],
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData()

async function saveInfo() {
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    infoEdit.value = false;
    
  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}
</script>
