<template>
  <DropDownEditGroup :isEdit="edit" :label="$t('applicant.list.info.attraction')" @openEdit="edit = true"
    @closeEdit="resetData(); edit = false;" @onSave="saveHandler">
    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.attractionsStatus') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant?.attractionsStatus === true ? 'OK' : applicant?.attractionsStatus === false ? 'NG'
          : '-' }}</span>
        <template v-if="edit">
          <q-checkbox v-model="data['attractionsStatus']" label="OK" checked-icon="mdi-checkbox-intermediate"
            unchecked-icon="mdi-checkbox-blank-outline" color="primary" />
          <q-checkbox v-model="data['attractionsStatus']" label="NG" unchecked-icon="mdi-checkbox-intermediate"
            checked-icon="mdi-checkbox-blank-outline" color="primary" />
        </template>
      </div>
      <div class="row q-pb-sm q-pt-sm col-12" v-if="!data['attractionsStatus']">
        <NGReasonSelect
          :value="data[reasonKey] ? $t('applicant.list.fixEmployment.' + data[reasonKey]) + (data[detailKey] ? ' (' + $t('applicant.list.fixEmployment.' + data[detailKey]) + ')' : '') : ''"
          :edit="edit" :label="$t('applicant.list.fixEmployment.' + reasonKey)" :reasonValue="data[reasonKey]"
          @update:reasonValue="(newValue: string) => data[reasonKey] = newValue" :detailedValue="data[detailKey]"
          @update:detailedValue="(newValue: string) => data[detailKey] = newValue" :disable="loading"
          :hightlightError="hightlightError" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.invitationDate') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant['invitationDate']? myDateFormat(applicant['invitationDate'], 'YYYY/MM/DD HH:mm'):myDateFormat(applicant['applicationDate'], 'YYYY/MM/DD HH:mm') }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['invitationDate']">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['invitationDate']" default-view="Years" :options="limitDate">
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
                <q-time v-model="data['invitationDate']" mask="YYYY/MM/DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.employmentStatus') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{ applicant.employmentStatus ? $t('applicant.list.info.' + applicant.employmentStatus) :
          '' }}</span>
        <q-select v-if="edit" outlined dense :options="employmentStatusOption" v-model="data['employmentStatus']"
          bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.chargeOfAttraction') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{
          usersListOption
            .filter(user => user.value === data['chargeOfAttraction'])
            .map(user => user.label).join('')
        }}</span>
        <q-select v-if="edit" outlined dense :options="usersListOption" v-model="data['chargeOfAttraction']"
          bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.classiffication') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <template v-if="!edit" >
          <span v-for="item, index in applicant.classification" :key="index">{{ $t('applicant.list.info.classification.'+item.toLowerCase()) }}<template v-if="applicant.classification && applicant.classification.length > index + 1">, </template></span>
        </template>
        <template v-else>
          <q-checkbox
            v-for="option in classificationOption"
            v-model="data['classification']"
            :val="option.value"
            :label="option.label"
            :key="option.value"
          />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.occupation') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{ applicant.occupation ? $t(`applicant.add.${applicant.occupation}`) : '' }}</span>
        <div v-if="edit">
          <q-radio v-model="data['occupation']" val="nurse" :label="$t('applicant.add.nurse')" />
          <q-radio v-model="data['occupation']" val="nursingCare" :label="$t('applicant.add.nursingCare')" />
          <q-radio v-model="data['occupation']" val="lifeCounselor" :label="$t('applicant.add.lifeCounselor')" />
          <q-radio v-model="data['occupation']" val="careManager" :label="$t('applicant.add.careManager')" />
          <q-radio v-model="data['occupation']" val="others" :label="$t('applicant.add.others')" />
        </div>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.qualifications') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.qualification? applicant.qualification.map(applic => $t('applicant.qualification.'+applic)).join(', ') :''}}</span>
        <template v-if="edit">
          <q-checkbox v-model="data['qualification']" val="registeredNurse"
            :label="$t('applicant.qualification.registeredNurse')" />
          <q-checkbox v-model="data['qualification']" val="assistantNurse"
            :label="$t('applicant.qualification.assistantNurse')" />
          <q-checkbox v-model="data['qualification']" val="newcomer"
            :label="$t('applicant.qualification.newcomer')" />
          <q-checkbox v-model="data['qualification']" val="careWorker"
            :label="$t('applicant.qualification.careWorker')" />
          <q-checkbox v-model="data['qualification']" val="worker"
            :label="$t('applicant.qualification.worker')" />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.period') }}
      </div>
      <div class="col-3 q-pl-md blue self-center relative-position">
        <hidden-text v-if="!edit" :value="applicant.period" />
        <q-input v-if="edit" outlined dense v-model="data['period']" bg-color="white" />
      </div>
    </div>

    <div class="row q-pt-sm  q-pb-sm ">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.branchIncharge') }}
      </div>
      <div class="col-9 q-pl-md blue relative-position">
        <span v-if="!edit">{{ data.branchIncharge ? branches.find(b => b.value == data.branchIncharge)?.label : '' }}</span>
        <select-branch v-if="edit" :organization-id="organizationStore.currentOrganizationId"
          v-model="data['branchIncharge']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.memo') }}
      </div>
      <div class="col-9 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.attractionMemo" />
        <q-input v-if="edit" outlined dense v-model="data['attractionMemo']" bg-color="white" />
      </div>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { applicantClassification, employmentStatus, usersInCharge } from 'src/shared/constants/Applicant.const';
import { Applicant, ApplicantInputs, selectOptions, BackOrderModel } from 'src/shared/model';
import { limitDate, myDateFormat } from 'src/shared/utils/utils'
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import SelectBranch from 'src/pages/user/Settings/management/components/SelectBranch.vue';
import { useApplicant } from 'src/stores/applicant';
import { useOrganization } from 'src/stores/organization';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useBranch } from 'src/stores/branch';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods';
import { Alert } from 'src/shared/utils/Alert.utils';

const props =defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()

const defaultData: Ref<Partial<ApplicantInputs>> = ref({})
const data: Ref<Partial<ApplicantInputs>> = ref({})
const edit = ref(false);
const loading = ref(false);
const applicantStore = useApplicant();
const organizationStore = useOrganization();
const branchStore = useBranch()
const branches = ref<selectOptions[]>([])

const employmentStatusOption = ref(employmentStatus);
const classificationOption = ref(applicantClassification);
const usersListOption = usersInCharge.value

/** NGReasonSelect handlers */
const reasonKey = 'attractionsReasonNG' /** change reason key */
const detailKey = 'attractionsReasonNGDetail' /** change reason detail key */
const statusKey = 'attractionsStatus' /** change status key */
const hightlightError = ref<string[]>([])
const saveHandler = async () => {
  if (useSaveHandler(data, hightlightError, reasonKey, detailKey, statusKey)) {
    await save()
    resetData();
  }
}
useNGWatchers(data, hightlightError, reasonKey, detailKey, statusKey)
/** NGReasonSelect handlers */

async function resetData() {
  defaultData.value = {
    attractionsStatus: props?.applicant['attractionsStatus'] || false,
    attractionsReasonNG: props?.applicant['attractionsReasonNG'] || '',
    attractionsReasonNGDetail: props?.applicant['attractionsReasonNGDetail'] || '',
    invitationDate: props?.applicant['invitationDate']?myDateFormat(props?.applicant['invitationDate'], 'YYYY/MM/DD HH:mm'):myDateFormat(props?.applicant['applicationDate'], 'YYYY/MM/DD HH:mm'),
    employmentStatus: props?.applicant['employmentStatus'],
    chargeOfAttraction: props?.applicant['chargeOfAttraction'],
    classification: Array.isArray(props?.applicant['classification']) ? props?.applicant['classification'] : [],
    occupation: props?.applicant['occupation'],
    position: props?.applicant['position'],
    qualification: props?.applicant['qualification'],
    period: props?.applicant['period'],
    branchIncharge: props?.applicant['branchIncharge'],
    attractionMemo: props?.applicant['attractionMemo'],
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
  branches.value = mapToSelectOptions(await branchStore.getBranchesInOrganization(organizationStore.currentOrganizationId))
}
resetData()

async function save() {
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    edit.value = false;
    Alert.success()
  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}
</script>
