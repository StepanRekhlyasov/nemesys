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
            <q-input dense outlined bg-color="white" v-model="data['startMonth']"  :disable="loading">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="data['startMonth']" mask="YYYY/MM/DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
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
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
import { useQuasar } from 'quasar';
import { employmentStatus } from 'src/shared/constants/Applicant.const';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref, SetupContext } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'WorkExperienceForm',
  props: {
    editExperience: {
      type: Object,
      required: false
    },
    applicantId: {
      type: Number,
      required: false
    }
  },
  setup(props, context: SetupContext) {
    const data = ref(props.editExperience || {
      hidden: false
    });
    const loading = ref(false);
    const employmentStatusOption = ref(employmentStatus);
    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();
    const db = getFirestore();

    return {
      data,
      loading,
      employmentStatusOption,

      async save() {
        loading.value = true;
        const saveData = data.value
        try {
            const boRef = doc(db, 'applicants/'+props.applicantId+'/experience/'+props.editExperience?.id);
            await updateDoc(boRef, {
              updated_at: serverTimestamp(),
              ...saveData
            })

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      },
      async addExperience() {
        loading.value = true;
        let newData = JSON.parse(JSON.stringify(data.value));
        try {
            newData['created_at'] = serverTimestamp();
            newData['updated_at'] = serverTimestamp();
            newData['deleted'] = false;

            const clientRef = collection(db, 'applicants/'+props.applicantId+'/experience/');
            await addDoc(clientRef, newData);

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      }
    }
  }

}
</script>

<style>

</style>
