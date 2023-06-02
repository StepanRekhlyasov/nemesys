import { ClientFactoryTableColumn } from 'src/components/client-factory/types'

export const tableColumnsSavedCriteriaList: ClientFactoryTableColumn[] = [
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