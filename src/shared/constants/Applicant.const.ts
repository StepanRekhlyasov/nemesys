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
      label: t('applicant.statusOption.contactNG'),
      value: 'contactNG',
    },
    {
      label: t('applicant.statusOption.contactedWI'),
      value: 'contactedWI',
    },
    {
      label: t('applicant.statusOption.invitationNG'),
      value: 'invitationNG',
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
      label: t('applicant.statusOption.attendedWaitingFix'),
      value: 'attendedWaitingFix',
    },
    {
      label: t('applicant.statusOption.fixNG'),
      value: 'fixNG',
    },
    {
      label: t('applicant.statusOption.fixedWaiting'),
      value: 'fixedWaiting',
    },
    {
      label: t('applicant.statusOption.visitingNG'),
      value: 'visitingNG',
    },
    {
      label: t('applicant.statusOption.visitedWaitingOffer'),
      value: 'visitedWaitingOffer',
    },
    {
      label: t('applicant.statusOption.offerNG'),
      value: 'offerNG',
    },
    {
      label: t('applicant.statusOption.OfferedWaitingEntry'),
      value: 'OfferedWaitingEntry',
    },
    {
      label: t('applicant.statusOption.entryNG'),
      value: 'entryNG',
    },
    {
      label: t('applicant.statusOption.entered'),
      value: 'entered',
    },
    {
      label: t('applicant.statusOption.expiryNG'),
      value: 'expiryNG',
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
