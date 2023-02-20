interface TableColumn {
    name?: string,
    required?: boolean,
    align?: string,
    field?: string,
    sortable?: boolean,
    label?: string
}

const tableColumnsSearchedList: TableColumn[] = [
    {
        name: 'office name',
        required: true,
        align: 'left',
        field: 'office',
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
        field: 'officeMaster',
        sortable: false,
    },
    {
        name: 'client master',
        required: true,
        align: 'left',
        field: 'clientMaster',
        sortable: false,
    },
    {
        name: 'basic information',
        required: true,
        align: 'left',
        field: 'basicInfo',
        sortable: false,
    }
]

const tableColumnsSavedCriteriaList: TableColumn[] = [
    {
        name: 'search condition name',
        required: true,
        align: 'left',
        field: 'search condition name',
        sortable: false,
    },
    {
        name: 'registered user',
        required: true,
        align: 'left',
        field: 'registered user',
        sortable: false,
    },
    {
        name: 'registered Date',
        required: true,
        align: 'left',
        field: 'registered Date',
        sortable: false,
    },
    {
        name: 'updated user',
        required: true,
        align: 'left',
        field: 'updated user',
        sortable: false,
    },
    {
        name: 'last modified',
        required: true,
        align: 'left',
        field: 'last modified',
        sortable: false,
    }
]
export default {
    tableColumnsSearchedList,
    tableColumnsSavedCriteriaList
}