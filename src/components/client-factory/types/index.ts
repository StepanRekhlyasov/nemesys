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