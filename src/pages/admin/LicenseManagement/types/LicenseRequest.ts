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

export const requestType = ['Addition', 'Delete']
export const requestTypeOptions = computed(()=>{
  return [
    {label: t('common.add'), value: 'Addition'},
    {label: t('common.delete'), value: 'Delete'},
  ]
});

type RequestType = typeof requestType[number]

type TargetSystem = typeof targetSystem[number]

export const targetSystem = ['nemesys'] as const
