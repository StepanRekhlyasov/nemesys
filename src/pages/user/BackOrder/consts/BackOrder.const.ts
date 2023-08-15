import { computed, ref } from 'vue';
import { i18n } from 'boot/i18n';

export const radius = ref<number>(0);

export const drawerValue = ref<boolean>(false);
export const mapDrawerValue = ref<boolean>(false);

export const BackOrderColumns = computed(() => {
  const { t } = i18n.global;
  return [
    {
      name: 'BOID',
      required: true,
      label: 'BOID',
      align: 'left',
      field: 'boId',
      sortable: true,
    },
    {
      name: 'personnel',
      required: true,
      label: t('backOrder.personnel'),
      field: 'personnel',
      align: 'left',
      sortable: true,
    },
    {
      name: 'dateOfRegistration',
      required: true,
      label: t('backOrder.registrationDate'),
      field: 'dateOfRegistration',
      align: 'left',
      sortable: true,
    },
    {
      name: 'caseType',
      required: true,
      field: 'caseType',
      align: 'left',
      sortable: true,
    },
    {
      name: 'distance',
      required: true,
      label: t('backOrder.distance'),
      field: 'distance',
      align: 'left',
      sortable: true,
    },
    {
      name: 'name',
      field: 'name',
      align: 'left',
      sortable: true,
    },
    {
      name: 'employmentType',
      required: true,
      label: t('backOrder.employmentType'),
      field: 'employmentType',
      align: 'left',
      sortable: true,
    },
    {
      name: 'wage',
      required: true,
      label: t('backOrder.hourlyRate'),
      field: 'wage',
      align: 'left',
      sortable: true,
    },
    {
      name: 'salary',
      required: true,
      label: t('backOrder.monthlyWage'),
      field: 'salary',
      align: 'left',
      sortable: true,
    },
    {
      name: 'state',
      required: true,
      label: t('backOrder.state'),
      field: 'state',
      align: 'left',
      sortable: true,
    },
    {
      name: 'info',
    },
  ];
});

export const BackOrderStaff = computed(() => {
  const { t } = i18n.global;
  return [
    {
      name: 'name',
      required: true,
      label: t('backOrder.name'),
      field: 'name',
      align: 'left',
    },
    {
      name: 'distanceBusiness',
      required: true,
      label: t('backOrder.distanceBusiness'),
      field: 'distanceBusiness',
      align: 'left',
      sortable: true,
    },
    {
      name: 'matchDegree',
      required: true,
      label: t('backOrder.matchDegree'),
      field: 'matchDegree',
      align: 'left',
      sortable: true,
    },
    {
      name: 'statusThisTime',
      required: true,
      label: t('backOrder.statusThisTime'),
      field: 'statusThisTime',
      align: 'left',
    },
  ];
});

export const moreHalfYearExpOption = computed(() => {
  const { t } = i18n.global;
  return [
    {
      label: t('client.backOrder.necessary'),
      value: 'necessary',
    },
    {
      label: t('client.backOrder.unnecessary'),
      value: 'unnecessary',
    },
  ];
});

export const employmentTypeOption = computed(() => {
  const { t } = i18n.global;
  return [
    {
      label: t('client.backOrder.fullTime'),
      value: 'fullTime',
    },
    {
      label: t('client.backOrder.dispatchEm'),
      value: 'dispatchEm',
    },
    {
      label: t('client.backOrder.partTime'),
      value: 'partTime',
    },
    {
      label: t('client.backOrder.partTimeEmployee'),
      value: 'partTimeEmployee',
    },
  ];
});

export const qualificationOption = computed(() => {
  const { t } = i18n.global;
  return [
    {
      label: t('applicant.qualification.registeredNurse'),
      value: 'registeredNurse',
    },
    {
      label: t('applicant.qualification.assistantNurse'),
      value: 'assistantNurse',
    },
    {
      label: t('applicant.qualification.newcomer'),
      value: 'newcomer',
    },
    {
      label: t('applicant.qualification.careWorker'),
      value: 'careWorker',
    },
    {
      label: t('applicant.qualification.worker'),
      value: 'worker',
    },
  ];
});
