import { i18n } from 'boot/i18n';
import { ComputedRef, computed } from 'vue'
import { ClientFactoryTableColumn } from 'src/components/client-factory/types';
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