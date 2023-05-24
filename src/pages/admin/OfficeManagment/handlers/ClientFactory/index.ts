import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { ClientFactoryTableRow, RenderOfficeDetails, RenderHeadDetails } from '../../types';
import { useClientFactory } from 'src/stores/clientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { recursivelyRemoveField } from 'src/shared/utils';

const {updateClientFactory} = useClientFactory()
const { t } = i18n.global

export const updateClientFactoryHangler = (
  changedData: Array<{ label: string; value: string | number | string[]; editType: string; key: string }>,
  clientFactory: ClientFactory
  ) => {
    const updatedClientFactory = JSON.parse(JSON.stringify(clientFactory));

    changedData.forEach(({key, value}) => {
        const keys = key.split('.'); 
        let nestedObj = updatedClientFactory;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
                nestedObj[key] = value;
            } else {
                nestedObj[key] = nestedObj[key] || {}; 
                nestedObj = nestedObj[key];
            }
        }
    });

    recursivelyRemoveField(updatedClientFactory, 'created_at')
    updateClientFactory(updatedClientFactory);
};

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
        {label: t('clientFactory.drawer.details.parentClient'), value: clientFactory?.client?.name ?? '', editType: 'client', key: 'clientID'},
        {label: t('clientFactory.drawer.details.prefecture'), value: clientFactory?.officeDetails?.registeredInfo.prefecture ?? '', editType: 'prefecture', key: 'officeDetails.registeredInfo.prefecture'},
        {label: t('clientFactory.drawer.details.officeName'), value: clientFactory?.officeDetails?.registeredInfo.officeName ?? '', editType: 'text', key: 'officeDetails.registeredInfo.officeName'},
        {label: t('clientFactory.drawer.details.city'), value: clientFactory?.officeDetails?.registeredInfo.city ?? '', editType: 'text', key: 'officeDetails.registeredInfo.city' },
        {label: '事業所TEL', value: clientFactory?.officeDetails?.registeredInfo.tel ?? '', editType: 'text', key: 'officeDetails.registeredInfo.tel'},
        {label: t('clientFactory.drawer.details.townAndStreet'), value: clientFactory?.officeDetails?.registeredInfo.townAndStreet ?? '', editType: 'text', key: 'officeDetails.registeredInfo.townAndStreet' },
        {label: '事業所FAX', value: clientFactory?.officeDetails?.registeredInfo.fax ?? '', editType: 'text', key: 'officeDetails.registeredInfo.fax'},
        {label: t('clientFactory.drawer.details.others'), value: clientFactory?.officeDetails?.registeredInfo.others ?? '', editType: 'text', key: 'officeDetails.registeredInfo.others'},
        {label: t('clientFactory.drawer.details.latitude'), value: clientFactory?.officeDetails?.registeredInfo.latitude ?? 0, editType: 'number', key: 'officeDetails.registeredInfo.latitude'},
        {label: t('clientFactory.drawer.details.longitude'), value: clientFactory?.officeDetails?.registeredInfo.longitude ?? 0, editType: 'number', key: 'officeDetails.registeredInfo.longitude'}
    ]
  }).value;

  officeDetails.commonItems = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.referralFeePer'), value: clientFactory?.officeDetails?.commonItems.referralFeePer ?? 0, editType: 'number', key: 'officeDetails.commonItems.referralFeePer'},
      {label: t('clientFactory.drawer.details.referralFeeFix'), value: clientFactory?.officeDetails?.commonItems.referralFeeFix ?? 0, editType: 'number', key: 'officeDetails.commonItems.referralFeeFix'},
      {label: t('clientFactory.drawer.details.salaryHour'), value: clientFactory?.officeDetails?.commonItems.salaryHour ?? 0, editType: 'number', key: 'officeDetails.commonItems.salaryHour'},
      {label: t('clientFactory.drawer.details.salaryMonth'), value: clientFactory?.officeDetails?.commonItems.salaryMonth ?? 0, editType: 'number', key: 'officeDetails.commonItems.salaryMonth'},
      {label: t('clientFactory.drawer.details.salaryAdditional'), value: clientFactory?.officeDetails?.commonItems.salaryAdditional ?? '', editType: 'text', key: 'officeDetails.commonItems.salaryAdditional'},
      {label: t('clientFactory.drawer.details.payday'), value: clientFactory?.officeDetails?.commonItems.payday ?? '', editType: 'text', key: 'officeDetails.commonItems.payday'},
      {label: t('clientFactory.drawer.details.disabilityTime'), value: clientFactory?.officeDetails?.commonItems.disabilityTime ?? '', editType: 'text', key: 'officeDetails.commonItems.disabilityTime'},
      {label: t('clientFactory.drawer.details.yearFixed'), value: clientFactory?.officeDetails?.commonItems.yearFixed ?? '', editType: 'text', key: 'officeDetails.commonItems.yearFixed'},
      {label: t('clientFactory.drawer.details.welfareHealth'), value: clientFactory?.officeDetails?.commonItems.welfareHealth ?? '', editType: 'text', key: 'officeDetails.commonItems.welfareHealth'},
      {label: t('clientFactory.drawer.details.leisureSpecial'), value: clientFactory?.officeDetails?.commonItems.leisureSpecial ?? '', editType: 'text', key: 'officeDetails.commonItems.leisureSpecial'},
      {label: t('clientFactory.drawer.details.contentWork'), value: clientFactory?.officeDetails?.commonItems.contentWork ?? '', editType: 'text', key: 'officeDetails.commonItems.contentWork'},
      {label: t('clientFactory.drawer.details.dayOffYear'), value: clientFactory?.officeDetails?.commonItems.dayOffYear ?? '', editType: 'text', key: 'officeDetails.commonItems.dayOffYear'},
      {label: t('clientFactory.drawer.details.canSmoke'), value: `${clientFactory?.officeDetails?.commonItems.canSmoke ?? ''}`, editType: 'text', key: 'officeDetails.commonItems.canSmoke'},
      {label: t('clientFactory.drawer.details.dayOffWeek'), value: clientFactory?.officeDetails?.commonItems.dayOffWeek ?? '', editType: 'text', key: 'officeDetails.commonItems.dayOffWeek'},
      {label: t('clientFactory.drawer.details.workingHourEarly'), value: clientFactory?.officeDetails?.commonItems.workingHourEarly ?? 0, editType: 'number', key: 'officeDetails.commonItems.workingHourEarly'},
      {label: t('clientFactory.drawer.details.workingHourDay'), value: clientFactory?.officeDetails?.commonItems.workingHourDay ?? '', editType: 'text', key: 'officeDetails.commonItems.workingHourDay'},
      {label: t('clientFactory.drawer.details.workingHourLate'), value: clientFactory?.officeDetails?.commonItems.workingHourLate ?? 0, editType: 'number', key: 'officeDetails.commonItems.workingHourLate'},
      {label: t('clientFactory.drawer.details.workingHourNight'), value: clientFactory?.officeDetails?.commonItems.workingHourNight ?? '', editType: 'text', key: 'officeDetails.commonItems.workingHourNight'}
    ]
  }).value

  officeDetails.uniqueItems = computed(() => {

    const uniqueItems = Object.keys(clientFactory.officeDetails?.uniqueItems ?? {}).map((key) => {
        if(key) {
          return {label: key, value: clientFactory.officeDetails?.uniqueItems[key] ?? '', key: `clientFactory.officeDetails.uniqueItems.${key}`, editType: 'text'}
        }

        return {label: '', value: '', editType: '', key: ''}
    })

    return uniqueItems
  }).value

  return officeDetails
}

export const useHeadDetails = (clientFactory: ClientFactory): RenderHeadDetails => {
  const headDetails = {} as RenderHeadDetails

  headDetails.headOfficeInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.officeLocation'), value: clientFactory.address ?? '', editType: 'text', key: 'address'},
      {label: t('clientFactory.drawer.details.officeTel'), value: clientFactory.tel ?? '', editType: 'text', key: 'tel'},
      {label: t('clientFactory.drawer.details.officeFax'), value: clientFactory.fax ?? '', editType: 'text', key: 'fax'},
      {label: t('clientFactory.drawer.details.inChargeTitle'), value: clientFactory.nameContact ?? '', editType: 'text', key: 'nameContact'},
      {label: t('clientFactory.drawer.details.inChargeTel'), value: clientFactory.telContact ?? '', editType: 'text', key: 'telContact'},
      {label: t('clientFactory.drawer.details.inChargeAddress'), value: clientFactory.positionContact ?? '', editType: 'text', key: 'positionContact'}
    ]
  }).value

  headDetails.clientInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.representative'), value: clientFactory.client?.representativeName ?? '', editType: 'text', key: 'client.representativeName'},
      {label: t('clientFactory.drawer.details.established'), value: clientFactory.client?.established ?? '', editType: 'text', key: 'client.established'},
      {label: t('clientFactory.drawer.details.capital'), value: clientFactory.client?.capital ?? '', editType: 'text', key: 'client.capital'},
      {label: t('clientFactory.drawer.details.earnings'), value: clientFactory.client?.earnings ?? '', editType: 'text', key: 'client.earnings'},
      {label: t('clientFactory.drawer.details.numberOffices'), value: clientFactory.client?.numberOffices ?? 0, editType: 'number', key: 'client.numberOffices'},
      {label: t('clientFactory.drawer.details.numberEmployees'), value: clientFactory.client?.numberEmployees ?? 0, editType: 'number', key: 'client.numberEmployees'},
      {label: t('clientFactory.drawer.details.companyProfile'), value: clientFactory.client?.companyProfile ?? '', editType: 'text', key: 'client.companyProfile'}
    ]
  }).value

  headDetails.contractInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.contractUnit'), value: clientFactory.contractInfo?.contractUnit ?? '', editType: 'contract_unit', key: 'contractInfo.contractUnit'},
      {label: t('clientFactory.drawer.details.industry'), value: clientFactory.contractInfo?.industry ? clientFactory.contractInfo?.industry : [], editType: 'industry', key: 'contractInfo.industry'},
      {label: t('clientFactory.drawer.details.contractTel'), value: clientFactory.contractInfo?.contractTel ?? '', editType: 'text', key: 'contractInfo.contractTel'},
      {label: t('clientFactory.drawer.details.contractFax'), value: clientFactory.contractInfo?.contractFax ?? '', editType: 'text', key: 'contractInfo.contractFax'},
      {label: t('clientFactory.drawer.details.contractMail'), value: clientFactory.contractInfo?.contractMail ?? '', editType: 'text', key: 'contractInfo.contractMail'},
      {label: t('clientFactory.drawer.details.contractPerson'), value: clientFactory.contractInfo?.contractPerson ?? '', editType: 'text', key: 'contractInfo.contractPerson'}
    ]
  }).value

  return headDetails
}

export const useImportLogLabels = computed(() => {
  return [
    t('clientFactory.drawer.details.executionUser'),
    t('clientFactory.drawer.details.executionDateTime'),
    t('clientFactory.drawer.details.sourceCompany'),
    t('clientFactory.drawer.details.update_create'),
    t('clientFactory.drawer.details.captured')
  ]
})

export const useReflectLogLabels = computed(() => {
  return [
    t('clientFactory.drawer.details.executionUser'),
    t('clientFactory.drawer.details.executionDateTime'),
    t('clientFactory.drawer.details.update_create'),
    t('clientFactory.drawer.details.captured'),
  ]
})