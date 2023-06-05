import { Timestamp } from 'firebase/firestore'

export interface LicenseRequest {
  id: string,
  organizationId: string,
  businessId: string,
  branchId: string,
  targetSystem: TargetSystem,
  requestType: 'Addition' | 'Delete',
  requestQuantity: number,
  requestDate: Timestamp,
  requestUserId: string
}

type TargetSystem = typeof targetSystem[number]

const targetSystem = ['nemesys'] as const
