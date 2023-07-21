import { useOrganization } from 'src/stores/organization'
import { i18n } from 'boot/i18n';
import { ADMIN_ORGANIZATION_CODE } from './consts';

const { t } = i18n.global

export const creationRule = (val: string) => val && val.length > 0 && val.trim().length >= val.length || '';

export const creationArrayRule = (val: string[]) => val && val.length > 0 || ''

export const phoneRule = (val: string) => {
  if (!/^[0-9]+$/.test(val)) {
    return t('rule.onlyNumber')
  }
  return true
}

export const organizationCodeRule = async (val: string) => {

  if (!/^[A-Za-z1-9!?#$%&]+$/.test(val)) {
    return t('menu.admin.organizationsTable.onlyUppercase')
  }

  return true
}

export const isKatakanaRule = (val: string) => {

  if (!/^[\u30a0-\u30ff!?#$%&\s]+$/.test(val)) {
    return ''
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

