import { Timestamp } from 'firebase/firestore'

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

export const requestType = ['Addition', 'Delete'] as const

type RequestType = typeof requestType[number]

type TargetSystem = typeof targetSystem[number]

export const targetSystem = ['nemesys'] as const
