import { i18n } from 'boot/i18n';
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
const { t } = i18n.global

export const sortable = ref(true)
export const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'numberIdName',
    label: t('menu.admin.licenseManagement.numberIdName'),
    field: 'numberIdName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'businessName',
    label: t('menu.admin.licenseManagement.businessName'),
    field: 'businessName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'branchName',
    label: t('menu.admin.licenseManagement.branchName'),
    field: 'branchName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'systemInUse',
    label: t('menu.admin.licenseManagement.systemInUse'),
    field: 'systemInUse',
    align: 'left',
  },
  {
    name: 'usageCount',
    label: t('menu.admin.licenseManagement.usageCount'),
    field: 'usageCount',
    align: 'left',
  },
])
