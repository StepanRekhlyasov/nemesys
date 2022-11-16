import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export const Alert = {
  success: () => {
    Alert.createAlert('success', 'white', 'green-4', 'cloud_done')
  },
  warning: () => {
    Alert.createAlert('failed', 'white', 'red-5', 'warning')
  },
  createAlert: ( message: string, textColor?: string, color?: string, icon?: string) => {
    const $q = useQuasar();
    const { t } = useI18n({
      useScope: 'global',
    });
    $q.notify({
      color: color,
      textColor: textColor,
      icon: icon,
      message: t(message),
    });
  }
}
