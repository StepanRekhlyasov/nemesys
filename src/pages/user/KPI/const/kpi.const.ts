import { QTableProps } from 'quasar';
import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const actualFiguresColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: '',
      field: 'name',
      label: '',
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.1'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.2'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.3'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.4'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.5'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.6'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.7'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.8'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.9'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.10'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.11'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.12'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.13'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.14'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.15'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.16'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.17'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.18'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.19'),
      align: 'center',
      sortable: true
    },
    {
      name: '',
      field: '',
      label: t('KPI.tables.actualFigures.20'),
      align: 'center',
      sortable: true
    },
  ]
}) 