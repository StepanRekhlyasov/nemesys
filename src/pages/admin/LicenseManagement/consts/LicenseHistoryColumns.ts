import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { sortOrganization } from 'src/shared/utils/utils';
import { computed, ref } from 'vue';
const { t } = i18n.global

export const sortable = ref(true)
export const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'number',
    label: t('menu.admin.organizationsTable.number'),
    field: 'number',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'organizationCodeAndName',
    label: `${t('menu.admin.organizationsTable.organizationId') + '\n' + t('menu.admin.organizationsTable.organizationName')}`,
    field: 'organizationCodeAndName',
    align: 'left',
    sortable: sortable.value,
    sort: sortOrganization,

  },
  {
    name: 'targetSystem',
    label: t('menu.admin.licenseManagement.targetSystem'),
    field: 'targetSystem',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'requestType',
    label: t('menu.admin.licenseManagement.request.addition') + '\n' + t('menu.admin.licenseManagement.request.delete'),
    field: 'requestType',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'businessName',
    label: t('menu.admin.organizationsTable.businessName'),
    field: 'businessName',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'branchName',
    label: t('menu.admin.organizationsTable.branchName'),
    field: 'branchName',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'requestQuantity',
    label: t('menu.admin.licenseManagement.requestQuantity'),
    field: 'requestQuantity',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'requestDate',
    label: t('menu.admin.licenseManagement.requestDate'),
    field: 'requestDate',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'requestUser',
    label: t('menu.admin.licenseManagement.requestUser'),
    field: 'requestUser',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'executionTime',
    label:  t('menu.admin.licenseManagement.executionTime'),
    field: 'executionTime',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'executor',
    label:  t('menu.admin.licenseManagement.executor'),
    field: 'executor',
    align: 'left',
    sortable: sortable.value
  }


])
