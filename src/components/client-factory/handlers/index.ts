import { i18n } from 'boot/i18n';
import { computed } from 'vue';
import {arraysAreEqual, deepMerge } from 'src/shared/utils';
import { ClientFactory, Industry } from 'src/shared/model/ClientFactory.model';
import { RenderMainInfo, RenderOfficeDetailsWithoutIndustryType, RenderOfficeDetailsWithIndustryType, RenderHeadDetails } from '../types';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { deepCopy, safeGet } from 'src/shared/utils';
const { t } = i18n.global

export const finishEditing = (
  changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>,
  draft: Partial<ClientFactory>,
  clientFactory: ClientFactory,
) => {
  const removeEqualKeys = (obj1: Partial<ClientFactory>, obj2: ClientFactory) => {
    for (const key in obj1) {
      if (obj2.hasOwnProperty(key)) {
        if(Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          if(arraysAreEqual(obj1[key], obj2[key])) {
            delete obj1[key];
          }
        } else if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
          removeEqualKeys(obj1[key], obj2[key]);
          if (Object.keys(obj1[key]).length === 0) {
            delete obj1[key];
          }
        } else if (obj1[key] === obj2[key]) {
          delete obj1[key];
        }
      }
    }
  };

  if(!changedData) {
    return draft
  }

  changedData.forEach(({key, value}) => {
    let target = draft;
    const path = key.split('.');
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        target[key] = value;
      } else if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    });
  });

  removeEqualKeys(draft, clientFactory);

  return draft;
};

export const mergeWithDraft = (dataToMerge: ClientFactory | ModifiedCF, draft: Partial<ClientFactory>) => {
  return deepMerge(dataToMerge, draft)
}

export const useHighlightMainInfo = (traceableClientFactory: ClientFactory, draft: Partial<ClientFactory>): RenderMainInfo => {
  const clientFactory = deepCopy(traceableClientFactory) as ClientFactory;
  const mainInfo = {} as RenderMainInfo

  mainInfo.officeInfo = computed(() => {
    return [
      {label: '担当者MAIL', value: (safeGet(draft, 'mail') ?? safeGet(clientFactory, 'mail')) || '', editType: 'text', key: 'mail', isHighlight: safeGet(draft, 'mail') !== undefined && safeGet(clientFactory, 'mail') !== safeGet(draft, 'mail')},
      {label: t('clientFactory.homePage'), value: (safeGet(draft, 'homepageUrl') ?? safeGet(clientFactory, 'homepageUrl')) || '', editType: 'text', key: 'homepageUrl', isHighlight: safeGet(draft, 'homepageUrl') !== undefined && safeGet(clientFactory, 'homepageUrl') !== safeGet(draft, 'homepageUrl')},
      {label: t('clientFactory.numberEmployees'), value: (safeGet(draft, 'numberEmployees') ?? safeGet(clientFactory, 'numberEmployees')) || '', editType: 'text', key: 'numberEmployees', isHighlight: safeGet(draft, 'numberEmployees') !== undefined && safeGet(clientFactory, 'numberEmployees') !== safeGet(draft, 'numberEmployees')},
      {label: t('clientFactory.conclusionDispatchContract'), value: (safeGet(draft, 'isSignedDispatchContract') ?? safeGet(clientFactory, 'isSignedDispatchContract')) || false, editType: 'dispatch_contract', key: 'isSignedDispatchContract', isHighlight: safeGet(draft, 'isSignedDispatchContract') !== undefined && safeGet(clientFactory, 'isSignedDispatchContract') !== safeGet(draft, 'isSignedDispatchContract')},
      {label: t('clientFactory.facilityType'), value: (safeGet(draft, 'facilityType') ?? safeGet(clientFactory, 'facilityType')) || [], editType: 'facility', key: 'facilityType', isHighlight: safeGet(draft, 'facilityType') !== undefined && !arraysAreEqual(safeGet(clientFactory, 'facilityType'), safeGet(draft, 'facilityType'))},
      {label: t('clientFactory.conclusionReferralContract'), value: (safeGet(draft, 'isSignedReferralContract') ?? safeGet(clientFactory, 'isSignedReferralContract')) || false, editType: 'referral_contract', key: 'isSignedReferralContract', isHighlight: safeGet(draft, 'isSignedReferralContract') !== undefined && safeGet(clientFactory, 'isSignedReferralContract') !== safeGet(draft, 'isSignedReferralContract')}
    ]
  }).value

  mainInfo.contactInfo = computed(() => {
    return [
      {label: t('clientFactory.namePersonInCharge'), value: (safeGet(draft, 'nameContact') ?? safeGet(clientFactory, 'nameContact')) || '', editType: 'text', key: 'nameContact', isHighlight: safeGet(draft, 'nameContact') !== undefined && safeGet(clientFactory, 'nameContact') !== safeGet(draft, 'nameContact')},
      {label: t('clientFactory.personInChargeTitle'), value: (safeGet(draft, 'positionContact') ?? safeGet(clientFactory, 'positionContact')) || '', editType: 'text', key: 'positionContact', isHighlight: safeGet(draft, 'positionContact') !== undefined && safeGet(clientFactory, 'positionContact') !== safeGet(draft, 'positionContact')},
      {label: '担当者TEL', value: (safeGet(draft, 'telContact') ?? safeGet(clientFactory, 'telContact')) || '', editType: 'text', key: 'telContact', isHighlight: safeGet(draft, 'telContact') !== undefined && safeGet(clientFactory, 'telContact') !== safeGet(draft, 'telContact')},
      {label: '担当者MAIL', value: (safeGet(draft, 'mailContact') ?? safeGet(clientFactory, 'mailContact')) ||'', editType: 'text', key: 'mailContact', isHighlight: safeGet(draft, 'mailContact') !== undefined && safeGet(clientFactory, 'mailContact') !== safeGet(draft, 'mailContact')}
    ]
  }).value

  return mainInfo
}

export const useOfficeDetails = (clientFactory: ClientFactory, draft: Partial<ClientFactory>, industryType?: Industry[number]): RenderOfficeDetailsWithoutIndustryType | RenderOfficeDetailsWithIndustryType => {
  const officeDetails = {} as RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType;

  officeDetails.registeredInfo = computed(() => {
    return [
        {label: t('clientFactory.drawer.details.parentClient'), value:(safeGet(draft, 'client.name') ?? safeGet(clientFactory, 'client.name')) || '', editType: 'client', key: 'client.name', isHighlight: safeGet(draft, 'client.name') !== undefined && safeGet(clientFactory, 'client.name') !== safeGet(draft, 'client.name')},
        {label: t('clientFactory.drawer.details.prefecture'), value: (safeGet(draft, 'officeDetails.registeredInfo.prefecture') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.prefecture')) || '', editType: 'prefecture', key: 'officeDetails.registeredInfo.prefecture', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.prefecture') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.prefecture') !== safeGet(draft, 'officeDetails.registeredInfo.prefecture')},
        {label: t('clientFactory.drawer.details.officeName'), value: (safeGet(draft, 'officeDetails.registeredInfo.officeName') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.officeName')) || '', editType: 'text', key: 'officeDetails.registeredInfo.officeName', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.officeName') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.officeName') !== safeGet(draft, 'officeDetails.registeredInfo.officeName')},
        {label: t('clientFactory.drawer.details.city'), value: (safeGet(draft, 'officeDetails.registeredInfo.city') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.city')) || '', editType: 'text', key: 'officeDetails.registeredInfo.city', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.city') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.city') !== safeGet(draft, 'officeDetails.registeredInfo.city')},
        {label: '事業所TEL', value: (safeGet(draft, 'officeDetails.registeredInfo.tel') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.tel')) || '', editType: 'text', key: 'officeDetails.registeredInfo.tel', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.tel') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.tel') !== safeGet(draft, 'officeDetails.registeredInfo.tel')},
        {label: t('applicant.add.street'), value: (safeGet(draft, 'officeDetails.registeredInfo.street') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.street')) || '', editType: 'text', key: 'officeDetails.registeredInfo.street', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.street') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.street') !== safeGet(draft, 'officeDetails.registeredInfo.street')},
        {label: t('client.add.addressBuildingName'), value: (safeGet(draft, 'officeDetails.registeredInfo.building') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.building')) || '', editType: 'text', key: 'officeDetails.registeredInfo.building', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.building') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.building') !== safeGet(draft, 'officeDetails.registeredInfo.building')},
        {label: '事業所FAX', value: (safeGet(draft, 'officeDetails.registeredInfo.fax') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.fax')) || '', editType: 'text', key: 'officeDetails.registeredInfo.fax', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.fax') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.fax') !== safeGet(draft, 'officeDetails.registeredInfo.fax')},
        {label: t('clientFactory.drawer.details.others'), value: (safeGet(draft, 'officeDetails.registeredInfo.others') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.others')) || '', editType: 'text', key: 'officeDetails.registeredInfo.others', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.others') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.others') !== safeGet(draft, 'officeDetails.registeredInfo.others')},
        {label: t('clientFactory.drawer.details.latitude'), value: (safeGet(draft, 'officeDetails.registeredInfo.latitude') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.latitude')) || 0, editType: 'number', key: 'officeDetails.registeredInfo.latitude', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.latitude') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.latitude') !== safeGet(draft, 'officeDetails.registeredInfo.latitude')},
        {label: t('clientFactory.drawer.details.longitude'), value: (safeGet(draft, 'officeDetails.registeredInfo.longitude') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.longitude')) || 0, editType: 'number', key: 'officeDetails.registeredInfo.longitude', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.longitude') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.longitude') !== safeGet(draft, 'officeDetails.registeredInfo.longitude')}
    ]
  }).value;

  if(industryType) {
    officeDetails[`${industryType}.commonItems`] = computed(() => {
      return [
        {label: t('clientFactory.drawer.details.referralFeePer'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeePer`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.referralFeePer`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.referralFeePer`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeePer`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.referralFeePer`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeePer`)},
        {label: t('clientFactory.drawer.details.referralFeeFix'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeeFix`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.referralFeeFix`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.referralFeeFix`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeeFix`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.referralFeeFix`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.referralFeeFix`)},
        {label: t('clientFactory.drawer.details.salaryHour'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.salaryHour`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryHour`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.salaryHour`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.salaryHour`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryHour`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.salaryHour`)},
        {label: t('clientFactory.drawer.details.salaryMonth'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.salaryMonth`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryMonth`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.salaryMonth`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.salaryMonth`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryMonth`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.salaryMonth`)},
        {label: t('clientFactory.drawer.details.salaryAdditional'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.salaryAdditional`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryAdditional`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.salaryAdditional`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.salaryAdditional`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.salaryAdditional`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.salaryAdditional`)},
        {label: t('clientFactory.drawer.details.payday'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.payday`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.payday`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.payday`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.payday`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.payday`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.payday`)},
        {label: t('clientFactory.drawer.details.disabilityTime'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.disabilityTime`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.disabilityTime`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.disabilityTime`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.disabilityTime`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.disabilityTime`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.disabilityTime`)},
        {label: t('clientFactory.drawer.details.yearFixed'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.yearFixed`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.yearFixed`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.yearFixed`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.yearFixed`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.yearFixed`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.yearFixed`)},
        {label: t('clientFactory.drawer.details.welfareHealth'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.welfareHealth`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.welfareHealth`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.welfareHealth`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.welfareHealth`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.welfareHealth`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.welfareHealth`)},
        {label: t('clientFactory.drawer.details.leisureSpecial'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.leisureSpecial`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.leisureSpecial`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.leisureSpecial`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.leisureSpecial`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.leisureSpecial`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.leisureSpecial`)},
        {label: t('clientFactory.drawer.details.contentWork'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.contentWork`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.contentWork`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.contentWork`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.contentWork`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.contentWork`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.contentWork`)},
        {label: t('clientFactory.drawer.details.dayOffYear'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffYear`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.dayOffYear`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.dayOffYear`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffYear`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.dayOffYear`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffYear`)},
        {label: t('clientFactory.drawer.details.canSmoke'), value: `${(safeGet(draft, `officeDetails.${industryType}.commonItems.canSmoke`) ?? safeGet(clientFactory, 'officeDetails.${industryType}.commonItems.canSmoke'))|| ''}`, editType: 'text', key: `officeDetails.${industryType}.commonItems.canSmoke`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.canSmoke`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.canSmoke`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.canSmoke`)},
        {label: t('clientFactory.drawer.details.dayOffWeek'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffWeek`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.dayOffWeek`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.dayOffWeek`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffWeek`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.dayOffWeek`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.dayOffWeek`)},
        {label: t('clientFactory.drawer.details.workingHourEarly'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourEarly`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourEarly`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.workingHourEarly`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourEarly`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourEarly`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourEarly`)},
        {label: t('clientFactory.drawer.details.workingHourDay'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourDay`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourDay`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.workingHourDay`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourDay`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourDay`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourDay`)},
        {label: t('clientFactory.drawer.details.workingHourLate'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourLate`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourLate`)) || 0, editType: 'number', key: `officeDetails.${industryType}.commonItems.workingHourLate`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourLate`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourLate`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourLate`)},
        {label: t('clientFactory.drawer.details.workingHourNight'), value: (safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourNight`) ?? safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourNight`)) || '', editType: 'text', key: `officeDetails.${industryType}.commonItems.workingHourNight`, isHighlight: safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourNight`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.commonItems.workingHourNight`) !== safeGet(draft, `officeDetails.${industryType}.commonItems.workingHourNight`)}
      ]
    }).value

    officeDetails[`${industryType}.uniqueItems`] = computed(() => {

      const uniqueItems = Object.keys(safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems`) ?? {}).map((key) => {
          if(key) {
            return {label: key, value: (safeGet(draft, key) ?? safeGet(clientFactory, key)) || '', key: `clientFactory.officeDetails.${industryType}.uniqueItems.${key}`, editType: 'text', isHighlight: safeGet(draft, key) !== undefined && safeGet(clientFactory, key) !== safeGet(draft, key)}
          }

        return {label: '', value: '', editType: '', key: '', isHighlight: false}
      })

      return uniqueItems
    }).value
  } else {

    officeDetails.commonItems = computed(() => {
      return [
        {label: t('clientFactory.drawer.details.referralFeePer'), value: (safeGet(draft, 'officeDetails.commonItems.referralFeePer') ?? safeGet(clientFactory, 'officeDetails.commonItems.referralFeePer')) || 0, editType: 'number', key: 'officeDetails.commonItems.referralFeePer', isHighlight: safeGet(draft, 'officeDetails.commonItems.referralFeePer') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.referralFeePer') !== safeGet(draft, 'officeDetails.commonItems.referralFeePer')},
        {label: t('clientFactory.drawer.details.referralFeeFix'), value: (safeGet(draft, 'officeDetails.commonItems.referralFeeFix') ?? safeGet(clientFactory, 'officeDetails.commonItems.referralFeeFix')) || 0, editType: 'number', key: 'officeDetails.commonItems.referralFeeFix', isHighlight: safeGet(draft, 'officeDetails.commonItems.referralFeeFix') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.referralFeeFix') !== safeGet(draft, 'officeDetails.commonItems.referralFeeFix')},
        {label: t('clientFactory.drawer.details.salaryHour'), value: (safeGet(draft, 'officeDetails.commonItems.salaryHour') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryHour')) || 0, editType: 'number', key: 'officeDetails.commonItems.salaryHour', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryHour') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryHour') !== safeGet(draft, 'officeDetails.commonItems.salaryHour')},
        {label: t('clientFactory.drawer.details.salaryMonth'), value: (safeGet(draft, 'officeDetails.commonItems.salaryMonth') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryMonth')) || 0, editType: 'number', key: 'officeDetails.commonItems.salaryMonth', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryMonth') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryMonth') !== safeGet(draft, 'officeDetails.commonItems.salaryMonth')},
        {label: t('clientFactory.drawer.details.salaryAdditional'), value: (safeGet(draft, 'officeDetails.commonItems.salaryAdditional') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryAdditional')) || '', editType: 'text', key: 'officeDetails.commonItems.salaryAdditional', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryAdditional') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryAdditional') !== safeGet(draft, 'officeDetails.commonItems.salaryAdditional')},
        {label: t('clientFactory.drawer.details.payday'), value: (safeGet(draft, 'officeDetails.commonItems.payday') ?? safeGet(clientFactory, 'officeDetails.commonItems.payday')) || '', editType: 'text', key: 'officeDetails.commonItems.payday', isHighlight: safeGet(draft, 'officeDetails.commonItems.payday') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.payday') !== safeGet(draft, 'officeDetails.commonItems.payday')},
        {label: t('clientFactory.drawer.details.disabilityTime'), value: (safeGet(draft, 'officeDetails.commonItems.disabilityTime') ?? safeGet(clientFactory, 'officeDetails.commonItems.disabilityTime')) || '', editType: 'text', key: 'officeDetails.commonItems.disabilityTime', isHighlight: safeGet(draft, 'officeDetails.commonItems.disabilityTime') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.disabilityTime') !== safeGet(draft, 'officeDetails.commonItems.disabilityTime')},
        {label: t('clientFactory.drawer.details.yearFixed'), value: (safeGet(draft, 'officeDetails.commonItems.yearFixed') ?? safeGet(clientFactory, 'officeDetails.commonItems.yearFixed')) || '', editType: 'text', key: 'officeDetails.commonItems.yearFixed', isHighlight: safeGet(draft, 'officeDetails.commonItems.yearFixed') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.yearFixed') !== safeGet(draft, 'officeDetails.commonItems.yearFixed')},
        {label: t('clientFactory.drawer.details.welfareHealth'), value: (safeGet(draft, 'officeDetails.commonItems.welfareHealth') ?? safeGet(clientFactory, 'officeDetails.commonItems.welfareHealth')) || '', editType: 'text', key: 'officeDetails.commonItems.welfareHealth', isHighlight: safeGet(draft, 'officeDetails.commonItems.welfareHealth') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.welfareHealth') !== safeGet(draft, 'officeDetails.commonItems.welfareHealth')},
        {label: t('clientFactory.drawer.details.leisureSpecial'), value: (safeGet(draft, 'officeDetails.commonItems.leisureSpecial') ?? safeGet(clientFactory, 'officeDetails.commonItems.leisureSpecial')) || '', editType: 'text', key: 'officeDetails.commonItems.leisureSpecial', isHighlight: safeGet(draft, 'officeDetails.commonItems.leisureSpecial') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.leisureSpecial') !== safeGet(draft, 'officeDetails.commonItems.leisureSpecial')},
        {label: t('clientFactory.drawer.details.contentWork'), value: (safeGet(draft, 'officeDetails.commonItems.contentWork') ?? safeGet(clientFactory, 'officeDetails.commonItems.contentWork')) || '', editType: 'text', key: 'officeDetails.commonItems.contentWork', isHighlight: safeGet(draft, 'officeDetails.commonItems.contentWork') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.contentWork') !== safeGet(draft, 'officeDetails.commonItems.contentWork')},
        {label: t('clientFactory.drawer.details.dayOffYear'), value: (safeGet(draft, 'officeDetails.commonItems.dayOffYear') ?? safeGet(clientFactory, 'officeDetails.commonItems.dayOffYear')) || '', editType: 'text', key: 'officeDetails.commonItems.dayOffYear', isHighlight: safeGet(draft, 'officeDetails.commonItems.dayOffYear') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.dayOffYear') !== safeGet(draft, 'officeDetails.commonItems.dayOffYear')},
        {label: t('clientFactory.drawer.details.canSmoke'), value: `${(safeGet(draft, 'officeDetails.commonItems.canSmoke') ?? safeGet(clientFactory, 'officeDetails.commonItems.canSmoke'))|| ''}`, editType: 'text', key: 'officeDetails.commonItems.canSmoke', isHighlight: safeGet(draft, 'officeDetails.commonItems.canSmoke') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.canSmoke') !== safeGet(draft, 'officeDetails.commonItems.canSmoke')},
        {label: t('clientFactory.drawer.details.dayOffWeek'), value: (safeGet(draft, 'officeDetails.commonItems.dayOffWeek') ?? safeGet(clientFactory, 'officeDetails.commonItems.dayOffWeek')) || '', editType: 'text', key: 'officeDetails.commonItems.dayOffWeek', isHighlight: safeGet(draft, 'officeDetails.commonItems.dayOffWeek') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.dayOffWeek') !== safeGet(draft, 'officeDetails.commonItems.dayOffWeek')},
        {label: t('clientFactory.drawer.details.workingHourEarly'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourEarly') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourEarly')) || 0, editType: 'number', key: 'officeDetails.commonItems.workingHourEarly', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourEarly') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourEarly') !== safeGet(draft, 'officeDetails.commonItems.workingHourEarly')},
        {label: t('clientFactory.drawer.details.workingHourDay'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourDay') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourDay')) || '', editType: 'text', key: 'officeDetails.commonItems.workingHourDay', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourDay') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourDay') !== safeGet(draft, 'officeDetails.commonItems.workingHourDay')},
        {label: t('clientFactory.drawer.details.workingHourLate'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourLate') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourLate')) || 0, editType: 'number', key: 'officeDetails.commonItems.workingHourLate', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourLate') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourLate') !== safeGet(draft, 'officeDetails.commonItems.workingHourLate')},
        {label: t('clientFactory.drawer.details.workingHourNight'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourNight') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourNight')) || '', editType: 'text', key: 'officeDetails.commonItems.workingHourNight', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourNight') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourNight') !== safeGet(draft, 'officeDetails.commonItems.workingHourNight')}
      ]
    }).value 

    officeDetails.uniqueItems = computed(() => {

      const uniqueItems = Object.keys(safeGet(clientFactory, 'clientFactory.officeDetails.uniqueItems') ?? {}).map((key) => {
          if(key) {
            return {label: key, value: (safeGet(draft, key) ?? safeGet(clientFactory, key)) || '', key: `clientFactory.officeDetails.uniqueItems.${key}`, editType: 'text', isHighlight: safeGet(draft, key) !== undefined && safeGet(clientFactory, key) !== safeGet(draft, key)}
          }

          return {label: '', value: '', editType: '', key: '', isHighlight: false}
      })

      return uniqueItems
    }).value
  }

  return officeDetails
}

export const useHeadDetails = (clientFactory: ClientFactory): RenderHeadDetails => {
  const headDetails = {} as RenderHeadDetails

  headDetails.headOfficeInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.prefecture'), value: (safeGet(clientFactory, 'draft.clientFactory.officeDetails.registeredInfo.prefecture') ?? safeGet(clientFactory, 'clientFactory.officeDetails.registeredInfo.prefecture')) || '', editType: 'prefecture', key: 'officeDetails.registeredInfo.prefecture', isHighlight: safeGet(clientFactory, 'draft.clientFactory.officeDetails.registeredInfo.prefecture') !== undefined && safeGet(clientFactory, 'clientFactory.officeDetails.registeredInfo.prefecture') !== safeGet(clientFactory, 'draft.clientFactory.officeDetails.registeredInfo.prefecture')},
      {label: t('applicant.add.street'), value: (safeGet(clientFactory, 'draft.officeDetails.registeredInfo.city') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.city')) || '', editType: 'text', key: 'officeDetails.registeredInfo.city', isHighlight: safeGet(clientFactory, 'draft.officeDetails.registeredInfo.city') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.city') !== safeGet(clientFactory, 'draft.officeDetails.registeredInfo.city')},
      {label: t('client.add.municipalities'), value: (safeGet(clientFactory, 'draft.officeDetails.registeredInfo.municipality') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.municipality')) || '', editType: 'municipality', key: 'officeDetails.registeredInfo.municipality', isHighlight: safeGet(clientFactory, 'draft.officeDetails.registeredInfo.municipality') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.municipality') !== safeGet(clientFactory, 'draft.officeDetails.registeredInfo.municipality')},
      {label: t('client.add.addressBuildingName'), value: (safeGet(clientFactory, 'draft.officeDetails.registeredInfo.building') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.building')) || '', editType: 'text', key: 'officeDetails.registeredInfo.building', isHighlight: safeGet(clientFactory, 'draft.officeDetails.registeredInfo.building') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.building') !== safeGet(clientFactory, 'draft.officeDetails.registeredInfo.building')},
      {label: t('clientFactory.drawer.details.officeTel'), value: (safeGet(clientFactory, 'draft.tel') ?? safeGet(clientFactory, 'tel')) || '', editType: 'text', key: 'tel', isHighlight: safeGet(clientFactory, 'draft.tel') !== undefined && safeGet(clientFactory, 'tel') !== safeGet(clientFactory, 'draft.tel')},
      {label: t('clientFactory.drawer.details.officeFax'), value: (safeGet(clientFactory, 'draft.fax') ?? safeGet(clientFactory, 'fax')) || '', editType: 'text', key: 'fax', isHighlight: safeGet(clientFactory, 'draft.fax') !== undefined && safeGet(clientFactory, 'fax') !== safeGet(clientFactory, 'draft.fax')},
      {label: t('clientFactory.drawer.details.inChargeTitle'), value: (safeGet(clientFactory, 'draft.nameContact') ?? safeGet(clientFactory, 'nameContact')) || '', editType: 'text', key: 'nameContact', isHighlight: safeGet(clientFactory, 'draft.nameContact') !== undefined && safeGet(clientFactory, 'nameContact') !== safeGet(clientFactory, 'draft.nameContact')},
      {label: t('clientFactory.drawer.details.inChargeTel'), value: (safeGet(clientFactory, 'draft.telContact') ?? safeGet(clientFactory, 'telContact')) || '', editType: 'text', key: 'telContact', isHighlight: safeGet(clientFactory, 'draft.telContact') !== undefined && safeGet(clientFactory, 'telContact') !== safeGet(clientFactory, 'draft.telContact')},
      {label: t('clientFactory.drawer.details.inChargeAddress'), value: (safeGet(clientFactory, 'draft.positionContact') ?? safeGet(clientFactory, 'positionContact')) || '', editType: 'text', key: 'positionContact', isHighlight: safeGet(clientFactory, 'draft.positionContact') !== undefined && safeGet(clientFactory, 'positionContact') !== safeGet(clientFactory, 'draft.positionContact')}
    ]
  }).value

  headDetails.clientInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.representative'), value: safeGet(clientFactory, 'client.representativeName') ?? '', editType: 'text', key: 'representativeName'},
      {label: t('clientFactory.drawer.details.established'), value: safeGet(clientFactory, 'client.established') ?? '', editType: 'text', key: 'established'},
      {label: t('clientFactory.drawer.details.capital'), value: safeGet(clientFactory, 'client.capital') ?? '', editType: 'text', key: 'capital'},
      {label: t('clientFactory.drawer.details.earnings'), value: safeGet(clientFactory, 'client.earnings') ?? '', editType: 'text', key: 'earnings'},
      {label: t('clientFactory.drawer.details.numberOffices'), value: safeGet(clientFactory, 'client.numberOffices') ?? 0, editType: 'number', key: 'numberOffices'},
      {label: t('clientFactory.drawer.details.numberEmployees'), value: safeGet(clientFactory, 'client.numberEmployees') ?? 0, editType: 'number', key: 'numberEmployees'},
      {label: t('clientFactory.drawer.details.companyProfile'), value: safeGet(clientFactory, 'client.companyProfile') ?? '', editType: 'text', key: 'companyProfile'}
    ]
  }).value

  headDetails.contractInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.contractUnit'), value: safeGet(clientFactory, 'contractInfo.contractUnit') ?? '', editType: 'contract_unit', key: 'contractInfo.contractUnit'},
      {label: t('clientFactory.drawer.details.industry'), value: safeGet(clientFactory, 'contractInfo.industry') ?? [], editType: 'industry', key: 'contractInfo.industry'},
      {label: t('clientFactory.drawer.details.contractTel'), value: safeGet(clientFactory, 'contractInfo.contractTel') ?? '', editType: 'text', key: 'contractInfo.contractTel'},
      {label: t('clientFactory.drawer.details.contractFax'), value: safeGet(clientFactory, 'contractInfo.contractFax') ?? '', editType: 'text', key: 'contractInfo.contractFax'},
      {label: t('clientFactory.drawer.details.contractMail'), value: safeGet(clientFactory, 'contractInfo.contractMail') ?? '', editType: 'text', key: 'contractInfo.contractMail'},
      {label: t('clientFactory.drawer.details.contractPerson'), value: safeGet(clientFactory, 'contractInfo.contractPerson') ?? '', editType: 'text', key: 'contractInfo.contractPerson'}
    ]
  }).value

  return headDetails
}

export const useClientDetails = (clientFactory: ClientFactory): RenderHeadDetails['clientInfo'] => {
  return computed(() => [
      {label: t('clientFactory.drawer.details.representative'), value: safeGet(clientFactory, 'client.representativeName') ?? '', editType: 'text', key: 'representativeName'},
      {label: t('clientFactory.drawer.details.established'), value: safeGet(clientFactory, 'client.established') ?? '', editType: 'text', key: 'established'},
      {label: t('clientFactory.drawer.details.capital'), value: safeGet(clientFactory, 'client.capital') ?? '', editType: 'text', key: 'capital'},
      {label: t('clientFactory.drawer.details.earnings'), value: safeGet(clientFactory, 'client.earnings') ?? '', editType: 'text', key: 'earnings'},
      {label: t('clientFactory.drawer.details.numberOffices'), value: safeGet(clientFactory, 'client.numberOffices') ?? 0, editType: 'number', key: 'numberOffices'},
      {label: t('clientFactory.drawer.details.numberEmployees'), value: safeGet(clientFactory, 'client.numberEmployees') ?? 0, editType: 'number', key: 'numberEmployees'},
      {label: t('clientFactory.drawer.details.companyProfile'), value: safeGet(clientFactory, 'client.companyProfile') ?? '', editType: 'text', key: 'companyProfile'}
  ]).value
}