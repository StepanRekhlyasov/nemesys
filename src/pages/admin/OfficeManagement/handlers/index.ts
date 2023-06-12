import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { RenderOfficeDetails, RenderHeadDetails, RenderMainInfo } from '../types';
import { ClientFactoryTableRow } from 'src/components/client-factory/types';
import { useClientFactory } from 'src/stores/clientFactory';
import { useClient } from 'src/stores/client';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { recursivelyRemoveField, safeGet, arraysAreEqual } from 'src/shared/utils';

const {updateClientFactory} = useClientFactory()
const {updateClient} = useClient()
const { t } = i18n.global

export const updateClientFactoryHangler = (
  changedData: Array<{ label: string; value: string | number | boolean | string[]; editType: string; key: string }>,
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

export const updateClientHandler = (
  changedData: Array<{ label: string; value: string | number | boolean | string[]; editType: string; key: string }>,
  clientFactory: ClientFactory
) => {
  const updatedClient = JSON.parse(JSON.stringify(clientFactory.client))

  changedData.forEach(({key, value}) => {
        const keys = key.split('.'); 
        let nestedObj = updatedClient;
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

  recursivelyRemoveField(updatedClient, 'created_at')
  updateClient(clientFactory.clientID, updatedClient)
}

export const clientFactoriesToTableRows = (factories: ClientFactory[]) => {
    return factories.map((factory) => {
        const row = {} as ClientFactoryTableRow

        row.id = factory.id
        row.distance = `${factory.distance}m`  
        row.fax = factory.fax
        row.office= {name: factory.name, isHead: factory.isHead, clientName: factory.client?.representativeName}
        row.address = factory.address
        row.telephone = factory.tel
        row.basicInfo = factory.basicInfoChangingFlag ? '✓（基本情報変更済）' : 'なし（基本情報変更済）'
        row.clientMaster = factory.clientFlag ? '✓（クライアント）' : 'なし（クライアント）'
        row.officeMaster = factory.existingOfficeFlag ? '✓（事業所) ' : 'なし（事業所) '

        return row
    })
}

export const useHighlightMainInfo = (clientFactory: ClientFactory): RenderMainInfo => {
  const mainInfo = {} as RenderMainInfo

  mainInfo.officeInfo = computed(() => {
    return [
      {label: '担当者MAIL', value: (safeGet(clientFactory, 'draft.mail') ?? safeGet(clientFactory, 'mail')) || '', editType: 'text', key: 'mail', isHighlight: safeGet(clientFactory, 'draft.mail') !== undefined && safeGet(clientFactory, 'mail') !== safeGet(clientFactory, 'draft.mail')},
      {label: t('clientFactory.homePage'), value: (safeGet(clientFactory, 'draft.homepageUrl') ?? safeGet(clientFactory, 'homepageUrl')) || '', editType: 'text', key: 'homepageUrl', isHighlight: safeGet(clientFactory, 'draft.homepageUrl') !== undefined && safeGet(clientFactory, 'homepageUrl') !== safeGet(clientFactory, 'draft.homepageUrl')},
      {label: t('clientFactory.numberEmployees'), value: (safeGet(clientFactory, 'draft.numberEmployees') ?? safeGet(clientFactory, 'numberEmployees')) || '', editType: 'text', key: 'numberEmployees', isHighlight: safeGet(clientFactory, 'draft.numberEmployees') !== undefined && safeGet(clientFactory, 'numberEmployees') !== safeGet(clientFactory, 'draft.numberEmployees')},
      {label: t('clientFactory.conclusionDispatchContract'), value: (safeGet(clientFactory, 'draft.isSignedDispatchContract') ?? safeGet(clientFactory, 'isSignedDispatchContract')) || false, editType: 'dispatch_contract', key: 'isSignedDispatchContract', isHighlight: safeGet(clientFactory, 'draft.isSignedDispatchContract') !== undefined && safeGet(clientFactory, 'isSignedDispatchContract') === safeGet(clientFactory, 'draft.isSignedDispatchContract')},
      {label: t('clientFactory.facilityType'), value: (safeGet(clientFactory, 'draft.facilityType') ?? safeGet(clientFactory, 'facilityType')) || [], editType: 'facility', key: 'facilityType', isHighlight: safeGet(clientFactory, 'draft.facilityType') !== undefined && !arraysAreEqual(safeGet(clientFactory, 'facilityType'), safeGet(clientFactory, 'draft.facilityType'))},
      {label: t('clientFactory.conclusionReferralContract'), value: (safeGet(clientFactory, 'draft.isSignedReferralContract') || safeGet(clientFactory, 'isSignedReferralContract')) || false, editType: 'referral_contract', key: 'isSignedReferralContract', isHighlight: safeGet(clientFactory, 'draft.isSignedReferralContract') !== undefined && safeGet(clientFactory, 'isSignedReferralContract') === safeGet(clientFactory, 'draft.isSignedReferralContract')}
    ]
  }).value

  mainInfo.contactInfo = computed(() => {
    return [
      {label: t('clientFactory.namePersonInCharge'), value: (safeGet(clientFactory, 'draft.nameContact') ?? safeGet(clientFactory, 'nameContact')) || '', editType: 'text', key: 'nameContact', isHighlight: safeGet(clientFactory, 'draft.nameContact') !== undefined && safeGet(clientFactory, 'nameContact') !== safeGet(clientFactory, 'draft.nameContact')},
      {label: t('clientFactory.personInChargeTitle'), value: (safeGet(clientFactory, 'draft.positionContact') ?? safeGet(clientFactory, 'positionContact')) || '', editType: 'text', key: 'positionContact', isHighlight: safeGet(clientFactory, 'draft.positionContact') !== undefined && safeGet(clientFactory, 'positionContact') !== safeGet(clientFactory, 'draft.positionContact')},
      {label: '担当者TEL', value: (safeGet(clientFactory, 'draft.telContact') ?? safeGet(clientFactory, 'telContact')) || '', editType: 'text', key: 'telContact', isHighlight: safeGet(clientFactory, 'draft.telContact') !== undefined && safeGet(clientFactory, 'telContact') !== safeGet(clientFactory, 'draft.telContact')},
      {label: '担当者MAIL', value: (safeGet(clientFactory, 'draft.mailContact') ?? safeGet(clientFactory, 'mailContact')) ||'', editType: 'text', key: 'mailContact', isHighlight: safeGet(clientFactory, 'draft.mailContact') !== undefined && safeGet(clientFactory, 'mailContact') !== safeGet(clientFactory, 'draft.mailContact')}
    ]
  }).value

  return mainInfo
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
        {label: t('clientFactory.drawer.details.townAndStreet'), value: clientFactory?.officeDetails?.registeredInfo?.street + ' ' + clientFactory?.officeDetails?.registeredInfo?.building ?? '', editType: 'text', key: 'officeDetails.registeredInfo.townAndStreet' },
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
      {label: t('clientFactory.drawer.details.prefecture'), value: clientFactory?.officeDetails?.registeredInfo.prefecture ?? '', editType: 'prefecture', key: 'officeDetails.registeredInfo.prefecture'},
      {label: t('applicant.add.street'), value: clientFactory?.officeDetails?.registeredInfo.street ?? '', editType: 'text', key: 'officeDetails.registeredInfo.city' },
      {label: t('client.add.municipalities'), value: clientFactory?.officeDetails?.registeredInfo.municipality ?? '', editType: 'municipality', key: 'officeDetails.registeredInfo.municipality'},
      {label: t('client.add.addressBuildingName'), value: clientFactory?.officeDetails?.registeredInfo.building ?? '', editType: 'text', key: 'officeDetails.registeredInfo.building'},
      {label: t('clientFactory.drawer.details.officeTel'), value: clientFactory.tel ?? '', editType: 'text', key: 'tel'},
      {label: t('clientFactory.drawer.details.officeFax'), value: clientFactory.fax ?? '', editType: 'text', key: 'fax'},
      {label: t('clientFactory.drawer.details.inChargeTitle'), value: clientFactory.nameContact ?? '', editType: 'text', key: 'nameContact'},
      {label: t('clientFactory.drawer.details.inChargeTel'), value: clientFactory.telContact ?? '', editType: 'text', key: 'telContact'},
      {label: t('clientFactory.drawer.details.inChargeAddress'), value: clientFactory.positionContact ?? '', editType: 'text', key: 'positionContact'}
    ]
  }).value

  headDetails.clientInfo = computed(() => {
    return [
      {label: t('clientFactory.drawer.details.representative'), value: clientFactory.client?.representativeName ?? '', editType: 'text', key: 'representativeName'},
      {label: t('clientFactory.drawer.details.established'), value: clientFactory.client?.established ?? '', editType: 'text', key: 'established'},
      {label: t('clientFactory.drawer.details.capital'), value: clientFactory.client?.capital ?? '', editType: 'text', key: 'capital'},
      {label: t('clientFactory.drawer.details.earnings'), value: clientFactory.client?.earnings ?? '', editType: 'text', key: 'earnings'},
      {label: t('clientFactory.drawer.details.numberOffices'), value: clientFactory.client?.numberOffices ?? 0, editType: 'number', key: 'numberOffices'},
      {label: t('clientFactory.drawer.details.numberEmployees'), value: clientFactory.client?.numberEmployees ?? 0, editType: 'number', key: 'numberEmployees'},
      {label: t('clientFactory.drawer.details.companyProfile'), value: clientFactory.client?.companyProfile ?? '', editType: 'text', key: 'companyProfile'}
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