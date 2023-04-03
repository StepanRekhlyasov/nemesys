<template>
  <q-scroll-area class="fit text-left">
    <q-card class="no-shadow">
      <q-card-section class="text-white bg-primary " >
        <div class="row">
          <div class="col-1 flex flex-end items-end">
            <q-btn dense flat icon="close" @click="$emit('close')" class="q-mr-md"/>
          </div>
          <div class="col-11 ">
            <span class="row">{{ applicant.name }}</span>
            <div class="row">
              <span class="text-h6"> {{ $t('client.add.officeName') }}</span>
              <q-btn :label="$t('applicant.list.fixEmployment.save')" class="q-ml-md" color="white" text-color="primary" @click="saveDoc" size="sm"/>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-form>
        <!-- Main Information -->
        <q-card-section>
          <q-select
            v-model="data.client"
            @update:model-value="data['office']=null"
            :loading="loading"
            :options="applicantStore.state.clientList"
            option-value="id"
            option-label="name"
            emit-value map-options
            :label="$t('applicant.list.fixEmployment.client')"  />
          <q-select
            v-model="data.office"
            :loading="loading"
            emit-value map-options
            option-value="id"
            option-label="name"
            :options="applicantStore.state.clientList.find(client => client.id === data['client'])?.office" 
            :label="$t('applicant.list.fixEmployment.office')" />
        </q-card-section>

        <!-- Fix Information -->
        <q-card-section>
          <FixInfoSection 
            :edit="edit" 
            :loading="loading" 
            :fix-data="fixData" 
            :edit-data="data"
            :users-list-option="usersListOption"
            @save="save('info')"
            @close-edit="edit=edit.filter(i => i !== 'info')" 
            @open-edit="edit.push('info')"/>
        </q-card-section>

        <!-- Job-search Information  -->
        <q-card-section>
          <JobSearchInfoSection
            :edit="edit" 
            :loading="loading" 
            :fix-data="fixData" 
            :edit-data="data"
            :users-list-option="usersListOption"
            @save="save('jobSearchInfo')"
            @close-edit="edit=edit.filter(i => i !== 'jobSearchInfo')" 
            @open-edit="edit.push('jobSearchInfo')" :disable-level="disableLevel" />
        </q-card-section>

        <!-- Information on job offers -->
        <q-card-section>
          <JobOffersInfoSection
            :edit="edit" 
            :loading="loading" 
            :fix-data="fixData" 
            :edit-data="data"
            :users-list-option="usersListOption"
            @save="save('jobOffersInfo')"
            @close-edit="edit=edit.filter(i => i !== 'jobOffersInfo')" 
            @open-edit="edit.push('jobOffersInfo')" :disable-level="disableLevel" />
        </q-card-section>

        <!-- Employment Information -->
        <q-card-section>
          <edit-view-component
            :edit="edit.includes('employmentInfo')"
            :label="$t('applicant.list.fixEmployment.employmentInfo')"
            @openEdit="edit.push('employmentInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'employmentInfo')"
            @onSave="save('employmentInfo')"
            :disableButton="disableLevel < 3">
            <div class="row q-pb-sm">

              <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.status')" :value="fixData.admissionStatus">
                  <q-radio v-model="data['admissionStatus']" val="ok" label="OK" @click="data['admissionDate'] = ''" :disable="disableLevel < 3"/>
                  <q-radio v-model="data['admissionStatus']" val="ng" label="NG" class="q-ml-sm" :disable="disableLevel < 3"/>
              </labelField>

              <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.date')" :value="fixData.admissionDate">
                <q-input dense outlined bg-color="white" v-model="data['admissionDate']"  :disable="loading || disableLevel < 3">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="data['admissionDate']" mask="YYYY/MM/DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField 
                :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.reasonNotJoining')" 
                :value="fixData.reasonNotJoining" valueClass="col-9">
                <q-input dense outlined bg-color="white"
                  v-model="data['reasonNotJoining']" :disable="loading || disableLevel < 3" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField 
                :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.chargeOfAdmission')"
                :value="usersListOption
                  .filter(user => user.value === data['chargeOfAdmission'])
                  .map(user => user.label).join('')">
                <q-select
                  v-model="data['chargeOfAdmission']"
                  :disable="loading || disableLevel < 3"
                  emit-value map-options dense outlined
                  :options="usersListOption" :label="$t('common.pleaseSelect')" />
              </labelField>

              <labelField :edit="edit.includes('employmentInfo')" :label="$t('applicant.attendant.endDate')" :value="fixData.endDate">
                <q-input dense outlined bg-color="white" v-model="data['endDate']" :disable="loading">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="data['endDate']" mask="YYYY/MM/DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField 
                :edit="edit.includes('employmentInfo')" :label="$t('applicant.list.fixEmployment.admission.memo')" 
                :value="fixData.admissionMemo" value-class="col-9">
                <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white"
                  v-model="data['admissionMemo']" :disable="loading || disableLevel < 3" />
              </labelField>
            </div>
          </edit-view-component>
        </q-card-section>
      </q-form>
    </q-card>
  </q-scroll-area>
</template>

<script lang="ts">
import { ref, SetupContext } from 'vue';
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc} from 'firebase/firestore';
import { selectOptions, UserPermissionNames } from 'src/shared/model';
import editViewComponent from 'src/components/editView.component.vue';
import { getAuth } from 'firebase/auth';
import { pick } from 'src/shared/utils/utils';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import labelField from 'src/components/form/LabelField.vue';
import FixInfoSection from './FixInfoSection.vue';
import JobSearchInfoSection from './JobSearchInfoSection.vue';
import JobOffersInfoSection from './JobOffersInfoSection.vue';

export default {
  name: 'FixEmployCreate',
  props: {
    fixData: {
      type: Object,
      required: true
    },
    applicant: {
      type: Object,
      required: true
    }
  },
  emits: {
    updateList: null,
    close: null,
    updateDoc: null,
    updateStatus: null
  },
  components: {
    editViewComponent,
    labelField,
    FixInfoSection,
    JobSearchInfoSection,
    JobOffersInfoSection
  },
  setup(props, context: SetupContext) {
    const db = getFirestore();
    const auth = getAuth();
    const organization = useOrganization();
    const applicantStore = useApplicant();

    const data = ref({...props.fixData});
    const loading = ref(false);
    const disableLevel = ref(0);
    const edit = ref<string[]>([])
    const show = ref<string[]>([])
    const usersListOption = ref<selectOptions[]>([]);
    const clientOptions = applicantStore.state.clientList;
    const officeOptions = ref<selectOptions[]> ([]); 

    const options = [
      'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
    ];

    function disableChange() {
      let level = 0;
      if (data.value['status'] == 'ok') {
        level = 1
      }
      if (data.value['inspectionStatus'] == 'ok') {
        level = 2
      }
      if (data.value['offerStatus'] == 'ok') {
        level = 3
      }
      disableLevel.value = level
    }

    function loadUser() {
      const usersSnapshot = getUsersByPermission(db, UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);

      usersSnapshot.then(users => {
        let list: selectOptions[] = [];
        users?.forEach((doc) => {
          const data = doc.data();
          list.push({
            label: data.displayName,
            value: doc.id
          });
        });
        usersListOption.value = list;
      })
    }
    loadUser();
    disableChange();

    return {
      data,
      edit,
      show,
      options,
      loading,
      clientOptions,
      officeOptions,
      usersListOption,
      disableLevel,
      applicantStore,

      disableChange,
      save(type: string) {
        let retData = {};
        switch(type){
          case 'info': {
            retData = pick(data.value, ['status', 'data', 'reason', 'contactPerson', 'memo'])
            break;
          }
          case 'jobSearchInfo': {
            retData = pick(
              data.value,
              ['inspectionStatus', 'inspectionDate', 'reasonNG', 'chargeOfFacility',
              'jobTitle', 'contact', 'comments', 'notesInspection'])
            break;
          }
          case 'jobOffersInfo': {
            retData = pick(
              data.value,
              ['offerStatus', 'offerDate', 'offerReasonNG', 'contactPerson', 'memo',
              'offerReasonNG', 'chargeOfOffer', 'offerMemo'])
            break;
          }
          case 'employmentInfo': {
            retData = pick(
              data.value,
              ['admissionStatus', 'admissionDate', 'reasonNotJoining', 'chargeOfAdmission', 'admissionMemo', 'endDate'])
            break;
          }
          default: {
            return ;
          }
        }
        context.emit('updateDoc', retData);
        context.emit('updateStatus')
        edit.value=edit.value.filter(i => i !== type)
        disableChange()
      },
      async saveDoc() {
        try {
          const retData = {...data.value}
          retData['updated_at'] = serverTimestamp();
          delete retData['created_at']
          if (props.fixData.id) {
            await updateDoc(
              doc(db, 'applicants/' + props.applicant.id + '/fix/'+ props.fixData.id),
              retData
            );
            context.emit('updateList')
            context.emit('updateStatus')
            context.emit('close')
            return;
          }
          retData['created_at'] = serverTimestamp();
          retData['deleted'] = false;
          retData['created_by'] = auth.currentUser?.uid;
          await addDoc(
            collection(db, 'applicants/' + props.applicant.id + '/fix'),
            retData
          )
          context.emit('updateList')
          context.emit('updateStatus', [true])
          context.emit('close')
        } catch (e) {
          console.log(e)
        }
      }
    }
  }

}
</script>