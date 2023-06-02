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