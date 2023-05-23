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
    Client = 'Client',
    ReflectionHistory = 'ReflectionHistory',
    ImportHistory = 'ImportHistory'
}

export interface RenderOfficeDetails {
    registeredInfo: { label: string, value: string | number, editType: string, key: string }[]
    commonItems: { label: string, value: string | number, editType: string, key: string }[]
    uniqueItems: { label: string; value: string; key: string; editType: string; }[]
}

export interface RenderHeadDetails {
    headOfficeInfo: {label: string, value: string | number, editType: string, key: string}[]
    clientInfo: {label: string, value: string | number, editType: string, key: string}[]
    contractInfo: {label: string, value: string | number, editType: string, key: string}[]
}