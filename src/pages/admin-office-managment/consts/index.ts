interface TableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

const tableColumns: TableColumn[] = [
    {
        name: 'office name',
        required: true,
        align: 'left',
        field: 'office name',
        sortable: false,
    },
    {
        name: 'distance',
        required: true,
        align: 'left',
        field: 'distance',
        sortable: false,
    },
    {
        name: 'location',
        required: true,
        align: 'left',
        field: 'location',
        sortable: false,
    },
    {
        name: 'telephone',
        required: true,
        align: 'left',
        field: 'telephone',
        sortable: false,
    },
    {
        name: 'fax',
        required: true,
        align: 'left',
        field: 'fax',
        sortable: false,
    },
    {
        name: 'office master',
        required: true,
        align: 'left',
        field: 'office master',
        sortable: false,
    },
    {
        name: 'basic information',
        required: true,
        align: 'left',
        field: 'basic information',
        sortable: false,
    }
]

export default {
    tableColumns
}