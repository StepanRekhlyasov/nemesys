import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { sortDate } from 'src/shared/utils/utils';

const { t } = i18n.global

export const ResponsibleMasterColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'edit',
    label: '',
    field: ''
  }, {
    name: 'email',
    required: true,
    label: t('settings.users.email'),
    field: 'email',
    align: 'left',
    sortable: true,
  }, {
    name: 'name',
    required: true,
    label: t('settings.users.person_name'),
    field: 'displayName',
    align: 'left',
    sortable: true,
  }, {
    name: 'role',
    required: true,
    label: t('settings.users.role'),
    field: 'role_name',
    align: 'left',
    sortable: true,
  }, {
    name: 'branch',
    label: t('settings.users.branch_name'),
    field: 'branch',
    align: 'left',
    sortable: true,
  }, {
    name: 'hidden',
    required: true,
    label: t('settings.users.hidden'),
    field: 'hidden',
    align: 'left',
    sortable: true,
  }, {
    name: 'create_at',
    required: true,
    label: t('settings.users.create_at'),
    field: 'create_at',
    align: 'left',
    sortable: true,
    sort: sortDate
  }, {
    name: 'updated_at',
    label: t('settings.users.last_update'),
    field: 'updated_at',
    align: 'left',
    sortable: true,
    sort: sortDate
  }, {
    name: 'delete',
    label: '',
    field: ''
  }
])
