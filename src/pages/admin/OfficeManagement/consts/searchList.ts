import { ClientFactoryTableColumn } from 'src/components/client-factory/types'
import { computed, ComputedRef } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

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