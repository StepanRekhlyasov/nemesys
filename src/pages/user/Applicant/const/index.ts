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
    name:'condition',
    required:true,
    label:t('common.searchCondition'),
    align:'left',
    sortable: false,
  },
]);

export const taskTypeOptions = computed(()=>[
  {label: t('task.types.extensionConfirm'), value: 'extensionConfirm'},
  {label: t('task.types.finishApplicant'), value: 'finishApplicant'},
  {label: t('task.types.dateManagement'), value: 'dateManagement'},
  {label: t('task.types.visitManagement'), value: 'visitManagement'},
  {label: t('task.types.followUp'), value: 'followUp'},
  {label: t('task.types.collectDocs'), value: 'collectDocs'},
  {label: t('task.types.staffRequests'), value: 'staffRequests'},
  {label: t('task.types.clientsRequests'), value: 'clientsRequests'},
])
