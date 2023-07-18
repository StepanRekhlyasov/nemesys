import { i18n } from 'boot/i18n';
import { computed } from 'vue';


export const facilityOp = computed(() => {
  const { t } = i18n.global
  return [
    {
      name: t('client.add.facilityOp.longCareWelfareFacilityElderly'),
      value: 'longCareWelfareFacilityElderly',
    },
    {
      name: t('client.add.facilityOp.nursingCareElderly'),
      value: 'nursingCareElderly',
    },
    {
      name: t('client.add.facilityOp.dayCareFacility'),
      value: 'dayCareFacility',
    },
    {
      name: t('client.add.facilityOp.dementiaLivingCare'),
      value: 'dementiaLivingCare',
    },
    {
      name: t('client.add.facilityOp.paidNursingHome'),
      value: 'paidNursingHome',
    },
    {
      name: t('client.add.facilityOp.elderlyHousingServices'),
      value: 'elderlyHousingServices',
    },
    {
      name: t('client.add.facilityOp.outpatientRehabilitation'),
      value: 'outpatientRehabilitation',
    },
    {
      name: t('client.add.facilityOp.smallMultifunFacility'),
      value: 'smallMultifunFacility',
    },
    {
      name: t('client.add.facilityOp.smallMultifunFacilityNurse'),
      value: 'smallMultifunFacilityNurse',
    },
    {
      name: t('client.add.facilityOp.shortResidentialCare'),
      value: 'shortResidentialCare',
    },
    { 
      name: t('client.add.facilityOp.careHouse'), 
      value: 'careHouse'
    },
    {
      name: t('client.add.facilityOp.longMedicalFacility'),
      value: 'longMedicalFacility',
    },
    {
      name: t('client.add.facilityOp.nursingCareClinic'),
      value: 'nursingCareClinic',
    },
    { 
      name: t('client.add.facilityOp.hospital'), 
      value: 'hospital'
    },
    { 
      name: t('client.add.facilityOp.clinic'), 
      value: 'clinic'
    },
    { 
      name: t('client.add.facilityOp.disablesFacility'), 
      value: 'disablesFacility'
    },
    {
      name: t('client.add.facilityOp.homeVisitCare'),
      value: 'homeVisitCare',
    },
    {
      name: t('client.add.facilityOp.homeNursing'),
      value: 'homeNursing',
    },
    {
      name: t('client.add.facilityOp.homeVisitRehabilitation'),
      value: 'homeVisitRehabilitation',
    },
    {
      name: t('client.add.facilityOp.homeBathingCare'),
      value: 'homeBathingCare',
    },
  ];
});
