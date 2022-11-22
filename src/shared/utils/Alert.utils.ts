export interface AlertInterface {
  message: string,
  textColor?: string,
  color?: string,
  icon?: string
}

export const Alert = {
  success: ( $q, t) => {
    Alert.createAlert({
      message:t('success'),
      textColor: 'white',
      color: 'green-4',
      icon: 'cloud_done'
  }, $q)
  },
  warning: ( $q, t) => {
    Alert.createAlert({
      message: t('failed'),
      textColor:'white',
      color:'red-5',
      icon: 'warning'
    }, $q)
  },
  createAlert: ( alert: AlertInterface, $q?) => {
    $q.notify(alert);
  }
}
