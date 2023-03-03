export interface TableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

export interface TableRow {
        id: number,
        office: {
            name: string,
            kind: string
        },
        distance: string,
        location: {
            area: string,
            address: string,
            building: string
        },
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