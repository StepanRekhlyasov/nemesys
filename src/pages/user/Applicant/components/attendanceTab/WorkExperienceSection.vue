<template>
  <DropDownEditGroup :isHiddenActions="bo?true:false" :isEdit="edit" :label="'2.' + $t('applicant.attendant.workExperience')"
    @openEdit="edit = true" @closeEdit="edit = false; resetData()" @onSave="save">
    <div class="row ">
      <div class="text-blue text-weight-regular self-center text-subtitle1 ">
        [{{ $t('applicant.attendant.experienceDetails') }}]
      </div>
      <q-btn v-if="!bo" :label="$t('common.addNew')" color="primary" icon="mdi-plus-thick"
        @click="editExperience = undefined; openDialog = true" class="no-shadow q-ml-lg" size="sm" />
    </div>

    <div class="row q-pa-sm"></div>

    <q-table :columns="columns" :rows="experienceData" row-key="id" v-model:pagination="pagination"
      class="q-ma-none q-pa-none no-shadow" hide-pagination>

      <template v-slot:header-cell-experience="props">
        <q-th :props="props">
          {{ $t('applicant.attendant.experience') }}<br />
          {{ $t('applicant.attendant.facilityType') }}<br />
        </q-th>
      </template>

      <template v-slot:header-cell-month="props">
        <q-th :props="props">
          {{ $t('applicant.attendant.startMonth') }}<br />
          {{ $t('applicant.attendant.endMonth') }}<br />
        </q-th>
      </template>

      <template v-slot:header-cell-establishment="props">
        <q-th :props="props">
          {{ $t('applicant.attendant.nameEstablishment') }}<br />
          {{ $t('applicant.attendant.employmentType') }}<br />
        </q-th>
      </template>

      <template v-slot:body-cell-experience="props">
        <q-td :props="props">
          {{ props.row.experience }}<br />
          {{ props.row.facilityType }}<br />
        </q-td>
      </template>

      <template v-slot:body-cell-years="props">
        <q-td :props="props">
          <template v-if="(props.row.startMonth instanceof Timestamp) && (props.row.endMonth instanceof Timestamp)">
            {{ differentDateYear(toDate(props.row.startMonth), toDate(props.row.endMonth)) + ' ' + $t('common.year') }}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-month="props">
        <q-td :props="props">
          {{ myDateFormat(props.row.startMonth) }}<br />
          {{ myDateFormat(props.row.endMonth) }}<br />
        </q-td>
      </template>

      <template v-slot:body-cell-establishment="props">
        <q-td :props="props">
          {{ props.row.nameEstablishment }}<br />
          {{ props.row.employmentType ? $t('applicant.list.info.' + props.row.employmentType) : '' }}<br />
        </q-td>
      </template>


      <template v-if="!bo" v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat
            @click="editExperience = props.row; openDialog = true;" />
        </q-td>
      </template>
      <template v-if="!bo" v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn style="color: #222222" icon="delete" size="sm" round flat @click="deleteExperience(props.row)" />
        </q-td>
      </template>
    </q-table>

    <div class="row q-pa-sm"></div>

    <div class="row q-pb-sm">
      <div class="col-2 flex justify-between items-center q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.totalYearsExperience') }}
      </div>

      <div class="row q-pb-sm">
        <div class="col-4 q-pl-md blue self-center">
          <span v-if="!edit">{{ applicant.totalYear? applicant.totalYear + $t('common.year') : ''}}</span>
          <q-input v-if="edit" dense outlined bg-color="white" type="number"
            v-model="data['totalYear']" :disable="loading" />
        </div>
      </div>
    </div>
    <div>

    </div>
  </DropDownEditGroup>
  <q-dialog v-model="openDialog">
    <workExperienceForm @closeDialog="load(); openDialog = false;" :editExperience="editExperience"
      :applicantId="applicant.id" />
  </q-dialog>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { collection, getFirestore, onSnapshot, query, where, Timestamp } from '@firebase/firestore';
import workExperienceForm from './WorkExperienceForm.vue';
import { Applicant, ApplicantExperience, ApplicantExperienceInputs, BackOrderModel } from 'src/shared/model';
import { differentDateYear, myDateFormat, toDate } from 'src/shared/utils/utils';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { useApplicant } from 'src/stores/applicant';
import { workExpColumns as columns } from 'src/shared/constants/Applicant.const';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()

const applicantStore = useApplicant();

const loading = ref(false);
const openDialog = ref(false);
const edit = ref(false);
const data = ref({})
const editExperience: Ref<ApplicantExperience | undefined> = ref(undefined)
const experienceData: Ref<ApplicantExperience[]> = ref([]);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const db = getFirestore();

load();
resetData();

function resetData() {
  data.value = {
    totalYear: props.applicant['totalYear']
  }
}

function deleteExperience(experience: Partial<ApplicantExperienceInputs>) {
  $q.dialog({
    title: t('common.delete'),
    message: t('applicant.attendant.deletedInfo'),
    ok: {
      label: t('common.delete'),
      color: 'negative',
      class: 'no-shadow',
      unelevated: true
    },
  }).onOk(async () => {
    try {
      loading.value = true;
      await applicantStore.saveWorkExperience({
        id: experience.id,
        deleted: true,
      }, props.applicant.id)
      load();
    } catch (e) {
      console.log(e)
      loading.value = false;
    }
  })
}
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
function load() {
  editExperience.value = undefined;
  const q = query(collection(db, 'applicants/' + props.applicant.id + '/experience/'), where('deleted', '==', false));
  onSnapshot(q, (querySnapshot) => {
    let list: ApplicantExperience[] = [];
    querySnapshot.forEach((doc) => {
      const data = { ...doc.data() as ApplicantExperience };
      data['id'] = doc.id;
      list.push(data);
    });
    experienceData.value = list;
  });
}
</script>

<style></style>
