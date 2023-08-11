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

export enum ActionsType {
    ADMIN = 'admin',
    CLIENT = 'client'
}

export type ChangedData = Array<{ label: string; value: string | number | boolean | string[]; key: string, isHighlight?: boolean, industry?: string | null }>

export interface RenderMainInfo {
    officeInfo: {label: string; value: string | number | string[] | boolean; editType: string; key: string; isHighlight: boolean}[],
    contactInfo: {label: string; value: string; key: string; editType: string; isHighlight: boolean }[]
}

export interface RenderOfficeDetailsWithoutIndustryType {
  registeredInfo: { label: string; value: string | number; editType: string; key: string }[]
  commonItems: { label: string; value: string | number; editType: string; key: string }[]
  uniqueItems: { label: string; value: string; key: string; editType: string; }[]
}

export type RenderOfficeDetailsWithIndustryType = {
  registeredInfo: { label: string; value: string | number; editType: string; key: string }[]
} & {
  [key: string]: {
    commonItems: { label: string; value: string | number; editType: string; key: string }[]
    uniqueItems: { label: string; value: string; key: string; editType: string; }[]
  }
}

export interface RenderHeadDetails {
    headOfficeInfo: {label: string; value: string | number; editType: string; key: string}[]
    clientInfo: {label: string; value: string | number; editType: string; key: string}[]
    contractInfo: {label: string; value: string | number | string[]; editType: string; key: string}[]
    relatedOfficeInfo: {label: string; value: string | number | string[]; editType: string; key: string}[]
}


export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  PREFECTURE = 'prefecture',
  MUNICIPALITY = 'municipality',
  CLIENT = 'client',
  CONTRACT_UNIT = 'contract_unit',
  INDUSTRY = 'industry',
  DISPATCH_CONTRACT = 'dispatch_contract',
  REFERRAL_CONTRACT = 'referral_contract',
  FACILITY = 'facility',
  RADIO = 'radio',
  COMMA_SEPARATED = 'comma_separated',
}
