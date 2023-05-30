import { Timestamp } from 'firebase/firestore';
import { LicenseRequest } from './LicenseRequest';

export interface LicenseHistory extends LicenseRequest {
  executor: string
  executionTime: Timestamp
}

export type LicensePath = 'licenseRequests' | 'licenseHistory'
export type LicenseVariation<T> =
  T extends 'licenseRequests' ? LicenseRequest :
  T extends 'licenseHistory' ? LicenseHistory :
  never
