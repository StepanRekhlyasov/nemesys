export interface TableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

export interface TableRow {
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