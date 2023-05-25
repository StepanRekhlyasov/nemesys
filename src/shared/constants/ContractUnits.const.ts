import { computed } from 'vue'
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const contractUnits = computed(() => {
  return [
    {
        label: t('client.contractUnit.corporateBulk'),
        value: '法人一括'
    },
    {
        label: t('client.contractUnit.businessUnit'),
        value: '事業所単位'
    }
]
});