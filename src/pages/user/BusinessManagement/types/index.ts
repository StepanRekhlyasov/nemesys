export interface OfficeMenuItem {
    name: string,
    center?: string,
    right?: string,
    click: () => void
}

export interface RenderMainInfo {
    officeInfo: {label: string; value: string | number | string[] | boolean; editType: string; key: string; isHighlight: boolean}[],
    contactInfo: {label: string; value: string; key: string; editType: string; isHighlight: boolean }[]
}

export enum ClientFactoryTabs {
    TeleAppointmentHistory = 'TeleAppointmentHistory',
    OfficeDetails = 'OfficeDetails',
    BOHistory = 'BOHistory',
    HeadOffice = 'HeadOffice',
    VariousAchievements = 'VariousAchievements',
    Memo = 'Memo'
}