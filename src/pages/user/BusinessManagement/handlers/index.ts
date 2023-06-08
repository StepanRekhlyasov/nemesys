import { i18n } from 'boot/i18n';
import { computed } from 'vue'
import { ClientFactory } from 'src/shared/model/ClientFactory.model'
import { ClientFactoryTableRow } from 'src/components/client-factory/types'
import { safeGet, arraysAreEqual } from 'src/shared/utils'
import { RenderMainInfo } from '../types'

const { t } = i18n.global

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

export const finishEditing = (
  changedData: Array<{ label: string; value: string | number | boolean | string[]; editType: string; key: string }>,
  draft: Partial<ClientFactory>,
  clientFactory: ClientFactory,
) => {
  changedData.forEach(({key, value}) => {
    const keys = key.split('.'); 
    let nestedObj = draft;
    let nestedOriginalObj = clientFactory;
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (!nestedOriginalObj || typeof nestedOriginalObj !== 'object') {
        throw new Error(`clientFactory does not contain the key: ${currentKey}`);
      }
      if (i === keys.length - 1) {
        // Check if both values are arrays
        if (Array.isArray(nestedOriginalObj[currentKey]) && Array.isArray(value)) {
          // Use arraysAreEqual function to compare
          if (arraysAreEqual(nestedOriginalObj[currentKey], value)) {
            if (nestedObj.hasOwnProperty(currentKey)) {
              delete nestedObj[currentKey];
            }
          } else {
            nestedObj[currentKey] = value;
          }
        } else {
          if (nestedOriginalObj[currentKey] === value) {
            if (nestedObj.hasOwnProperty(currentKey)) {
              delete nestedObj[currentKey];
            }
          } else {
            nestedObj[currentKey] = value;
          }
        }
      } else {
        nestedOriginalObj = nestedOriginalObj[currentKey];
        nestedObj[currentKey] = nestedObj[currentKey] || {};
        nestedObj = nestedObj[currentKey];
      }
    }
  });
}

export const useHighlightMainInfo = (traceableClientFactory: ClientFactory, draft: Partial<ClientFactory>): RenderMainInfo => {
  const clientFactory = JSON.parse(JSON.stringify(traceableClientFactory));
  const mainInfo = {} as RenderMainInfo

  mainInfo.officeInfo = computed(() => {
    return [
      {label: '担当者MAIL', value: (safeGet(draft, 'mail') ?? safeGet(clientFactory, 'mail')) || '', editType: 'text', key: 'mail', isHighlight: safeGet(draft, 'mail') !== undefined && safeGet(clientFactory, 'mail') !== safeGet(draft, 'mail')},
      {label: t('clientFactory.homePage'), value: (safeGet(draft, 'homepageUrl') ?? safeGet(clientFactory, 'homepageUrl')) || '', editType: 'text', key: 'homepageUrl', isHighlight: safeGet(draft, 'homepageUrl') !== undefined && safeGet(clientFactory, 'homepageUrl') !== safeGet(draft, 'homepageUrl')},
      {label: t('clientFactory.numberEmployees'), value: (safeGet(draft, 'numberEmployees') ?? safeGet(clientFactory, 'numberEmployees')) || '', editType: 'text', key: 'numberEmployees', isHighlight: safeGet(draft, 'numberEmployees') !== undefined && safeGet(clientFactory, 'numberEmployees') !== safeGet(draft, 'numberEmployees')},
      {label: t('clientFactory.conclusionDispatchContract'), value: (safeGet(draft, 'isSignedDispatchContract') ?? safeGet(clientFactory, 'isSignedDispatchContract')) || false, editType: 'dispatch_contract', key: 'isSignedDispatchContract', isHighlight: safeGet(draft, 'isSignedDispatchContract') !== undefined && safeGet(clientFactory, 'isSignedDispatchContract') !== safeGet(draft, 'isSignedDispatchContract')},
      {label: t('clientFactory.facilityType'), value: (safeGet(draft, 'facilityType') ?? safeGet(clientFactory, 'facilityType')) || [], editType: 'facility', key: 'facilityType', isHighlight: safeGet(draft, 'facilityType') !== undefined && !arraysAreEqual(safeGet(clientFactory, 'facilityType'), safeGet(draft, 'facilityType'))},
      {label: t('clientFactory.conclusionReferralContract'), value: (safeGet(draft, 'isSignedReferralContract') || safeGet(clientFactory, 'isSignedReferralContract')) || false, editType: 'referral_contract', key: 'isSignedReferralContract', isHighlight: safeGet(draft, 'isSignedReferralContract') !== undefined && safeGet(clientFactory, 'isSignedReferralContract') !== safeGet(draft, 'isSignedReferralContract')}
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