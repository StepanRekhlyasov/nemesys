import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global
export const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'edit',
    label: '',
    field: '',
  },
  {
    name: 'name',
    required: true,
    label: t('settings.branch.name'),
    field: 'name',
    align: 'left',
  },
  {
    name: 'prefecture',
    label: t('settings.branch.prefectures'),
    field: 'prefecture',
    align: 'left',
  },
  {
    name: 'phone',
    required: true,
    label: t('settings.branch.phone'),
    field: 'phone',
    align: 'left',
  },
  {
    name: 'hidden',
    required: true,
    label: t('settings.users.hidden'),
    field: 'hidden',
    align: 'left',
  },
  {
    name: 'created_at',
    required: true,
    label: t('settings.branch.create_at'),
    field: 'created_at',
    align: 'left',
  },
  {
    name: 'updated_at',
    label: t('settings.branch.last_update'),
    field: 'updated_at',
    align: 'left',
  },
  {
    name: 'delete',
    label: '',
    field: '',
  }])
