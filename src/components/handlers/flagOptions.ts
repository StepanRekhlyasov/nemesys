import { branchEnablityFilter } from 'src/shared/model';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const flagOptions = computed(() => [{
  label: i18n.global.t('settings.branch.flags.enabled'),
  flag: branchEnablityFilter.Enabled
}, {
  label: i18n.global.t('settings.branch.flags.disabled'),
  flag: branchEnablityFilter.Disabled
}, {
  label: t('settings.branch.flags.all'),
  flag: branchEnablityFilter.All
}])
