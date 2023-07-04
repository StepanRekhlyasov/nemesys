import { ApplicantFix } from 'src/shared/model';
import { Ref, watch } from 'vue';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';

export const useNGWatchers = (data : Ref<Partial<ApplicantFix>>, hightlightError : Ref<string[]>, reasonKey : string, detailKey : string, statusKey : string) => {
  watch(()=>data.value[reasonKey], (newVal)=>{
    if(newVal){
      hightlightError.value = hightlightError.value.filter((row)=>{
        return row !== 'reason'
      })
    }
  })
  watch(()=>data.value[detailKey], (newVal)=>{
    if(newVal){
      hightlightError.value = hightlightError.value.filter((row)=>{
        return row !== 'detail'
      })
    }
  })
  watch(()=>data.value[statusKey], (newVal)=>{
    if(newVal){
      data.value[reasonKey] = ''
      data.value[detailKey] = ''
    }
  })
}
export const useSaveHandler = (data : Ref<Partial<ApplicantFix>>, hightlightError: Ref<string[]>, reasonKey : string, detailKey : string, statusKey : string) => {
  hightlightError.value = []
  if(!data.value[statusKey]){
    if(!data.value[reasonKey]){
      hightlightError.value.push('reason')
    }
    if(!data.value[detailKey] && data.value[reasonKey] !== 'break_contact'){
      hightlightError.value.push('detail')
    }
  }
  if(hightlightError.value.length){
    return false;
  }
  return true;
}

export const destinationApplicant = computed(() => {
	const { t } = i18n.global
	return [
		{
			name: 'selected',
			required: true,
			label: '' ,
			field: 'selected',
			align: 'left',
		},
		{
			name: 'staffApplication',
			required: true,
			label: '' ,
			field: 'staffApplication',
			align: 'left',
		},
		{
			name: 'occupationAdress',
			required: true,
			label: '' ,
			field: 'occupationAdress',
			align: 'left',
		},
    {
			name: 'staffRank',
			required: true,
			label: t('applicant.list.rank') ,
			field: 'staffRank',
			align: 'left',
		},
    {
			name: 'status',
			required: true,
			label: t('applicant.list.status'),
			field: 'status',
			align: 'left',
		},
		{
			name: 'qualificationExp',
			required: true,
			label: '' ,
			field: 'qualificationExp',
			align: 'left',
		},
		{
			name: 'lineStation',
			required: true,
			label: '' ,
			field: 'station',
			align: 'left',
		},
  ]
})

export const options = computed(() => {
  const { t } = i18n.global
  return [
    {
      label: t('common.pleaseSelect'),
      value: 'Select',
    },
  ];
});
