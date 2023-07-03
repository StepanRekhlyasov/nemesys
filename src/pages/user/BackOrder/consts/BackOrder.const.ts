import { computed } from 'vue';
import { i18n } from 'boot/i18n';


export const BackOrderColumns = computed(() => {
	const { t } = i18n.global
	return [
		{
			name: 'BOID',
			required: true,
			label: 'BOID',
			align: 'left',
			field: 'boId',
			sortable: false,
		},
		{
			name: 'personnel',
			required: true,
			label: t('backOrder.personnel') ,
			field: 'personnel',
			align: 'left',
		},
		{
			name: 'dateOfRegistration',
			required: true,
			label: t('backOrder.registrationDate') ,
			field: 'dateOfRegistration',
			align: 'left',
		},
		{
			name: 'caseType',
			required: true,
			field: 'caseType',
			align: 'left',
		},
		{
			name: 'distance',
			required: true,
			label: t('backOrder.distance'),
			field: 'distance',
			align: 'left',
		},
		{
			name: 'name',
			field: 'name',
			align: 'left',
		},
		{
			name: 'employmentType',
			required: true,
			label: t('backOrder.employmentType'),
			field: 'employmentType',
			align: 'left',
		},
		{
			name: 'wage',
			required: true,
			label: t('backOrder.hourlyRate'),
			field: 'wage',
			align: 'left',
		},
		{
			name: 'salary',
			required: true,
			label: t('backOrder.monthlyWage'),
			field: 'salary',
			align: 'left',
		},
		{
			name: 'state',
			required: true,
			label: t('backOrder.state'),
			field: 'state',
			align: 'left',
		},
		{
			name: 'info',
		},
	];
});


export const BackOrderStaff = computed(() => {
	const { t } = i18n.global
	return [
		{
			name: 'name',
			required: true,
			label: t('backOrder.name') ,
			field: 'name',
			align: 'left',
		},
		{
			name: 'distanceBusiness',
			required: true,
			label: t('backOrder.distanceBusiness') ,
			field: 'distanceBusiness',
			align: 'left',
		},
		{
			name: 'matchDegree',
			required: true,
			label: t('backOrder.matchDegree') ,
			field: 'matchDegree',
			align: 'left',
		},
		{
			name: 'statusThisTime',
			required: true,
			label: t('backOrder.statusThisTime') ,
			field: 'statusThisTime',
			align: 'left',
		},]
})

export const destinationApplicant = computed(() => {
	const { t } = i18n.global
	return [
    {
      name: 'selected',
			field: 'selected',
			align: 'left',
    },
		{
			name: 'keyword',
			required: true,
			label: t('backOrder.name') ,
			field: 'keyword',
			align: 'left',
		},
		{
			name: 'distanceBusiness',
			required: true,
			label: t('backOrder.distanceBusiness') ,
			field: 'distanceBusiness',
			align: 'left',
		},
		{
			name: 'matchDegree',
			required: true,
			label: t('backOrder.matchDegree') ,
			field: 'matchDegree',
			align: 'left',
		},
		{
			name: 'matchDegree',
			required: true,
			label: t('backOrder.matchDegree') ,
			field: 'matchDegree',
			align: 'left',
		},
		{
			name: 'matchDegree',
			required: true,
			label: t('backOrder.matchDegree') ,
			field: 'matchDegree',
			align: 'left',
		},
		{
			name: 'matchDegree',
			required: true,
			label: t('backOrder.matchDegree') ,
			field: 'matchDegree',
			align: 'left',
		},

  ]
})
