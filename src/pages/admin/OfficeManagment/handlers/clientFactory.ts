import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { TableRow } from '../types';

export const clientFactoriesToTableRows = (factories: ClientFactory[]) => {
    return factories.map((factory) => {
        const row = {} as TableRow

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