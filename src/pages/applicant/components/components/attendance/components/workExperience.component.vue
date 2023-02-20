<template>
  <div class="row q-pb-md justify-between">
    <div class="flex self-center">
      <span class="text-primary text-h6">2.{{ $t('applicant.attendant.workExperience') }}</span>
      <div>
        <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
          class="text-grey-9" @click="show = false" v-if="show" />
        <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
          class="text-grey-9" @click="show = true" v-else />
      </div>
    </div>
    <div class="col-3 text-right" v-if="show">
      <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm" />
      <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save" size="sm" />
      <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm" />
    </div>
  </div>
  <template v-if="show">
    <div class="row ">
      <div class="text-blue text-weight-regular self-center text-subtitle1 ">
        [{{ $t('applicant.attendant.experienceDetails') }}]
      </div>
      <q-btn :label="$t('common.addNew')" color="primary" icon="mdi-plus-thick" @click="openDialog=true" class="no-shadow q-ml-lg" size="sm"/>
    </div>

    <div class="row q-pa-sm"></div>

    <q-table
      :columns="columns"
      :rows="experienceData"
      row-key="id"
      v-model:pagination="pagination"
      class="q-ma-none q-pa-none no-shadow"
      hide-pagination>

      <template v-slot:header-cell-experience="props">
        <q-th :props="props">
          {{$t('applicant.attendant.experience')}}<br/>
          {{$t('applicant.attendant.facilityType')}}<br/>
        </q-th>
      </template>

      <template v-slot:header-cell-month="props">
        <q-th :props="props">
          {{$t('applicant.attendant.startMonth')}}<br/>
          {{$t('applicant.attendant.endMonth')}}<br/>
        </q-th>
      </template>

      <template v-slot:header-cell-establishment="props">
        <q-th :props="props">
          {{$t('applicant.attendant.nameEstablishment')}}<br/>
          {{$t('applicant.attendant.employmentType')}}<br/>
        </q-th>
      </template>

      <template v-slot:body-cell-experience="props">
        <q-td :props="props">
          {{ props.row.experience  }}<br/>
          {{ props.row.facilityType  }}<br/>
        </q-td>
      </template>

      <template v-slot:body-cell-years="props">
        <q-td :props="props">
          {{ differentDateYear(props.row.startMonth, props.row.endMonth)+' ' +$t('common.year') }}
        </q-td>
      </template>

      <template v-slot:body-cell-month="props">
        <q-td :props="props">
          {{ props.row.startMonth  }}<br/>
          {{ props.row.endMonth  }}<br/>
        </q-td>
      </template>

      <template v-slot:body-cell-establishment="props">
        <q-td :props="props">
          {{ props.row.nameEstablishment  }}<br/>
          {{ props.row.employmentType? $t('applicant.list.info.'+props.row.employmentType): '' }}<br/>
        </q-td>
      </template>


      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat @click="editExperience=props.row;openDialog=true;"/>
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn style="color: #222222" icon="delete" size="sm" round flat @click="deleteExperience(props.row)" />
        </q-td>
      </template>
    </q-table>

    <div class="row q-pa-sm"></div>

    <div class="row q-pb-sm">
      <div class="col-2 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.attendant.totalYearsExperience') }}
      </div>
      <div class="col-4 q-pl-md blue self-center">
        <span v-if="!edit">{{ applicant.totalYear || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white"
          v-model="data['totalYear']" :disable="loading" />
      </div>
    </div>
    <div>

    </div>
  </template>
  <q-dialog v-model="openDialog">
    <workExperienceForm @closeDialog="load();openDialog=false;" :editExperience="editExperience" :applicantId="applicant.id"/>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { computed, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where } from '@firebase/firestore';
import workExperienceForm from './companents/workExperience.form.vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { differentDateYear } from 'src/shared/utils/utils';
import { ApplicantExperience } from 'src/shared/model';

export default {
  name: 'workExperienceComponent',
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
  components: {
    workExperienceForm
  },
  setup(props) {
    const show = ref(false);
    const loading = ref(false);
    const openDialog = ref(false);
    const edit = ref(false);
    const data = computed(() => {
      return {
      totalYear: props.applicant['totalYear']
      }
    })
    const editExperience: Ref<ApplicantExperience | undefined> = ref(undefined)
    const experienceData: Ref<ApplicantExperience[]> = ref([]);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
        {
          name: 'edit',
          align: 'left',
          headerStyle: 'width: 24px'
        },
        {
          name: 'experience',
          required: true,
          align: 'left',
          field: 'experience',
          sortable: false,
        },{
          name: 'month',
          required: true,
          field: 'month',
          align: 'left',
        },{
          name: 'years',
          required: true,
          label: t('applicant.attendant.years') ,
          field: 'years',
          align: 'left',
        },{
          name: 'establishment',
          field: 'establishment',
          align: 'left',
        },{
          name: 'reasonResignation',
          label: t('applicant.attendant.reasonResignation') ,
          field: 'reasonResignation',
          align: 'left',
        },{
          name: 'pastInterviews',
          label: t('applicant.attendant.pastInterviews') ,
          field: 'pastInterviews',
          align: 'left',
        },
        {
          name: 'delete',
          align: 'left',
        }
      ];
    });

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();
    const db = getFirestore();


    load();
    function load() {
      editExperience.value=undefined;
      const q = query(collection(db, 'applicants/'+props.applicant.id+'/experience/'), where('deleted', '==', false));
      onSnapshot(q, (querySnapshot) => {
        let list: ApplicantExperience[] = [];
        querySnapshot.forEach((doc) => {
          const data = {...doc.data() as ApplicantExperience};
          data['id'] = doc.id;
          list.push(data);
        });
        experienceData.value = list;
      });
    }

    return {
      show,
      edit,
      data,
      loading,
      columns,
      pagination,
      experienceData,
      openDialog,
      editExperience,

      differentDateYear,
      load,
      deleteExperience(experience) {
        $q.dialog({
          title: t('common.delete'),
          message: t('applicant.attendant.deletedInfo'),
          ok:{
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
          },
        }).onOk(async () => {
          try{
            loading.value = true;
            const boRef = doc(db, 'applicants/'+props.applicant.id+'/experience/'+experience.id);
            await updateDoc(boRef, {
              deleted: true
            })
            load();
            Alert.success($q, t)
          } catch (e) {
            console.log(e)
            Alert.warning($q, t)
            loading.value = false;
          }
        })
      },
      async save() {
        loading.value = true
        try {
          await props.updateApplicant(data.value);
          Alert.success($q, t);
          edit.value = false;
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
