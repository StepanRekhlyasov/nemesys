<template>
  <div class="row q-pb-md">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn v-if="!infoEdit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="infoEdit = true" class="no-shadow q-ml-lg" />
      <q-btn v-if="infoEdit" :label="$t('common.save')" color="primary" @click="saveInfo"/>
      <q-btn v-if="infoEdit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="infoEdit=false" />
    </div>
  </div>

  <div class="row q-pb-sm">
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.attendantStatus') }}
    </div>
    <div class="col-2 q-pl-md blue ">
      <span v-if="!infoEdit" class="text-uppercase">{{ applicant.attendingStatus }}</span>
      <q-select v-if="infoEdit" outlined dense :options="attendantStatusOption"
      emit-value map-options v-model="indoData['attendingStatus']" :disable="loading"/>
    </div>
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.day') }}
    </div>
    <div class="col-2 q-pl-md  blue ">
      <span v-if="!infoEdit">{{ applicant.attendingDate }}</span>
      <q-input v-if="infoEdit" dense outlined bg-color="white" v-model="indoData['attendingDate']"  :disable="loading">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="indoData['attendingDate']" mask="YYYY/MM/DD">
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
      {{ $t('applicant.attendant.attendee') }}
    </div>
    <div class="col-2 q-pl-md blue ">
      <span v-if="!infoEdit">{{
          usersListOption
            .filter(user => user.value === indoData['attendee'])
            .map(user => user.label).join('')
      }}</span>
      <q-select v-if="infoEdit" outlined dense :options="usersListOption" v-model="indoData['attendee']"
        bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
    </div>
  </div>

  <div class="row q-pb-sm">
    <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
      {{ $t('applicant.attendant.memo') }}
    </div>
    <div class="col-10 q-pl-md blue ">
      <span v-if="!infoEdit">{{ applicant.memo }}</span>
      <q-input v-if="infoEdit" dense outlined bg-color="white" v-model="indoData['memo']" :disable="loading"/>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { attendantStatus } from 'src/shared/constants/Applicant.const';
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useOrganization } from 'src/stores/organization';
import { getFirestore } from '@firebase/firestore';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { selectOptions, UserPermissionNames } from 'src/shared/model';

export default {
  name: 'attendanceInfoComponent',
  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const db = getFirestore();
    const organization = useOrganization()
    const infoEdit = ref(false);
    const loading = ref(false);
    const attendantStatusOption = ref(attendantStatus);
    const usersListOption: Ref<selectOptions[]> = ref([])
    const indoData = ref( {
      attendingStatus: props?.applicant['attendingStatus'] || '',
      attendingDate: props?.applicant['attendingDate'] || '',
      attendee: props?.applicant['attendee'] || '',
      memo: props?.applicant['memo'] || '',
    })

    if (organization.currentOrganizationId){
      loadUser()
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

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();

    return {
      infoEdit,
      indoData,
      attendantStatusOption,
      loading,
      usersListOption,

      async saveInfo() {
        loading.value = true
        try {
          await props.updateApplicant(indoData.value);
          Alert.success($q, t);
          infoEdit.value = false;
        } catch (error) {
          console.log(error);
          loading.value = false;
          Alert.warning($q, t);
        }
        loading.value = false
      }
    }
  }
}
</script>

<style>

</style>
