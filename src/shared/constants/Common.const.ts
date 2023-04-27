import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const monthsList = computed(() => {
  return [
    {
      label: t('common.months.1'),
      value: 1,
    },
    {
      label: t('common.months.2'),
      value: 2,
    },
    {
      label: t('common.months.3'),
      value: 3,
    },
    {
      label: t('common.months.4'),
      value: 4,
    },
    {
      label: t('common.months.5'),
      value: 5,
    },
    {
      label: t('common.months.6'),
      value: 6,
    },
    {
      label: t('common.months.7'),
      value: 7,
    },
    {
      label: t('common.months.8'),
      value: 8,
    },
    {
      label: t('common.months.9'),
      value: 9,
    },
    {
      label: t('common.months.10'),
      value: 10,
    },
    {
      label: t('common.months.11'),
      value: 11,
    },
    {
      label: t('common.months.12'),
      value: 12,
    },
  ]
})