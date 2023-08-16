import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { ClientFactoryTableRow } from 'src/components/client-factory/types';
import { useClient } from 'src/stores/client';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { recursivelyRemoveField } from 'src/shared/utils';

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
export const useImportCandidatesLabels = computed(() => {
  return [
    t('clientFactory.drawer.details.sourceCompany'),
    t('clientFactory.drawer.lastModifiedDate'),
    t('clientFactory.drawer.acquisitionUpdateResults'),
    t('clientFactory.drawer.importCreationRecord'),
    ''
  ]
})