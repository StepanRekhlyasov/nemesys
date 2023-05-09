import { computed } from 'vue'
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const industries = computed(() => {
  return [
    {
      label: t('industry.nursing'),
      value: 'nursing',
    },
    {
      label: t('industry.nurse'),
      value: 'nurse',
    },
  ];
});