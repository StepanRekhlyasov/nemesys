import { ComputedRef, Ref } from 'vue'

export interface ClientFactoryTableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

export interface ClientFactoryTableRow {
        id: string,
        office: {
            name: string,
            kind?: string
        },
        distance: string,
        address: string,
        telephone: string,
        fax: string,
        officeMaster: string,
        clientMaster: string,
        basicInfo: string,
}

export interface OfficeMenuItem {
    name: string,
    center?: string,
    right?: string,
    click: () => void
}

export enum ClientFactoryDetailTabs {
    OfficeDetails = 'officeDetails',
    CompanyWideBOHistory = 'CompanyWideBOHistory',
    HeadOffice = 'HeadOffice',
    ReflectionHistory = 'ReflectionHistory',
    ImportHistory = 'ImportHistory'
}

export interface RenderOfficeDetails extends Ref {
    registeredInfo: ComputedRef<{ label: string, value: string | number }[]>
    commonItems: ComputedRef<{ label: string, value: string | number }[]>
    uniqueItems: ComputedRef<{ label: string, value: string }[]>   
}