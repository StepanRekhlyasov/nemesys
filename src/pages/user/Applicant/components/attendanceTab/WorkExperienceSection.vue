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
        <q-td :props="props" style="white-space: normal;min-width: 320px;">
          {{ props.row.experience }}<br />
          {{ Array.isArray(props.row.facilityType) ? props.row.facilityType.map((row : string)=>$t('client.add.facilityOp.'+row)).join(', ') : props.row.facilityType }}<br />
        </q-td>
      </template>

      <template v-slot:body-cell-years="props">
        <q-td :props="props">
          <template v-if="(props.row.startMonth instanceof Timestamp) && (props.row.endMonth instanceof Timestamp)">
            {{ Math.floor(differentDateMonth(toDate(props.row.startMonth), toDate(props.row.endMonth))/12) + ' ' + $t('common.year') }}
            {{ differentDateMonth(toDate(props.row.startMonth), toDate(props.row.endMonth))%12 + ' ' + $t('common.addMonth').toLowerCase() }}
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

    <div class="row">
      <div class="col-12 q-pb-sm flex justify-between items-center q-pl-md text-left text-blue text-weight-regular self-center">
        [{{ $t('applicant.attendant.totalYearsExperience') }}]
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-2 flex justify-between items-center q-pl-md text-left text-blue text-weight-regular self-center">
        {{ $t('applicant.list.yearsExperience') }}
      </div>
      <div class="row">
        <div class="col-10 q-pl-md blue self-center">
          <span style="white-space: nowrap;">{{ totalMonthes() }}</span>
        </div>
      </div>
    </div>
    <div class="row q-pb-sm" v-if="data.addMonthes || edit">
      <div class="col-2 flex justify-between items-center q-pl-md text-left text-blue text-weight-regular self-center">
        {{ $t('common.add') }}
      </div>
      <div class="row">
        <div class="col-10 q-pl-md blue self-center flex">
          <span v-if="!edit" style="white-space: nowrap;">{{ totalMonthes(data.addMonthes) }}</span>

          <div v-if="edit" class="flex items-center no-wrap">
            <q-input dense outlined bg-color="white" type="number" :rules="[(val:number)=>val>=0]" v-model="addYears" :disable="loading" class="q-pb-none"/>
            <span class="q-mx-sm text-no-wrap">{{ $t('common.year').toLowerCase()  }}</span>
            <q-input dense outlined bg-color="white" type="number" :rules="[(val:number)=>val>=0]" v-model="addMonthes" :disable="loading" class="q-pb-none"/>
            <span class="q-ml-sm text-no-wrap">{{ $t('common.addMonth').toLowerCase()  }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-pb-sm" v-if="data.totalMonthes">
      <div class="col-2 flex justify-between items-center q-pl-md text-left text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.totalYearsExperience') }}
      </div>
      <div class="row">
        <div class="col-10 q-pl-md blue self-center flex">
          <span style="white-space: nowrap;">{{ totalMonthes(data.totalMonthes, false) }}</span>
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
import { differentDateMonth, myDateFormat, toDate } from 'src/shared/utils/utils';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { useApplicant } from 'src/stores/applicant';
import { workExpColumns as columns } from 'src/shared/constants/Applicant.const';
import { Alert } from 'src/shared/utils/Alert.utils';

const props = defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()

const applicantStore = useApplicant();

const addYears = ref('0')
const addMonthes = ref('0')

const loading = ref(false);
const openDialog = ref(false);
const edit = ref(false);
const data = ref({
  addMonthes: props.applicant.addMonthes,
  totalMonthes: props.applicant.totalMonthes,
})
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
function totalMonthes( add?: string | number, sum = false, returnMonth = false ) {
  let years = 0
  let month = 0
  if(typeof add === 'string'){
    add = parseInt(add)
  }
  if(sum && add){
    experienceData.value.forEach((row)=>{
      if(row.startMonth && row.endMonth){
        month += differentDateMonth(toDate(row.startMonth), toDate(row.endMonth))
      }
    })
    return totalMonthes(month + add, false, returnMonth)
  }

  if(add){
    years += Math.floor(add/12)
    month += add%12
    if(returnMonth){
      return add
    }
    return years  + ' ' + t('common.year') + ' ' + month + ' ' + t('common.addMonth').toLowerCase() 
  }
  
  experienceData.value.forEach((row)=>{
    if(row.startMonth && row.endMonth){
      years += Math.floor(differentDateMonth(toDate(row.startMonth), toDate(row.endMonth))/12)
      month += differentDateMonth(toDate(row.startMonth), toDate(row.endMonth))%12
    }
  })
  if(returnMonth){
    return years*12 + month
  }
  return years  + ' ' + t('common.year') + ' ' + month + ' ' + t('common.addMonth').toLowerCase() 
}

function resetData() {
  data.value.totalMonthes = props.applicant.totalMonthes
  data.value.addMonthes = props.applicant.addMonthes
  if(props.applicant.addMonthes){
    addYears.value = Math.floor(props.applicant.addMonthes / 12).toString()
    addMonthes.value = (props.applicant.addMonthes % 12).toString()
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
  data.value.addMonthes = parseInt(addYears.value)*12 + parseInt(addMonthes.value)
  data.value.totalMonthes = totalMonthes(data.value.addMonthes, true, true) as number
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    edit.value = false;
    
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
