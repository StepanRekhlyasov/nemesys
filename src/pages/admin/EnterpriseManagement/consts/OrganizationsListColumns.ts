import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
const { t } = i18n.global

export const sortable = ref(true)
export const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'edit',
    label: '',
    field: '',
    align: 'left',
  },
  {
    name: 'number',
    label: t('menu.admin.organizationsTable.number'),
    field: 'number',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'organizationCodeAndName',
    label: `${t('menu.admin.organizationsTable.organizationId') + '\n' + t('menu.admin.organizationsTable.organizationName')}  `,
    field: 'organizationCodeAndName',
    align: 'left',
    sortable: sortable.value,
    sort: (a: string, b: string) => {
      const firstOrganizationName = a.split(' ')[1]
      const secondOrganizationName = b.split(' ')[1]
      return firstOrganizationName.localeCompare(secondOrganizationName)
    }
  },
  {
    name: 'operatorName',
    label: t('menu.admin.organizationsTable.operator'),
    field: 'operatorName',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'tel',
    label: t('menu.admin.organizationsTable.phoneNumber'),
    field: 'tel',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'fax',
    label: t('menu.admin.organizationsTable.fax'),
    field: 'fax',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'mailaddress',
    label: t('menu.admin.organizationsTable.email'),
    field: 'mailaddress',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'invoiceRequest',
    label: t('menu.admin.organizationsTable.invoiceRequest'),
    field: 'invoiceRequest',
    align: 'left',
    sortable: sortable.value
  },
  {
    name: 'buttons',
    label: '',
    field: '',
    align: 'left',
  },
  {
    name: 'expandButton',
    label: '',
    field: '',
    align: 'left',
  }
])
