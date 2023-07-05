import { computed } from 'vue'
import { i18n } from 'boot/i18n'

const { t } = i18n.global
export const columns = computed(() => {
  return [
    {
      label: '',
      field: 'select',
      name: 'select',
      align: 'left',
    },
  {
      name: 'displayName',
      required: true,
      label: t('detal.memo.registredUser'),
      align: 'left',
      field: 'displayName',
      sortable: false,
    },{
      name: 'content',
      label: t('detal.memo.contents') ,
      field: 'content',
      align: 'left',
    },{
      name: 'created_date',
      label: t('detal.memo.creationDay') ,
      field: 'created_date',
      align: 'left',
    },{
      name: 'updated_date',
      label: t('detal.memo.updateDate') ,
      field: 'updated_date',
      align: 'left',
    },{
      name: 'edit',
      align: 'left',
    }
  ];
});
