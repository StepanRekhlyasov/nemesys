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
            @closeEdit="edit=edit.filter(i => i !== 'info')" 
            @openEdit="edit.push('info')"/>
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
            @closeEdit="edit=edit.filter(i => i !== 'jobSearchInfo')" 
            @openEdit="edit.push('jobSearchInfo')" :disable-level="disableLevel" />
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
            @closeEdit="edit=edit.filter(i => i !== 'jobOffersInfo')" 
            @openEdit="edit.push('jobOffersInfo')" :disable-level="disableLevel" />
        </q-card-section>

        <!-- Employment Information -->
        <q-card-section>
          <EmploymentInfoSection
            :edit="edit" 
            :loading="loading" 
            :fix-data="fixData" 
            :edit-data="data"
            :users-list-option="usersListOption"
            @save="save('employmentInfo')"
            @closeEdit="edit=edit.filter(i => i !== 'employmentInfo')" 
            @openEdit="edit.push('employmentInfo')" :disable-level="disableLevel"  />
        </q-card-section>
      </q-form>
    </q-card>
  </q-scroll-area>
</template>

<script lang="ts">
import { ref, SetupContext } from 'vue';
import { getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore';
import { selectOptions, UserPermissionNames } from 'src/shared/model';
import { getAuth } from 'firebase/auth';
import { pick } from 'src/shared/utils/utils';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import FixInfoSection from './FixInfoSection.vue';
import JobSearchInfoSection from './JobSearchInfoSection.vue';
import JobOffersInfoSection from './JobOffersInfoSection.vue';
import EmploymentInfoSection from './EmploymentInfoSection.vue';

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
    FixInfoSection,
    JobSearchInfoSection,
    JobOffersInfoSection,
    EmploymentInfoSection
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
            retData = pick(data.value, ['status', 'date', 'reason', 'contactPerson', 'memo'])
            if (retData['date']) {
              retData['date'] = Timestamp.fromDate(new Date(retData['date']))
            }
            break;
          }
          case 'jobSearchInfo': {
            retData = pick(
              data.value,
              ['inspectionStatus', 'inspectionDate', 'reasonNG', 'chargeOfFacility',
              'jobTitle', 'contact', 'comments', 'notesInspection'])
            if (retData['inspectionDate']) {
              console.log(retData['inspectionDate'])
              retData['inspectionDate'] = Timestamp.fromMillis(Date.parse(retData['inspectionDate']))
            }
            break;
          }
          case 'jobOffersInfo': {
            retData = pick(
              data.value,
              ['offerStatus', 'offerDate', 'offerReasonNG', 'contactPerson', 'memo',
              'offerReasonNG', 'chargeOfOffer', 'offerMemo'])
            if (retData['offerDate']) {
              retData['offerDate'] = Timestamp.fromDate(new Date(retData['data']))
            }
            break;
          }
          case 'employmentInfo': {
            retData = pick(
              data.value,
              ['admissionStatus', 'admissionDate', 'reasonNotJoining', 'chargeOfAdmission', 'admissionMemo', 'endDate'])
            if (retData['admissionDate']) {
              retData['admissionDate'] = Timestamp.fromDate(new Date(retData['data']))
            }
            break;
          }
          default: {
            return ;
          }
        }
        console.log(retData)
        context.emit('updateDoc', retData);
        context.emit('updateList')
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
            applicantStore.updateFix(props.fixData.id, retData)

            context.emit('updateList')
            context.emit('updateStatus')
            context.emit('close')
            return;
          }
          retData['created_at'] = serverTimestamp();
          retData['deleted'] = false;
          retData['created_by'] = auth.currentUser?.uid;
          await applicantStore.saveFix(props.applicant.id, retData)

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