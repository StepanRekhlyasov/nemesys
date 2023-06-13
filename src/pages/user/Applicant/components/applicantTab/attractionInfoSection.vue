<template>
  <DropDownEditGroup
    :isEdit="edit"
    :label="$t('applicant.list.info.attraction')"
    @openEdit="edit = true"
    @closeEdit="resetData(); edit = false;"
    @onSave="save">
    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.attractionsStatus') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant?.attractionsStatus? 'OK' : 'NG'}}</span>
        <template v-if="edit">
          <q-checkbox v-model="data['attractionsStatus']" label="OK" checked-icon="mdi-checkbox-intermediate"
            unchecked-icon="mdi-checkbox-blank-outline" color="primary"/>
          <q-checkbox v-model="data['attractionsStatus']" label="NG" unchecked-icon="mdi-checkbox-intermediate"
            checked-icon="mdi-checkbox-blank-outline" color="primary"/>
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.invitationDate') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ timestampToDateFormat(applicant.invitationDate) }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['invitationDate']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['invitationDate']" default-view="Years" :options="limitDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
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
        <span v-if="!edit">{{ applicant.employmentStatus? $t('applicant.list.info.'+applicant.employmentStatus): ''}}</span>
        <q-select v-if="edit" outlined dense :options="employmentStatusOption" v-model="data['employmentStatus']"
          bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.seduser') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{
            usersListOption
              .filter(user => user.value === data['seduser'])
              .map(user => user.label).join('')
        }}</span>
        <q-select v-if="edit" outlined dense :options="usersListOption" v-model="data['seduser']"
          bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
      </div>
    </div>

      <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.classiffication') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{ applicant.classification? $t('applicant.list.info.classification.'+applicant.classification):''}}</span>
        <q-select v-if="edit" outlined dense :options="classificationOption" v-model="data['classification']"
          bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.occupation') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{ applicant.occupation ?$t(`applicant.add.${applicant.occupation}`):''}}</span>
        <div v-if="edit">
          <q-radio v-model="data['occupation']" val="nurse" :label="$t('applicant.add.nurse')" />
          <q-radio v-model="data['occupation']" val="nursingCare"
            :label="$t('applicant.add.nursingCare')" />
          <q-radio v-model="data['occupation']" val="lifeCounselor"
            :label="$t('applicant.add.lifeCounselor')" />
          <q-radio v-model="data['occupation']" val="careManager"
            :label="$t('applicant.add.careManager')" />
          <q-radio v-model="data['occupation']" val="others" :label="$t('applicant.add.others')" />
        </div>
      </div>
    </div>

      <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.qualifications') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.qualification? applicant.qualification.map(applic => $t('applicant.add.'+applic)).join(', ') :''}}</span>
        <template v-if="edit">
          <q-checkbox v-model="data['qualification']" val="registeredNurse"
            :label="$t('applicant.add.registeredNurse')" />
          <q-checkbox v-model="data['qualification']" val="assistantNurse"
            :label="$t('applicant.add.assistantNurse')" />
          <q-checkbox v-model="data['qualification']" val="newcomer"
            :label="$t('applicant.add.newcomer')" />
          <q-checkbox v-model="data['qualification']" val="careWorker"
            :label="$t('applicant.add.careWorker')" />
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
        <span v-if="!edit">{{data.branchIncharge? branches.find(b => b.value == data.branchIncharge)?.label : ''}}</span>
        <select-branch v-if="edit" :organization-id="organizationStore.currentOrganizationId" v-model="data['branchIncharge']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.memo') }}
      </div>
      <div class="col-9 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.memo" />
        <q-input v-if="edit" outlined dense v-model="data['memo']" bg-color="white" />
      </div>
    </div>
  </DropDownEditGroup>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { applicantClassification, employmentStatus, usersInCharge } from 'src/shared/constants/Applicant.const';
import { Applicant, ApplicantInputs, selectOptions } from 'src/shared/model';
import { limitDate, timestampToDateFormat } from 'src/shared/utils/utils'
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import SelectBranch from 'src/pages/user/Settings/management/components/SelectBranch.vue';
import { useApplicant } from 'src/stores/applicant';
import { useOrganization } from 'src/stores/organization';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useBranch } from 'src/stores/branch';

const props = defineProps<{
  applicant: Applicant
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


async function resetData() {
  defaultData.value = {
    attractionsStatus: props?.applicant['attractionsStatus'] || false,
    invitationDate: timestampToDateFormat(props?.applicant['invitationDate']),
    employmentStatus: props?.applicant['employmentStatus'],
    seduser: props?.applicant['seduser'],
    classification: props?.applicant['classification'],
    position: props?.applicant['position'],
    qualification: props?.applicant['qualification'],
    period: props?.applicant['period'],
    branchIncharge: props?.applicant['branchIncharge'],
    memo: props?.applicant['memo'],
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
  } catch (error) {
    console.log(error);
  }
  loading.value = false
}
</script>
