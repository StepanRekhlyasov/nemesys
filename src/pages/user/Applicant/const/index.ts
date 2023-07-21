import { ClientFactoryTableColumn } from 'src/components/client-factory/types'
import { computed, ComputedRef, ref } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const boMapDrawerValue = ref<boolean>(false);

const searchDataSample = { sex: [], qualification: [], classification: [], occupation: [], availableShift: [], daysperweek: [] };
export const searchData = ref(JSON.parse(JSON.stringify(searchDataSample)));

export const checkValidity = (data)=>{
  const checkArr = ['ageMin','ageMax','workPerWeekMin','workPerWeekMax','yearsExperienceMin','yearsExperienceMax']
  checkArr.forEach(val=>{
    if(data[val]==0) data[val] = null;
  })
  if (data['ageMin'] && data['ageMax'] && Number(data['ageMin']) > Number(data['ageMax']) ) {
    throw new Error('Min Age must be lesser than Max Age');
}
else if (data['applicationDateMin'] && data['applicationDateMax'] && (data['applicationDateMin']) > (data['applicationDateMax'])) {
  throw new Error('Min Application Date must be lesser than Max Application Date');
}
else if (data['workPerWeekMin'] && data['workPerWeekMax'] && Number(data['workPerWeekMin']) > Number(data['workPerWeekMax'])) {
  throw new Error('Min Days per week must be lesser than Max Days per week');
}
else if (data['yearsExperienceMin'] && data['yearsExperienceMax'] && Number(data['yearsExperienceMin']) > Number(data['yearsExperienceMax'])) {
  throw new Error('Min Experience must be lesser than Max Experience');
}
}

export const tableColumnsSavedCriteriaList: ComputedRef<ClientFactoryTableColumn[]> = computed(() => [
  {
    name:'edit',
    required:true,
    align:'left',
    sortable: false,
  },
  {
    name:'keyword',
    required:true,
    align:'left',
    field: 'Keyword',
    sortable: false,
    label: t('common.searchKeyword'),
  },
  {
    name: 'Age',
    required: true,
    align: 'left',
    field: 'Age',
    sortable: true,
    label: t('applicant.list.fixEmployment.age'),
  },
  {
    name: 'Sex',
    required: true,
    align: 'left',
    field: 'Sex',
    sortable: false,
    label: t('applicant.add.sex')
  },
  {
    name: 'Staff Rank',
    required: true,
    align: 'left',
    field: 'Staff Rank',
    sortable: false,
    label: t('applicant.list.rank')
  },
  {
    name: 'Classification',
    required: true,
    align: 'left',
    field: 'Classification',
    sortable: false,
    label: t('applicant.list.info.classiffication')
  },
  {
    name: 'Occupation',
    required: true,
    align: 'left',
    field: 'Occupation',
    sortable: false,
    label: t('applicant.add.occupation')
  },
  {
    name: 'Prefecture',
    required: true,
    align: 'left',
    field: 'Prefecture',
    sortable: false,
    label: t('applicant.progress.filters.prefecture')
  },
  {
    name: 'Municipalities',
    required: true,
    align: 'left',
    field: 'Municipalities',
    sortable: false,
    label: t('applicant.add.municipalities')
  },
  {
    name: 'Route',
    required: true,
    align: 'left',
    field: 'Route',
    sortable: false,
    label: t('applicant.attendant.route')
  },
  {
    name: 'Nearest Station',
    required: true,
    align: 'left',
    field: 'Nearest Station',
    sortable: false,
    label: t('applicant.attendant.nearestStation')
  },
  {
    name: 'Qualification',
    required: true,
    align: 'left',
    field: 'Qualification',
    sortable: false,
    label: t('applicant.list.qualification')
  },
  {
    name: 'Years of Experience',
    required: true,
    align: 'left',
    field: 'Years of Experience',
    sortable: false,
    label: t('applicant.list.yearsExperience')
  },
  {
    name: 'Available Shift',
    required: true,
    align: 'left',
    field: 'Available Shift',
    sortable: false,
    label: t('applicant.list.availableShift')
  },
  {
    name: 'Available days of the week',
    required: true,
    align: 'left',
    field: 'Available days of the week',
    sortable: false,
    label: t('applicant.attendant.daysPerWeek')
  },
  {
    name: 'Days per week',
    required: true,
    align: 'left',
    field: 'Days per week',
    sortable: false,
    label: t('applicant.attendant.daysToWork')
  },
  {
    name: 'Application Date',
    required: true,
    align: 'left',
    field: 'Available Days',
    sortable: false,
    label: t('applicant.add.applicationDate')
  },
  {
    name: 'status',
    required: true,
    align: 'left',
    field: 'Available Days',
    sortable: false,
    label: t('applicant.add.status')
  },
]);
