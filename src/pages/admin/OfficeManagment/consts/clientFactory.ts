import { TableColumn } from '../types'

export const tableColumnsClientFactory: TableColumn[] = [
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

export const columnLabelsClientFactory: string[] = [
    'client.list.name',
    'client.list.distanceStartingPoint',
    'client.list.officeLocation',
    'client.list.phone',
    'client.list.fax',
    'client.list.officeMaster',
    'client.list.clientMaster',
    'client.list.basicInfo'
]