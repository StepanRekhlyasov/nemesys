export interface ClientFactoryTableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

export interface Pagination {
    sortBy: string,
    descending: boolean,
    page: number,
    rowsPerPage: number,
    rowsNumber?: number
}

export interface ClientFactoryTableRow {
        id: string,
        office: {
            name: string,
            isHead?: boolean
            clientName?: string
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
    registeredInfo: { label: string; value: string | number; editType: string; key: string }[]
    commonItems: { label: string; value: string | number; editType: string; key: string }[]
    uniqueItems: { label: string; value: string; key: string; editType: string; }[]
}

export interface RenderHeadDetails {
    headOfficeInfo: {label: string; value: string | number; editType: string; key: string}[]
    clientInfo: {label: string; value: string | number; editType: string; key: string}[]
    contractInfo: {label: string; value: string | number | string[]; editType: string; key: string}[]
}

export interface RenderMainInfo {
    officeInfo: {label: string; value: string | number | string[] | boolean; editType: string; key: string; isHighlight: boolean}[],
    contactInfo: {label: string; value: string; key: string; editType: string; isHighlight: boolean }[]
}