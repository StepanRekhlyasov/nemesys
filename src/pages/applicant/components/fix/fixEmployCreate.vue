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
          <edit-view-component
            :edit="edit.includes('info')"
            :label="$t('applicant.list.fixEmployment.info')"
            @openEdit="edit.push('info')"
            @closeEdit="edit=edit.filter(i => i !== 'info')"
            @onSave="save('info')">

            <div class="row q-pb-sm">
              <labelField :label="$t('applicant.list.fixEmployment.status')" :edit="edit.includes('info')" :value="fixData.status" valueClass="text-uppercase">
                <q-radio v-model="data['status']" val="ok" label="OK" @click="data['data'] = '';disableChange ()"/>
                <q-radio v-model="data['status']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" />
              </labelField>

              <labelField :label="$t('applicant.list.fixEmployment.date')" :edit="edit.includes('info')" :value="fixData.data">
                <q-input v-if="edit.includes('info')" dense outlined bg-color="white" v-model="data['data']" :disable="loading">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="data['data']" mask="YYYY/MM/DD">
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
            
            <template v-if="data['status'] == 'ng'">              
              <div class="row q-pb-sm">  
                <labelField 
                  :edit="edit.includes('info') " 
                  :label="$t('applicant.list.fixEmployment.reason')"
                  :value="fixData.reason? $t('applicant.list.fixEmployment.'+fixData.reason) : ''"
                  valueClass="col-9">
                  <div class="row">
                    <div class="col-9">
                      <q-radio v-model="data['reason']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" @click="changeStatus" />
                      <q-radio v-model="data['reason']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" @click="changeStatus" />
                      <q-radio v-model="data['reason']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" @click="changeStatus" />
                      <q-radio v-model="data['reason']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" @click="changeStatus" />
                    </div>
                    <div class="col-3">
                      <q-select 
                        v-if="data['reason']" 
                        v-model="data['reasonDetal']"
                        :options="statusOptions"                        
                        emit-value map-options dense outlined
                        :label="$t('common.pleaseSelect')" 
                      />
                    </div>
                  </div>
                </labelField>
              </div>
            </template>

            <div class="row q-pb-sm">            
              <labelField 
                :edit="edit.includes('info')"
                :value="usersListOption
                  .filter(user => user.value === data['contactPerson'])
                  .map(user => user.label).join('')"
                :label="$t('applicant.list.fixEmployment.contactPerson')"
                valueClass="col-9">  

                <q-select
                  v-if="edit.includes('info')"
                  v-model="data['contactPerson']"
                  :disable="loading"
                  emit-value map-options dense outlined
                  :options="usersListOption" 
                  :label="$t('common.pleaseSelect')" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField 
                :edit="edit.includes('info')" 
                :label="$t('applicant.list.fixEmployment.memo')" 
                :value="fixData['memo']" valueClass="col-9">

                <q-input dense outlined bg-color="white"
                  v-model="data['memo']" :disable="loading" />
              </labelField>
            </div>
          </edit-view-component>
        </q-card-section>

        <!-- Job-search Information  -->
        <q-card-section>
          <edit-view-component
            :edit="edit.includes('jobSearchInfo')"
            :label="$t('applicant.list.fixEmployment.jobSearchInfo')"
            @openEdit="edit.push('jobSearchInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'jobSearchInfo')"
            @onSave="save('jobSearchInfo')"
            :disableButton="disableLevel < 1">

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.status')" :value="fixData.inspectionStatus">
                <q-radio v-model="data['inspectionStatus']" val="ok" label="OK" @click="data['inspectionDate'] = '';disableChange()" :disable="disableLevel < 1"/>
                <q-radio v-model="data['inspectionStatus']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" :disable="disableLevel < 1"/>
              </labelField>
              
              <labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.date')" :value="fixData.inspectionDate">                
                <q-input dense outlined bg-color="white" v-model="data['inspectionDate']"  :disable="loading || disableLevel < 1">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="data['inspectionDate']" mask="YYYY/MM/DD">
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
            
            <div class="row q-pb-sm" v-if="data['inspectionStatus'] == 'ng'">
              <labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.reasonNG')" :value="fixData.reasonNG" valueClass="col-9">
                <div class="row">
                    <div class="col-9">
                      <q-radio v-model="data['reasonNG']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" @click="changeJobStatus" />
                      <q-radio v-model="data['reasonNG']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" @click="changeJobStatus" />
                      <q-radio v-model="data['reasonNG']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" @click="changeJobStatus" />
                      <q-radio v-model="data['reasonNG']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" @click="changeJobStatus" />
                    </div>
                    <div class="col-3">
                      <q-select 
                        v-if="data['reasonNG']" 
                        v-model="data['reasonJobDetal']"
                        :options="statusJobOptions"                        
                        emit-value map-options dense outlined
                        :label="$t('common.pleaseSelect')" 
                      />
                    </div>
                  </div>
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobSearchInfo')" 
                :label="$t('applicant.list.fixEmployment.inspection.chargeOfFacility')" 
                :value="fixData.chargeOfFacility">
                <q-input v-if="edit" dense outlined bg-color="white"
                  v-model="data['chargeOfFacility']" :disable="loading || disableLevel < 1" />
              </labelField>              
              
              <labelField :edit="edit.includes('jobSearchInfo')" 
                :label="$t('applicant.list.fixEmployment.inspection.jobTitle')" 
                :value="fixData.jobTitle">
                <q-input dense outlined bg-color="white"
                  v-model="data['jobTitle']" :disable="loading || disableLevel < 1" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.contact')" 
                :value="usersListOption
                  .filter(user => user.value === data['contact'])
                  .map(user => user.label).join('')">
                <q-input dense outlined bg-color="white"
                  v-model="data['contact']" :disable="loading || disableLevel < 1" />
              </labelField>
              <labelField
                :edit="edit.includes('jobSearchInfo')"
                :label="$t('applicant.list.fixEmployment.inspection.comments')"
                :value="fixData.comments">
                <q-input dense outlined bg-color="white"
                  v-model="data['comments']" :disable="loading || disableLevel < 1" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.notes')" :value="fixData.notesInspection" valueClass="col-9">
                <q-input dense outlined bg-color="white"
                  v-model="data['notesInspection']" :disable="loading || disableLevel < 1" />
              </labelField>
            </div>
          </edit-view-component>
        </q-card-section>

        <!-- Information on job offers -->
        <q-card-section>
          <edit-view-component
            :edit="edit.includes('jobOffersInfo')"
            :label="$t('applicant.list.fixEmployment.jobOffersInfo')"
            @openEdit="edit.push('jobOffersInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'jobOffersInfo')"
            @onSave="save('jobOffersInfo')"
            :disableButton="disableLevel < 2">

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.status')" :value="fixData.offerStatus">
                <q-radio v-model="data['offerStatus']" val="ok" label="OK" @click="data['offerDate'] = '';disableChange()" :disable="disableLevel < 2"/>
                <q-radio v-model="data['offerStatus']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" :disable="disableLevel < 2"/>
              </labelField>

              <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.date')" :value="fixData.offerDate" >
                <q-input dense outlined bg-color="white" v-model="data['offerDate']"  :disable="loading || disableLevel < 2">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="data['offerDate']" mask="YYYY/MM/DD">
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
              <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.reasonNG')" :value="fixData.offerReasonNG" valueClass="col-9">                
                <q-input dense outlined bg-color="white"
                  v-model="data['offerReasonNG']" :disable="loading || disableLevel < 2" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.chargeOfOffer')"
                :value="usersListOption
                  .filter(user => user.value === data['chargeOfOffer'])
                  .map(user => user.label).join('')"
                valueClass="col-9">
                <q-select
                  v-model="data['chargeOfOffer']"
                  :disable="loading || disableLevel < 2"
                  emit-value map-options dense outlined
                  :options="usersListOption" :label="$t('common.pleaseSelect')" />
              </labelField>
            </div>

            <div class="row q-pb-sm">
              <labelField :edit="edit.includes('jobOffersInfo')" :label="$t('applicant.list.fixEmployment.offer.memo')" :value="fixData.offerMemo" valueClass="col-9">
                <q-input  dense outlined bg-color="white"
                  v-model="data['offerMemo']" :disable="loading || disableLevel < 2" />
              </labelField>
            </div>
          </edit-view-component>
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
import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

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
    labelField
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
    const statusOptions = ref<selectOptions[]> ([]);
    const statusJobOptions = ref<selectOptions[]> ([])

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
        disableChange();
      })
    }
    loadUser();

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
      statusOptions,
      statusJobOptions,

      disableChange,
      changeStatus() {
        if (data.value['status'] && data.value['status'] == 'ng') {
          switch(data.value['reason']){
            case('notApplicable'):
              statusOptions.value = notApplicableFixList;
            break;
            case('decided'):
              statusOptions.value = decidedFixList;
            break;
            case('notCovered'):
              statusOptions.value = [];
            break;
            case('registrationDeclined'):
              statusOptions.value = registrationDeclinedFixList;
            break;
          }
          data.value['reasonDetal'] = '';
        }
      },
      changeJobStatus() {
        if (data.value['inspectionStatus'] && data.value['inspectionStatus'] == 'ng') {
          switch(data.value['reasonNG']){
            case('notApplicable'):
              statusJobOptions.value = notApplicableFixList;
            break;
            case('decided'):
              statusJobOptions.value = decidedFixList;
            break;
            case('notCovered'):
              statusJobOptions.value = [];
            break;
            case('registrationDeclined'):
              statusJobOptions.value = registrationDeclinedFixList;
            break;
          }
          data.value['reasonJobDetal'] = '';
        }

      },
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