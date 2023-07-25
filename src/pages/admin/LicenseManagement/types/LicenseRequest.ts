import { Timestamp } from 'firebase/firestore'
import { computed } from 'vue'
import { i18n } from 'boot/i18n';

const { t } = i18n.global

export interface LicenseRequest {
  id: string,
  organizationId: string,
  businessId: string,
  branchId: string,
  targetSystem: TargetSystem,
  requestType: RequestType,
  requestQuantity: number,
  requestDate: Timestamp,
  requestUserId: string
}

export const requestType = computed(()=>{
  return [
    {label: t('common.add'), value: 'addition'},
    {label: t('common.delete'), value: 'delete'},
  ]
});

type RequestType = typeof requestType.value[number]

type TargetSystem = typeof targetSystem[number]

export const targetSystem = ['nemesys'] as const
