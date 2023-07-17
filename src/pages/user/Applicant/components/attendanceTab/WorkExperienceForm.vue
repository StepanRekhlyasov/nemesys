<template>
  <q-card style="width: 800px; max-width: 80vw">
    <q-card-section>
      <q-form @submit="addExperience">
        <div class="row q-pb-sm">
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.experience') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input
              v-model="data['experience']" name="experience" :disable="loading"
              outlined dense
            />
          </div>
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.facilityType') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input
              v-model="data['facilityType']" name="facilityType" :disable="loading"
              outlined dense
            />
          </div>
        </div>


        <div class="row q-pb-sm">
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.startMonth') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input dense outlined bg-color="white" v-model="data['startMonth']" :disable="loading">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="data['startMonth']" mask="YYYY/MM/DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.endMonth') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input dense outlined bg-color="white" v-model="data['endMonth']"  :disable="loading">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="data['endMonth']" mask="YYYY/MM/DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.nameEstablishment') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input
              v-model="data['nameEstablishment']" name="nameEstablishment" :disable="loading"
              outlined dense
            />
          </div>
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.employmentType') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-select outlined dense :options="employmentStatusOption" v-model="data['employmentType']"
              bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.reasonResignation') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input
              v-model="data['reasonResignation']" name="reasonResignation" :disable="loading"
              outlined dense
            />
          </div>
          <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
            {{ $t('applicant.attendant.pastInterviews') }}
          </div>
          <div class="col-4 q-pl-md blue self-center">
            <q-input
              v-model="data['pastInterviews']" name="pastInterviews" :disable="loading"
              outlined dense
            />
          </div>
        </div>
        <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
          <q-btn v-if="!editExperience?.id" :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
          <q-btn v-if="editExperience?.id" :label="$t('common.edit')" color="primary" class="no-shadow" :loading="loading" @click="save"/>
          <q-btn v-close-popup :label="$t('common.close')" color="primary" flat  />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { addDoc, collection, getFirestore, serverTimestamp } from '@firebase/firestore';
import { employmentStatus } from 'src/shared/constants/Applicant.const';
import { ApplicantExperience, ApplicantExperienceInputs } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { dateToTimestampFormat, myDateFormat } from 'src/shared/utils/utils';
import { useApplicant } from 'src/stores/applicant';
import { Ref, ref } from 'vue';

const props = defineProps<{
  editExperience?: ApplicantExperience,
  applicantId?: string
}>()
const emit = defineEmits(['closeDialog'])
const data: Ref<Partial<ApplicantExperienceInputs>> = ref({});
const applicantStore = useApplicant();
if(props.editExperience){
  data.value = {
    id: props.editExperience.id,
    experience: props.editExperience.experience,
    facilityType: props.editExperience.facilityType,
    nameEstablishment: props.editExperience.nameEstablishment,
    employmentType: props.editExperience.employmentType,
    reasonResignation: props.editExperience.reasonResignation,
    pastInterviews: props.editExperience.pastInterviews,
    startMonth: myDateFormat(props.editExperience.startMonth),
    endMonth: myDateFormat(props.editExperience.endMonth),
  }
}

const loading = ref(false);
const employmentStatusOption = ref(employmentStatus);
const db = getFirestore();
async function save() {
  if(!props.applicantId) return;
  loading.value = true;
  try {
      await applicantStore.saveWorkExperience(data.value, props.applicantId)
  } catch (e) {
    Alert.warning(e)
    console.log(e)
  }
  loading.value = false;
  emit('closeDialog');
}
async function addExperience() {
  loading.value = true;
  const newData = JSON.parse(JSON.stringify(data.value));
  try {
      newData['created_at'] = serverTimestamp();
      newData['updated_at'] = serverTimestamp();
      newData['deleted'] = false;
      if(newData.startMonth) newData.startMonth = dateToTimestampFormat(new Date(newData.startMonth))
      if(newData.endMonth) newData.endMonth = dateToTimestampFormat(new Date(newData.endMonth))
      const clientRef = collection(db, 'applicants/'+props.applicantId+'/experience/');
      await addDoc(clientRef, newData);
      emit('closeDialog');
      Alert.success();
  } catch (e) {
    console.log(e)
    Alert.warning(e);
  }
  loading.value = false;
}
</script>
