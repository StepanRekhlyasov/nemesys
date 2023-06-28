import { Notify, QNotifyCreateOptions } from 'quasar'
import { i18n } from 'boot/i18n';
import { FirebaseError } from 'firebase/app';
import axios from 'axios';
import { authErrors, firestoreErrors, storageErrors } from './ErrorMaps';

const { t } = i18n.global
export const Alert = {
  success: () => {
    Alert.createAlert({
      message: t('success'),
      textColor: 'white',
      color: 'green-4',
      icon: 'cloud_done'
    })
  },
  warning: (error?: unknown | string, opts?: QNotifyCreateOptions) => {
    const errorMessage = getErrorText(error)
    Alert.createAlert({
      ...opts,
      message: errorMessage || opts?.message || t('failed'),
      textColor: opts?.textColor || 'white',
      color: opts?.color || 'red-5',
      icon: opts?.icon || 'warning',
    })
  },

  createAlert: (opts: QNotifyCreateOptions | string) => {
    Notify.create(opts)
  }
}

function getErrorText(error: unknown | undefined) {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof FirebaseError) {
    //NOTE see https://github.com/firebase/firebase-js-sdk/blob/534047b4b8e75c2816793aa1599ceb0310a939ec/packages/util/src/errors.ts#L114
    const [, code] = error.code.split('/')

    const authError: string | undefined = authErrors[code]

    const firestoreError: string | undefined = firestoreErrors[error.code]

    const storageError: string | undefined = storageErrors[error.code]

    const functionError = error?.message

    return authError || firestoreError || storageError || functionError
  }

  if (axios.isAxiosError(error)) {
    return error.response?.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

}
