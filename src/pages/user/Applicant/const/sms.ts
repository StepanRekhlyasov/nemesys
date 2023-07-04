import { computed} from 'vue';
import { i18n } from 'boot/i18n';


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
