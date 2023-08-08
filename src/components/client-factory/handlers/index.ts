import { i18n } from 'boot/i18n';
import { computed } from 'vue';
import {arraysAreEqual, deepMerge } from 'src/shared/utils';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
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
      {label: t('menu.admin.organizationsTable.manager')+'TEL', value: (safeGet(draft, 'telContact') ?? safeGet(clientFactory, 'telContact')) || '', editType: 'text', key: 'telContact', isHighlight: safeGet(draft, 'telContact') !== undefined && safeGet(clientFactory, 'telContact') !== safeGet(draft, 'telContact')},
      {label: t('menu.admin.organizationsTable.manager')+'MAIL', value: (safeGet(draft, 'mailContact') ?? safeGet(clientFactory, 'mailContact')) ||'', editType: 'text', key: 'mailContact', isHighlight: safeGet(draft, 'mailContact') !== undefined && safeGet(clientFactory, 'mailContact') !== safeGet(draft, 'mailContact')}
    ]
  }).value
  
  return mainInfo
}

export const useOfficeDetails = (clientFactory: ClientFactory, draft: Partial<ClientFactory>, industryType?: string): RenderOfficeDetailsWithoutIndustryType | RenderOfficeDetailsWithIndustryType => {
  const officeDetails = {} as RenderOfficeDetailsWithIndustryType | RenderOfficeDetailsWithoutIndustryType;

  officeDetails.registeredInfo = computed(() => {
    return [
        {label: t('clientFactory.drawer.details.parentClient'), value:(safeGet(draft, 'client.name') ?? safeGet(clientFactory, 'client.name')) || '', editType: 'client', key: 'client.name', isHighlight: safeGet(draft, 'client.name') !== undefined && safeGet(clientFactory, 'client.name') !== safeGet(draft, 'client.name')},
        {label: t('clientFactory.drawer.details.prefecture'), value: (safeGet(draft, 'prefecture') ?? safeGet(clientFactory, 'prefecture')) || '', editType: 'prefecture', key: 'prefecture', isHighlight: safeGet(draft, 'prefecture') !== undefined && safeGet(clientFactory, 'prefecture') !== safeGet(draft, 'prefecture')},
        {label: t('clientFactory.drawer.details.officeName'), value: (safeGet(draft, 'name') ?? safeGet(clientFactory, 'name')) || '', editType: 'text', key: 'text', isHighlight: safeGet(draft, 'name') !== undefined && safeGet(clientFactory, 'name') !== safeGet(draft, 'name')},
        {label: t('clientFactory.drawer.details.municipality'), value: (safeGet(draft, 'municipality') ?? safeGet(clientFactory, 'municipality')) || '', editType: 'municipality', key: 'municipality', isHighlight: safeGet(draft, 'municipality') !== undefined && safeGet(clientFactory, 'municipality') !== safeGet(draft, 'municipality')},
        {label: '事業所TEL', value: (safeGet(draft, 'officeDetails.registeredInfo.tel') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.tel')) || '', editType: 'text', key: 'officeDetails.registeredInfo.tel', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.tel') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.tel') !== safeGet(draft, 'officeDetails.registeredInfo.tel')},
        {label: t('applicant.add.street'), value: (safeGet(draft, 'officeDetails.registeredInfo.street') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.street')) || '', editType: 'text', key: 'officeDetails.registeredInfo.street', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.street') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.street') !== safeGet(draft, 'officeDetails.registeredInfo.street')},
        {label: '事業所FAX', value: (safeGet(draft, 'officeDetails.registeredInfo.fax') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.fax')) || '', editType: 'text', key: 'officeDetails.registeredInfo.fax', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.fax') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.fax') !== safeGet(draft, 'officeDetails.registeredInfo.fax')},
        {label: t('client.add.addressBuildingName'), value: (safeGet(draft, 'officeDetails.registeredInfo.building') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.building')) || '', editType: 'text', key: 'officeDetails.registeredInfo.building', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.building') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.building') !== safeGet(draft, 'officeDetails.registeredInfo.building')},
        {label: t('clientFactory.drawer.details.latitude'), value: (safeGet(draft, 'officeDetails.registeredInfo.latitude') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.latitude')) || '', editType: 'number', key: 'officeDetails.registeredInfo.latitude', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.latitude') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.latitude') !== safeGet(draft, 'officeDetails.registeredInfo.latitude')},
        {label: t('clientFactory.drawer.details.longitude'), value: (safeGet(draft, 'officeDetails.registeredInfo.longitude') ?? safeGet(clientFactory, 'officeDetails.registeredInfo.longitude')) || '', editType: 'number', key: 'officeDetails.registeredInfo.longitude', isHighlight: safeGet(draft, 'officeDetails.registeredInfo.longitude') !== undefined && safeGet(clientFactory, 'officeDetails.registeredInfo.longitude') !== safeGet(draft, 'officeDetails.registeredInfo.longitude')}
    ]
  }).value;

  if(industryType) {
    officeDetails[`${industryType}.commonItems`] = computed(() => {
      return [
        {label: t('clientFactory.drawer.details.referralFeePer'), value: (safeGet(draft, 'officeDetails.'+industryType+'.referralFeePer') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.referralFeePer')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.referralFeePer', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.referralFeePer') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.referralFeePer') !== safeGet(draft, 'officeDetails.'+industryType+'.referralFeePer')},
        {label: t('clientFactory.drawer.details.salaryHour'), value: (safeGet(draft, 'officeDetails.'+industryType+'.salaryHour') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryHour')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.salaryHour', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.salaryHour') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryHour') !== safeGet(draft, 'officeDetails.'+industryType+'.salaryHour')},
        {label: t('clientFactory.drawer.details.referralFeeFix'), value: (safeGet(draft, 'officeDetails.'+industryType+'.referralFeeFix') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.referralFeeFix')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.referralFeeFix', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.referralFeeFix') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.referralFeeFix') !== safeGet(draft, 'officeDetails.'+industryType+'.referralFeeFix')},
        {label: t('clientFactory.drawer.details.salaryMonth'), value: (safeGet(draft, 'officeDetails.'+industryType+'.salaryMonth') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryMonth')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.salaryMonth', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.salaryMonth') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryMonth') !== safeGet(draft, 'officeDetails.'+industryType+'.salaryMonth')},
        {label: t('clientFactory.drawer.details.contentWork'), value: (safeGet(draft, 'officeDetails.'+industryType+'.contentWork') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.contentWork')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.contentWork', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.contentWork') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.contentWork') !== safeGet(draft, 'officeDetails.'+industryType+'.contentWork')},
        {label: t('clientFactory.drawer.details.payday'), value: (safeGet(draft, 'officeDetails.'+industryType+'.payday') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.payday')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.payday', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.payday') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.payday') !== safeGet(draft, 'officeDetails.'+industryType+'.payday')},
        {label: t('clientFactory.drawer.details.welfareHealth'), value: (safeGet(draft, 'officeDetails.'+industryType+'.welfareHealth') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.welfareHealth')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.welfareHealth', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.welfareHealth') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.welfareHealth') !== safeGet(draft, 'officeDetails.'+industryType+'.welfareHealth')},
        {label: t('clientFactory.drawer.details.salaryAdditional'), value: (safeGet(draft, 'officeDetails.'+industryType+'.salaryAdditional') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryAdditional')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.salaryAdditional', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.salaryAdditional') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.salaryAdditional') !== safeGet(draft, 'officeDetails.'+industryType+'.salaryAdditional')},
        {label: t('clientFactory.drawer.details.leisureSpecial'), value: (safeGet(draft, 'officeDetails.'+industryType+'.leisureSpecial') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.leisureSpecial')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.leisureSpecial', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.leisureSpecial') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.leisureSpecial') !== safeGet(draft, 'officeDetails.'+industryType+'.leisureSpecial')},
        {label: t('clientFactory.drawer.details.workingHourEarly'), value: (safeGet(draft, 'officeDetails.'+industryType+'.workingHourEarly') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourEarly')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.workingHourEarly', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.workingHourEarly') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourEarly') !== safeGet(draft, 'officeDetails.'+industryType+'.workingHourEarly')},
        {label: t('clientFactory.drawer.details.yearFixed'), value: (safeGet(draft, 'officeDetails.'+industryType+'.yearFixed') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.yearFixed')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.yearFixed', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.yearFixed') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.yearFixed') !== safeGet(draft, 'officeDetails.'+industryType+'.yearFixed')},
        {label: t('clientFactory.drawer.details.workingHourDay'), value: (safeGet(draft, 'officeDetails.'+industryType+'.workingHourDay') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourDay')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.workingHourDay', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.workingHourDay') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourDay') !== safeGet(draft, 'officeDetails.'+industryType+'.workingHourDay')},
        {label: t('clientFactory.drawer.details.canSmoke'), value: `${(safeGet(draft, 'officeDetails.'+industryType+'.canSmoke') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.canSmoke'))|| ''}`, editType: 'radio', key: 'officeDetails.'+industryType+'.canSmoke', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.canSmoke') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.canSmoke') !== safeGet(draft, 'officeDetails.'+industryType+'.canSmoke'), radioVals: [{label: t('smoking.yes'), value: '有'}, {label: t('smoking.no'), value: '無'}]},
        {label: t('clientFactory.drawer.details.workingHourLate'), value: (safeGet(draft, 'officeDetails.'+industryType+'.workingHourLate') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourLate')) || '', editType: 'number', key: 'officeDetails.'+industryType+'.workingHourLate', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.workingHourLate') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourLate') !== safeGet(draft, 'officeDetails.'+industryType+'.workingHourLate')},
        {label: t('office.commutingByCar'), value: (safeGet(draft, 'officeDetails.'+industryType+'.commutingByCar') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.commutingByCar')) || '', editType: 'radio', key: 'officeDetails.'+industryType+'.commutingByCar', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.commutingByCar') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.commutingByCar') !== safeGet(draft, 'officeDetails.'+industryType+'.commutingByCar'), radioVals: [{label: t('applicant.attendant.possible'), value: '可'}, {label: t('applicant.attendant.no'), value: '不可'}]},
        {label: t('clientFactory.drawer.details.workingHourNight'), value: (safeGet(draft, 'officeDetails.'+industryType+'.workingHourNight') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourNight')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.workingHourNight', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.workingHourNight') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.workingHourNight') !== safeGet(draft, 'officeDetails.'+industryType+'.workingHourNight')},
        {label: t('backOrder.create.availabilityOfGarage'), value: (safeGet(draft, 'officeDetails.'+industryType+'.availabilityOfGarage') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.availabilityOfGarage')) || '', editType: 'radio', key: 'officeDetails.'+industryType+'.availabilityOfGarage', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.availabilityOfGarage') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.availabilityOfGarage') !== safeGet(draft, 'officeDetails.'+industryType+'.availabilityOfGarage'), radioVals: [{label: t('smoking.yes'), value: '有'}, {label: t('smoking.no'), value: '無'}]},
        {label: t('clientFactory.drawer.details.dayOffYear'), value: (safeGet(draft, 'officeDetails.'+industryType+'.dayOffYear') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.dayOffYear')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.dayOffYear', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.dayOffYear') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.dayOffYear') !== safeGet(draft, 'officeDetails.'+industryType+'.dayOffYear')},
        {label: t('backOrder.create.parkingRemarks'), value: (safeGet(draft, 'officeDetails.'+industryType+'.parkingRemarks') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.parkingRemarks')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.parkingRemarks', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.parkingRemarks') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.parkingRemarks') !== safeGet(draft, 'officeDetails.'+industryType+'.parkingRemarks')},
        {label: t('clientFactory.drawer.details.dayOffWeek'), value: (safeGet(draft, 'officeDetails.'+industryType+'.dayOffWeek') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.dayOffWeek')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.dayOffWeek', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.dayOffWeek') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.dayOffWeek') !== safeGet(draft, 'officeDetails.'+industryType+'.dayOffWeek')},
        { label: '', value: '', editType: '', key: '', isHighlight: '' },
        {label: t('clientFactory.drawer.details.disabilityTime'), value: (safeGet(draft, 'officeDetails.'+industryType+'.disabilityTime') ?? safeGet(clientFactory, 'officeDetails.'+industryType+'.disabilityTime')) || '', editType: 'text', key: 'officeDetails.'+industryType+'.disabilityTime', isHighlight: safeGet(draft, 'officeDetails.'+industryType+'.disabilityTime') !== undefined && safeGet(clientFactory, 'officeDetails.'+industryType+'.disabilityTime') !== safeGet(draft, 'officeDetails.'+industryType+'.disabilityTime')},
      ]
    }).value

    officeDetails[`${industryType}.uniqueItems`] = computed(() => {

      // const uniqueItems = Object.keys(safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems`) ?? {}).map((key) => {
      const uniqueItems : Record<string, string | number | boolean>[] = []
      for(const [key, item] of Object.entries(safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems`) || {})){
        
        const title = (item as {title : string}).title
        const order = (item as {order : number}).order
        if(title){
          uniqueItems.push({
            label: title, 
            value: (safeGet(draft, `officeDetails.${industryType}.uniqueItems.${key}.value`) ?? safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems.${key}.value`)),
            key: `officeDetails.${industryType}.uniqueItems.${key}.value`, 
            editType: typeof safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems.${key}.value`) === 'number' ? 'number' : 'text', 
            isHighlight: safeGet(draft, `officeDetails.${industryType}.uniqueItems.${key}.value`) !== undefined && safeGet(clientFactory, `officeDetails.${industryType}.uniqueItems.${key}.value`) !== safeGet(draft, `officeDetails.${industryType}.uniqueItems.${key}.value`),
            order: order
          })
        }
      }
      uniqueItems.sort((a, b)=>{
        return (a.order as number) - (b.order as number)
      })

      return uniqueItems
    }).value
  } else {

    officeDetails.commonItems = computed(() => {
      return [
        {label: t('clientFactory.drawer.details.referralFeePer'), value: (safeGet(draft, 'officeDetails.commonItems.referralFeePer') ?? safeGet(clientFactory, 'officeDetails.commonItems.referralFeePer')) || '', editType: 'number', key: 'officeDetails.commonItems.referralFeePer', isHighlight: safeGet(draft, 'officeDetails.commonItems.referralFeePer') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.referralFeePer') !== safeGet(draft, 'officeDetails.commonItems.referralFeePer')},
        {label: t('clientFactory.drawer.details.salaryHour'), value: (safeGet(draft, 'officeDetails.commonItems.salaryHour') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryHour')) || '', editType: 'number', key: 'officeDetails.commonItems.salaryHour', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryHour') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryHour') !== safeGet(draft, 'officeDetails.commonItems.salaryHour')},
        {label: t('clientFactory.drawer.details.referralFeeFix'), value: (safeGet(draft, 'officeDetails.commonItems.referralFeeFix') ?? safeGet(clientFactory, 'officeDetails.commonItems.referralFeeFix')) || '', editType: 'number', key: 'officeDetails.commonItems.referralFeeFix', isHighlight: safeGet(draft, 'officeDetails.commonItems.referralFeeFix') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.referralFeeFix') !== safeGet(draft, 'officeDetails.commonItems.referralFeeFix')},
        {label: t('clientFactory.drawer.details.salaryMonth'), value: (safeGet(draft, 'officeDetails.commonItems.salaryMonth') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryMonth')) || '', editType: 'number', key: 'officeDetails.commonItems.salaryMonth', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryMonth') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryMonth') !== safeGet(draft, 'officeDetails.commonItems.salaryMonth')},
        {label: t('clientFactory.drawer.details.contentWork'), value: (safeGet(draft, 'officeDetails.commonItems.contentWork') ?? safeGet(clientFactory, 'officeDetails.commonItems.contentWork')) || '', editType: 'text', key: 'officeDetails.commonItems.contentWork', isHighlight: safeGet(draft, 'officeDetails.commonItems.contentWork') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.contentWork') !== safeGet(draft, 'officeDetails.commonItems.contentWork')},
        {label: t('clientFactory.drawer.details.payday'), value: (safeGet(draft, 'officeDetails.commonItems.payday') ?? safeGet(clientFactory, 'officeDetails.commonItems.payday')) || '', editType: 'text', key: 'officeDetails.commonItems.payday', isHighlight: safeGet(draft, 'officeDetails.commonItems.payday') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.payday') !== safeGet(draft, 'officeDetails.commonItems.payday')},
        {label: t('clientFactory.drawer.details.welfareHealth'), value: (safeGet(draft, 'officeDetails.commonItems.welfareHealth') ?? safeGet(clientFactory, 'officeDetails.commonItems.welfareHealth')) || '', editType: 'text', key: 'officeDetails.commonItems.welfareHealth', isHighlight: safeGet(draft, 'officeDetails.commonItems.welfareHealth') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.welfareHealth') !== safeGet(draft, 'officeDetails.commonItems.welfareHealth')},
        {label: t('clientFactory.drawer.details.salaryAdditional'), value: (safeGet(draft, 'officeDetails.commonItems.salaryAdditional') ?? safeGet(clientFactory, 'officeDetails.commonItems.salaryAdditional')) || '', editType: 'text', key: 'officeDetails.commonItems.salaryAdditional', isHighlight: safeGet(draft, 'officeDetails.commonItems.salaryAdditional') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.salaryAdditional') !== safeGet(draft, 'officeDetails.commonItems.salaryAdditional')},
        {label: t('clientFactory.drawer.details.leisureSpecial'), value: (safeGet(draft, 'officeDetails.commonItems.leisureSpecial') ?? safeGet(clientFactory, 'officeDetails.commonItems.leisureSpecial')) || '', editType: 'text', key: 'officeDetails.commonItems.leisureSpecial', isHighlight: safeGet(draft, 'officeDetails.commonItems.leisureSpecial') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.leisureSpecial') !== safeGet(draft, 'officeDetails.commonItems.leisureSpecial')},
        {label: t('clientFactory.drawer.details.workingHourEarly'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourEarly') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourEarly')) || '', editType: 'number', key: 'officeDetails.commonItems.workingHourEarly', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourEarly') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourEarly') !== safeGet(draft, 'officeDetails.commonItems.workingHourEarly')},
        {label: t('clientFactory.drawer.details.yearFixed'), value: (safeGet(draft, 'officeDetails.commonItems.yearFixed') ?? safeGet(clientFactory, 'officeDetails.commonItems.yearFixed')) || '', editType: 'text', key: 'officeDetails.commonItems.yearFixed', isHighlight: safeGet(draft, 'officeDetails.commonItems.yearFixed') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.yearFixed') !== safeGet(draft, 'officeDetails.commonItems.yearFixed')},
        {label: t('clientFactory.drawer.details.workingHourDay'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourDay') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourDay')) || '', editType: 'text', key: 'officeDetails.commonItems.workingHourDay', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourDay') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourDay') !== safeGet(draft, 'officeDetails.commonItems.workingHourDay')},
        {label: t('clientFactory.drawer.details.canSmoke'), value: `${(safeGet(draft, 'officeDetails.commonItems.canSmoke') ?? safeGet(clientFactory, 'officeDetails.commonItems.canSmoke'))|| ''}`, editType: 'text', key: 'officeDetails.commonItems.canSmoke', isHighlight: safeGet(draft, 'officeDetails.commonItems.canSmoke') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.canSmoke') !== safeGet(draft, 'officeDetails.commonItems.canSmoke')},
        {label: t('clientFactory.drawer.details.workingHourLate'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourLate') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourLate')) || '', editType: 'number', key: 'officeDetails.commonItems.workingHourLate', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourLate') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourLate') !== safeGet(draft, 'officeDetails.commonItems.workingHourLate')},
        {label: t('office.commutingByCar'), value: (safeGet(draft, 'officeDetails.commonItems.commutingByCar') ?? safeGet(clientFactory, 'officeDetails.commonItems.commutingByCar')) || '', editType: 'radio', key: 'officeDetails.commonItems.commutingByCar', isHighlight: safeGet(draft, 'officeDetails.commonItems.commutingByCar') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.commutingByCar') !== safeGet(draft, 'officeDetails.commonItems.commutingByCar'), radioVals: [{label: t('applicant.attendant.possible'), value: '可'}, {label: t('applicant.attendant.no'), value: '不可'}]},
        {label: t('clientFactory.drawer.details.workingHourNight'), value: (safeGet(draft, 'officeDetails.commonItems.workingHourNight') ?? safeGet(clientFactory, 'officeDetails.commonItems.workingHourNight')) || '', editType: 'text', key: 'officeDetails.commonItems.workingHourNight', isHighlight: safeGet(draft, 'officeDetails.commonItems.workingHourNight') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.workingHourNight') !== safeGet(draft, 'officeDetails.commonItems.workingHourNight')},
        {label: t('backOrder.create.availabilityOfGarage'), value: (safeGet(draft, 'officeDetails.commonItems.availabilityOfGarage') ?? safeGet(clientFactory, 'officeDetails.commonItems.availabilityOfGarage')) || '', editType: 'radio', key: 'officeDetails.commonItems.availabilityOfGarage', isHighlight: safeGet(draft, 'officeDetails.commonItems.availabilityOfGarage') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.availabilityOfGarage') !== safeGet(draft, 'officeDetails.commonItems.availabilityOfGarage'), radioVals: [{label: t('smoking.yes'), value: '有'}, {label: t('smoking.no'), value: '無'}]},
        {label: t('clientFactory.drawer.details.dayOffYear'), value: (safeGet(draft, 'officeDetails.commonItems.dayOffYear') ?? safeGet(clientFactory, 'officeDetails.commonItems.dayOffYear')) || '', editType: 'text', key: 'officeDetails.commonItems.dayOffYear', isHighlight: safeGet(draft, 'officeDetails.commonItems.dayOffYear') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.dayOffYear') !== safeGet(draft, 'officeDetails.commonItems.dayOffYear')},
        {label: t('backOrder.create.parkingRemarks'), value: (safeGet(draft, 'officeDetails.commonItems.parkingRemarks') ?? safeGet(clientFactory, 'officeDetails.commonItems.parkingRemarks')) || '', editType: 'text', key: 'officeDetails.commonItems.parkingRemarks', isHighlight: safeGet(draft, 'officeDetails.commonItems.parkingRemarks') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.parkingRemarks') !== safeGet(draft, 'officeDetails.commonItems.parkingRemarks')},
        {label: t('clientFactory.drawer.details.dayOffWeek'), value: (safeGet(draft, 'officeDetails.commonItems.dayOffWeek') ?? safeGet(clientFactory, 'officeDetails.commonItems.dayOffWeek')) || '', editType: 'text', key: 'officeDetails.commonItems.dayOffWeek', isHighlight: safeGet(draft, 'officeDetails.commonItems.dayOffWeek') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.dayOffWeek') !== safeGet(draft, 'officeDetails.commonItems.dayOffWeek')},
        { label: '', value: '', editType: '', key: '', isHighlight: '' },
        {label: t('clientFactory.drawer.details.disabilityTime'), value: (safeGet(draft, 'officeDetails.commonItems.disabilityTime') ?? safeGet(clientFactory, 'officeDetails.commonItems.disabilityTime')) || '', editType: 'text', key: 'officeDetails.commonItems.disabilityTime', isHighlight: safeGet(draft, 'officeDetails.commonItems.disabilityTime') !== undefined && safeGet(clientFactory, 'officeDetails.commonItems.disabilityTime') !== safeGet(draft, 'officeDetails.commonItems.disabilityTime')},
      ]
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