import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const statusList = computed(() => {
  return [
    {
      label: t('applicant.statusOption.notCompatible'),
      value: 'notCompatible',
    },
    {
      label: t('applicant.statusOption.excludedApplicant'),
      value: 'excludedApplicant',
    },
    {
      label: t('applicant.statusOption.waitingContact'),
      value: 'waitingContact',
    },
    {
      label: t('applicant.statusOption.noContact'),
      value: 'noContact',
    },
    {
      label: t('applicant.statusOption.contacted'),
      value: 'contacted',
    },
    {
      label: t('applicant.statusOption.notAllowed'),
      value: 'notAllowed',
    },
    {
      label: t('applicant.statusOption.invitedWaiting'),
      value: 'invitedWaiting',
    },
    {
      label: t('applicant.statusOption.invitedNoContact'),
      value: 'invitedNoContact',
    },
    {
      label: t('applicant.statusOption.attendedNG'),
      value: 'attendedNG',
    },
    {
      label: t('applicant.statusOption.attendedWaiting'),
      value: 'attendedWaiting',
    },
    {
      label: t('applicant.statusOption.fixing'),
      value: 'fixing',
    },
    {
      label: t('applicant.statusOption.fixed'),
      value: 'fixed',
    },
    {
      label: t('applicant.statusOption.jobNG'),
      value: 'jobNG',
    },
    {
      label: t('applicant.statusOption.lookingJob'),
      value: 'lookingJob',
    },
    {
      label: t('applicant.statusOption.noOffer'),
      value: 'noOffer',
    },
    {
      label: t('applicant.statusOption.offered'),
      value: 'offered',
    },
    {
      label: t('applicant.statusOption.notHiring'),
      value: 'notHiring',
    },
    {
      label: t('applicant.statusOption.employed'),
      value: 'employed',
    },
    {
      label: t('applicant.statusOption.withdrawal'),
      value: 'withdrawal',
    },
    {
      label: t('applicant.statusOption.end'),
      value: 'end',
    },
    {
      label: t('applicant.statusOption.update'),
      value: 'update',
    },
    {
      label: t('applicant.statusOption.futureTalent'),
      value: 'futureTalent',
    },
    
    
  ];
});

