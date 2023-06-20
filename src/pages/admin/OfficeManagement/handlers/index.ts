import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { RenderHeadDetails } from '../types';
import { ClientFactoryTableRow } from 'src/components/client-factory/types';
import { useClient } from 'src/stores/client';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { recursivelyRemoveField, safeGet } from 'src/shared/utils';

const { updateClient } = useClient()
const { t } = i18n.global

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

export const useImportCandidatesLabels = computed(() => {
  return [
    t('clientFactory.drawer.details.sourceCompany'),
    t('clientFactory.drawer.lastModifiedDate'),
    t('clientFactory.drawer.acquisitionUpdateResults'),
    t('clientFactory.drawer.importCreationRecord'),
    ''
  ]
})