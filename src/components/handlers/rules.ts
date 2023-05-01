import { useOrganization } from 'src/stores/organization'
import { i18n } from 'boot/i18n';
import { ADMIN_ORGANIZATION_CODE } from './consts';

const { t } = i18n.global

export const creationRule = (val: string) => val && val.length > 0 || ''

export const organizationCodeRule = async (val: string) => {

  if (!/^[A-Z]+$/.test(val)) {
    return t('menu.admin.organizationsTable.onlyUppercase')
  }

  return true
}

export const isCodeUniqueRule = async (val: string) => {

  if (val == ADMIN_ORGANIZATION_CODE) {
    return t('menu.admin.organizationsTable.codeMustBeUnique')
  }

  const organizationStore = useOrganization()

  const isCodeUnique = await organizationStore.isCodeUnique(val)

  if (!isCodeUnique) {
    return t('menu.admin.organizationsTable.codeMustBeUnique')
  }

  return true
}

