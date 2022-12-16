import { computed } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const segment = computed(() => {
    return [{
        label: t('settings.item.classification.oualifications'),
        value: 'oualifications'
    },{
        label: t('settings.item.classification.job'),
        value: 'job'
    },{
        label: t('settings.item.classification.media'),
        value: 'media'
    }]
})
