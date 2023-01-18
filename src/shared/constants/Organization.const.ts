import { computed } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const facilityList = computed(() => {
  return [
    {
      name: t('client.add.facilityOp.medicalClinic'),
      value: 'medicalClinic',
    },
    {
      name: t('client.add.facilityOp.homeVisitCare'),
      value: 'homeVisitCare',
    },
    { name: t('client.add.facilityOp.dayCare'), value: 'dayCare' },
    {
      name: t('client.add.facilityOp.homeVisitRehabilitation'),
      value: 'homeVisitRehabilitation',
    },
    {
      name: t('client.add.facilityOp.longMedicalFacility'),
      value: 'longMedicalFacility',
    },
    {
      name: t('client.add.facilityOp.homeNursing'),
      value: 'homeNursing',
    },
    { name: t('client.add.facilityOp.shortStay'), value: 'shortStay' },
    { name: t('client.add.facilityOp.dayService'), value: 'dayService' },
    {
      name: t('client.add.facilityOp.nursingCareElderly'),
      value: 'nursingCareElderly',
    },
    {
      name: t('client.add.facilityOp.specialElderlyNursingHome'),
      value: 'specialElderlyNursingHome',
    },
    {
      name: t('client.add.facilityOp.paidNursingHome'),
      value: 'paidNursingHome',
    },
    { name: t('client.add.facilityOp.groupHome'), value: 'groupHome' },
    {
      name: t('client.add.facilityOp.smallMultifunFacility'),
      value: 'smallMultifunFacility',
    },
    {
      name: t('client.add.facilityOp.homeCareNursing'),
      value: 'homeCareNursing',
    },
    {
      name: t('client.add.facilityOp.elderlyHousingServices'),
      value: 'elderlyHousingServices',
    },
    { name: t('client.add.facilityOp.clinic'), value: 'clinic' },
    { name: t('client.add.facilityOp.hospital'), value: 'hospital' },
    { name: t('client.add.facilityOp.careHouse'), value: 'careHouse' },
    {
      name: t('client.add.facilityOp.nursingCareClinic'),
      value: 'nursingCareClinic',
    },
    {
      name: t('client.add.facilityOp.dementiaLivingCare'),
      value: 'dementiaLivingCare',
    },
    {
      name: t('client.add.facilityOp.longCareWelfareFacilityElderly'),
      value: 'longCareWelfareFacilityElderly',
    },
    {
      name: t('client.add.facilityOp.communityNursingElderly'),
      value: 'communityNursingElderly',
    },
    {
      name: t('client.add.facilityOp.communitySpecificFacility'),
      value: 'communitySpecificFacility',
    },
    {
      name: t('client.add.facilityOp.dayCareFacility'),
      value: 'dayCareFacility',
    },
    { name: t('client.add.facilityOp.homeCare'), value: 'homeCare' },
    {
      name: t('client.add.facilityOp.specifiedWelfareSales'),
      value: 'specifiedWelfareSales',
    },
    {
      name: t('client.add.facilityOp.shortResidentialCare'),
      value: 'shortResidentialCare',
    },
    {
      name: t('client.add.facilityOp.lendingWelfareEquipment'),
      value: 'lendingWelfareEquipment',
    },
    {
      name: t('client.add.facilityOp.homeBathingCare'),
      value: 'homeBathingCare',
    },
    {
      name: t('client.add.facilityOp.livelihoodResidentFacility'),
      value: 'livelihoodResidentFacility',
    },
    {
      name: t('client.add.facilityOp.outpatientRehabilitation'),
      value: 'outpatientRehabilitation',
    },
    {
      name: t('client.add.facilityOp.dentalClinic'),
      value: 'dentalClinic',
    },
    { name: t('client.add.facilityOp.pharmacy'), value: 'pharmacy' },
  ];
});

