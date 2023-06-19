import { branchFlags } from 'src/shared/model';
import { computed } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export const flagOptions = computed(() => [{
  label: i18n.global.t('settings.branch.flags.working'),
  flag: branchFlags.Working
}, {
  label: t('settings.branch.flags.all'),
  flag: branchFlags.All
}])
