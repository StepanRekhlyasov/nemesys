import { computed } from 'vue';
import { i18n } from 'boot/i18n'
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ClientFactoryTableRow, RenderOfficeDetails } from '../../types';

const { t } = i18n.global

export const clientFactoriesToTableRows = (factories: ClientFactory[]) => {
    return factories.map((factory) => {
        const row = {} as ClientFactoryTableRow

        row.id = factory.id
        row.distance = `${factory.distance}m`  
        row.fax = factory.fax
        row.office= {name: factory.name}
        row.address = factory.address
        row.telephone = factory.tel
        row.basicInfo = factory.basicInfoChangingFlag ? '✓（基本情報変更済）' : 'なし（基本情報変更済）'
        row.clientMaster = factory.clientFlag ? '✓（クライアント）' : 'なし（クライアント）'
        row.officeMaster = factory.existingOfficeFlag ? '✓（事業所) ' : 'なし（事業所) '

        return row
    })
}

export const useOfficeDetails = (clientFactory: ClientFactory): RenderOfficeDetails => {
  const officeDetails = {} as RenderOfficeDetails;

  officeDetails.registeredInfo = computed(() => {
    return [
        {label: t('clientFactory.drawer.details.parentClient'), value: clientFactory.officeDetails.registeredInfo.parentClient},
        {label: t('clientFactory.drawer.details.prefecture'), value: clientFactory.officeDetails.registeredInfo.prefecture },
        {label: t('clientFactory.drawer.details.officeName'), value: clientFactory.officeDetails.registeredInfo.officeName},
        {label: t('clientFactory.drawer.details.city'), value: clientFactory.officeDetails.registeredInfo.city },
        {label: '事業所TEL', value: clientFactory.officeDetails.registeredInfo.tel},
        {label: t('clientFactory.drawer.details.townAndStreet'), value: clientFactory.officeDetails.registeredInfo.townAndStreet },
        {label: '事業所FAX', value: clientFactory.officeDetails.registeredInfo.fax},
        {label: t('clientFactory.drawer.details.others'), value: clientFactory.officeDetails.registeredInfo.others },
        {label: t('clientFactory.drawer.details.latitude'), value: clientFactory.officeDetails.registeredInfo.latitude},
        {label: t('clientFactory.drawer.details.longitude'), value: clientFactory.officeDetails.registeredInfo.longitude}
    ]
  });

  officeDetails.commonItems = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.referralFeePer'), value: clientFactory.officeDetails.commonItems.referralFeePer},
      {label: t('clientFactory.drawer.details.referralFeeFix'), value: clientFactory.officeDetails.commonItems.referralFeeFix},
      {label: t('clientFactory.drawer.details.salaryHour'), value: clientFactory.officeDetails.commonItems.salaryHour},
      {label: t('clientFactory.drawer.details.salaryMonth'), value: clientFactory.officeDetails.commonItems.salaryMonth},
      {label: t('clientFactory.drawer.details.salaryAdditional'), value: clientFactory.officeDetails.commonItems.salaryAdditional},
      {label: t('clientFactory.drawer.details.payday'), value: clientFactory.officeDetails.commonItems.payday},
      {label: t('clientFactory.drawer.details.disabilityTime'), value: clientFactory.officeDetails.commonItems.disabilityTime},
      {label: t('clientFactory.drawer.details.yearFixed'), value: clientFactory.officeDetails.commonItems.yearFixed},
      {label: t('clientFactory.drawer.details.welfareHealth'), value: clientFactory.officeDetails.commonItems.welfareHealth},
      {label: t('clientFactory.drawer.details.leisureSpecial'), value: clientFactory.officeDetails.commonItems.leisureSpecial},
      {label: t('clientFactory.drawer.details.contentWork'), value: clientFactory.officeDetails.commonItems.contentWork},
      {label: t('clientFactory.drawer.details.dayOffYear'), value: clientFactory.officeDetails.commonItems.dayOffYear},
      {label: t('clientFactory.drawer.details.canSmoke'), value: `${clientFactory.officeDetails.commonItems.canSmoke}`},
      {label: t('clientFactory.drawer.details.dayOffWeek'), value: clientFactory.officeDetails.commonItems.dayOffWeek},
      {label: t('clientFactory.drawer.details.workingHourEarly'), value: clientFactory.officeDetails.commonItems.workingHourEarly},
      {label: t('clientFactory.drawer.details.workingHourDay'), value: clientFactory.officeDetails.commonItems.workingHourDay},
      {label: t('clientFactory.drawer.details.workingHourLate'), value: clientFactory.officeDetails.commonItems.workingHourLate},
      {label: t('clientFactory.drawer.details.workingHourNight'), value: clientFactory.officeDetails.commonItems.workingHourNight}
    ]
  })

  officeDetails.uniqueItems = computed(() => {
    const uniqueItems = Object.keys(clientFactory.officeDetails.uniqueItems).map((key) => {
      return {label: key, value: clientFactory.officeDetails.uniqueItems[key]}
    })

    return uniqueItems
  })  

  return officeDetails
}
