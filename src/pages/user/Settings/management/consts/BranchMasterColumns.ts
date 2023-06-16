import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
import { i18n } from 'boot/i18n';
import { sortDate } from 'src/shared/utils/utils';

const { t } = i18n.global
export const sortable = ref(true)
export const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    required: true,
    label: t('settings.branch.name'),
    field: 'name',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'prefecture',
    label: t('settings.branch.prefectures'),
    field: 'prefecture',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'phone',
    required: true,
    label: t('settings.branch.phone'),
    field: 'phone',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'hidden',
    required: true,
    label: t('settings.users.hidden'),
    field: 'hidden',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'created_at',
    required: true,
    label: t('settings.branch.create_at'),
    field: 'created_at',
    align: 'left',
    sortable: sortable.value,
    sort: sortDate
  },
  {
    name: 'updated_at',
    label: t('settings.branch.last_update'),
    field: 'updated_at',
    align: 'left',
    sortable: sortable.value,
  },
  {
    name: 'delete',
    label: '',
    field: '',
  }])
