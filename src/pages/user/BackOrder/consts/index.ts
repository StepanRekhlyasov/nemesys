import { ClientFactoryTableColumn } from 'src/components/client-factory/types'
import { computed, ComputedRef, ref } from 'vue';
import { i18n } from 'boot/i18n';
import { DocumentData } from 'firebase/firestore';

const { t } = i18n.global
const searchDataSample = {
  employmenttype: [],
  qualifications: [],
  transactiontype: [],
  typecase: [],
};
export const sharedData = ref<DocumentData>(JSON.parse(JSON.stringify(searchDataSample)));
export function updateSharedVariable(newValue: DocumentData) {
    sharedData.value = newValue;
}
export function resetSharedVariable(){
    sharedData.value = JSON.parse(JSON.stringify(searchDataSample));
}
export const searchData = ref(JSON.parse(JSON.stringify(searchDataSample)));

export const tableColumnsSavedCriteriaList: ComputedRef<ClientFactoryTableColumn[]> = computed(() => [
  {
    name:'condition',
    required:true,
    label:t('common.searchCondition'),
    align:'left',
    sortable: false,
  },
]);

export const checkValidity = (data)=>{
  const checkArr = ['ageMin','ageMax','workPerWeekMin','workPerWeekMax','yearsExperienceMin','yearsExperienceMax']
  checkArr.forEach(val=>{
    if(data[val]==0) data[val] = null;
  })
  if (data['ageMin'] && data['ageMax'] && Number(data['ageMin']) > Number(data['ageMax']) ) {
    throw new Error('Min Age must be lesser than Max Age');
}
else if (data['registrationDateMax'] && data['registrationDateMin']) {
  const maxDate = Date.parse(data['registrationDateMax']);
  const minDate = Date.parse(data['registrationDateMin']);
  if(minDate>maxDate){
    throw new Error('Registration Date min must be lesser than Registration Date max');
  }
}
else if(data['boid']){
  if (!(/^\d+$/.test(data['boid'])) || Number(data['boid'])===0) {
    throw new Error('BOID must be positive integer');
  }
}
}
