import { ClientFactoryTableColumn } from 'src/components/client-factory/types'
import { computed, ComputedRef } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const tableColumnsClientFactory: ComputedRef<ClientFactoryTableColumn[]> = computed(() => {
    return [
        {
            name: 'name',
            required: true,
            align: 'left',
            field: 'office',
            sortable: false,
            label: t('client.list.name')
        },
        {
            name: 'distance',
            required: true,
            align: 'left',
            field: 'distance',
            sortable: false,
            label: t('client.list.distanceStartingPoint')
        },
        {
            name: 'address',
            required: true,
            align: 'left',
            field: 'address',
            sortable: false,
            label: t('client.list.officeLocation')
        },
        {
            name: 'telephone',
            required: true,
            align: 'left',
            field: 'telephone',
            sortable: false,
            label: t('client.list.phone')
        },
        {
            name: 'fax',
            required: true,
            align: 'left',
            field: 'fax',
            sortable: false,
            label: t('client.list.fax')
        },
        {
            name: 'office master',
            required: true,
            align: 'left',
            field: 'officeMaster',
            sortable: false,
            label: t('client.list.officeMaster')
        },
        {
            name: 'client master',
            required: true,
            align: 'left',
            field: 'clientMaster',
            sortable: false,
            label: t('client.list.clientMaster')
        },
        {
            name: 'basic information',
            required: true,
            align: 'left',
            field: 'basicInfo',
            sortable: false,
            label: t('client.list.basicInfo')
        }
    ]
})

export const tableColumnsSavedCriteriaList: ComputedRef<ClientFactoryTableColumn[]> = computed(() => [
    {
        name: 'search condition name',
        required: true,
        align: 'left',
        field: 'search condition name',
        sortable: false,
        label: t('office.searchConditionName')
    },
    {
        name: 'registered user',
        required: true,
        align: 'left',
        field: 'registered user',
        sortable: false,
        label: t('office.registeredUser')
    },
    {
        name: 'registered Date',
        required: true,
        align: 'left',
        field: 'registered Date',
        sortable: false,
        label: t('office.registeredDate')
    },
    {
        name: 'updated user',
        required: true,
        align: 'left',
        field: 'updated user',
        sortable: false,
        label: t('office.updatedUser')
    },
    {
        name: 'last modified',
        required: true,
        align: 'left',
        field: 'last modified',
        sortable: false,
        label: t('office.lastModified')
    }
])