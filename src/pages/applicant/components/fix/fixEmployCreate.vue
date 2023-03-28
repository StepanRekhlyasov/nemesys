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

        <q-card-section>
          <edit-view-component
            :edit="edit.includes('info')"
            :label="$t('applicant.list.fixEmployment.info')"
            @openEdit="edit.push('info')"
            @closeEdit="edit=edit.filter(i => i !== 'info')"
            @onSave="save('info')">

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.status') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span class="text-uppercase" v-if="!edit.includes('info')">{{ fixData.status }}</span>
                <template v-if="edit.includes('info')">
                  <q-radio v-model="data['status']" val="ok" label="OK" @click="data['data'] = '';disableChange ()"/>
                  <q-radio v-model="data['status']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" />
                </template>
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.date') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('info')" :value="fixData.data" />
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
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.reason') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <span v-if="!edit.includes('info')" class="text_dots">{{ fixData.reason }}</span>
                <q-input v-if="edit.includes('info')" dense outlined bg-color="white"
                  v-model="data['reason']" :disable="loading" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.contactPerson') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <span v-if="!edit.includes('info')" class="text_dots">{{ 
                  usersListOption
                  .filter(user => user.value === data['contactPerson'])
                  .map(user => user.label).join('')  }}</span>
                <q-select
                  v-if="edit.includes('info')"
                  v-model="data['contactPerson']"
                  :disable="loading"
                  emit-value map-options dense outlined
                  :options="usersListOption" 
                  :label="$t('common.pleaseSelect')" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.memo') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('info')" :value="fixData.memo" />
                <q-input v-if="edit.includes('info')" dense outlined bg-color="white"
                  v-model="data['memo']" :disable="loading" />
              </div>
            </div>
          </edit-view-component>
        </q-card-section>

        <q-card-section>
          <edit-view-component
            :edit="edit.includes('jobSearchInfo')"
            :label="$t('applicant.list.fixEmployment.jobSearchInfo')"
            @openEdit="edit.push('jobSearchInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'jobSearchInfo')"
            @onSave="save('jobSearchInfo')"
            :disableButton="disableLevel < 1">

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.status') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span class="text-uppercase" v-if="!edit.includes('jobSearchInfo')">{{ fixData.inspectionStatus }}</span>
                <template v-if="edit.includes('jobSearchInfo')">
                  <q-radio v-model="data['inspectionStatus']" val="ok" label="OK" @click="data['inspectionDate'] = '';disableChange()" :disable="disableLevel < 1"/>
                  <q-radio v-model="data['inspectionStatus']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" :disable="disableLevel < 1"/>
                </template>
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.date') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobSearchInfo')" :value="fixData.inspectionDate" />
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white" v-model="data['inspectionDate']"  :disable="loading || disableLevel < 1">
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
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.reasonNG') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobSearchInfo')" :value="fixData.reasonNG" />
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white"
                  v-model="data['reasonNG']" :disable="loading || disableLevel < 1" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.chargeOfFacility') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span v-if="!edit.includes('jobSearchInfo')">{{ fixData.chargeOfFacility }}</span>
                <template v-if="edit.includes('jobSearchInfo')">
                  <q-input v-if="edit" dense outlined bg-color="white"
                    v-model="data['chargeOfFacility']" :disable="loading || disableLevel < 1" />
                </template>
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.jobTitle') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobSearchInfo')" :value="fixData.jobTitle" />
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white"
                  v-model="data['jobTitle']" :disable="loading || disableLevel < 1" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.contact') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span v-if="!edit.includes('jobSearchInfo')" class="text_dots">{{ 
                  usersListOption
                  .filter(user => user.value === data['contact'])
                  .map(user => user.label).join('')  }}</span>
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white"
                  v-model="data['contact']" :disable="loading || disableLevel < 1" />
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.comments') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobSearchInfo')" :value="fixData.comments" />
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white"
                  v-model="data['comments']" :disable="loading || disableLevel < 1" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.inspection.notes') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobSearchInfo')" :value="fixData.notesInspection" />
                <q-input v-if="edit.includes('jobSearchInfo')" dense outlined bg-color="white"
                  v-model="data['notesInspection']" :disable="loading || disableLevel < 1" />
              </div>
            </div>
          </edit-view-component>
        </q-card-section>

        <q-card-section>
          <edit-view-component
            :edit="edit.includes('jobOffersInfo')"
            :label="$t('applicant.list.fixEmployment.jobOffersInfo')"
            @openEdit="edit.push('jobOffersInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'jobOffersInfo')"
            @onSave="save('jobOffersInfo')"
            :disableButton="disableLevel < 2">
            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.offer.status') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span class="text-uppercase" v-if="!edit.includes('jobOffersInfo')">{{ fixData.offerStatus }}</span>
                <template v-if="edit.includes('jobOffersInfo')">
                  <q-radio v-model="data['offerStatus']" val="ok" label="OK" @click="data['offerDate'] = '';disableChange()" :disable="disableLevel < 2"/>
                  <q-radio v-model="data['offerStatus']" val="ng" label="NG" class="q-ml-sm" @click="disableChange" :disable="disableLevel < 2"/>
                </template>
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.offer.date') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobOffersInfo')" :value="fixData.offerDate" />
                <q-input v-if="edit.includes('jobOffersInfo')" dense outlined bg-color="white" v-model="data['offerDate']"  :disable="loading || disableLevel < 2">
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
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.offer.reasonNG') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobOffersInfo')" :value="fixData.offerReasonNG" />
                <q-input v-if="edit.includes('jobOffersInfo')" dense outlined bg-color="white"
                  v-model="data['offerReasonNG']" :disable="loading || disableLevel < 2" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.offer.chargeOfOffer') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span v-if="!edit.includes('jobOffersInfo')" class="text_dots">{{ 
                  usersListOption
                  .filter(user => user.value === data['chargeOfOffer'])
                  .map(user => user.label).join('')  }}</span>
                <q-select
                  v-if="edit.includes('jobOffersInfo')"
                  v-model="data['chargeOfOffer']"
                  :disable="loading || disableLevel < 2"
                  emit-value map-options dense outlined
                  :options="usersListOption" :label="$t('common.pleaseSelect')" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.offer.memo') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('jobOffersInfo')" :value="fixData.offerMemo" />
                <q-input v-if="edit.includes('jobOffersInfo')" dense outlined bg-color="white"
                  v-model="data['offerMemo']" :disable="loading || disableLevel < 2" />
              </div>
            </div>
          </edit-view-component>
        </q-card-section>

        <q-card-section>
          <edit-view-component
            :edit="edit.includes('employmentInfo')"
            :label="$t('applicant.list.fixEmployment.employmentInfo')"
            @openEdit="edit.push('employmentInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'employmentInfo')"
            @onSave="save('employmentInfo')"
            :disableButton="disableLevel < 3">
            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.admission.status') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <span class="text-uppercase" v-if="!edit.includes('employmentInfo')">{{ fixData.admissionStatus }}</span>
                <template v-if="edit.includes('employmentInfo')">
                  <q-radio v-model="data['admissionStatus']" val="ok" label="OK" @click="data['admissionDate'] = ''" :disable="disableLevel < 3"/>
                  <q-radio v-model="data['admissionStatus']" val="ng" label="NG" class="q-ml-sm" :disable="disableLevel < 3"/>
                </template>
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.admission.date') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('employmentInfo')" :value="fixData.admissionDate" />
                <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white" v-model="data['admissionDate']"  :disable="loading || disableLevel < 3">
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
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.admission.reasonNotJoining') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('employmentInfo')" :value="fixData.reasonNotJoining" />
                <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white"
                  v-model="data['reasonNotJoining']" :disable="loading || disableLevel < 3" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.admission.chargeOfAdmission') }}
              </div>
              <div class="col-3 q-pl-md blue ">                
                <span v-if="!edit.includes('employmentInfo')" class="text_dots">{{ 
                  usersListOption
                  .filter(user => user.value === data['chargeOfAdmission'])
                  .map(user => user.label).join('')  }}</span>
                <q-select
                  v-if="edit.includes('employmentInfo')"
                  v-model="data['chargeOfAdmission']"
                  :disable="loading || disableLevel < 3"
                  emit-value map-options dense outlined
                  :options="usersListOption" :label="$t('common.pleaseSelect')" />
              </div>
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.attendant.endDate') }}
              </div>
              <div class="col-3 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('employmentInfo')" :value="fixData.endDate" />
                <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white" v-model="data['endDate']" :disable="loading">
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
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
                {{ $t('applicant.list.fixEmployment.admission.memo') }}
              </div>
              <div class="col-9 q-pl-md blue ">
                <hidden-text v-if="!edit.includes('employmentInfo')" :value="fixData.admissionMemo" />
                <q-input v-if="edit.includes('employmentInfo')" dense outlined bg-color="white"
                  v-model="data['admissionMemo']" :disable="loading || disableLevel < 3" />
              </div>
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
import { ApplicantStatus, selectOptions, UserPermissionNames } from 'src/shared/model';
import hiddenText from 'src/components/hiddingText.component.vue';
import editViewComponent from 'src/components/editView.component.vue';
import { getAuth } from 'firebase/auth';
import { pick } from 'src/shared/utils/utils';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
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
    hiddenText,
    editViewComponent
  },
  setup(props, context: SetupContext) {
    const db = getFirestore();
    const auth = getAuth();
    const organization = useOrganization();
    const applicantStore = useApplicant();

    const data = ref(props.fixData);
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