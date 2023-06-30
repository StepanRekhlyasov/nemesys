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

export interface CustomIndustry {
    value: string
    isSelected: boolean
    ts: string
}